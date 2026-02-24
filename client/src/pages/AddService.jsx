import { useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DisclaimerBanner from "../components/DisclaimerBanner";

const AddService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    city: "",
    state: "",
    priceRange: "",
    description: "",
    diseases: "",
    treatmentType: "Ayurveda",
    contact: "",
    proof: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate("/login");
    }
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        diseases: form.diseases
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      };
      await api.post("/services", payload);
      setMessage(
        "Submitted successfully. An admin will review and approve before it appears in search results."
      );
      setForm({
        name: "",
        city: "",
        state: "",
        priceRange: "",
        description: "",
        diseases: "",
        treatmentType: "Ayurveda",
        contact: "",
        proof: ""
      });
    } catch (err) {
      setError("Submission failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">
        Submit a new service center
      </h2>
      <DisclaimerBanner />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4 text-sm"
      >
        {message && (
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-slate-600">Service Center Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-slate-600">Contact details</label>
            <input
              type="text"
              name="contact"
              required
              value={form.contact}
              onChange={handleChange}
              placeholder="Phone / WhatsApp / Email"
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-slate-600">City</label>
            <input
              type="text"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-slate-600">State</label>
            <input
              type="text"
              name="state"
              required
              value={form.state}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-slate-600">Price range</label>
          <input
            type="text"
            name="priceRange"
            required
            value={form.priceRange}
            onChange={handleChange}
            placeholder="e.g. ₹500 - ₹1500 per session"
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-slate-600">Description</label>
          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Explain what kind of treatment and facilities are available. Avoid medical claims or guarantees."
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-slate-600">
            Specializes in which diseases
          </label>
          <input
            type="text"
            name="diseases"
            required
            value={form.diseases}
            onChange={handleChange}
            placeholder="e.g. knee pain, back pain, migraines (comma separated)"
            className="w-full border border-slate-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-slate-600">Treatment type</label>
            <select
              name="treatmentType"
              value={form.treatmentType}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            >
              <option>Ayurveda</option>
              <option>Herbal</option>
              <option>Local therapy</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-slate-600">
              Verification proof (optional but recommended)
            </label>
            <input
              type="text"
              name="proof"
              value={form.proof}
              onChange={handleChange}
              placeholder="e.g. registration ID, website link, certificate details"
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Do not make medical promises or guaranteed cure statements. Misleading
          entries may be removed by admins.
        </p>

        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-teal-700"
        >
          Submit for approval
        </button>
      </form>
    </div>
  );
};

export default AddService;
