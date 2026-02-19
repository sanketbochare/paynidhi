// backend/src/routes/auth.routes.js
import express from "express";
import {
  registerSeller,
  loginSeller,
  registerLender,
  loginLender,
  getMe,
  updateAvatar,
  requestOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Seller Routes
router.post("/register-seller", registerSeller);
router.post("/login-seller", loginSeller);

// Lender Routes
router.post("/register-lender", registerLender);
router.post("/login-lender", loginLender);

// Get current user from cookie
router.get("/me", protect, getMe);

// Avatar update
router.put("/avatar", protect, updateAvatar);

// OTP
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

export default router;
