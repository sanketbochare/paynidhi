import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { encryptField, decryptField } from "../utils/encryption.utils.js";

const lenderSchema = new mongoose.Schema(
  {
    // 1. Core Identity
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },

    // 2. Lender Profile
    companyName: { type: String, trim: true },
    lenderType: {
      type: String,
      enum: ["BANK", "NBFC", "INDIVIDUAL"],
      required: true
    },
    // We encrypt the license to keep it safe
    lenderLicense: { type: String, trim: true }, 

    // 3. Bank Details (Encrypted)
    bankAccount: {
      accountNumber: { type: String }, // Will be encrypted
      ifsc: { type: String, uppercase: true }, // Will be encrypted
      beneficiaryName: String,
      bankName: String,
    },

    // 4. Investment Settings
    maxInvestment: { type: Number, default: 0 },
    avgDiscountRate: { type: Number, default: 0 }, // e.g., 1.5%

    // 5. Address
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

// Pre-save: Encrypt & Hash (Fixed: Removed 'next')
lenderSchema.pre("save", async function () {
  const lender = this;

  // Hash Password
  if (lender.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    lender.password = await bcrypt.hash(lender.password, salt);
  }

  // Encrypt Sensitive Data
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