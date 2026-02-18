// backend/src/routes/auth.routes.js
import express from "express";
import {
  registerSeller,
  loginSeller,
  registerLender,
  loginLender,
  getMe,
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

export default router;
