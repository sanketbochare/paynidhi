import mongoose from "mongoose";

const mockRBISchema = new mongoose.Schema(
  {
    lenderName: { type: String, required: true, trim: true },
    
    // The primary key for RBI lookups
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    
    // To cross-reference with our MockCompany database
    gstin: { type: String, required: true, unique: true, uppercase: true, trim: true },
    
    lenderType: {
      type: String,
      enum: ["Bank", "NBFC", "Institutional"],
      required: true,
    },
    
    // CRITICAL: If they are cancelled, PayNidhi must block them
    status: {
      type: String,
      enum: ["Active", "Suspended", "Cancelled"],
      default: "Active",
    },
    
    registeredEmail: { type: String, required: true, lowercase: true, trim: true },
    
    // Minimum capital required by RBI (Useful if you want to cap their Credit Limit later)
    netOwnedFund: { type: Number, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("MockRBIDatabase", mockRBISchema);