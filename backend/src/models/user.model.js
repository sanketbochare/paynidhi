import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // 🆔 Identity (Linked to Clerk)
  clerkId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  email: { type: String, required: true },
  
  // 🔐 Access Control
  role: { 
    type: String, 
    enum: ["seller", "lender", "admin"], 
    default: "seller" 
  },
  isOnboarded: { type: Boolean, default: false }, // False until they fill Step 2

  // 👤 Basic Profile
  displayName: String,
  phoneNumber: String,

  // 🏭 Seller Details (Borrower)
  companyName: String,
  gstNumber: String, // Crucial for Verification
  panNumber: String,
  address: String,
  
  // 💰 Lender Details (Investor)
  lenderType: {
    type: String,
    enum: ["BANK", "NBFC", "INDIVIDUAL", null],
    default: null
  },

  // 🏦 Financial Details (Where money goes)
  bankAccount: {
    accountNumber: String,
    ifsc: String,
    beneficiaryName: String
  },
  
  // 💳 Platform Wallet
  walletBalance: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model("User", userSchema);