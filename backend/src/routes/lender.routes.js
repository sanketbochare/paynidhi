import express from "express";
import { getMarketplace, placeBid } from "../controllers/lender.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

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

export default router;