import express from "express";
import {
  applyToInternship,
  getMyApplications,
  getApplications,
  getMenteeApplications,
  updateApplicationStatus,
  setMentorApproval,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("student"), applyToInternship);
router.get("/my", authorize("student"), getMyApplications);
router.get("/mentee", authorize("faculty"), getMenteeApplications);
router.get("/", authorize("company", "coordinator", "admin"), getApplications);
router.put("/:id/status", authorize("company", "coordinator", "admin"), updateApplicationStatus);
router.put("/:id/mentor-approval", authorize("faculty"), setMentorApproval);

export default router;
