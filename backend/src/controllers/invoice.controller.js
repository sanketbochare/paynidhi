import Invoice from "../models/Invoice.model.js";
import { extractInvoiceData } from "../services/gemini.service.js"; // Ensure this file exists
import { verifyInvoiceRules } from "../services/verification.service.js"; // Ensure this file exists
import fs from "fs";
import MockGovtInvoice from "../models/MockGovtInvoice.model.js"

// ==========================================
// 1. UPLOAD & SCAN INVOICE
// ==========================================
// @desc    Upload PDF -> Scan with Gemini -> Verify -> Save to DB
// @route   POST /api/invoice/upload
export const uploadInvoice = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    console.log(`👤 Processing Upload for: ${req.user.companyName}`);

    // A. AI Extraction (Gemini)
    const extractedData = await extractInvoiceData(req.file.path);

    // ==========================================
    // 🛡️ STAGE 1: THE INTERNAL PLATFORM SHIELD (Govt IRN Verification)
    // ==========================================
    
    // Shield 1: Did Gemini find an IRN?
    if (!extractedData.irn) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Fraud Alert: No valid 64-character Govt IRN found on this document." });
    }

    // Shield 2: Is it a real IRN registered with the government?
    const officialRecord = await MockGovtInvoice.findOne({ irn: extractedData.irn });
    if (!officialRecord) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Fraud Alert: This IRN is not registered with the official GST portal." });
    }

    // Shield 3: Did they tamper with the PDF? (Check the money)
    if (Number(officialRecord.totalAmount) !== Number(extractedData.total_amount)) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: `Fraud Alert: Document tampering detected. PDF shows ₹${extractedData.total_amount}, but official GST record is ₹${officialRecord.totalAmount}.` });
    }

    // Shield 4: Double Financing Check (Has this exact IRN been uploaded before?)
    const alreadyFinanced = await Invoice.findOne({ irn: extractedData.irn });
    if (alreadyFinanced) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Double Financing Alert: This exact IRN has already been uploaded to PayNidhi." });
    }
    // ==========================================

    // C. Save to MongoDB
    const newInvoice = await Invoice.create({
      seller: req.user._id,
      
      irn: extractedData.irn, 
      invoiceNumber: extractedData.invoice_number,
      poNumber: extractedData.po_number,
      totalAmount: extractedData.total_amount,
      
      invoiceDate: new Date(extractedData.invoice_date),
      dueDate: new Date(extractedData.due_date),
      
      sellerGst: extractedData.seller_gstin,
      buyerGst: extractedData.buyer_gstin,
      buyerName: extractedData.buyer_name,
      buyerEmail: extractedData.buyer_email,
      
      status: "Pending_Buyer_Approval", // 👈 This proves the new code is running
      fileUrl: req.file.path,
      description: `Invoice for ${extractedData.items_summary || "services"}`
    });

    console.log("✅ Verified against Govt records & Saved to MongoDB:", newInvoice._id);

    res.status(201).json({
      success: true,
      message: "Invoice mathematically verified & Saved Successfully!",
      data: newInvoice
    });

  } catch (error) {
    console.error("Handler Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    // MongoDB Duplicate Key Error
    if (error.code === 11000) {
      return res.status(400).json({ error: "Database Error: Duplicate Unique Key constraint violated (Check MongoDB Indexes)." });
    }
    
    res.status(500).json({ error: "Failed to process invoice" });
  }
};

// ==========================================
// 2. GET ALL INVOICES (For Lender Dashboard)
// ==========================================
export const getAllInvoices = async (req, res) => {
  try {
    // Return all invoices that are Verified or Financed
    const invoices = await Invoice.find()
      .populate("seller", "companyName trustScore")
      .sort({ createdAt: -1 });
    
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// 3. GET SINGLE INVOICE
// ==========================================
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("seller");
    if(!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getSellerInvoices = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const invoices = await Invoice.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .limit(5); // recent 5

    res.json(invoices);
  } catch (error) {
    console.error("Get seller invoices error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
