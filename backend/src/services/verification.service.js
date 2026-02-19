import fs from "fs";
import path from "path";
import Invoice from "../models/Invoice.model.js"; // 👈 Import MongoDB Model

// 📂 Mock Government Database
const gstRegistryPath = path.resolve("src/data/mock_gst_registry.json");

const readJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.log("error in reading json file : ", error);
    return [];
  }
};

export const verifyInvoiceRules = async (invoiceData) => {
  console.log("🕵️ Starting 4-Step Verification...");
  console.log("Invoice Data: ", invoiceData);
  // ====================================================
  // 🏛️ STEP 2: IDENTITY CHECK (GSTIN Validation)
  // ====================================================
  
  try {
    const registry = readJSON(gstRegistryPath);
    // Check Seller
    if(registry) {
      console.log(registry)
    }

  const seller = registry.find(entry => entry.gstin === invoiceData.seller_gstin);
  if (!seller) {
    return { success: false, error: "❌ Identity Fraud: Seller GSTIN not found in Government Registry." };
  }
  
  // Check Buyer
  const buyer = registry.find(entry => entry.gstin === invoiceData.buyer_gstin);
  if (!buyer) {
    return { success: false, error: "❌ Trusted Buyer Check: Buyer GSTIN not found. We only fund verified buyers." };
  }

  console.log("✅ Step 2 Passed: Identities Verified.");

  // ====================================================
  // 🚫 STEP 4: DOUBLE SPENDING CHECK (MongoDB)
  // ====================================================
  // We check the Database: "Has this Seller uploaded this Invoice Number before?"
  
  const existingInvoice = await Invoice.findOne({
    invoiceNumber: invoiceData.invoice_number,
    sellerGst: invoiceData.seller_gstin
  });

  if (existingInvoice) {
    return { 
      success: false, 
      error: `❌ Double Spending Alert: Invoice #${invoiceData.invoice_number} has already been financed/uploaded.` 
    };
  }

  console.log("✅ Step 4 Passed: Unique Invoice Verified.");

  // ====================================================
  // 📧 STEP 3: PO VERIFICATION (Email)
  // ====================================================
  // (Currently skipped as per your request, but the logic sits here)
  /*
  const emailSent = await sendVerificationEmail(buyer.email, invoiceData);
  if (!emailSent) return { success: false, error: "Email Verification Failed" };
  */

  return { 
    success: true, 
    message: "Invoice Validated Successfully" 
  };
  } catch (error) {
    console.log(error);
  }
};