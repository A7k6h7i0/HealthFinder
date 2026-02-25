import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DiseaseSelect from "../components/DiseaseSelect";
import api from "../api/axiosClient";

const isValidIndianLocal = (digits) => /^[6-9]\d{9}$/.test(digits);
const isValidUSLocal = (digits) => /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
const isValidIndiaOrUSPhone = (raw) => {
  const value = String(raw || "").trim();
  if (!value) return false;

  if (value.startsWith("+91")) {
    return isValidIndianLocal(value.replace(/\D/g, "").slice(2));
  }

  if (value.startsWith("+1")) {
    return isValidUSLocal(value.replace(/\D/g, "").slice(1));
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return isValidIndianLocal(digits.slice(2));
  if (digits.length === 11 && digits.startsWith("1")) return isValidUSLocal(digits.slice(1));
  if (digits.length === 10) return isValidIndianLocal(digits) || isValidUSLocal(digits);
  return false;
};

const AddService = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const isBusiness = user?.role === "business";
  const [step, setStep] = useState("otp"); // otp -> license (business) -> form

  const [phone, setPhone] = useState(user?.phone || "");
  const [otp, setOTP] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");

  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [licenseFile, setLicenseFile] = useState(null);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenseError, setLicenseError] = useState("");

  const [form, setForm] = useState({
    name: "",
    diseaseId: "",
    diseaseName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phone || "",
    email: user?.email || "",
    website: "",
    description: "",
    serviceDetails: "",
    photos: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDiseaseSelect = (disease) => {
    setForm((prev) => ({
      ...prev,
      diseaseId: disease._id,
      diseaseName: disease.name
    }));
    setErrors((prev) => ({ ...prev, diseaseId: "" }));
  };

  const handleSendOTP = async () => {
    if (!isValidIndiaOrUSPhone(phone)) {
      setOtpError("Enter a valid India (+91) or US (+1) phone number");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setOtpInfo("");
    try {
      const purpose = isBusiness ? "add_center_business" : "add_center_normal";
      const res = await api.post("/otp/send", { phone, purpose });
      if (res.data?.demoOTP) {
        setOtpInfo(`Demo OTP: ${res.data.demoOTP} (testing mode)`);
      } else {
        setOtpInfo("OTP sent successfully to your phone.");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    try {
      const purpose = isBusiness ? "add_center_business" : "add_center_normal";
      const res = await api.post("/otp/verify", { phone, otp, purpose });
      if (res.data?.verified) {
        updateUser({ phone });
        setForm((prev) => ({ ...prev, phone }));
        setStep(isBusiness ? "license" : "form");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLicenseUpload = async () => {
    if (!businessName.trim()) {
      setLicenseError("Business name is required");
      return;
    }

    if (!licenseNumber.trim()) {
      setLicenseError("License number is required");
      return;
    }

    if (!licenseFile) {
      setLicenseError("License upload is required");
      return;
    }

    setLicenseLoading(true);
    setLicenseError("");

    try {
      const data = new FormData();
      data.append("license", licenseFile);
      data.append("businessName", businessName.trim());
      data.append("licenseNumber", licenseNumber.trim());

      await api.post("/centers/license-upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      updateUser({ businessName: businessName.trim(), licenseNumber: licenseNumber.trim() });
      setStep("form");
    } catch (err) {
      setLicenseError(err.response?.data?.message || "Failed to upload license");
    } finally {
      setLicenseLoading(false);
    }
  };

  const validateForm = () => {
    const next = {};

    if (!form.name.trim()) next.name = "Center name is required";
    if (!form.diseaseId) next.diseaseId = "Disease category is required";
    if (!form.address.trim()) next.address = "Address is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.state.trim()) next.state = "State is required";

    if (!form.phone.trim()) {
      next.phone = "Contact number is required";
    } else if (!isValidIndiaOrUSPhone(form.phone)) {
      next.phone = "Enter a valid India (+91) or US (+1) phone number";
    }

    if (!form.email.trim()) next.email = "Email is required";
    if (!form.description.trim()) next.description = "Description is required";

    if (isBusiness) {
      if (!businessName.trim()) next.businessName = "Business name is required";
      if (!licenseNumber.trim()) next.licenseNumber = "License number is required";
      if (!form.serviceDetails.trim()) next.serviceDetails = "Service details are required";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        businessName: isBusiness ? businessName.trim() : undefined,
        licenseNumber: isBusiness ? licenseNumber.trim() : undefined
      };
      await api.post("/centers", payload);
      alert("Center submitted successfully! Pending admin approval.");
      navigate("/search");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit center");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900">
          {isBusiness ? "Business Phone Verification" : "Phone Verification"}
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-slate-600">
              {isBusiness ? "Registered Mobile Number" : "Mobile Number"}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setOtpError("");
              }}
              placeholder={isBusiness ? "Use your registered business number" : "Enter mobile number"}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleSendOTP}
            disabled={otpLoading || !phone}
            className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {otpLoading ? "Sending..." : "Send OTP"}
          </button>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOTP(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              placeholder="6-digit OTP"
              maxLength={6}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleVerifyOTP}
            disabled={otpLoading || otp.length !== 6}
            className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {otpLoading ? "Verifying..." : "Verify OTP"}
          </button>

          {otpError && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md">{otpError}</p>}
          {otpInfo && <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md">{otpInfo}</p>}
        </div>
      </div>
    );
  }

  if (step === "license") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900">Business License Verification</h2>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Business Name *</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                setLicenseError("");
              }}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">License Number *</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => {
                setLicenseNumber(e.target.value);
                setLicenseError("");
              }}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">License Upload * (PDF/JPG/PNG/WEBP)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                setLicenseFile(e.target.files?.[0] || null);
                setLicenseError("");
              }}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleLicenseUpload}
            disabled={licenseLoading}
            className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {licenseLoading ? "Uploading..." : "Upload and Verify License"}
          </button>

          {licenseError && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md">{licenseError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-2 text-slate-900">
        {isBusiness ? "Add Business Service Center" : "Add Treatment Center"}
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        Your center will be reviewed by an admin before publishing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
          <h3 className="font-medium text-slate-900">Basic Information</h3>

          {isBusiness && (
            <>
              <div className="space-y-2">
                <label className="block text-sm text-slate-600">Business Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
                {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-slate-600">License Number *</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
                {errors.licenseNumber && <p className="text-xs text-red-500">{errors.licenseNumber}</p>}
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Center Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <DiseaseSelect
            value={form.diseaseId}
            onChange={handleDiseaseSelect}
            error={errors.diseaseId}
          />

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          {isBusiness && (
            <div className="space-y-2">
              <label className="block text-sm text-slate-600">Service Details *</label>
              <textarea
                value={form.serviceDetails}
                onChange={(e) => setForm({ ...form, serviceDetails: e.target.value })}
                rows={3}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.serviceDetails && <p className="text-xs text-red-500">{errors.serviceDetails}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Image URLs (optional, one per line)</label>
            <textarea
              value={form.photos.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  photos: e.target.value
                    .split("\n")
                    .map((p) => p.trim())
                    .filter(Boolean)
                })
              }
              rows={3}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
          <h3 className="font-medium text-slate-900">Location</h3>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Address *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-slate-600">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-600">State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Pincode</label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
          <h3 className="font-medium text-slate-900">Contact Information</h3>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Contact Number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91XXXXXXXXXX or +1XXXXXXXXXX"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Website (optional)</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Center"}
        </button>
      </form>
    </div>
  );
};

export default AddService;
