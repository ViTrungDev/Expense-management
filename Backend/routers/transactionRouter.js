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

router.post("/", createTransaction);          
router.get("/", getTransactions);              
router.put("/:id", updateTransaction);         
router.delete("/:id", deleteTransaction);      

export default router;
