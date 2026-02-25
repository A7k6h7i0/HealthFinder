import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  // Purpose: 'mobile_verification', 'add_center_normal', 'add_center_business'
  purpose: { 
    type: String, 
    required: true,
    enum: ['mobile_verification', 'add_center_normal', 'add_center_business']
  },
  // User ID if associated with a user
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: null 
  },
  // Expiry time
  expiresAt: { type: Date, required: true },
  // Verification status
  isUsed: { type: Boolean, default: false },
  // Attempts counter
  attempts: { type: Number, default: 0 },
  // IP address for rate limiting
  ipAddress: { type: String, default: "" }
}, { timestamps: true });

// Indexes
otpSchema.index({ phone: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete after expiry

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
