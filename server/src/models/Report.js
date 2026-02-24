import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["open", "reviewed"], default: "open" }
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
