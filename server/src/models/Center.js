import mongoose from "mongoose";

const centerSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  
  // Disease/condition treated - references Disease model
  diseaseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Disease",
    required: true 
  },
  
  // For displaying disease name even if disease is deleted
  diseaseName: { type: String, required: true },
  
  // Owner info
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  
  // Location
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, default: "" },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    }
  },
  
  // Contact
  contact: {
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  
  // Treatment details
  description: { type: String, required: true },
  treatmentType: {
    type: String,
    enum: ["Ayurveda", "Herbal", "Allopathic", "Homeopathy", "Yoga", "Local therapy", "Other"],
    default: "Other"
  },
  priceRange: { type: String, default: "" },
  
  // Photos
  photos: [{ type: String }],
  
  // Business specific fields (for verified business users)
  businessLicenseNumber: { type: String, default: "" },
  licenseUrl: { type: String, default: "" },
  
  // Verification status
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  verifiedAt: { type: Date, default: null },
  
  // Admin approval
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: { type: String, default: "" },
  
  // Stats
  viewCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for performance
centerSchema.index({ name: "text", description: "text" });
centerSchema.index({ diseaseId: 1 });
centerSchema.index({ "location.city": 1 });
centerSchema.index({ "location.state": 1 });
centerSchema.index({ ownerId: 1 });
centerSchema.index({ status: 1 });
centerSchema.index({ isVerified: 1 });
centerSchema.index({ treatmentType: 1 });
centerSchema.index({ createdAt: -1 });

const Center = mongoose.model("Center", centerSchema);
export default Center;
