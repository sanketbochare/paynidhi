import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { extractInvoiceData } from "../services/gemini.service.js";
import { verifyInvoiceRules } from "../services/verification.service.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import Invoice from "../models/Invoice.model.js"; // 👈 Import the Model
import fs from "fs";

const router = Router();

router.post(
  "/scan", 
  protect,              
  authorize("seller"),  
  upload.single("invoice"), 
  async (req, res) => {
    
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      console.log(`👤 Processing Upload for: ${req.user.companyName}`);

      // 1. AI Extraction
      const extractedData = await extractInvoiceData(req.file.path);
      fs.unlinkSync(req.file.path); 

      // 2. Verification Logic (JSON Check)
      const verificationResult = await verifyInvoiceRules(extractedData);

      if (!verificationResult.success) {
        return res.status(400).json({
          success: false,
          data: extractedData,
          error: verificationResult.error
        });
      }

      // 3. 💾 SAVE TO MONGODB (The Missing Step!)
      const newInvoice = await Invoice.create({
        seller: req.user._id, // Link to logged-in user
        
        invoiceNumber: extractedData.invoice_number,
        poNumber: extractedData.po_number,
        totalAmount: extractedData.total_amount,
        invoiceDate: extractedData.invoice_date,
        dueDate: extractedData.due_date,
        
        sellerGst: extractedData.seller_gstin,
        buyerGst: extractedData.buyer_gstin,
        buyerName: extractedData.buyer_name,
        
        status: "Verified" // Since verification passed
      });

      console.log("✅ Saved to MongoDB:", newInvoice._id);

      res.status(201).json({
        success: true,
        message: "Invoice Verified & Saved Successfully!",
        data: newInvoice // Return the DB record
      });

    } catch (error) {
      console.error("Handler Error:", error);
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      
      // Handle Duplicate Error (MongoDB Code 11000)
      if (error.code === 11000) {
        return res.status(400).json({ error: "Duplicate Invoice! Already exists in database." });
      }
      
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;