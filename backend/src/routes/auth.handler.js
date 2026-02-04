// apps/backend/src/routes/auth.handler.js
import { Router } from "express";
import { verifyAuth, requireRole } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";
import * as ClerkBackend from "@clerk/backend"; // ✅ Use namespace import only

const { createClerkClient } = ClerkBackend;
const router = Router();
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// ==========================================
// 🚀 1. REGISTRATION & SYNC
// ==========================================
router.post("/sync-user", verifyAuth, async (req, res) => {
  try {
    const { clerkId } = req.auth;
    const { role, companyName, gstNumber, phoneNumber } = req.body;

    // 1. Check if user exists in MongoDB
    let user = await User.findOne({ clerkId });

    if (user) {
      return res.status(200).json({ message: "User synced", user });
    }

    // 2. Fetch Details from Clerk (Source of Truth)
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    // 3. Create New MongoDB Record
    user = await User.create({
      clerkId,
      email,
      role: role || "seller", 
      displayName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      phoneNumber: phoneNumber || "",
      companyName: companyName || "",
      gstNumber: gstNumber || "",
      authProvider: "clerk_oauth",
      isVerified: false 
    });

    // 4. Update Clerk Metadata
    try {
        await clerkClient.users.updateUserMetadata(clerkId, {
            publicMetadata: { role: user.role, mongoId: user._id.toString() }
        });
    } catch (metaError) {
        console.warn("Clerk Metadata Sync Warning:", metaError.message);
    }

    return res.status(201).json({ message: "Registration Successful", user });

  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ error: "Registration Failed" });
  }
});

router.get("/me", verifyAuth, async (req, res) => {
  if (!req.user) return res.status(404).json({ error: "User not registered." });
  res.json(req.user);
});

router.get("/lender-dashboard", verifyAuth, requireRole("lender"), (req, res) => {
  res.json({ message: "Lender Portal Active", balance: req.user.walletBalance });
});

router.get("/seller-dashboard", verifyAuth, requireRole("seller"), (req, res) => {
  res.json({ message: "Seller Portal Active", gst: req.user.gstNumber });
});

export default router;