import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // For hierarchical structure - if this disease has types (e.g., Cancer has Lung Cancer, Breast Cancer)
  parentDiseaseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Disease", 
    default: null 
  },
  // Description of the disease
  description: { type: String, default: "" },
  // Category for grouping
  category: { type: String, default: "General" },
  // Whether this disease is active/available for searching
  isActive: { type: Boolean, default: true },
  // Display order
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Index for searching
diseaseSchema.index({ name: "text", description: "text" });
// Index for hierarchical queries
diseaseSchema.index({ parentDiseaseId: 1 });
diseaseSchema.index({ isActive: 1 });

const Disease = mongoose.model("Disease", diseaseSchema);
export default Disease;
