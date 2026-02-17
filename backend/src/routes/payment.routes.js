import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// 1. Create Order (Start Payment)
router.post(
  "/create-order/:invoiceId",
  protect,
  authorize("lender"),
  createOrder
);

// 2. Verify Payment (Finish Payment)
router.post(
  "/verify",
  protect,
  authorize("lender"),
  verifyPayment
);

export default router;