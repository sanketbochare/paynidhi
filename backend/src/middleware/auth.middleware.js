// apps/backend/src/middleware/auth.middleware.js
import * as ClerkBackend from "@clerk/backend";

// Extract the factory function from the namespace
const { createClerkClient } = ClerkBackend;

import { User } from "../models/user.model.js";

const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify Token with Clerk
    const { sub, sid } = await clerkClient.verifyToken(token);

    // Find User in MongoDB
    const user = await User.findOne({ clerkId: sub });

    req.auth = { clerkId: sub, sessionId: sid }; 
    req.user = user; 

    next();
  } catch (error) {
    console.error("Auth Error:", error.message || error);
    return res.status(403).json({ error: "Forbidden: Invalid Token" });
  }
};

export const requireRole = (allowedRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(404).json({ error: "User not found in database." });
    }
    if (req.user.role !== allowedRole) {
      return res.status(403).json({ error: `Access Denied: Requires ${allowedRole}` });
    }
    next();
  };
};