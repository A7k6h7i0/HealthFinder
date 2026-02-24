import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true }
    },
    priceRange: { type: String, required: true }, // e.g. "₹500 - ₹1500"
    description: { type: String, required: true },
    diseases: [{ type: String, required: true }],
    treatmentType: {
      type: String,
      enum: ["Ayurveda", "Herbal", "Local therapy", "Other"],
      default: "Other"
    },
    contact: { type: String, required: true },
    photos: [{ type: String }],
    proof: { type: String }, // URL or description of verification proof
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isVerifiedProofChecked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
