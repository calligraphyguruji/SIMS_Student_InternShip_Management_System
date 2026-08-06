import express from "express";
import {
  updateMyProfile,
  uploadMyResume,
  listUsers,
  getUserById,
  setUserStatus,
  assignMentor,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.put("/me", updateMyProfile);
router.post("/me/resume", uploadMyResume);
router.get("/", authorize("admin", "coordinator"), listUsers);
router.get("/:id", authorize("admin", "coordinator", "faculty"), getUserById);
router.put("/:id/status", authorize("admin"), setUserStatus);
router.put("/:id/mentor", authorize("admin", "coordinator"), assignMentor);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
