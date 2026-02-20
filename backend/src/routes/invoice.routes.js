import { Router } from "express";
import multer from "multer";
import { 
  uploadInvoice, 
  getAllInvoices, 
  getInvoiceById,
  sendInvoiceVefificationMail,
  buyerInvoiceVerification
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
  "/", 
  protect, 
  getAllInvoices
);

// Endpoint: GET /api/invoice/:id
router.get(
  "/:id", 
  protect, 
  getInvoiceById
);

// Endpoint: POST /api/invoice/send-verification-mail/:id
router.post(
  "/send-verification-mail",
  protect,
  sendInvoiceVefificationMail
);

router.get(
  "/verify-invoice",
  buyerInvoiceVerification
);
export default router;