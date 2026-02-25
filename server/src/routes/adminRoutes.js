import express from "express";
import {
  getPendingServices,
  getApprovedServices,
  approveService,
  rejectService,
  updateServiceBeforeApproval,
  deleteService,
  getReports,
  markReportReviewed,
  verifyBusinessLicense,
  getAllUsers
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

// Center management
router.get("/services/pending", getPendingServices);
router.get("/services/approved", getApprovedServices);
router.put("/services/:id/approve", approveService);
router.put("/services/:id/reject", rejectService);
router.put("/services/:id", updateServiceBeforeApproval);
router.delete("/services/:id", deleteService);

// Reports
router.get("/reports", getReports);
router.put("/reports/:id/reviewed", markReportReviewed);

// Business verification
router.put("/users/:userId/verify-license", verifyBusinessLicense);
router.get("/users", getAllUsers);

export default router;
