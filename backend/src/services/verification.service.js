// ⚠️ Check this path carefully. 
// It assumes: src/services/verification.service.js -> src/models/Invoice.model.js
// ✅ CORRECT: This imports the database model!
import Invoice from "../models/Invoice.model.js";

export const verifyInvoiceRules = async (extractedData) => {
  console.log("🔍 Checking Invoice Rules...");

  // DEBUG: Check if Model is loaded
  if (!Invoice || typeof Invoice.findOne !== 'function') {
    console.error("❌ CRITICAL ERROR: Invoice Model is not loaded correctly!", Invoice);
    return { success: false, error: "Server Error: Database Model missing." };
  }

  const errors = [];

  // 1. Check for Duplicate Invoice Number
  try {
    const existingInvoice = await Invoice.findOne({ 
      invoiceNumber: extractedData.invoice_number 
    });
    
    if (existingInvoice) {
      console.log("❌ Duplicate found for:", extractedData.invoice_number);
      return { 
        success: false, 
        error: `Duplicate Invoice! Invoice #${extractedData.invoice_number} already exists.` 
      };
    }
  } catch (error) {
    console.error("Verification DB Error:", error);
    return { success: false, error: "Database error during verification." };
  }

  // 2. Validate Amount
  const amountStr = String(extractedData.total_amount).replace(/,/g, '');
  const amount = parseFloat(amountStr);
  
  if (isNaN(amount) || amount <= 0) errors.push("Invalid Total Amount");

  // 3. Validate Dates
  const invoiceDate = new Date(extractedData.invoice_date);
  const dueDate = new Date(extractedData.due_date);

  if (isNaN(invoiceDate.getTime())) errors.push("Invalid Invoice Date");
  if (isNaN(dueDate.getTime())) errors.push("Invalid Due Date");
  if (dueDate < invoiceDate) errors.push("Due Date cannot be before Invoice Date");

  if (errors.length > 0) {
    return { success: false, error: errors.join(", ") };
  }

  console.log("✅ Invoice Verification Passed");
  return { success: true };
};