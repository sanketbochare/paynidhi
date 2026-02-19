import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // 🔗 ENTITIES INVOLVED
    invoice: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Invoice',
      // Made optional because a generic wallet top-up might not link to an invoice immediately
      required: false 
    },
    bid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid'
    },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: 'Lender' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },

    // 💰 MONEY DETAILS
    amount: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: "INR" 
    },
    fee: {
      type: Number,
      default: 0
    },

    // 🏦 MATURE TRANSACTION TYPES
    type: { 
      type: String, 
      enum: [
        'FUNDING_INFLOW',  // Lender (RTGS/NEFT) -> Virtual Account (Real Money In)
        'MANDATE_PULL',    // (Legacy/Internal) Lender Bank -> Escrow 
        'PLATFORM_FEE',    // Processing Fee -> PayNidhi Revenue
        'DISBURSEMENT',    // Virtual Account -> Seller Wallet (Loan Given)
        'WITHDRAWAL',      // Seller Wallet -> Seller Bank Account
        'REPAYMENT_IN',    // Seller/Buyer -> Escrow (Loan Back)
        'SETTLEMENT_OUT'   // Escrow -> Lender Bank (Principal + Interest)
      ], 
      required: true 
    },

    // 🚦 STATE
    status: { 
      type: String, 
      enum: ['PENDING', 'SUCCESS', 'FAILED'], 
      default: 'PENDING' 
    },
    
    // 🧾 BANK RECONCILIATION & GATEWAY DATA
    referenceId: { type: String, required: true, unique: true }, // Internal ID (e.g., "TXN-123456")
    
    // Real Banking Data (Critical for Audit)
    razorpay_payment_id: { type: String }, // The ID from Razorpay (pay_...)
    razorpay_va_id: { type: String },      // The Virtual Account ID (va_...)
    utr_number: { type: String },          // The UTR from the bank (IMPS/NEFT ref)

    description: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);