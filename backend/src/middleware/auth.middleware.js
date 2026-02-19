import jwt from "jsonwebtoken";
import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";

// 🛡️ PROTECT: Verifies Token & Finds User
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find User (Check Seller first, then Lender)
      // Note: We included 'role' in the token payload during login, so we use it here.
      if (decoded.role === "seller") {
        console.log("seller role found!")
        req.user = await Seller.findById(decoded.id).select("-password");
        console.log(req.user);
      } else if (decoded.role === "lender") {
        req.user = await Lender.findById(decoded.id).select("-password");
      }

      if (!req.user) {
        return res.status(401).json({ error: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

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