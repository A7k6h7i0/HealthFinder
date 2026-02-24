import Service from "../models/Service.js";
import Report from "../models/Report.js";

export const getPendingServices = async (req, res) => {
  try {
    const services = await Service.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const approveService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.status = "approved";
    service.verifiedBy = req.user._id;
    service.isVerifiedProofChecked = !!service.proof;
    const updated = await service.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectService = async (req, res) => {
  try {
    const { reason } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.status = "rejected";
    const updated = await service.save();

    // Optionally store rejection reason in a separate collection/log if required
    res.json({ service: updated, reason });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateServiceBeforeApproval = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (service.status !== "pending") {
      return res.status(400).json({ message: "Can only edit pending services" });
    }

    const {
      name,
      city,
      state,
      priceRange,
      description,
      diseases,
      treatmentType,
      contact,
      photos,
      proof
    } = req.body;

    if (name) service.name = name;
    if (city || state) {
      service.location.city = city ?? service.location.city;
      service.location.state = state ?? service.location.state;
    }
    if (priceRange) service.priceRange = priceRange;
    if (description) service.description = description;
    if (Array.isArray(diseases)) service.diseases = diseases;
    if (treatmentType) service.treatmentType = treatmentType;
    if (contact) service.contact = contact;
    if (Array.isArray(photos)) service.photos = photos;
    if (proof !== undefined) service.proof = proof;

    const updated = await service.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("service reportedBy", "name email");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const markReportReviewed = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = "reviewed";
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
