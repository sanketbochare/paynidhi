import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { encryptField, decryptField, hashField } from "../utils/encryption.utils.js";

const sellerSchema = new mongoose.Schema(
  {
    // 1. CORE IDENTITY
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // 2. BUSINESS PROFILE (Registration fields)
    companyName: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: ["Trading", "Manufacturing", "Services"],
      default: "Services",
    },
    industry: {
      type: String,
      enum: ["Textiles", "IT", "Pharma", "Auto", "FMCG", "Retail"],
      default: "IT",
    },
    annualTurnover: { type: Number, default: 0 },
    beneficiaryName: { type: String, trim: true }, // Registration field

    // 3. KYC DATA (Completed during KYC - optional at registration)
    panNumber: { type: String }, // removed required
    gstNumber: { type: String, required: true }, // only GST required at registration
    panHash: { type: String, unique: true, sparse: true, index: true }, // sparse for optional
    gstHash: { type: String, required: true, unique: true, index: true },

    // 4. BANK DETAILS (Completed during KYC - partial at registration)
    bankAccount: {
      accountNumber: { type: String }, // removed required
      ifsc: { type: String, uppercase: true }, // removed required
      beneficiaryName: { type: String, required: true }, // required at registration
      bankName: { type: String },
      verified: { type: Boolean, default: false },
    },

    // 5. SYSTEM & FINANCIALS
    isOnboarded: { type: Boolean, default: false }, // false until KYC complete
    kycStatus: { 
      type: String, 
      enum: ["pending", "partial", "verified", "rejected"], 
      default: "partial" // partial after registration
    },
    trustScore: { type: Number, default: 0 },
    
    walletBalance: { type: Number, default: 0 },
    
    virtualAccount: {
      va_id: String,
      accountNumber: String,
      ifsc: String,
      bankName: String
    },

    // 6. PROFILE
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// HASH + ENCRYPT (only if fields exist)
sellerSchema.pre("save", async function () {
  const seller = this;

  // password
  if (seller.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    seller.password = await bcrypt.hash(seller.password, salt);
  }

  // GST (required)
  if (seller.isModified("gstNumber") && seller.gstNumber) {
    seller.gstNumber = encryptField(seller.gstNumber);
    seller.gstHash = hashField(seller.gstNumber);
  }

  // PAN (optional - KYC)
  if (seller.isModified("panNumber") && seller.panNumber) {
    seller.panNumber = encryptField(seller.panNumber);
    seller.panHash = hashField(seller.panNumber);
  }

  // Bank fields (only if they exist)
  if (seller.isModified("bankAccount.accountNumber") && seller.bankAccount?.accountNumber) {
    seller.bankAccount.accountNumber = encryptField(seller.bankAccount.accountNumber);
  }
  if (seller.isModified("bankAccount.ifsc") && seller.bankAccount?.ifsc) {
    seller.bankAccount.ifsc = encryptField(seller.bankAccount.ifsc);
  }
});

// DECRYPT AFTER LOAD (only if encrypted)
sellerSchema.post("init", function (doc) {
  if (doc.gstNumber && doc.gstNumber.includes(":")) {
    doc.gstNumber = decryptField(doc.gstNumber);
  }
  
  if (doc.panNumber && doc.panNumber.includes(":")) {
    doc.panNumber = decryptField(doc.panNumber);
  }

  if (doc.bankAccount?.accountNumber?.includes(":")) {
    doc.bankAccount.accountNumber = decryptField(doc.bankAccount.accountNumber);
  }
  if (doc.bankAccount?.ifsc?.includes(":")) {
    doc.bankAccount.ifsc = decryptField(doc.bankAccount.ifsc);
  }
});

sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Seller", sellerSchema);
