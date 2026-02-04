// apps/backend/src/middleware/auth.js
import admin from "firebase-admin";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * 🛡️ DUAL-AUTH MIDDLEWARE
 * Verifies requests from BOTH Firebase (Sellers) and Clerk (Lenders)
 */
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    // STRATEGY 1: Attempt Firebase Verification (Preferred for Sellers)
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        provider: "firebase",
        role: decodedToken.role || "seller", // Default to seller if not set
      };
      return next();
    } catch (firebaseError) {
      // If Firebase fails, silently fall through to try Clerk
    }

    // STRATEGY 2: Attempt Clerk Verification (Preferred for Lenders)
    try {
      // Verify token using Clerk's backend SDK
      const { sub, sid } = await clerkClient.verifyToken(token);
      
      // Fetch full user details from Clerk to get metadata/roles
      const clerkUser = await clerkClient.users.getUser(sub);
      
      req.user = {
        uid: sub,
        email: clerkUser.emailAddresses[0].emailAddress,
        provider: "clerk",
        role: clerkUser.publicMetadata.role || "lender", // Default to lender
      };
      return next();
    } catch (clerkError) {
      console.error("Auth Verification Failed:", clerkError.message);
      return res.status(403).json({ error: "Forbidden: Invalid or Expired Token" });
    }

  } catch (error) {
    return res.status(500).json({ error: "Internal Auth Error" });
  }
};

/**
 * 👮 ROLE GUARD
 * Usage: router.get('/secret', requireRole('lender'), controller)
 */
export const requireRole = (allowedRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== allowedRole) {
      return res.status(403).json({ 
        error: `Access Denied: Requires ${allowedRole} privileges` 
      });
    }
    next();
  };
};