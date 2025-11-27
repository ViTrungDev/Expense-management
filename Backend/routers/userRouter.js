import express from "express";
import {
  register,
  login,
  loginWithGoogle,
  loginWithFacebook,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", register);           // Đăng ký local
router.post("/login", login);                 // Đăng nhập local
router.post("/login/google", loginWithGoogle);   // Đăng nhập Google
router.post("/login/facebook", loginWithFacebook); // Đăng nhập Facebook

// ADMIN-ONLY ROUTES
router.get("/", verifyToken, getAllUsers);       // Lấy tất cả users
router.get("/:id", verifyToken, getUser);        // Lấy user theo id
router.put("/:id", verifyToken, updateUser);     // Cập nhật user
router.delete("/:id", verifyToken, deleteUser);  // Xóa user

export default router;
