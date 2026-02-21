import express from "express";
// Auth Controllers (if you handle seller auth here, otherwise they belong in auth.routes.js)
import { registerSeller, loginSeller } from "../controllers/auth.controller.js"; 
import { kycVerification } from "../controllers/kyc.controller.js";

// Seller Controllers - ALL functions now properly imported
import { 
  getMyInvoices, 
  respondToBid, 
  getInvoiceWithBids,
  completeKyc,
  dashboardSummary  // ✅ ADDED THIS
} from "../controllers/seller.controller.js";

// Middleware
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// SELLER ROUTES
// All routes protected & seller-only
// ==========================================

// 1. ✅ DASHBOARD SUMMARY (NEW - fixes your crash)
router.get("/dashboard-summary", protect, authorize("seller"), dashboardSummary);

// 2. Get all seller invoices
router.get("/invoices", protect, authorize("seller"), getMyInvoices);

// 3. Single invoice + bids
router.get("/invoice/:invoiceId/bids", protect, authorize("seller"), getInvoiceWithBids);

// 4. Accept/Reject bid
router.post("/bid-response/:bidId", protect, authorize("seller"), respondToBid);

// route : post : /api/seller/kyc-verification
router.post("/kyc-verification", protect, authorize("seller"), kycVerification);

export default router;
