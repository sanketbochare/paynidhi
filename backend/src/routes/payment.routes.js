import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only Lenders should be making payments
router.post("/create-order", protect, authorize("lender"), createOrder);
router.post("/verify", protect, authorize("lender"), verifyPayment);

export default router;