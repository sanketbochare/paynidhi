// backend/src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("------------------------------------------------");
    console.log("1. Decoded Token:", decoded);

    if (decoded.role === "seller") {
      console.log("2. Searching in SELLER collection...");
      req.user = await Seller.findById(decoded.id).select("-password");
    } else if (decoded.role === "lender") {
      console.log("2. Searching in LENDER collection...");
      req.user = await Lender.findById(decoded.id).select("-password");
    } else {
      console.log("❌ Error: Token has no valid role:", decoded.role);
    }

    if (!req.user) {
      console.log("❌ User NOT found in DB. ID was:", decoded.id);
      return res.status(401).json({ error: "Not authorized, user not found" });
    }

    console.log("✅ User Found:", req.user.email);
    console.log("------------------------------------------------");

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};

// 👮 AUTHORIZE: Checks if user has the correct Role
export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.businessType ? "seller" : "lender";

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: `Access Denied: User role '${userRole}' is not authorized to access this route`,
      });
    }
    next();
  };
};
