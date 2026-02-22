import express from "express";
import {
  registerSeller,
  loginSeller,
  registerLender,
  loginLender,
  getMe,
  updateAvatar,
  updateProfile,
  requestOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/avatarUpload.middleware.js";
import { upload } from "../middleware/upload.middleware.js"; // ✅ FIXED: Added curly braces

const router = express.Router();

// Seller Routes
router.post("/register-seller", registerSeller);
router.post("/login-seller", loginSeller);

// Lender Routes
router.post("/register-lender", registerLender);
router.post("/login-lender", loginLender);

// Get current user from cookie
router.get("/me", protect, getMe);

// Avatar & Profile updates
router.put("/avatar", protect, updateAvatar);
router.put("/update-profile", protect, updateProfile);
// ✅ FIXED: Uses uploadAvatar middleware (which allows images) instead of upload (which only allows PDFs)
router.post("/update-avatar", protect, uploadAvatar, updateAvatar); 

// OTP
router.post("/request-otp", requestOtp);
router.post("/verify-otp", uploadAvatar, verifyOtp);

export default router;