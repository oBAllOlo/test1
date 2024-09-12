import express from "express";
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../controllers/user.controller.js"; // นำเข้า deleteUser อย่างถูกต้อง
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route สำหรับจัดการข้อมูลผู้ใช้
router.get("/", protectRoute, adminRoute, getUsers); // Route สำหรับดึงข้อมูลผู้ใช้
router.delete("/:id", protectRoute, adminRoute, deleteUser); // Route สำหรับลบผู้ใช้
router.put("/:id", protectRoute, adminRoute, updateUser); // Route สำหรับอัปเดตผู้ใช้
router.post("/", protectRoute, adminRoute, createUser); // Route สำหรับเพิ่มผู้ใช้ใหม่

export default router;
