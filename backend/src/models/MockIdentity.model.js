import mongoose from "mongoose";

// Sub-schema for Bank Accounts
const bankAccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true, uppercase: true },
  bankName: { type: String, required: true }
}, { _id: false }); // _id: false keeps the database clean since we don't need IDs for individual accounts here

const mockIdentitySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  aadhaarNo: { 
    type: String, 
    required: true, 
    unique: true 
  },
  panNo: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true 
  },
  accounts: [bankAccountSchema] // Array of bank accounts
}, { timestamps: true });

export default mongoose.model("MockIdentity", mockIdentitySchema);