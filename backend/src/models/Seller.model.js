import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { encryptField, decryptField } from "../utils/encryption.utils.js";

const sellerSchema = new mongoose.Schema(
  {
    // =================================================
    // 1. CORE IDENTITY (Login)
    // =================================================
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 
    }, 

    // =================================================
    // 2. BUSINESS PROFILE (Public to Lenders)
    // =================================================
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
    annualTurnover: { type: Number, default: 0 }, // 👈 Added back (Critical for risk assessment)

    // =================================================
    // 3. SENSITIVE KYC DATA (Encrypted + Blind Index)
    // =================================================
    
    // A. The Encrypted Data (Randomized IV - Secure but not unique)
    panNumber: { type: String, required: true }, 
    gstNumber: { type: String, required: true },

    // B. The Blind Indexes (Hashed - Deterministic - Enforces Uniqueness)
    // 👈 THESE ARE CRITICAL FOR FRAUD PREVENTION
    panHash: { type: String, required: true, unique: true, index: true }, 
    gstHash: { type: String, required: true, unique: true, index: true },

    // =================================================
    // 4. BANK DETAILS (Encrypted)
    // =================================================
    bankAccount: {
      accountNumber: { type: String, required: true }, // Will be encrypted
      ifsc: { type: String, required: true, uppercase: true }, // Will be encrypted
      beneficiaryName: { type: String, required: true },
      bankName: { type: String },
      verified: { type: Boolean, default: false },
    },

    // =================================================
    // 5. SYSTEM & FINANCIALS
    // =================================================
    isOnboarded: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    
    // 👈 Added back (Required for the Disbursement Logic)
    walletBalance: { type: Number, default: 0 } 
  },
  { timestamps: true }
);

// ==========================================
// 🔒 MIDDLEWARE: ENCRYPTION & HASHING
// ==========================================

sellerSchema.pre("save", async function (next) {
  const seller = this;

  // 1. Hash Password
  if (seller.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    seller.password = await bcrypt.hash(seller.password, salt);
  }

  // 2. Encrypt KYC Fields (Only if modified)
  if (seller.isModified("panNumber")) seller.panNumber = encryptField(seller.panNumber);
  if (seller.isModified("gstNumber")) seller.gstNumber = encryptField(seller.gstNumber);
  
  // 3. Encrypt Bank Details
  if (seller.isModified("bankAccount.accountNumber")) {
    seller.bankAccount.accountNumber = encryptField(seller.bankAccount.accountNumber);
  }
  if (seller.isModified("bankAccount.ifsc")) {
    seller.bankAccount.ifsc = encryptField(seller.bankAccount.ifsc);
  }

  next();
});

// ==========================================
// 🔓 MIDDLEWARE: DECRYPTION
// ==========================================

sellerSchema.post("init", function (doc) {
  // Check if field exists and has the ':' separator (indicating it is encrypted)
  if (doc.panNumber && doc.panNumber.includes(":")) doc.panNumber = decryptField(doc.panNumber);
  if (doc.gstNumber && doc.gstNumber.includes(":")) doc.gstNumber = decryptField(doc.gstNumber);
  
  if (doc.bankAccount?.accountNumber?.includes(":")) {
    doc.bankAccount.accountNumber = decryptField(doc.bankAccount.accountNumber);
  }
  if (doc.bankAccount?.ifsc?.includes(":")) {
    doc.bankAccount.ifsc = decryptField(doc.bankAccount.ifsc);
  }
});

// Password Match Method
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Seller", sellerSchema);
