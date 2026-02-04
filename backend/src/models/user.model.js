// apps/backend/src/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  displayName: { type: String },
  role: { 
    type: String, 
    enum: ["lender", "seller", "admin"], 
    required: true 
  },
  phoneNumber: { type: String },
  
  // Business Details (KYC)
  companyName: { type: String },
  gstNumber: { type: String },
  
  // Financials
  walletBalance: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false }, // For Manual/Admin Approval
  
  authProvider: { type: String } // e.g., "oauth_google", "email_password"
}, { 
  timestamps: true 
});

export const User = mongoose.model("User", userSchema);