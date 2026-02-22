import mongoose from "mongoose";

const mockGovtInvoiceSchema = new mongoose.Schema({
  irn: { 
    type: String, 
    required: true, 
    unique: true,
    length: 64 // Real IRNs are exactly 64 characters long
  },
  sellerGstin: { type: String, required: true },
  buyerGstin: { type: String, required: true },
  documentNumber: { type: String, required: true }, // The original Invoice Number
  totalAmount: { type: Number, required: true },    // The undisputed total
  documentDate: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("MockGovtInvoice", mockGovtInvoiceSchema);