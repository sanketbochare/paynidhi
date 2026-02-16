import express from "express";
import { registerSeller, loginSeller ,registerLender,loginLender } from "../controllers/auth.controller.js";

const router = express.Router();

// Seller Routes
router.post("/register-seller", registerSeller);
router.post("/login-seller", loginSeller);

router.post("/register-lender", registerLender); // 👈 New
router.post("/login-lender", loginLender);

export default router;