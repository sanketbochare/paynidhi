import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // 👈 Import required for ES Modules
import sellerRoutes from "./routes/seller.routes.js";

import connectDB from "./lib/db.js";

// Import Routes
import invoiceRoutes from "./routes/invoice.handler.js"; 
import authRoutes from "./routes/auth.routes.js";
import lenderRoutes from "./routes/lender.routes.js";

// 👇 FIX: Define __dirname manually (It does not exist in ES Modules by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 📂 SERVE STATIC FILES
// This allows the frontend to access uploaded PDFs at http://localhost:5001/uploads/filename.pdf
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🔌 Mount Routes
app.use("/api/auth", authRoutes);

app.use("/api/invoice", invoiceRoutes);

app.use("/api/lender", lenderRoutes);

app.use("/api/seller", sellerRoutes);

const PORT = process.env.PORT || 5001;

// Connect to DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();