import Center from "../models/Center.js";
import User from "../models/User.js";
import Report from "../models/Report.js";

// Get pending centers
export const getPendingServices = async (req, res) => {
  try {
    const centers = await Center.find({ status: "pending" })
      .populate("ownerId", "name email phone role businessName")
      .sort({ createdAt: -1 });
    res.json(centers);
  } catch (err) {
    console.error("Get pending error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get approved centers
export const getApprovedServices = async (req, res) => {
  try {
    const centers = await Center.find({ status: "approved" })
      .populate("ownerId", "name email phone role businessName")
      .sort({ verifiedAt: -1, updatedAt: -1 });
    res.json(centers);
  } catch (err) {
    console.error("Get approved error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve center
export const approveService = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: "Center not found" });

    center.status = "approved";
    center.verifiedBy = req.user._id;
    center.verifiedAt = new Date();
    center.isVerified = true;
    const updated = await center.save();

    res.json(updated);
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject center
export const rejectService = async (req, res) => {
  try {
    const { reason } = req.body;
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: "Center not found" });

    center.status = "rejected";
    center.rejectionReason = reason || "";
    const updated = await center.save();

    res.json({ center: updated, reason });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update center before approval
export const updateServiceBeforeApproval = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: "Center not found" });

    if (center.status !== "pending") {
      return res.status(400).json({ message: "Can only edit pending centers" });
    }

    const {
      name,
      diseaseName,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website,
      description,
      treatmentType,
      priceRange,
      photos
    } = req.body;

    if (name) center.name = name;
    if (diseaseName) center.diseaseName = diseaseName;
    if (address) center.location.address = address;
    if (city) center.location.city = city;
    if (state) center.location.state = state;
    if (pincode) center.location.pincode = pincode;
    if (phone) center.contact.phone = phone;
    if (email) center.contact.email = email;
    if (website) center.contact.website = website;
    if (description) center.description = description;
    if (treatmentType) center.treatmentType = treatmentType;
    if (priceRange) center.priceRange = priceRange;
    if (Array.isArray(photos)) center.photos = photos;

    const updated = await center.save();
    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete center
export const deleteService = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: "Center not found" });

    await center.deleteOne();
    res.json({ message: "Center deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("service", "name")
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Get reports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark report reviewed
export const markReportReviewed = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = "reviewed";
    await report.save();
    res.json(report);
  } catch (err) {
    console.error("Mark reviewed error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify business user license
export const verifyBusinessLicense = async (req, res) => {
  try {
    const { userId, verified } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "business") {
      return res.status(400).json({ message: "User is not a business account" });
    }

    user.isLicenseVerified = verified;
    await user.save();

    res.json({ message: verified ? "Business verified" : "Verification revoked", user });
  } catch (err) {
    console.error("Verify license error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
