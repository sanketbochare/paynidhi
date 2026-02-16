import "dotenv/config"; // 👈 CRITICAL: Must be the very first line
import express from "express";
import cors from "cors";
import connectDB from "./lib/db.js";

// Import Routes
import invoiceRoutes from "./routes/invoice.handler.js"; 
import authRoutes from "./routes/auth.handler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔌 Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);

const PORT = process.env.PORT || 5001;

// Connect to DB and Start Server
const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB(); 
    
    // 2. Start listening only after DB matches
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();