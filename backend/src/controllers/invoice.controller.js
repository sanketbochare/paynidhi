import Invoice from "../models/Invoice.model.js";
import { extractInvoiceData } from "../services/gemini.service.js"; // Ensure this file exists
import { verifyInvoiceRules } from "../services/verification.service.js"; // Ensure this file exists
import fs from "fs";
import { sendInvoiceVerificationMail } from './../utils/email.utils.js'
import jwt from 'jsonwebtoken'

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
    // Note: Ensure extractInvoiceData returns the object structure you expect
    const extractedData = await extractInvoiceData(req.file.path);

    // B. Verification Logic
    const verificationResult = await verifyInvoiceRules(extractedData);

    if (!verificationResult.success) {
      // Cleanup file if validation fails
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      
      return res.status(400).json({
        success: false,
        data: extractedData,
        error: verificationResult.error
      });
    }

    // C. Save to MongoDB
    const newInvoice = await Invoice.create({
      seller: req.user._id,
      
      invoiceNumber: extractedData.invoice_number,
      poNumber: extractedData.po_number,
      totalAmount: extractedData.total_amount,
      
      // Handle Date Parsing safely
      invoiceDate: new Date(extractedData.invoice_date),
      dueDate: new Date(extractedData.due_date),
      
      sellerGst: extractedData.seller_gstin,
      buyerGst: extractedData.buyer_gstin,
      buyerName: extractedData.buyer_name,
      buyerEmail: extractedData.buyer_email,
      
      status: "Verified", // Ready for bidding
      fileUrl: req.file.path,
      description: `Invoice for ${extractedData.items_summary || "services"}`
    });

    console.log("✅ Saved to MongoDB:", newInvoice._id);


    res.status(201).json({
      success: true,
      message: "Invoice Verified & Saved Successfully!",
      data: newInvoice
    });

  } catch (error) {
    console.error("Handler Error:", error);
    // Cleanup file on error
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    // Handle Duplicate Invoice Number
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate Invoice! This invoice number already exists." });
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


const generateToken = (invoice_id) => {
  return jwt.sign({ invoice_id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 4. Send mail to buyer for invoice verification 
export const sendInvoiceVefificationMail = async (req, res) => {
  console.log("verification funciton started...");
  try {
    console.log("invoiceId: ", req.query.id);
    const invoice = await Invoice.findById(req.query.id);
    console.log("invoice: ", invoice);
    if(!invoice) 
      return res.status(404).json({success: false, error: "Inovice not found"});

    console.log("sending email to buyer: ", invoice.buyerEmail);
    const token = generateToken(req.query.id);

    sendInvoiceVerificationMail({to: invoice.buyerEmail, secret_token: token});

    return res.status(200).json({success: true, message: "Sent mail to buyer"});

  } catch (error) {
    console.log("error in sending verification mail to buyer: ", error);
    res.status(404).json({success: false, error: "mail error"});
  }
}

export const buyerInvoiceVerification = async (req, res) => {
  console.log("received buyer verififcation response...");
  const token = req.query.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const invoiceId = decoded.invoice_id;
  const isVerified = req.query.isVerified;


  console.log(invoiceId, isVerified);
}
