import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "business", "admin"],
      default: "user"
    },
    // Verification status
    isMobileVerified: { type: Boolean, default: false },
    isLicenseVerified: { type: Boolean, default: false },
    // Add-center verification state
    addCenterOtpVerifiedAt: { type: Date, default: null },
    addCenterOtpVerifiedPhone: { type: String, default: "" },
    addCenterLicenseVerifiedAt: { type: Date, default: null },
    addCenterLicenseUrl: { type: String, default: "" },
    // For business users
    businessName: { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
    licenseUrl: { type: String, default: "" },
    // Profile fields
    address: { type: String, default: "" },
    profilePhoto: { type: String, default: "" }
  },
  { timestamps: true }
);

userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
