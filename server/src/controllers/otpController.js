import OTP from "../models/OTP.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
const DEFAULT_COUNTRY_CODE = process.env.OTP_DEFAULT_COUNTRY_CODE || "+91";
const OTP_ALLOW_DEMO = String(process.env.OTP_ALLOW_DEMO || "false").toLowerCase() === "true";
const IS_PRODUCTION = String(process.env.NODE_ENV || "development").toLowerCase() === "production";

const ADD_CENTER_PURPOSES = ["add_center_normal", "add_center_business"];

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isValidIndianLocal = (digits10) => /^[6-9]\d{9}$/.test(digits10);
const isValidUSLocal = (digits10) => /^[2-9]\d{2}[2-9]\d{6}$/.test(digits10);
const isValidE164Phone = (value) => /^\+[1-9]\d{7,14}$/.test(value);

const normalizePhoneToE164 = (rawPhone) => {
  const value = String(rawPhone || "").trim();
  if (!value) return "";

  const plusPrefixed = value.startsWith("+");
  const digitsOnly = value.replace(/\D/g, "");

  if (plusPrefixed) {
    if (value.startsWith("+91")) {
      const local = digitsOnly.slice(2);
      return isValidIndianLocal(local) ? `+91${local}` : "";
    }
    if (value.startsWith("+1")) {
      const local = digitsOnly.slice(1);
      return isValidUSLocal(local) ? `+1${local}` : "";
    }
    return "";
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    const local = digitsOnly.slice(2);
    return isValidIndianLocal(local) ? `+91${local}` : "";
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    const local = digitsOnly.slice(1);
    return isValidUSLocal(local) ? `+1${local}` : "";
  }

  if (digitsOnly.length === 10) {
    if (DEFAULT_COUNTRY_CODE === "+1") {
      return isValidUSLocal(digitsOnly) ? `+1${digitsOnly}` : "";
    }
    return isValidIndianLocal(digitsOnly) ? `+91${digitsOnly}` : "";
  }

  return "";
};

const hasTwilioConfig = () => {
  return Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);
};

const isValidTwilioSender = () => {
  return isValidE164Phone(TWILIO_PHONE_NUMBER);
};

const sendSMSViaTwilio = async (to, otp) => {
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const payload = new URLSearchParams({
    To: to,
    From: TWILIO_PHONE_NUMBER,
    Body: `Your Kaaya Kalpa OTP is ${otp}. It expires in 10 minutes.`
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: payload
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio SMS failed: ${response.status} ${errorText}`);
  }
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
    if (req.user.role !== "business") {
      return { ok: false, status: 403, message: "Only business accounts can use business Add Center flow" };
    }

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
    return res.status(400).json({ message: "Enter a valid India (+91) or US (+1) phone number" });
  }

  const authCheck = ensureAddCenterAuthorized(req, purpose);
  if (!authCheck.ok) {
    return res.status(authCheck.status).json({ message: authCheck.message });
  }

  if (purpose === "add_center_business") {
    const registeredPhone = normalizePhoneToE164(req.user.phone);
    if (!registeredPhone || registeredPhone !== normalizedPhone) {
      return res.status(400).json({ message: "Please use your registered business phone number for verification" });
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

    // Testing mode: allow demo OTP only outside production.
    if (OTP_ALLOW_DEMO && !IS_PRODUCTION) {
      await OTP.create({
        phone: normalizedPhone,
        otp,
        purpose,
        userId: userId || req.user?._id || null,
        expiresAt,
        ipAddress: req.ip || req.connection.remoteAddress
      });

      return res.status(200).json({
        message: "OTP generated in demo mode",
        smsSent: false,
        phone: normalizedPhone,
        expiresIn: 600,
        demoOTP: otp
      });
    }

    if (!hasTwilioConfig()) {
      return res.status(503).json({ message: "OTP service unavailable: Twilio credentials are missing" });
    }

    if (!isValidTwilioSender()) {
      return res.status(500).json({ message: "OTP service misconfigured: TWILIO_PHONE_NUMBER must be in +E.164 format" });
    }

    await sendSMSViaTwilio(normalizedPhone, otp);

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
    return res.status(400).json({ message: "Enter a valid India (+91) or US (+1) phone number" });
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
