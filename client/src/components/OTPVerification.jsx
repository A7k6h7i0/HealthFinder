import { useState, useEffect, useRef } from "react";
import api from "../api/axiosClient";

// Matches the server's per-phone/purpose throttle (canSendOTP in otpController.js)
// so the button never re-enables before a resend would actually be accepted.
const RESEND_COOLDOWN_SECONDS = 5 * 60;

const formatCountdown = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const OTPVerification = ({ phone, purpose, onVerified }) => {
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [hasSentOnce, setHasSentOnce] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const startCooldown = () => {
    clearInterval(intervalRef.current);
    setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");
    try {
      await api.post(hasSentOnce ? "/otp/resend" : "/otp/send", { phone, purpose });
      setInfo(hasSentOnce ? "OTP resent successfully." : "OTP sent successfully.");
      setHasSentOnce(true);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      // A 429 here means the server already has a recent OTP on file for this
      // phone/purpose, so start the cooldown anyway rather than letting the
      // button stay clickable and keep hitting the throttle.
      if (err.response?.status === 429) {
        setHasSentOnce(true);
        startCooldown();
      }
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

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleSendOTP}
        disabled={loading || cooldownSeconds > 0}
        className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
      >
        {loading
          ? (hasSentOnce ? "Resending..." : "Sending...")
          : cooldownSeconds > 0
            ? `Resend OTP in ${formatCountdown(cooldownSeconds)}`
            : hasSentOnce
              ? "Resend OTP"
              : "Send OTP"}
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

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || otp.length !== 6}
        className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-xs text-slate-500">
        OTP will be valid for 10 minutes.
      </p>
    </div>
  );
};

export default OTPVerification;
