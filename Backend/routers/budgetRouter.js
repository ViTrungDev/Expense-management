import express from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// All routes require user authentication
router.post("/", verifyToken, createBudget);       // Create new budget
router.get("/", verifyToken, getBudgets);          // Get all budgets for user
router.put("/:id", verifyToken, updateBudget);     // Update a budget
router.delete("/:id", verifyToken, deleteBudget);  // Delete a budget

export default router;
