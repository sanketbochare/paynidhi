import express from "express";
// Auth Controllers (if you handle seller auth here, otherwise they belong in auth.routes.js)
import { registerSeller, loginSeller } from "../controllers/auth.controller.js"; 
import { kycVerification } from "../controllers/kyc.controller.js";

// Seller Controllers
import { 
  getMyInvoices, 
  respondToBid, 
  getInvoiceWithBids 
} from "../controllers/seller.controller.js";

// Middleware
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// SELLER ROUTES
// All routes should be protected and restricted to 'seller' role
// ==========================================

// 1. Dashboard: Get all invoices for the logged-in seller
router.get("/invoices", protect, authorize("seller"), getMyInvoices);

// 2. View Single Invoice & Its Bids (The new route!)
router.get("/invoice/:invoiceId/bids", protect, authorize("seller"), getInvoiceWithBids);

// 3. The Settlement Trigger: Accept/Reject a bid
router.post("/bid-response/:bidId", protect, authorize("seller"), respondToBid);

// route : post : /api/seller/kyc-verification
router.post("/kyc-verification", protect, authorize("seller"), kycVerification);

export default router;