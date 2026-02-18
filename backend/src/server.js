import webhookRoutes from "./routes/webhook.routes.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./lib/db.js";

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js"; // Renamed from invoice.handler.js? Check your file name.
import lenderRoutes from "./routes/lender.routes.js";
import sellerRoutes from "./routes/seller.routes.js";

// Define __dirname manually (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 📂 SERVE STATIC FILES (PDFs)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🔌 Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/lender", lenderRoutes);
app.use("/api/seller", sellerRoutes);

app.use("/api/webhooks", webhookRoutes);

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