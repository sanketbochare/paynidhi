import mongoose from "mongoose";
import dotenv from "dotenv";
import MockGovtInvoice from "../models/MockGovtInvoice.model.js";

dotenv.config();

// I have generated predictable 64-character hex strings for easy testing
const specificInvoices = [
  {
    irn: "1111111111111111111111111111111111111111111111111111111111111111",
    sellerGstin: "27ABCDE1234F1Z5",
    buyerGstin: "27AAACT0000A1Z5",
    documentNumber: "INV-2026-001",
    totalAmount: 50000,
    documentDate: "16 Feb 2026"
  },
  {
    irn: "2222222222222222222222222222222222222222222222222222222222222222",
    sellerGstin: "27MUSHM1381A1ZI",
    buyerGstin: "27TJZVT0843A1ZM",
    documentNumber: "INV-2026-001",
    totalAmount: 50000,
    documentDate: "21 Feb 2026"
  },
  {
    irn: "3333333333333333333333333333333333333333333333333333333333333333",
    sellerGstin: "27GOFYS7502R1ZP",
    buyerGstin: "27UWTIQ4328L1ZJ",
    documentNumber: "INV-2026-002",
    totalAmount: 80000,
    documentDate: "21 Feb 2026"
  },
  {
    irn: "4444444444444444444444444444444444444444444444444444444444444444",
    sellerGstin: "27QFLBR8219B1ZO",
    buyerGstin: "27JRGSX6195G1ZI",
    documentNumber: "INV-2026-003",
    totalAmount: 50000,
    documentDate: "21 Feb 2026"
  },
  {
    irn: "5555555555555555555555555555555555555555555555555555555555555555",
    sellerGstin: "27KMFZU1860N1ZU",
    buyerGstin: "27DKYTE7738P1ZC",
    documentNumber: "INV-2026-004",
    totalAmount: 80000,
    documentDate: "21 Feb 2026"
  },
  {
    irn: "6666666666666666666666666666666666666666666666666666666666666666",
    sellerGstin: "27LUMXV7154H1ZS",
    buyerGstin: "270NCYF8307C1ZX",
    documentNumber: "INV-2026-005",
    totalAmount: 50000,
    documentDate: "21 Feb 2026"
  },
  {
    irn: "7777777777777777777777777777777777777777777777777777777777777777",
    sellerGstin: "27QWRQN1462K1ZR",
    buyerGstin: "27EFFQ13455Y1ZJ",
    documentNumber: "INV-2026-006",
    totalAmount: 80000,
    documentDate: "21 Feb 2026"
  },
  {
    irn: "8888888888888888888888888888888888888888888888888888888888888888",
    sellerGstin: "27HOWSL0513W1ZB",
    buyerGstin: "27XOZBR2133K1ZJ",
    documentNumber: "INV-2026-007",
    totalAmount: 50000,
    documentDate: "21 Feb 2026"
  },
  {
    irn: "9999999999999999999999999999999999999999999999999999999999999999",
    sellerGstin: "27NGGWX8863T1ZZ",
    buyerGstin: "27BWIUZ7733B1ZY",
    documentNumber: "INV-2026-008",
    totalAmount: 80000,
    documentDate: "21 Feb 2026"
  }
];

const seedInvoices = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected!");

    console.log("🧹 Clearing old govt invoice records...");
    await MockGovtInvoice.deleteMany({});

    console.log("🌱 Injecting 9 Mock Invoices...");
    await MockGovtInvoice.insertMany(specificInvoices);

    console.log("🎉 Success! Official IRN database is ready.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedInvoices();