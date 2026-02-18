// backend/src/controllers/auth.controller.js
import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";
import jwt from "jsonwebtoken";
import { hashField } from "../utils/encryption.utils.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const sendAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in production with HTTPS
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// @desc    Register Seller
export const registerSeller = async (req, res) => {
  try {
    const {
      email,
      password,
      companyName,
      gstNumber,
      panNumber,
      bankAccount,
      businessType,
      industry,
      annualTurnover,
    } = req.body;

    const gstHash = hashField(gstNumber);
    const panHash = hashField(panNumber);

    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) return res.status(400).json({ error: "Email already registered" });

    const isGstNumDuplicate = await Seller.findOne({ gstHash });
    const isPanNumDuplicate = await Seller.findOne({ panHash });

    if (isGstNumDuplicate) return res.status(400).json({ error: "GST Number already registered" });
    if (isPanNumDuplicate) return res.status(400).json({ error: "PAN Number already registered" });

    const seller = await Seller.create({
      email,
      password,
      companyName,
      gstNumber,
      panNumber,
      gstHash,
      panHash,
      bankAccount,
      businessType,
      industry,
      annualTurnover: annualTurnover || 0,
      isOnboarded: true,
    });

    if (seller) {
      const token = generateToken(seller._id, "seller");
      sendAuthCookie(res, token);

      res.status(201).json({
        _id: seller._id,
        email: seller.email,
        companyName: seller.companyName,
        role: "seller",
        message: "Seller registered successfully",
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

    if (seller && (await seller.matchPassword(password))) {
      const token = generateToken(seller._id, "seller");
      sendAuthCookie(res, token);

      res.json({
        _id: seller._id,
        email: seller.email,
        companyName: seller.companyName,
        role: "seller",
        message: "Login successful",
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
      email,
      password,
      companyName,
      lenderType,
      lenderLicense,
      bankAccount,
      maxInvestment,
      address,
    } = req.body;

    const lenderExists = await Lender.findOne({ email });
    if (lenderExists) return res.status(400).json({ error: "Lender already exists" });

    const lender = await Lender.create({
      email,
      password,
      companyName,
      lenderType,
      lenderLicense,
      bankAccount,
      maxInvestment,
      address,
      isOnboarded: true,
      totalCreditLimit: maxInvestment || 0,
      utilizedLimit: 0,
      escrowBalance: 0,
    });

    if (lender) {
      const token = generateToken(lender._id, "lender");
      sendAuthCookie(res, token);

      res.status(201).json({
        _id: lender._id,
        email: lender.email,
        role: "lender",
        message: "Lender registered successfully",
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
      const token = generateToken(lender._id, "lender");
      sendAuthCookie(res, token);

      res.json({
        _id: lender._id,
        email: lender.email,
        role: "lender",
        message: "Login successful",
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// backend/src/controllers/auth.controller.js
export const getMe = async (req, res) => {
  // protect middleware already set req.user
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({
    _id: req.user._id,
    email: req.user.email,
    companyName: req.user.companyName,
    role: req.user.businessType ? "seller" : "lender",
  });
};
