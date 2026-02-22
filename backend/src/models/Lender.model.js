import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { encryptField, decryptField, hashField } from "../utils/encryption.utils.js";

// Reusing your robust bank schema
const bankAccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, sparse: true, unique: true },
  accountNumberHash: { type: String, required: false, sparse: true, unique: true },
  ifscCode: { type: String, required: true, sparse: true, uppercase: true },
  beneficiaryName: { type: String, sparse: true, required: true },
  bankName: { type: String, sparse: true, required: true },
});

const lenderSchema = new mongoose.Schema(
  {
    // 1. CORE IDENTITY
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },

    // 2. LENDER PROFILE
    companyName: { type: String, trim: true, required: true },
    lenderType: {
      type: String,
      enum: ["Bank", "NBFC", "Individual", "Institutional"], 
      required: true
    },
    // RBI License (Plain string for searching, encrypted for storage if needed)
    lenderLicense: { type: String, trim: true }, 

    // 3. SENSITIVE KYC DATA (Aligned with Seller!)
    panNumber: { type: String, unique: true, sparse: true, required: false },
    gstNumber: { type: String, unique: true, sparse: true, required: false, index: true },
    panHash: { type: String, required: false, unique: true, sparse: true, index: true },
    gstHash: { type: String, required: false, unique: true, sparse: true, index: true },
    aadhaarNumber: { type: Number, unique: true, sparse: true, required: false, index: true},

    // 4. BANK DETAILS
    bankAccount: { type: [bankAccountSchema] },

    // 5. TREASURY MANAGEMENT (Wallets)
    totalCreditLimit: { type: Number, default: 0 }, // Total allowed to invest
    utilizedLimit: { type: Number, default: 0 },    // Locked in active invoices
    walletBalance: { type: Number, default: 0 },    // Liquid cash ready to deploy

    // 6. SYSTEM STATUS
    isOnboarded: { type: Boolean, default: false },
    kycStatus: { 
      type: String, 
      enum: ["pending", "partial", "verified", "rejected"], 
      default: "partial" 
    },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// ==========================================
// 🔒 SECURITY MIDDLEWARE (Exact match to Seller)
// ==========================================
lenderSchema.pre("save", async function () {
  const lender = this;

  // 1. Password
  if (lender.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    lender.password = await bcrypt.hash(lender.password, salt);
  }

  // 2. GST (If provided at registration)
  if (lender.isModified("gstNumber") && lender.gstNumber) {
    lender.gstHash = hashField(lender.gstNumber);
    lender.gstNumber = encryptField(lender.gstNumber);
  }

  // 3. PAN 
  if (lender.isModified("panNumber") && lender.panNumber) {
    lender.panNumber = encryptField(lender.panNumber);
    lender.panHash = hashField(lender.panNumber);
  }

  // 4. Bank Fields
  if (lender.isModified("bankAccount")) {
    lender.bankAccount = lender.bankAccount.map(acc => {
      return {
        ...acc,
        accountNumberHash: acc.accountNumber.includes(":") ? acc.accountNumberHash : hashField(acc.accountNumber),
        accountNumber: acc.accountNumber.includes(":") ? acc.accountNumber : encryptField(acc.accountNumber),
        ifscCode: acc.ifscCode?.includes(":") ? acc.ifscCode : encryptField(acc.ifscCode)
      };
    });
  }
});

lenderSchema.post("init", function (doc) {
  if (doc.gstNumber && doc.gstNumber.includes(":")) doc.gstNumber = decryptField(doc.gstNumber);
  if (doc.panNumber && doc.panNumber.includes(":")) doc.panNumber = decryptField(doc.panNumber);
  if (doc.bankAccount) {
    doc.bankAccount.forEach(acc => {
      if (acc.accountNumber?.includes(":")) acc.accountNumber = decryptField(acc.accountNumber);
      if (acc.ifscCode?.includes(":")) acc.ifscCode = decryptField(acc.ifscCode);
    });
  }
});

lenderSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Lender", lenderSchema);