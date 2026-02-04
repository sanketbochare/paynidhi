// apps/backend/src/routes/auth.handler.js
import { Router } from "express";
import admin from "firebase-admin";
import { verifyAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const db = admin.firestore();

// ==========================================
// 🚀 1. REGISTRATION & SYNC (Crucial Step)
// ==========================================
// Call this immediately after Login on Frontend (Google/Facebook success)
// It ensures the user exists in your "Smart Ledger" database.
router.post("/sync-user", verifyAuth, async (req, res) => {
  try {
    const { uid, email, provider, role } = req.user;
    const { displayName, phoneNumber, gstNumber, companyName } = req.body;

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    // 1. If User Exists, return their profile
    if (userSnap.exists) {
      return res.status(200).json({ 
        message: "User synced", 
        user: userSnap.data() 
      });
    }

    // 2. If New User, Create Record (The "Onboarding" Step)
    const newUser = {
      uid,
      email,
      displayName: displayName || "",
      role: role || (provider === "clerk" ? "lender" : "seller"), // Smart Default
      phoneNumber: phoneNumber || "",
      companyName: companyName || "",
      gstNumber: gstNumber || "",
      isVerified: false, // Requires Admin/KYC approval
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      walletBalance: 0,
      authProvider: provider // 'clerk' or 'firebase'
    };

    // 3. Security: Set Custom Claims for Firebase users to lock role
    if (provider === "firebase") {
      await admin.auth().setCustomUserClaims(uid, { role: newUser.role });
    }

    await userRef.set(newUser);

    return res.status(201).json({ 
      message: "Registration Successful", 
      user: newUser 
    });

  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ error: "Registration Failed" });
  }
});

// ==========================================
// 👤 2. GET CURRENT USER PROFILE
// ==========================================
router.get("/me", verifyAuth, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found. Please register." });
    }

    // Return combined data (Auth info + DB info)
    res.json({
      ...userDoc.data(),
      session: {
        provider: req.user.provider,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Profile fetch failed" });
  }
});

// ==========================================
// 🏢 3. LENDER SPECIFIC ROUTES
// ==========================================
router.get("/lender-dashboard", verifyAuth, requireRole("lender"), async (req, res) => {
  // Only Lenders (Clerk Users) can see this
  res.json({ message: "Welcome to the Capital Dashboard, Institutional Lender." });
});

// ==========================================
// 🏭 4. SELLER SPECIFIC ROUTES
// ==========================================
router.get("/seller-dashboard", verifyAuth, requireRole("seller"), async (req, res) => {
  // Only Sellers (Firebase Users) can see this
  res.json({ message: "Welcome to PayNidhi, MSME Partner." });
});

export default router;