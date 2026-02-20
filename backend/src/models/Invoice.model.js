import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    // Link to Seller (User who uploaded it)
    seller: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Seller", 
      required: true 
    },
    
    // Link to Lender (Filled only when financed)
    lender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lender" 
    },

    // 📄 Invoice Data (Extracted from PDF)
    invoiceNumber: { type: String, required: true, unique: true },
    poNumber: { type: String },
    totalAmount: { type: Number, required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    
    // 🏢 Parties Involved
    sellerGst: { type: String },
    buyerGst: { type: String },
    buyerName: { type: String },
    buyerEmail: {type: String},

    // 📂 File & Metadata
    fileUrl: { type: String, required: true }, // Path to PDF
    description: { type: String },
    
    // 🚦 Status Workflow
    status: {
      type: String,
      enum: [
        "Verified",         // AI Scanned & Rules Passed (Ready for Bids)
        "Live",     // (Optional state if you want a separate 'Live' status)
        "Financed",         // Bid Accepted & Money Moved
        "Paid",             // Repaid by Buyer/Seller
        "Rejected"          // Failed Verification
      ],
      default: "Verified"
    },
    
    // 💰 Financing Details (Populated later)
    fundedAt: { type: Date },
    repaymentDate: { type: Date }
  },
  { timestamps: true }
);

// ⚠️ THIS IS CRITICAL: It must export the Model, NOT a Router
export default mongoose.model("Invoice", invoiceSchema);