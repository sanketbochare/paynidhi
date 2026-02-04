// apps/backend/src/middleware/auth.middleware.js
import * as ClerkBackend from "@clerk/backend";

// Extract the factory function from the namespace
const { createClerkClient } = ClerkBackend;
// Initialize Clerk
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * 🛡️ VERIFY AUTH
 * Decodes the Clerk JWT Token and attaches basic info to req.auth
 */
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify Token (UPDATED: Using standalone function)
    // We access it directly from the imported namespace 'ClerkBackend'
    const verifiedToken = await ClerkBackend.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const { sub } = verifiedToken;
    
    // 2. Fetch Email from Clerk
    const clerkUser = await clerkClient.users.getUser(sub);

    // 3. Attach basic info to Request
    req.auth = {
      clerkId: sub,
      email: clerkUser.emailAddresses[0]?.emailAddress,
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
};

/**
 * 👮 REQUIRE ROLE
 * Checks MongoDB to ensure the user has the correct permissions
 */
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Dynamic Import to ensure model is loaded
      const User = (await import("../models/User.model.js")).default;

      // Find the user in OUR database
      const user = await User.findOne({ clerkId: req.auth.clerkId });

      if (!user) {
        return res.status(404).json({ error: "User not found. Please complete onboarding." });
      }

      // Check permissions
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          error: `Access denied. Requires one of: ${allowedRoles.join(", ")}` 
        });
      }

      // Attach full DB user object for the controller to use
      req.user = user;
      next();
    } catch (error) {
      console.error("Role Check Error:", error);
      res.status(500).json({ error: "Server error during role verification" });
    }
  };
};