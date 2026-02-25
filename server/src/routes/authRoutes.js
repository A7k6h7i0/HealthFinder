import express from "express";
import { body } from "express-validator";
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  upgradeToBusiness,
  verifyMobile,
  checkEmail
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Min 6 chars password")
  ],
  register
);

// Login
router.post("/login", login);

// Check email exists
router.post("/check-email", checkEmail);

// Protected routes
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/verify-mobile", protect, verifyMobile);

// Upgrade to business account
router.put(
  "/upgrade-business",
  protect,
  [
    body("businessName").notEmpty().withMessage("Business name is required"),
    body("licenseNumber").notEmpty().withMessage("License number is required")
  ],
  upgradeToBusiness
);

export default router;
