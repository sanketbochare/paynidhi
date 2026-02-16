import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { encryptField, decryptField } from "../utils/encryption.utils.js"; // Ensure you created this file!

const sellerSchema = new mongoose.Schema(
  {
    // 1. Core Identity
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 }, // Hashed
    
    // 2. Business Profile
    companyName: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: ["Trading", "Manufacturing", "Services"],
      default: "Services"
    },
    industry: {
      type: String,
      enum: ["Textiles", "IT", "Pharma", "Auto", "FMCG", "Retail"],
      default: "IT"
    },
    annualTurnover: { type: Number, default: 0 },

    // 3. Sensitive KYC Data (Encrypted)
    panNumber: { type: String, required: true, unique: true, trim: true }, 
    gstNumber: { type: String, required: true, unique: true, trim: true },

    // 4. Bank Details (Account & IFSC Encrypted)
    bankAccount: {
      accountNumber: { type: String, required: true }, 
      ifsc: { type: String, required: true, uppercase: true },
      beneficiaryName: { type: String, required: true },
      bankName: { type: String },
      verified: { type: Boolean, default: false },
    },

    // 5. System Fields
    isOnboarded: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ==========================================
// 🔒 SECURITY MIDDLEWARE
// ==========================================

// Pre-save: Encrypt Sensitive Data & Hash Password
// ✅ NEW (Fixed)
sellerSchema.pre("save", async function () { // 1. Remove 'next' from here
  const seller = this;

  // Hash Password
  if (seller.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    seller.password = await bcrypt.hash(seller.password, salt);
  }

  // Encrypt Sensitive Fields
  if (seller.isModified("panNumber")) seller.panNumber = encryptField(seller.panNumber);
  if (seller.isModified("gstNumber")) seller.gstNumber = encryptField(seller.gstNumber);
  if (seller.isModified("bankAccount.accountNumber")) seller.bankAccount.accountNumber = encryptField(seller.bankAccount.accountNumber);
  if (seller.isModified("bankAccount.ifsc")) seller.bankAccount.ifsc = encryptField(seller.bankAccount.ifsc);
  
  // 2. Do NOT call next(). The function just ends.
});

// Post-init: Decrypt Data (So you see plain text in your code)
sellerSchema.post("init", function (doc) {
  if (doc.panNumber && doc.panNumber.includes(":")) doc.panNumber = decryptField(doc.panNumber);
  if (doc.gstNumber && doc.gstNumber.includes(":")) doc.gstNumber = decryptField(doc.gstNumber);
  if (doc.bankAccount?.accountNumber?.includes(":")) doc.bankAccount.accountNumber = decryptField(doc.bankAccount.accountNumber);
  if (doc.bankAccount?.ifsc?.includes(":")) doc.bankAccount.ifsc = decryptField(doc.bankAccount.ifsc);
});

// Compare Password Method
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Seller", sellerSchema);