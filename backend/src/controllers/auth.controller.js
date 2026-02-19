// backend/src/controllers/auth.controller.js
import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";
import jwt from "jsonwebtoken";
import { hashField } from "../utils/encryption.utils.js";
import Otp from "../models/Otp.model.js";
import { sendOtpEmail } from "../utils/email.utils.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const sendAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production with HTTPS
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// REGISTER SELLER
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
    if (sellerExists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const isGstNumDuplicate = await Seller.findOne({ gstHash });
    const isPanNumDuplicate = await Seller.findOne({ panHash });

    if (isGstNumDuplicate) {
      return res.status(400).json({ error: "GST Number already registered" });
    }
    if (isPanNumDuplicate) {
      return res.status(400).json({ error: "PAN Number already registered" });
    }

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
        avatarUrl: seller.avatarUrl || "",
        message: "Seller registered successfully",
      });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN SELLER
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
        avatarUrl: seller.avatarUrl || "",
        message: "Login successful",
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// REGISTER LENDER
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
    if (lenderExists) {
      return res.status(400).json({ error: "Lender already exists" });
    }

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
        companyName: lender.companyName,
        role: "lender",
        avatarUrl: lender.avatarUrl || "",
        message: "Lender registered successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN LENDER
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
        companyName: lender.companyName,
        role: "lender",
        avatarUrl: lender.avatarUrl || "",
        message: "Login successful",
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({
    _id: req.user._id,
    email: req.user.email,
    companyName: req.user.companyName,
    role: req.user.businessType ? "seller" : "lender",
    avatarUrl: req.user.avatarUrl || "",
  });
};

// UPDATE AVATAR (URL-based)
export const updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let updatedUser;

    if (req.user.businessType) {
      // seller
      updatedUser = await Seller.findByIdAndUpdate(
        req.user._id,
        { avatarUrl: avatarUrl || "" },
        { new: true }
      ).select("-password");
    } else {
      // lender
      updatedUser = await Lender.findByIdAndUpdate(
        req.user._id,
        { avatarUrl: avatarUrl || "" },
        { new: true }
      ).select("-password");
    }

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      companyName: updatedUser.companyName,
      role: updatedUser.businessType ? "seller" : "lender",
      avatarUrl: updatedUser.avatarUrl || "",
      message: "Avatar updated",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update avatar" });
  }
};
const generateOtpCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 1) Request OTP for login or register
export const requestOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body; // purpose: "login" | "register"
    if (!email || !purpose) {
      return res.status(400).json({ error: "Email and purpose are required" });
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Otp.deleteMany({ email, purpose, verified: false });

    await Otp.create({ email, code, purpose, expiresAt });

    await sendOtpEmail({ to: email, code });

    res.json({
      message: "OTP sent to email",
      email,
      purpose,
    });
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// 2) Verify OTP and finalize login/register
export const verifyOtp = async (req, res) => {
  try {
    const { email, code, purpose, mode, payload } = req.body;
    // mode: "seller" | "lender"
    // payload: registration data when purpose === "register"

    if (!email || !code || !purpose || !mode) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const otpDoc = await Otp.findOne({ email, code, purpose, verified: false });
    if (!otpDoc) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    otpDoc.verified = true;
    await otpDoc.save();

    let user;
    let role = mode;

    if (purpose === "register") {
      // Registration: create Seller or Lender
      if (mode === "seller") {
        const {
          companyName,
          gstNumber,
          panNumber,
          bankAccount,
          businessType,
          industry,
          annualTurnover,
        } = payload;

        const gstHash = hashField(gstNumber);
        const panHash = hashField(panNumber);

        const sellerExists = await Seller.findOne({ email });
        if (sellerExists) {
          return res
            .status(400)
            .json({ error: "Email already registered as seller" });
        }

        const isGstNumDuplicate = await Seller.findOne({ gstHash });
        const isPanNumDuplicate = await Seller.findOne({ panHash });

        if (isGstNumDuplicate) {
          return res
            .status(400)
            .json({ error: "GST Number already registered" });
        }
        if (isPanNumDuplicate) {
          return res
            .status(400)
            .json({ error: "PAN Number already registered" });
        }

        user = await Seller.create({
          email,
          password: payload.password,
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
      } else {
        // lender
        const {
          companyName,
          lenderType,
          lenderLicense,
          bankAccount,
          maxInvestment,
          address,
        } = payload;

        const lenderExists = await Lender.findOne({ email });
        if (lenderExists) {
          return res
            .status(400)
            .json({ error: "Email already registered as lender" });
        }

        user = await Lender.create({
          email,
          password: payload.password,
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
      }
    } else if (purpose === "login") {
      // Login: just find and validate password separately in /login, but here we assume user exists
      if (mode === "seller") {
        user = await Seller.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: "Seller not found" });
        }
      } else {
        user = await Lender.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: "Lender not found" });
        }
      }
    }

    const token = generateToken(user._id, role);
    sendAuthCookie(res, token);

    return res.json({
      _id: user._id,
      email: user.email,
      companyName: user.companyName,
      role,
      avatarUrl: user.avatarUrl || "",
      message:
        purpose === "register"
          ? "Registration complete"
          : "Login verified",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "OTP verification failed" });
  }
};
