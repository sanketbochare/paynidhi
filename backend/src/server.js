// apps/backend/src/server.js
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import { connectDB } from "./lib/db.js";

// Routes
import authRoutes from "./routes/auth.handler.js";
// import invoiceRoutes from "./routes/invoice.handler.js"; 
// import auctionRoutes from "./routes/auction.handler.js";
// import buyerRoutes from "./routes/buyer.handler.js";
// import paymentRoutes from "./routes/payment.handler.js";

const app = express();
const PORT = process.env.PORT || 5001;

// ─────────────────────────────
// ESM PATH FIX
// ─────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────
// RAZORPAY INIT
// ─────────────────────────────
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────
// MIDDLEWARE
// ─────────────────────────────
const corsOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL]
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(express.json()); // Parses JSON bodies
app.use(cookieParser());

// ─────────────────────────────
// API ROUTES
// ─────────────────────────────
app.use("/api/auth", authRoutes); // ✅ New Mongo+Clerk Auth
// app.use("/api/invoices", invoiceRoutes);
// app.use("/api/auction", auctionRoutes);
// app.use("/api/buyer", buyerRoutes);
// app.use("/api/payments", paymentRoutes);

// ─────────────────────────────
// HEALTH CHECK
// ─────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "PayNidhi Engine Running 🚀",
    database: "MongoDB",
    auth: "Clerk + Mongo",
    razorpay: process.env.RAZORPAY_KEY_ID ? "✅ Ready" : "❌ Missing",
    env: process.env.NODE_ENV,
  });
});

// ─────────────────────────────
// PRODUCTION SERVE
// ─────────────────────────────
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─────────────────────────────
// START SERVER
// ─────────────────────────────
app.listen(PORT, async () => {
  await connectDB(); // Ensure MongoDB connects before accepting traffic

  console.log(`🚀 PayNidhi Backend running at http://localhost:${PORT}`);
  console.log(`🗄️  MongoDB: Connected`);
  console.log(`🛡️  Auth: Clerk Mode`);
});