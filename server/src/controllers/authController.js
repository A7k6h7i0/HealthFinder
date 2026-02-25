import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { validationResult } from "express-validator";

// Register new user
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, phone, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ 
      name, 
      email, 
      password,
      phone: phone || "",
      role: role || "user"
    });
    
    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isMobileVerified: user.isMobileVerified,
      isLicenseVerified: user.isLicenseVerified,
      token
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = generateToken(user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isMobileVerified: user.isMobileVerified,
      isLicenseVerified: user.isLicenseVerified,
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profilePhoto } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      profilePhoto: user.profilePhoto,
      isMobileVerified: user.isMobileVerified,
      isLicenseVerified: user.isLicenseVerified
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update to business account (requires license verification)
export const upgradeToBusiness = async (req, res) => {
  try {
    const { businessName, licenseNumber, licenseUrl } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "business") {
      return res.status(400).json({ message: "Already a business account" });
    }

    // Update user to business
    user.role = "business";
    user.businessName = businessName || user.name;
    user.licenseNumber = licenseNumber || "";
    user.licenseUrl = licenseUrl || "";
    // License verification will be done after admin review
    user.isLicenseVerified = false;

    await user.save();

    res.json({ 
      message: "Business account request submitted. Awaiting license verification.",
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        businessName: user.businessName,
        isLicenseVerified: user.isLicenseVerified
      }
    });
  } catch (err) {
    console.error("Upgrade to business error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify mobile number (called after OTP verification)
export const verifyMobile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isMobileVerified = true;
    await user.save();

    res.json({ 
      message: "Mobile number verified successfully",
      isMobileVerified: true
    });
  } catch (err) {
    console.error("Verify mobile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check if email exists (for password reset)
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    res.json({ exists: !!user });
  } catch (err) {
    console.error("Check email error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
