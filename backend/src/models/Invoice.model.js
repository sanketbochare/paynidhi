import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    // 1. Link to the Seller (Who uploaded it)
    seller: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Seller", 
      required: true 
    },

    // 2. Invoice Details (Extracted by AI)
    invoiceNumber: { type: String, required: true },
    poNumber: { type: String }, // Optional
    totalAmount: { type: Number, required: true },
    invoiceDate: { type: Date },
    dueDate: { type: Date },

    // 3. Parties Involved
    sellerGst: { type: String, required: true },
    buyerGst: { type: String, required: true },
    buyerName: { type: String },

    // 4. Status Tracking
    status: {
      type: String,
      enum: ["Pending_Verification", "Verified", "Rejected", "Financed", "Paid"],
      default: "Pending_Verification"
    },
    
    rejectionReason: { type: String }, // If AI or Admin rejects it

    // 5. File Info
    fileUrl: { type: String }, // We'll add this later if using S3/Cloudinary
  },
  { timestamps: true }
);

// Compound Index: Ensure (Seller + InvoiceNumber) is unique in DB
invoiceSchema.index({ seller: 1, invoiceNumber: 1 }, { unique: true });

export default mongoose.model("Invoice", invoiceSchema);