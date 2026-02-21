import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { encryptField, decryptField, hashField } from "../utils/encryption.utils.js";

const bankAccountSchema = new mongoose.Schema({
      accountNumber: { type: String, required: true, sparse:true, unique: true},
      accountNumberHash: {type: String, required: false, sparse: true, unique: true},
      ifscCode: { type: String, required: true, sparse:true, uppercase: true},
      beneficiaryName: { type: String, sparse:true, required: true },
      bankName: { type: String, sparse:true, required: true },
      // verified: { type: Boolean, default: false }
})

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

    // 3. SENSITIVE KYC DATA (Encrypted + Blind Index)
    panNumber: { type: String, unique: true, sparse: true, required: false },
    gstNumber: { type: String, unique: true, sparse: true, required: true, index: true },
    panHash: { type: String, required: false, unique: true, sparse: true, index: true },
    gstHash: { type: String, required: true, unique: true, sparse: true, index: true },
    aadhaarNumber: { type: Number, unique: true, sparse: true, required: false, index: true},

    // 4. BANK DETAILS (Completed during KYC - partial at registration)
    bankAccount: {
      type: [bankAccountSchema]
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
    
    // virtualAccount: {
    //   va_id: String,
    //   accountNumber: String,
    //   ifscCode: String,
    //   bankName: String
    // },

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
    seller.gstHash = hashField(seller.gstNumber);
    seller.gstNumber = encryptField(seller.gstNumber);
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
  if (seller.isModified("bankAccount.ifscCode")) {
    seller.bankAccount.ifscCode = encryptField(seller.bankAccount.ifscCode);
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
  if (doc.bankAccount?.ifscCode?.includes(":")) {
    doc.bankAccount.ifscCode = decryptField(doc.bankAccount.ifscCode);
  }
});

sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
sellerSchema.pre("save", async function () {
    const seller = this;

    // ... password hashing logic ...

    // PAN / GST Encryption
    if (seller.isModified("panNumber") && seller.panNumber) {
        seller.panNumber = encryptField(seller.panNumber);
    }
    
    // BANK DETAILS Encryption (Mapping through the array)
    if (seller.isModified("bankAccount")) {
        seller.bankAccount = seller.bankAccount.map(acc => {
            // Only encrypt if it's not already encrypted (contains ":")
            return {
                ...acc,
                accountNumberHash: acc.accountNumber.includes(":") ? accountNumberHash : hashField(acc.accountNumber),
                accountNumber: acc.accountNumber.includes(":") ? acc.accountNumber : encryptField(acc.accountNumber),
                ifscCode: acc.ifscCode ? acc.ifscCode : encryptField(acc.ifscCode)
            };
        });
    }


});
export default mongoose.model("Seller", sellerSchema);
