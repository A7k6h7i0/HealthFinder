import express from "express";
import { body } from "express-validator";
import { sendOTP, verifyOTP, resendOTP } from "../controllers/otpController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();
const validPhone = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return false;
  const digits = raw.replace(/\D/g, "");

  if (raw.startsWith("+91")) return /^[6-9]\d{9}$/.test(digits.slice(2));
  if (digits.length === 12 && digits.startsWith("91")) return /^[6-9]\d{9}$/.test(digits.slice(2));
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  return false;
};

import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests. Please try again after 5 minutes." }
});

router.post(
  "/send",
  optionalProtect,
  otpLimiter,
  [
    body("phone")
      .custom((value) => validPhone(value))
      .withMessage("Enter a valid India (+91) phone number"),
    body("purpose")
      .isIn(["mobile_verification", "add_center_normal", "add_center_business"])
      .withMessage("Invalid purpose")
  ],
  sendOTP
);

router.post(
  "/verify",
  optionalProtect,
  [
    body("phone")
      .custom((value) => validPhone(value))
      .withMessage("Enter a valid India (+91) phone number"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    body("purpose")
      .isIn(["mobile_verification", "add_center_normal", "add_center_business"])
      .withMessage("Invalid purpose")
  ],
  verifyOTP
);

router.post(
  "/resend",
  optionalProtect,
  otpLimiter,
  [
    body("phone")
      .custom((value) => validPhone(value))
      .withMessage("Enter a valid India (+91) phone number"),
    body("purpose")
      .isIn(["mobile_verification", "add_center_normal", "add_center_business"])
      .withMessage("Invalid purpose")
  ],
  resendOTP
);

export default router;
