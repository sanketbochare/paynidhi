import jwt from "jsonwebtoken";
import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 🔍 DEBUG LOGS (Remove these later)
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
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};
// ... keep authorize function as is ...
// 👮 AUTHORIZE: Checks if user has the correct Role
export const authorize = (...roles) => {
  return (req, res, next) => {
    // We assume req.user is already populated by 'protect'
    // We can infer role: if businessType exists, it's a Seller. If lenderType exists, it's a Lender.
    const userRole = req.user.businessType ? "seller" : "lender";

    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        error: `Access Denied: User role '${userRole}' is not authorized to access this route` 
      });
    }
    next();
  };
};