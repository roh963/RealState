import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/admin/dashboard", authenticate, requireAdmin, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!", user: req.user });
});

export default router; 