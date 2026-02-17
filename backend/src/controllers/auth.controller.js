import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";
import jwt from "jsonwebtoken";


// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new Seller
// @route   POST /api/auth/register-seller
export const registerSeller = async (req, res) => {
  try {
    const { 
      email, password, companyName, 
      gstNumber, panNumber, 
      bankAccount, businessType, industry 
    } = req.body;

    // 1. Check if Seller already exists
    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({ error: "Seller with this email already exists" });
    }

    // 2. Check if GST/PAN is already used (Prevent duplicate businesses)
    // Note: We search by encrypted value is tricky, but for now we rely on email uniqueness primarily.
    // If you need strict GST uniqueness check, we'd need a blind index, but let's keep it simple first.

    // 3. Create Seller
    const seller = await Seller.create({
      email,
      password,
      companyName,
      gstNumber,
      panNumber,
      bankAccount,
      businessType,
      industry
    });

    if (seller) {
      res.status(201).json({
        _id: seller._id,
        email: seller.email,
        companyName: seller.companyName,
        token: generateToken(seller._id, "seller"),
        message: "Seller registered successfully"
      });
    } else {
      res.status(400).json({ error: "Invalid seller data" });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login Seller
// @route   POST /api/auth/login-seller
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find Seller by Email
    const seller = await Seller.findOne({ email });

    // 2. Check Password
    if (seller && (await seller.matchPassword(password))) {
      res.json({
        _id: seller._id,
        email: seller.email,
        companyName: seller.companyName,
        token: generateToken(seller._id, "seller"),
        message: "Login successful"
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};
export const registerLender = async (req, res) => {
  try {
    const { 
      email, password, companyName, 
      lenderType, lenderLicense, 
      bankAccount, maxInvestment, address 
    } = req.body;

    // 1. Check if Lender exists
    const lenderExists = await Lender.findOne({ email });
    if (lenderExists) {
      return res.status(400).json({ error: "Lender already exists" });
    }

    // 2. Create Lender
    const lender = await Lender.create({
      email,
      password,
      companyName,
      lenderType,
      lenderLicense,
      bankAccount,
      maxInvestment,
      address,
      isOnboarded: true
    });

    if (lender) {
      res.status(201).json({
        _id: lender._id,
        email: lender.email,
        lenderType: lender.lenderType,
        token: generateToken(lender._id, "lender"), // Role is 'lender'
        message: "Lender registered successfully"
      });
    }
  } catch (error) {
    console.error("Lender Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login Lender
// @route   POST /api/auth/login-lender
export const loginLender = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find Lender
    const lender = await Lender.findOne({ email });

    // 2. Check Password
    if (lender && (await lender.comparePassword(password))) {
      res.json({
        _id: lender._id,
        email: lender.email,
        lenderType: lender.lenderType,
        token: generateToken(lender._id, "lender"),
        message: "Login successful"
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};