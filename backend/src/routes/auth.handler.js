import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware.js"; // Note the .js extension
import User from "../models/User.model.js";
// apps/backend/src/middleware/auth.middleware.js
import * as ClerkBackend from "@clerk/backend";

// Extract the factory function from the namespace
const { createClerkClient } = ClerkBackend;
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const router = Router();

// ==========================================
// 🟢 STEP 1: INITIAL SYNC (Called after Signup)
// ==========================================
router.post("/sync-user", verifyAuth, async (req, res) => {
  try {
    const { clerkId, email } = req.auth;
    
    // Check if user exists
    let user = await User.findOne({ clerkId });

    // If not, create a basic record (Status: Not Onboarded)
    if (!user) {
      user = new User({
        clerkId,
        email,
        role: "seller", // Default role
        isOnboarded: false
      });
      await user.save();
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ error: "Sync failed" });
  }
});

// ==========================================
// 📝 STEP 2: ONBOARDING (Collects Fintech Data)
// ==========================================
router.post("/onboarding", verifyAuth, async (req, res) => {
  try {
    const { clerkId } = req.auth;
    const { 
      role,           // 'seller' or 'lender'
      companyName, 
      gstNumber, 
      panNumber, 
      address, 
      bankAccount,    // Object { accountNumber, ifsc }
      lenderType      // If role is lender
    } = req.body;

    // 1. Update the User in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        role,
        companyName,
        gstNumber,
        panNumber,
        address,
        bankAccount,
        lenderType,
        isOnboarded: true // 🏁 MARK AS COMPLETE
      },
      { new: true } // Return the updated document
    );

    // 2. Update Clerk Metadata (So frontend knows status instantly)
    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: { isOnboarded: true, role: role }
    });

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Onboarding Error:", error);
    res.status(500).json({ error: "Onboarding failed" });
  }
});

// ==========================================
// 👤 GET CURRENT USER PROFILE
// ==========================================
router.get("/me", verifyAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.clerkId });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Fetch Error" });
  }
});

export default router;