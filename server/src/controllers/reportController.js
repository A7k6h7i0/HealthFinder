import Report from "../models/Report.js";
import Service from "../models/Service.js";

export const createReport = async (req, res) => {
  try {
    const { serviceId, reason } = req.body;
    const service = await Service.findById(serviceId);
    if (!service || service.status !== "approved") {
      return res.status(404).json({ message: "Service not found" });
    }

    const report = await Report.create({
      service: serviceId,
      reportedBy: req.user._id,
      reason
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
