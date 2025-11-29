import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// All routes require login
router.use(verifyToken);

router.post("/", createTransaction);            // Create transaction
router.get("/", getTransactions);               // Get user's transactions
router.put("/:id", updateTransaction);         // Update transaction
router.delete("/:id", deleteTransaction);      // Delete transaction

export default router;
