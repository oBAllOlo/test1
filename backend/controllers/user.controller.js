import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // สำหรับการเข้ารหัสรหัสผ่าน

// ฟังก์ชันสำหรับเพิ่มผู้ใช้ใหม่
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // ตรวจสอบความยาวของรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // เข้ารหัสรหัสผ่าน
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ฟังก์ชันสำหรับอัปเดตผู้ใช้
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ดึงข้อมูลผู้ใช้ทั้งหมด ยกเว้นรหัสผ่าน
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ฟังก์ชันสำหรับลบผู้ใช้
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
