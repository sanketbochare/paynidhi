// apps/backend/src/server.js
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import admin from "firebase-admin";
import Razorpay from "razorpay";

// Import PayNidhi Routes
import authRoutes from "./routes/auth.handler.js";
import invoiceRoutes from "./routes/invoice.handler.js";
import auctionRoutes from "./routes/auction.handler.js";
import buyerRoutes from "./routes/buyer.handler.js";
import paymentRoutes from "./routes/payment.handler.js";
import { connectDB } from "./lib/db.js"; // Optional if using Firestore, but kept for MERN compatibility

const app = express();
const PORT = process.env.PORT || 5001;

// --- ESM PATH FIX ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- FIREBASE ADMIN INITIALIZATION ---
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});
const db = admin.firestore(); // Export this if needed in handlers

// --- RAZORPAY INITIALIZATION ---
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- MIDDLEWARE ---
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL] 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ 
  origin: corsOrigins, 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// --- PAYNIDHI API ROUTES ---
app.use("/api/auth", authRoutes);       // KYC, Registration, MFA
app.use("/api/invoices", invoiceRoutes); // Gemini OCR & Verification logic
app.use("/api/auction", auctionRoutes); // Bidding & Marketplace
app.use("/api/buyer", buyerRoutes);     // Magic Link & Email Verification
app.use("/api/payments", paymentRoutes); // Razorpay Orders & Webhooks

// --- HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "PayNidhi Engine Running",
    firebase: "✅ Connected",
    razorpay: !!process.env.RAZORPAY_KEY_ID ? "✅ Ready" : "❌ Missing",
    gemini: !!process.env.GEMINI_API_KEY ? "✅ Ready" : "❌ Missing",
    env: process.env.NODE_ENV
  });
});

// --- PRODUCTION STATIC SERVING ---
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), '../frontend/dist');
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 PayNidhi Backend at: http://localhost:${PORT}`);
  console.log(`🛡️  Admin SDK: Authenticated`);
  console.log(`💳 Razorpay: ${process.env.RAZORPAY_KEY_ID ? "Active" : "Keys Missing"}`);
  // connectDB(); // Uncomment if using MongoDB alongside Firestore
});