import { useState } from "react";
import api from "../api/axiosClient";

const OTPVerification = ({ phone, purpose, onVerified }) => {
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await api.post("/otp/send", { phone, purpose });
      if (res.data?.demoOTP) {
        setInfo(`Demo OTP: ${res.data.demoOTP} (testing mode)`);
      } else {
        setInfo("OTP sent successfully.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/otp/verify", { phone, otp, purpose });
      if (res.data.verified) {
        onVerified(phone);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setError("");
    setInfo("");
    try {
      const res = await api.post("/otp/resend", { phone, purpose });
      if (res.data?.demoOTP) {
        setInfo(`Demo OTP: ${res.data.demoOTP} (testing mode)`);
      } else {
        setInfo("OTP resent successfully.");
      }
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      setResendDisabled(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleSendOTP}
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <div className="space-y-2">
        <label className="block text-sm text-slate-600">Enter OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOTP(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="6-digit OTP"
          maxLength={6}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      {info && (
        <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md">
          {info}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="flex-1 bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className="px-4 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Resend
        </button>
      </div>

      <p className="text-xs text-slate-500">
        OTP will be valid for 10 minutes.
      </p>
    </div>
  );
};

export default OTPVerification;
