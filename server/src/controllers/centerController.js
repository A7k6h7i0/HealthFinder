import Center from "../models/Center.js";
import Disease from "../models/Disease.js";
import User from "../models/User.js";

const OTP_VERIFICATION_WINDOW_MS = 30 * 60 * 1000;

const hasRecentOtpVerification = (user) => {
  if (!user?.addCenterOtpVerifiedAt) return false;
  const verifiedAt = new Date(user.addCenterOtpVerifiedAt).getTime();
  return Date.now() - verifiedAt <= OTP_VERIFICATION_WINDOW_MS;
};

const isNonEmpty = (value) => String(value || "").trim().length > 0;
const isValidIndianPincode = (value) => /^[1-9]\d{5}$/.test(String(value || "").trim());
const isValidIndianMobile = (value) => {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+91")) return /^[6-9]\d{9}$/.test(digits.slice(2));
  if (digits.length === 12 && digits.startsWith("91")) return /^[6-9]\d{9}$/.test(digits.slice(2));
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  return false;
};
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
const isValidWebsite = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return true;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
const isValidLicenseNumber = (value) => /^[A-Za-z0-9][A-Za-z0-9\-\/]{5,29}$/.test(String(value || "").trim());
const isValidBusinessName = (value) => /^[A-Za-z0-9&.,()\-'\s]{2,120}$/.test(String(value || "").trim());
const isValidAddress = (value) => /^[A-Za-z0-9,./#()\-'\s]{10,250}$/.test(String(value || "").trim());
const isValidDescription = (value) => {
  const text = String(value || "").trim();
  return text.length >= 30 && text.length <= 2000;
};
const isValidPhotoUrl = (value) => {
  try {
    const parsed = new URL(String(value || "").trim());
    if (!(parsed.protocol === "http:" || parsed.protocol === "https:")) return false;
    return /\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(parsed.pathname + parsed.search);
  } catch {
    return false;
  }
};

// Search centers with filters and pagination
export const searchCenters = async (req, res) => {
  try {
    const {
      diseaseId,
      disease,
      city,
      state,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const query = { status: "approved" };

    if (diseaseId) {
      query.diseaseId = diseaseId;
    }

    if (disease) {
      query.diseaseName = { $regex: disease, $options: "i" };
    }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    if (state) {
      query["location.state"] = { $regex: state, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const centers = await Center.find(query)
      .populate("ownerId", "name email businessName")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Center.countDocuments(query);

    res.json({
      centers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Search centers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get center by ID
export const getCenterById = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id)
      .populate("ownerId", "name email businessName phone");

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    center.viewCount += 1;
    await center.save();

    res.json(center);
  } catch (err) {
    console.error("Get center error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadBusinessLicenseForAddCenter = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!hasRecentOtpVerification(user)) {
      return res.status(400).json({ message: "Complete OTP verification before uploading license" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "License upload is required" });
    }

    const allowedExt = new Set([".pdf", ".jpg", ".jpeg", ".png", ".webp"]);
    const fileExt = String(req.file.originalname || "").toLowerCase().slice(String(req.file.originalname || "").lastIndexOf("."));
    if (!allowedExt.has(fileExt)) {
      return res.status(400).json({ message: "Invalid license file format" });
    }

    const { businessName, licenseNumber } = req.body;
    if (!isValidBusinessName(businessName)) {
      return res.status(400).json({ message: "Enter a valid business name (2-120 chars)" });
    }

    if (!isValidLicenseNumber(licenseNumber)) {
      return res.status(400).json({ message: "Enter a valid license number" });
    }

    const relativePath = `/uploads/licenses/${req.file.filename}`;

    user.businessName = String(businessName).trim();
    user.licenseNumber = String(licenseNumber).trim();
    user.licenseUrl = relativePath;
    user.addCenterLicenseUrl = relativePath;
    user.addCenterLicenseVerifiedAt = new Date();

    await user.save();

    res.status(200).json({
      message: "License uploaded and verified for Add Center flow",
      licenseUrl: relativePath
    });
  } catch (err) {
    console.error("Business license upload error:", err);
    res.status(500).json({ message: "Failed to upload license" });
  }
};

// Create center (requires authentication)
export const createCenter = async (req, res) => {
  try {
    const {
      name,
      diseaseId,
      diseaseName,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website,
      description,
      serviceDetails,
      photos,
      businessName,
      licenseNumber,
      flowType
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!hasRecentOtpVerification(user)) {
      return res.status(400).json({ message: "Phone OTP verification is required before adding a center" });
    }

    if (!isNonEmpty(diseaseId)) return res.status(400).json({ message: "Disease category is required" });
    if (!isNonEmpty(address) || !isNonEmpty(city) || !isNonEmpty(state)) {
      return res.status(400).json({ message: "Complete location details are required" });
    }
    if (!isValidAddress(address)) return res.status(400).json({ message: "Enter a valid address (10-250 chars)" });
    if (!isValidIndianMobile(phone)) return res.status(400).json({ message: "Enter a valid India (+91) contact number" });
    if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (!isValidDescription(description)) return res.status(400).json({ message: "Description must be 30-2000 characters" });
    if (isNonEmpty(pincode) && !isValidIndianPincode(pincode)) {
      return res.status(400).json({ message: "Enter a valid 6-digit pincode" });
    }
    if (!isValidWebsite(website)) {
      return res.status(400).json({ message: "Website must be a valid http/https URL" });
    }
    if (Array.isArray(photos) && photos.some((url) => !isValidPhotoUrl(url))) {
      return res.status(400).json({ message: "All photo URLs must be valid image links (jpg/jpeg/png/webp)" });
    }

    const disease = await Disease.findById(diseaseId);
    if (!disease) {
      return res.status(400).json({ message: "Invalid disease selected" });
    }

    const isBusinessFlow = flowType === "business";

    if (!isBusinessFlow && !isNonEmpty(name)) {
      return res.status(400).json({ message: "Center name is required" });
    }

    let isVerified = false;
    let businessLicenseNumber = "";
    let licenseUrl = "";

    if (isBusinessFlow) {
      if (!isValidBusinessName(businessName)) {
        return res.status(400).json({ message: "Enter a valid business name (2-120 chars)" });
      }

      if (!isValidLicenseNumber(licenseNumber)) {
        return res.status(400).json({ message: "Enter a valid license number" });
      }

      if (!isNonEmpty(serviceDetails)) {
        return res.status(400).json({ message: "Service details are required" });
      }

      if (!user.addCenterLicenseVerifiedAt || !isNonEmpty(user.addCenterLicenseUrl)) {
        return res.status(400).json({ message: "License verification is required before adding a business center" });
      }

      if (String(user.licenseNumber || "").trim() !== String(licenseNumber).trim()) {
        return res.status(400).json({ message: "License number does not match uploaded license" });
      }

      businessLicenseNumber = user.licenseNumber;
      licenseUrl = user.addCenterLicenseUrl;
      isVerified = Boolean(user.isLicenseVerified);
    }

    const center = await Center.create({
      name: isBusinessFlow ? String(businessName).trim() : String(name).trim(),
      diseaseId,
      diseaseName: diseaseName || disease.name,
      ownerId: user._id,
      location: {
        address: String(address).trim(),
        city: String(city).trim(),
        state: String(state).trim(),
        pincode: pincode || ""
      },
      contact: {
        phone: String(phone).trim(),
        email: String(email).trim(),
        website: website || ""
      },
      description: String(description).trim(),
      priceRange: serviceDetails || "",
      photos: Array.isArray(photos) ? photos : [],
      businessLicenseNumber,
      licenseUrl,
      isVerified,
      status: "pending"
    });

    await User.findByIdAndUpdate(user._id, {
      addCenterOtpVerifiedAt: null,
      addCenterOtpVerifiedPhone: "",
      ...(isBusinessFlow ? { addCenterLicenseVerifiedAt: null } : {})
    });

    res.status(201).json(center);
  } catch (err) {
    console.error("Create center error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update center
export const updateCenter = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    if (center.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedCenter = await Center.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (req.user._id.toString() === center.ownerId.toString()) {
      updatedCenter.isVerified = false;
      updatedCenter.status = "pending";
      await updatedCenter.save();
    }

    res.json(updatedCenter);
  } catch (err) {
    console.error("Update center error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete center
export const deleteCenter = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    if (center.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Center.findByIdAndDelete(req.params.id);
    res.json({ message: "Center deleted" });
  } catch (err) {
    console.error("Delete center error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's own centers
export const getMyCenters = async (req, res) => {
  try {
    const centers = await Center.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(centers);
  } catch (err) {
    console.error("Get my centers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get centers by a specific user (for admin or public profile)
export const getUserCenters = async (req, res) => {
  try {
    const centers = await Center.find({ ownerId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(centers);
  } catch (err) {
    console.error("Get user centers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
