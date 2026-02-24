import express from "express";
import {
  getPendingServices,
  approveService,
  rejectService,
  updateServiceBeforeApproval,
  deleteService,
  getReports,
  markReportReviewed
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/services/pending", getPendingServices);
router.put("/services/:id/approve", approveService);
router.put("/services/:id/reject", rejectService);
router.put("/services/:id", updateServiceBeforeApproval);
router.delete("/services/:id", deleteService);

router.get("/reports", getReports);
router.put("/reports/:id/reviewed", markReportReviewed);

export default router;
