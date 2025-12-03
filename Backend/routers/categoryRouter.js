import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Public route: get categories
router.get("/", verifyToken, getCategories);

// Admin routes: create, update, delete
router.post("/", verifyToken, createCategory);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;
