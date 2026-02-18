import express from "express";
import { registerSeller, loginSeller } from "../controllers/auth.controller.js";
import { getMyInvoices, respondToBid } from "../controllers/seller.controller.js"; // 👈 Import new controller
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Dashboard
router.get("/invoices", protect, authorize("seller"), getMyInvoices);

// The Settlement Trigger
router.post("/bid-response/:bidId", protect, authorize("seller"), respondToBid);

export default router;