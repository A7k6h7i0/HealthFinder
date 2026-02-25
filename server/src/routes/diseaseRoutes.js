import express from "express";
import {
  getAllDiseases,
  getDiseasesHierarchy,
  getDiseaseById,
  searchDiseases,
  createDisease,
  updateDisease,
  deleteDisease
} from "../controllers/diseaseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllDiseases);
router.get("/hierarchy", getDiseasesHierarchy);
router.get("/search", searchDiseases);
router.get("/:id", getDiseaseById);

// Admin routes
router.post("/", protect, requireRole('admin'), createDisease);
router.put("/:id", protect, requireRole('admin'), updateDisease);
router.delete("/:id", protect, requireRole('admin'), deleteDisease);

export default router;
