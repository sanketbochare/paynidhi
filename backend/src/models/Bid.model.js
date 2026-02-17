import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    // 🔗 LINKS
    invoice: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Invoice", 
      required: true 
    },
    lender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lender", 
      required: true 
    },

    // 💰 THE OFFER (What the Lender Controls)
    loanAmount: { 
      type: Number, 
      required: true,
      min: 1000 
    }, // Amount they want to lend (e.g., ₹45,000 on a ₹50k invoice)

    interestRate: { 
      type: Number, 
      required: true 
    }, // Monthly Interest Rate (e.g., 1.5%)

    processingFee: { 
      type: Number, 
      default: 0 
    }, // Any upfront charges (e.g., ₹500)

    // 🧮 CALCULATED FIELDS (For Seller Clarity)
    repaymentAmount: { 
      type: Number, 
      required: true 
    }, // How much Seller must pay back (Principal + Interest)

    netDisbursement: { 
      type: Number, 
      required: true 
    }, // Cash hitting the Seller's bank (Loan Amount - Processing Fee)

    // ⏳ TERMS
    tenureDays: { 
      type: Number, 
      required: true 
    }, // Duration of the loan (usually remaining days of invoice)
    
    latePenaltyRate: { 
      type: Number, 
      default: 2 
    }, // Penalty % if repayment is delayed beyond due date

    // 🚦 STATUS
   status: {
      type: String,
      enum: [
        "Pending_Verification", 
        "Verified", 
        "Pending_Bids", 
        "Awaiting_Payment", // 👈 NEW: Deal agreed, waiting for cash
        "Financed",         // Cash received
        "Paid"              // Loan repaid
      ],
      default: "Pending_Verification"
    },
    
    expiryDate: { 
      type: Date,
      // Default to 7 Days from creation
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) 
    }
  },
  { timestamps: true }
);

// Prevent multiple bids from same lender on same invoice
bidSchema.index({ invoice: 1, lender: 1 }, { unique: true });

export default mongoose.model("Bid", bidSchema);