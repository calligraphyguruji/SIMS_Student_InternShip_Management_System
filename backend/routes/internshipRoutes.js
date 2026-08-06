import express from "express";
import {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
} from "../controllers/internshipController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Browsing internships is public-ish, but require login to keep it simple and consistent
router.get("/", protect, getInternships);
router.get("/:id", protect, getInternshipById);

router.post("/", protect, authorize("company", "admin"), createInternship);
router.put("/:id", protect, authorize("company", "admin", "coordinator"), updateInternship);
router.delete("/:id", protect, authorize("company", "admin", "coordinator"), deleteInternship);

export default router;
