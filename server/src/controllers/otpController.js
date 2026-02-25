import OTP from "../models/OTP.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import {
  formatIndianPhoneForFast2SMS,
  hasFast2SMSConfig,
  sendOtpSmsViaFast2SMS
} from "../services/fast2smsService.js";

const ADD_CENTER_PURPOSES = ["add_center_normal", "add_center_business"];

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const normalizePhoneToE164 = (rawPhone) => {
  const local = formatIndianPhoneForFast2SMS(rawPhone);
  return local ? `+91${local}` : "";
};

// Rate limiting check
const canSendOTP = async (phone, purpose) => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const recentOTP = await OTP.findOne({
    phone,
    purpose,
    createdAt: { $gte: fiveMinutesAgo }
  });

  return !recentOTP;
};

const ensureAddCenterAuthorized = (req, purpose) => {
  if (!ADD_CENTER_PURPOSES.includes(purpose)) {
    return { ok: true };
  }

  if (!req.user) {
    return { ok: false, status: 401, message: "Login is required for Add Center verification" };
  }

  if (purpose === "add_center_business") {
    if (!req.user.phone) {
      return { ok: false, status: 400, message: "Please set your registered phone number in profile before verification" };
    }
  }

  return { ok: true };
};

// Send OTP
export const sendOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, purpose, userId } = req.body;
  const normalizedPhone = normalizePhoneToE164(phone);

  if (!normalizedPhone) {
    return res.status(400).json({ message: "Enter a valid India (+91) phone number" });
  }

  const authCheck = ensureAddCenterAuthorized(req, purpose);
  if (!authCheck.ok) {
    return res.status(authCheck.status).json({ message: authCheck.message });
  }

  if (purpose === "add_center_business") {
    const registeredPhone = normalizePhoneToE164(req.user.phone);
    if (!registeredPhone || registeredPhone !== normalizedPhone) {
      return res.status(400).json({ message: "Please use your registered mobile number for verification" });
    }
  }

  try {
    const canSend = await canSendOTP(normalizedPhone, purpose);
    if (!canSend) {
      return res.status(429).json({
        message: "OTP already sent. Please wait 5 minutes before requesting again."
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (!hasFast2SMSConfig()) {
      return res.status(503).json({ message: "OTP service unavailable: FAST2SMS_API_KEY is missing" });
    }

    await sendOtpSmsViaFast2SMS({ phone: normalizedPhone, otp });

    await OTP.create({
      phone: normalizedPhone,
      otp,
      purpose,
      userId: userId || req.user?._id || null,
      expiresAt,
      ipAddress: req.ip || req.connection.remoteAddress
    });

    res.status(200).json({
      message: "OTP sent successfully",
      smsSent: true,
      phone: normalizedPhone,
      expiresIn: 600
    });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(502).json({ message: "Failed to send OTP via SMS provider" });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, otp, purpose } = req.body;
  const normalizedPhone = normalizePhoneToE164(phone);

  if (!normalizedPhone) {
    return res.status(400).json({ message: "Enter a valid India (+91) phone number" });
  }

  const authCheck = ensureAddCenterAuthorized(req, purpose);
  if (!authCheck.ok) {
    return res.status(authCheck.status).json({ message: authCheck.message });
  }

  try {
    const otpRecord = await OTP.findOne({
      phone: normalizedPhone,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (otpRecord.attempts >= 5) {
      otpRecord.isUsed = true;
      await otpRecord.save();
      return res.status(400).json({ message: "Too many attempts. Please request a new OTP." });
    }

    otpRecord.attempts += 1;

    if (otpRecord.otp !== otp) {
      await otpRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    let result = { verified: true };

    if (purpose === "mobile_verification" && (otpRecord.userId || req.user?._id)) {
      const targetUserId = otpRecord.userId || req.user?._id;
      await User.findByIdAndUpdate(targetUserId, {
        isMobileVerified: true,
        phone: normalizedPhone
      });
      result.userId = targetUserId;
    }

    if (ADD_CENTER_PURPOSES.includes(purpose) && req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        addCenterOtpVerifiedAt: new Date(),
        addCenterOtpVerifiedPhone: normalizedPhone,
        phone: normalizedPhone,
        ...(purpose === "add_center_business"
          ? { addCenterLicenseVerifiedAt: null, addCenterLicenseUrl: "" }
          : {})
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

// Resend OTP (with rate limiting)
export const resendOTP = async (req, res) => {
  const { phone, purpose } = req.body;

  if (!phone || !purpose) {
    return res.status(400).json({ message: "Phone and purpose are required" });
  }

  return sendOTP(req, res);
};
