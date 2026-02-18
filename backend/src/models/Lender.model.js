import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { encryptField, decryptField } from "../utils/encryption.utils.js";

const lenderSchema = new mongoose.Schema(
  {
    // ==========================================
    // 1. Core Identity
    // ==========================================
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },

    // ==========================================
    // 2. Lender Profile
    // ==========================================
    companyName: { type: String, trim: true },
    
    lenderType: {
      type: String,
      // ✅ FIX: Added "Bank", "NBFC", "Institutional" to match your request
      enum: ["Bank", "NBFC", "Individual", "Institutional", "BANK", "INDIVIDUAL"], 
      required: true
    },
    
    // Encrypted License
    lenderLicense: { type: String, trim: true }, 

    // ==========================================
    // 3. Bank Details (Encrypted)
    // ==========================================
    bankAccount: {
      accountNumber: { type: String }, // Encrypted
      ifsc: { type: String, uppercase: true }, // Encrypted
      beneficiaryName: String,
      bankName: String,
      mandateId: String // 👈 Added for Auto-Debit Logic
    },

    // ==========================================
    // 4. Treasury Management (CRITICAL FOR SETTLEMENT)
    // ==========================================
    // 🏦 The "Credit Line" Model
    totalCreditLimit: { 
      type: Number, 
      default: 0 
    }, // Max amount they agreed to lend

    utilizedLimit: { 
      type: Number, 
      default: 0 
    }, // Amount currently locked in Active Loans

    escrowBalance: { 
      type: Number, 
      default: 0 
    }, // Money pulled from bank, waiting to go to Seller

    isMandateActive: { type: Boolean, default: false },

    // ==========================================
    // 5. Investment Settings
    // ==========================================
    maxInvestment: { type: Number, default: 0 }, // Used to set initial Credit Limit
    avgDiscountRate: { type: Number, default: 0 }, 

    // ==========================================
    // 6. Address
    // ==========================================
    address: {
      city: String,
      state: String,
      pincode: { type: String, match: /^\d{6}$/ },
    },
    
    isOnboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ==========================================
// 🔒 SECURITY MIDDLEWARE
// ==========================================

// Pre-save: Encrypt & Hash
lenderSchema.pre("save", async function () {
  const lender = this;

  // 1. Hash Password
  if (lender.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    lender.password = await bcrypt.hash(lender.password, salt);
  }

  // 2. Sync 'maxInvestment' to 'totalCreditLimit' on first creation
  if (lender.isNew && lender.maxInvestment > 0) {
    lender.totalCreditLimit = lender.maxInvestment;
    lender.isMandateActive = true;
  }

  // 3. Encrypt Sensitive Data
  if (lender.isModified("lenderLicense")) {
    lender.lenderLicense = encryptField(lender.lenderLicense);
  }
  if (lender.isModified("bankAccount.accountNumber")) {
    lender.bankAccount.accountNumber = encryptField(lender.bankAccount.accountNumber);
  }
  if (lender.isModified("bankAccount.ifsc")) {
    lender.bankAccount.ifsc = encryptField(lender.bankAccount.ifsc);
  }
});

// Post-init: Decrypt Data
lenderSchema.post("init", function (doc) {
  if (doc.lenderLicense && doc.lenderLicense.includes(":")) {
    doc.lenderLicense = decryptField(doc.lenderLicense);
  }
  if (doc.bankAccount?.accountNumber?.includes(":")) {
    doc.bankAccount.accountNumber = decryptField(doc.bankAccount.accountNumber);
  }
  if (doc.bankAccount?.ifsc?.includes(":")) {
    doc.bankAccount.ifsc = decryptField(doc.bankAccount.ifsc);
  }
});

// Compare Password
lenderSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Lender", lenderSchema);