import Report from "../models/Report.js";
import Center from "../models/Center.js";

export const createReport = async (req, res) => {
  try {
    const { serviceId, reason } = req.body;
    const center = await Center.findById(serviceId);
    if (!center || center.status !== "approved") {
      return res.status(404).json({ message: "Center not found" });
    }

    const report = await Report.create({
      service: serviceId,
      reportedBy: req.user._id,
      reason
    });

    res.status(201).json(report);
  } catch (err) {
    console.error("Create report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
