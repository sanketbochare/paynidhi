import { Router } from "express";
import multer from "multer";
import { 
  uploadInvoice, 
  getAllInvoices, 
  getInvoiceById,
  getSellerInvoices,
  verifyInvoiceBuyerWithEmail,
  verifyInvoice
} from "../controllers/invoice.controller.js"; // 👈 Imports logic from Controller
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Configure Multer (Temporary storage for uploads)
const upload = multer({ dest: "uploads/" });

// ==========================================
// 1. UPLOAD ROUTE (Seller Only)
// ==========================================
// Endpoint: POST /api/invoice/upload
router.post(
  "/upload", 
  protect,              // 1. Check Token
  authorize("seller"),  // 2. Check Role
  upload.single("file"),// 3. Handle File Upload
  uploadInvoice         // 4. Run Controller Logic
);

// ==========================================
// 2. READ ROUTES (For Dashboard)
// ==========================================

// Endpoint: GET /api/invoice
router.get(
  "/all-invoices", 
  protect, 
  getAllInvoices
);

// route: api/invoice/verify-invoice
router.get(
  "/get-invoice/:id", 
  protect, 
  getInvoiceById
);

// GET /api/invoice/my
router.get(
  "/my",
  protect,
  authorize("seller"),
  getSellerInvoices
);

router.post(
  "/verify-buyer",
  protect,
  authorize("seller"),
  verifyInvoiceBuyerWithEmail
)

export default router;
