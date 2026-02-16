import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js"; // Middleware to handle file upload
import { extractInvoiceData } from "../services/gemini.service.js"; // AI Service
import fs from "fs";

const router = Router();

// POST /api/invoice/scan
// 🔓 Public Route (No verifyAuth middleware)
router.post("/scan", upload.single("invoice"), async (req, res) => {
  // 1. Check if file exists
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded" });
  }

  try {
    console.log(`📄 Processing file: ${req.file.path}`);

    // 2. Send to Gemini AI
    const extractedData = await extractInvoiceData(req.file.path);

    // 3. Delete the temp file (Cleanup)
    fs.unlinkSync(req.file.path);

    console.log("✅ Data Extracted Successfully");

    // 4. Send JSON back to Frontend/Postman
    res.json({
      success: true,
      message: "Invoice Scanned Successfully",
      data: extractedData
    });

  } catch (error) {
    console.error("Scan Error:", error);
    // Cleanup even on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: "Failed to process invoice", details: error.message });
  }
});

export default router;