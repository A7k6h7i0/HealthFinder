import express from "express";
import {
  searchServices,
  createService,
  getServiceById
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", searchServices);
router.get("/:id", getServiceById);
router.post("/", protect, createService); // user submit (pending)

export default router;
