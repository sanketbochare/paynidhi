import express from "express";
import { getMyInvoices, respondToBid } from "../controllers/seller.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// 1. Dashboard (View My Invoices + Bids)
router.get(
  "/invoices",
  protect,
  authorize("seller"), 
  getMyInvoices
);

// 2. Accept/Reject a Bid
router.post(
  "/bid-response/:bidId",
  protect,
  authorize("seller"),
  respondToBid
);

export default router;