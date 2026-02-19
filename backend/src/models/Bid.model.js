import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    // 🔗 RELATIONS
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

    // 💰 THE OFFER (Input by Lender)
    loanAmount: { 
      type: Number, 
      required: true 
    }, // e.g., ₹50,000

    interestRate: { 
      type: Number, 
      required: true 
    }, // Monthly Interest % (e.g., 1.5%)

    // 🧮 CALCULATED TERMS (Auto-calculated by Backend)
    processingFee: { 
      type: Number, 
      default: 0 
    }, // Platform Revenue (e.g., ₹500)

    netDisbursement: { 
      type: Number, 
      required: true 
    }, // What Seller actually gets (Loan - Fee) => ₹49,500

    repaymentAmount: { 
      type: Number, 
      required: true 
    }, // What Seller must pay back (Principal + Interest) => ₹51,200

    tenureDays: { 
      type: Number, 
      required: true 
    }, // Duration (e.g., 30 Days)

    latePenaltyRate: { 
      type: Number, 
      default: 2 
    }, // Penalty % per day if late

    // 🚦 STATUS
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Expired"],
      default: "Pending"
    },

    expiryDate: { 
      type: Date,
      // Default: 7 Days from creation
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) 
    }
  },
  { timestamps: true }
);

// Prevent same lender bidding twice on same invoice
bidSchema.index({ invoice: 1, lender: 1 }, { unique: true });

export default mongoose.model("Bid", bidSchema);