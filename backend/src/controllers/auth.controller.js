// backend/src/controllers/auth.controller.js
import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";
import MockCompany from "../models/MockCompany.model.js";
import jwt from "jsonwebtoken";
import { hashField } from "../utils/encryption.utils.js";
import Otp from "../models/Otp.model.js";
import { sendOtpEmail } from "../utils/email.utils.js";
import { getRandomAvatarUrl } from "../utils/avatar.utils.js";


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
// REGISTER SELLER
export const registerSeller = async (req, res) => {
  console.log("seller registration started!!!")
  try {
    const {
      email,
      password,
      companyName,
      gstNumber,
      // panNumber,
      // bankAccount,
      businessType,
      industry,
      annualTurnover,
      // beneficiaryName,
    } = req.body;

  
    console.log("verifying company gstin...")
    const verifiedCompany = await MockCompany.findOne({ gstin: gstNumber });
    if (!verifiedCompany) {
      return res.status(400).json({ error: "Registration Failed: GSTIN not found in official Govt records." });
    }
    if (verifiedCompany.companyName.toLowerCase() !== companyName.toLowerCase()) {
      return res.status(400).json({ error: `Registration Failed: GSTIN belongs to '${verifiedCompany.companyName}', not '${companyName}'.` });
    }
    // ==========================================
    console.log("gst company verification done!")
    const gstHash = hashField(gstNumber);
    console.log(typeof gstHash);
    console.log(gstNumber, gstHash);
    // const panHash = hashField(panNumber);

    const sellerExists = await Seller.findOne({ email });
    // ... the rest of your existing registerSeller logic stays exactly the same ...
    if (sellerExists) {
      console.log("duplicate seller found (email)")
      return res.status(400).json({ error: "Email already registered" });
    }

    const isGstNumDuplicate = await Seller.findOne({ gstHash: gstHash });
    console.log("isGstNumDuplicate: ", isGstNumDuplicate);
    // const isPanNumDuplicate = await Seller.findOne({ panHash });

    if (isGstNumDuplicate) {
      console.log("gst number is duplicate")
      return res.status(400).json({ error: "GST Number already registered" });
    }
    // if (isPanNumDuplicate) {
    //   return res.status(400).json({ error: "PAN Number already registered" });
    // }

    
    const seller = await Seller.create({
      email,
      password,
      companyName,
      gstNumber,
      // panNumber,
      gstHash,
      // panHash,
      // bankAccount,
      businessType,
      industry,
      annualTurnover: Number(annualTurnover) || 0,
      isOnboarded: true,
    });

    if (seller) {
      const token = generateToken(seller._id, "seller");
      sendAuthCookie(res, token);

      console.log("seller created successfully...", seller._id);
      return res.status(201).json({
        _id: seller._id,
        email: seller.email,
        companyName: seller.companyName,
        role: "seller",
        avatarUrl: seller.avatarUrl || "",
        isOnboarded: seller.isOnboarded,
        kycStatus: seller.kycStatus,
        message: "Seller registered successfully. Complete KYC to get started.",
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
        isOnboarded: seller.isOnboarded,
        kycStatus: seller.kycStatus,
        message: "Login successful",
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// REGISTER LENDER (simplified similarly)
export const registerLender = async (req, res) => {
  try {
    const {
      email,
      password,
      companyName,
      lenderType,
      lenderLicense,
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
      isOnboarded: false,
      kycStatus: "partial",
      totalCreditLimit: 0,
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
        isOnboarded: lender.isOnboarded,
        kycStatus: lender.kycStatus,
        message: "Lender registered successfully. Complete KYC to get started.",
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
        isOnboarded: lender.isOnboarded,
        kycStatus: lender.kycStatus,
        message: "Login successful",
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET CURRENT USER (enhanced with KYC status)
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
    isOnboarded: req.user.isOnboarded,
    kycStatus: req.user.kycStatus,
  });
};

// UPDATE AVATAR
export const updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let updatedUser;

    if (req.user.businessType) {
      updatedUser = await Seller.findByIdAndUpdate(
        req.user._id,
        { avatarUrl: avatarUrl || "" },
        { new: true }
      ).select("-password");
    } else {
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

// 1) Request OTP
export const requestOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email || !purpose) {
      return res.status(400).json({ error: "Email and purpose are required" });
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

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

//  Verify OTP and finalize (UPDATED FOR SIMPLIFIED REGISTRATION)
export const verifyOtp = async (req, res) => {
  try {
    const { email, code, purpose, mode } = req.body;
    const payload = req.body.payload ? JSON.parse(req.body.payload) : null;
    const avatarFile = req.file;

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
    let avatarUrl = "";

    if (purpose === "register") {
      if (avatarFile) {
        avatarUrl = `/uploads/avatars/${avatarFile.filename}`;
      } else {
        avatarUrl = getRandomAvatarUrl();
      }

      if (mode === "seller") {
        // ONLY these fields are used at registration
        const {
          email: payloadEmail,          // optional, fallback to req.email
          password,
          companyName,
          gstNumber,
          businessType,
          industry,
          annualTurnover,
        } = payload || {};

        const finalEmail = payloadEmail || email;

        // basic validation
        if (!finalEmail || !password || !companyName || !gstNumber) {
          return res.status(400).json({ error: "Missing registration fields" });
        }

        // duplicate checks using gstHash
        const gstHash = hashField(gstNumber);

        const sellerExists = await Seller.findOne({ email: finalEmail });
        if (sellerExists) {
          return res
            .status(400)
            .json({ error: "Email already registered as seller" });
        }

        const isGstNumDuplicate = await Seller.findOne({ gstHash });
        if (isGstNumDuplicate) {
          return res
            .status(400)
            .json({ error: "GST Number already registered" });
        }

        // CREATE SELLER WITH ONLY BASIC FIELDS
        user = await Seller.create({
          email: finalEmail,
          password,
          companyName,
          gstNumber,
          gstHash,
          businessType: businessType || "Services",
          industry: industry || "IT",
          annualTurnover: Number(annualTurnover) || 0,
          // no beneficiaryName, no bankAccount, no PAN, no Aadhaar here
          isOnboarded: false,   // KYC pending
          kycStatus: "partial", // you can keep or change
          avatarUrl,
        });
      } else {
        // lender (keep minimal too if you want)
        const {
          email: payloadEmail,
          password,
          companyName,
          lenderType,
          lenderLicense,
        } = payload || {};

        const finalEmail = payloadEmail || email;

        if (!finalEmail || !password || !companyName) {
          return res.status(400).json({ error: "Missing registration fields" });
        }

        const lenderExists = await Lender.findOne({ email: finalEmail });
        if (lenderExists) {
          return res
            .status(400)
            .json({ error: "Email already registered as lender" });
        }

        user = await Lender.create({
          email: finalEmail,
          password,
          companyName,
          lenderType,
          lenderLicense,
          isOnboarded: false,
          kycStatus: "partial",
          totalCreditLimit: 0,
          utilizedLimit: 0,
          escrowBalance: 0,
          avatarUrl,
        });
      }
    } else if (purpose === "login") {
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

      if (!user.avatarUrl) {
        user.avatarUrl = getRandomAvatarUrl();
        await user.save();
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
      isOnboarded: user.isOnboarded,
      kycStatus: user.kycStatus,
      message:
        purpose === "register"
          ? "Registration complete. Complete KYC to continue."
          : "Login verified",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

