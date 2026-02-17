import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";
import jwt from "jsonwebtoken";
import { hashField } from '../utils/encryption.utils.js'; // 👈 Import this

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register Seller
export const registerSeller = async (req, res) => {
  try {
    const { 
      email, password, companyName, 
      gstNumber, panNumber, 
      bankAccount, businessType, industry,
      annualTurnover // 👈 Added this
    } = req.body;

    // 1. Calculate Hashes (Blind Index)
    const gstHash = hashField(gstNumber);
    const panHash = hashField(panNumber);

    // 2. Check Duplicates (Email)
    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) return res.status(400).json({ error: "Email already registered" });

    // 3. Check Duplicates (GST & PAN using Hash)
    const isGstNumDuplicate = await Seller.findOne({ gstHash });
    const isPanNumDuplicate = await Seller.findOne({ panHash });

    if (isGstNumDuplicate) return res.status(400).json({ error: "GST Number already registered" });
    if (isPanNumDuplicate) return res.status(400).json({ error: "PAN Number already registered" });

    // 4. Create Seller
    const seller = await Seller.create({
      email,
      password,
      companyName,
      
      // Raw values (Will be encrypted by Model Middleware)
      gstNumber, 
      panNumber,

      // Hashed values (Saved for future uniqueness checks)
      gstHash, 
      panHash, 

      bankAccount,
      businessType,
      industry,
      annualTurnover: annualTurnover || 0,
      
      isOnboarded: true // Mark as ready
    });

    if (seller) {
      res.status(201).json({
        _id: seller._id,
        email: seller.email,
        companyName: seller.companyName,
        token: generateToken(seller._id, "seller"),
        message: "Seller registered successfully"
      });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login Seller
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    // Decryption happens automatically in Model post-init hook
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
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Register Lender
export const registerLender = async (req, res) => {
  try {
    const { 
      email, password, companyName, 
      lenderType, lenderLicense, 
      bankAccount, maxInvestment, address 
    } = req.body;

    const lenderExists = await Lender.findOne({ email });
    if (lenderExists) return res.status(400).json({ error: "Lender already exists" });

    const lender = await Lender.create({
      email, password, companyName, lenderType, 
      lenderLicense, bankAccount, 
      maxInvestment, address, 
      isOnboarded: true,
      
      // Initialize Financials
      totalCreditLimit: maxInvestment || 0, // Set limit based on investment promise
      utilizedLimit: 0,
      escrowBalance: 0
    });

    if (lender) {
      res.status(201).json({
        _id: lender._id,
        email: lender.email,
        token: generateToken(lender._id, "lender"),
        message: "Lender registered successfully"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login Lender
export const loginLender = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lender = await Lender.findOne({ email });

    if (lender && (await lender.comparePassword(password))) {
      res.json({
        _id: lender._id,
        email: lender.email,
        token: generateToken(lender._id, "lender"),
        message: "Login successful"
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
