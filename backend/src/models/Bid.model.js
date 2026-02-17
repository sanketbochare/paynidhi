import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
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
    
    // The Offer
    interestRate: { type: Number, required: true }, // e.g., 1.2% per month
    proposedAmount: { type: Number, required: true }, // e.g., ₹48,000 for a ₹50k invoice
    
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bid", bidSchema);