import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  searchCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  getMyCenters,
  getUserCenters,
  uploadBusinessLicenseForAddCenter
} from "../controllers/centerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const licensesDir = path.join(process.cwd(), "uploads", "licenses");
fs.mkdirSync(licensesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, licensesDir),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname || "").toLowerCase();
    const timestamp = Date.now();
    cb(null, `${req.user._id}-${timestamp}${safeExt}`);
  }
});

const allowedMime = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
      return cb(new Error("Only PDF/JPEG/PNG/WEBP files are allowed"));
    }
    return cb(null, true);
  }
});

// Public routes
router.get("/", searchCenters);
router.get("/user/:userId", getUserCenters);

// Protected routes
router.get("/my/list", protect, getMyCenters);
router.post("/license-upload", protect, upload.single("license"), uploadBusinessLicenseForAddCenter);
router.post("/", protect, createCenter);
router.put("/:id", protect, updateCenter);
router.delete("/:id", protect, deleteCenter);

// Keep ID route at the end so it doesn't shadow static paths
router.get("/:id", getCenterById);

export default router;
