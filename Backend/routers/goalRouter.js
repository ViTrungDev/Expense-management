import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// All routes require user authentication
router.post("/", verifyToken, createGoal);       // Create new goal
router.get("/", verifyToken, getGoals);          // Get all goals for user
router.put("/:id", verifyToken, updateGoal);     // Update a goal
router.delete("/:id", verifyToken, deleteGoal);  // Delete a goal

export default router;
