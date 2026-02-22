import mongoose from "mongoose";
import dotenv from "dotenv";
import MockRBIDatabase from "../models/MockRBIDatabase.model.js";

dotenv.config();

const mockLenders = [
  {
    lenderName: "Apex Finance NBFC",
    licenseNumber: "RBI-NBFC-11111",
    gstin: "27APEXN1111A1Z1",
    lenderType: "NBFC",
    status: "Active",
    registeredEmail: "compliance@apexfinance.in",
    netOwnedFund: 50000000 // ₹5 Crores
  },
  {
    lenderName: "Global Trust Bank",
    licenseNumber: "RBI-BANK-22222",
    gstin: "27GLOBT2222B1Z2",
    lenderType: "Bank",
    status: "Active",
    registeredEmail: "admin@globaltrustbank.in",
    netOwnedFund: 1000000000 // ₹100 Crores
  },
  {
    lenderName: "Shady Credits Ltd",
    licenseNumber: "RBI-NBFC-99999",
    gstin: "27SHADY9999C1Z9",
    lenderType: "NBFC",
    status: "Cancelled", // ❌ This one should FAIL registration!
    registeredEmail: "scam@shadycredits.in",
    netOwnedFund: 1000000 // ₹10 Lakhs
  }
];

const seedRBI = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected!");

    console.log("🧹 Clearing old RBI records...");
    await MockRBIDatabase.deleteMany({});

    console.log("🌱 Injecting Mock RBI Database...");
    await MockRBIDatabase.insertMany(mockLenders);

    console.log("🎉 Success! RBI verification database is ready.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedRBI();