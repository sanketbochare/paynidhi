import express from "express";
import { getMarketplace, placeBid } from "../controllers/lender.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { kycVerification, lenderKycVerification } from "../controllers/kyc.controller.js"; // Adjust import path
const router = express.Router();

// 1. Dashboard (Feed)
router.get(
  "/marketplace",
  protect,
  authorize("lender"), 
  getMarketplace
);

// 2. Place a Bid
router.post(
  "/bid/:invoiceId",
  protect,
  authorize("lender"),
  placeBid
);

router.post("/kyc-verification", protect, lenderKycVerification);

export default router;