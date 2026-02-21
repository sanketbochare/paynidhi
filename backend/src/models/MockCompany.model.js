import mongoose from "mongoose";

const mockCompanySchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    required: true 
  },
  gstin: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  companyType: { 
    type: String, 
    required: true 
  }, // e.g., "Private Limited", "LLP", "Proprietorship"
  industryType: { 
    type: String, 
    required: true 
  }, // e.g., "Textiles", "IT", "Manufacturing"
  turnover: { 
    type: Number, 
    required: true 
  } // In INR
}, { timestamps: true });

export default mongoose.model("MockCompany", mockCompanySchema);