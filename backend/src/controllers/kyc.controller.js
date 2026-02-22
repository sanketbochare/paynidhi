import Seller from "../models/Seller.model.js";
import Lender from "../models/Lender.model.js";
import MockIdentityModel from "../models/MockIdentity.model.js"
import { hashField } from "../utils/encryption.utils.js";

// ==========================================
// 1. SELLER KYC
// ==========================================
export const kycVerification = async (req, res) => {
    try {
        console.log("Seller KYC verification started...");

        const { name, panNumber, aadhaarNumber, bankAccount } = req.body;

        const sellerId = req.user?._id; 
        if (!sellerId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        
        const identityRecord = await MockIdentityModel.findOne({ 
            panNo: panNumber,
            aadhaarNo: Number(aadhaarNumber)
        });

        if (!identityRecord) {
            return res.status(400).json({ message: "Invalid PAN or Aadhaar details. Verification failed." });
        }
        
        // Check for duplicate PAN
        const hashedPan = hashField(panNumber);
        const existingSeller = await Seller.findOne({ panHash: hashedPan });
        
        if (existingSeller && existingSeller._id.toString() !== sellerId.toString()) {
            return res.status(400).json({ message: "This PAN is already registered with another account." });
        }

        // Check for duplicate Aadhaar
        const existingAadhaarSeller = await Seller.findOne({ aadhaarNumber: Number(aadhaarNumber) });
        if (existingAadhaarSeller && existingAadhaarSeller._id.toString() !== sellerId.toString()) {
            return res.status(400).json({ message: "This Aadhaar is already registered with another account." });
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found." });
        }

        seller.panNumber = panNumber; 
        seller.panHash = hashedPan;  
        seller.aadhaarNumber = aadhaarNumber; 
        
        if (bankAccount) {
            seller.bankAccount = [{
                accountNumber: bankAccount.accountNumber,
                ifscCode: bankAccount.ifscCode,
                beneficiaryName: name,
                bankName: bankAccount.bankName
            }];
        }

        seller.isOnboarded = true; 
        seller.kycStatus = "verified"; 
        await seller.save();

        return res.status(200).json({
            success: true,
            message: "KYC Verified successfully",
            isOnboarded: true,
            kycStatus: "verified" 
        });

    } catch (error) {
        console.error("Seller KYC Error:", error);
        
        // Catch MongoDB duplicate key errors gracefully
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `This ${duplicateField} is already registered to another account.` });
        }
        
        res.status(500).json({ message: "Internal Server Error during KYC." });
    }
};

// ==========================================
// 2. LENDER KYC
// ==========================================
export const lenderKycVerification = async (req, res) => {
    try {
        console.log("Lender KYC verification started...");

        const { name, panNumber, aadhaarNumber, bankAccount } = req.body;

        const lenderId = req.user?._id; 
        if (!lenderId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        
        // 1. Check Identity DB 
        const identityRecord = await MockIdentityModel.findOne({ 
            panNo: panNumber,
            aadhaarNo: Number(aadhaarNumber)
        });

        if (!identityRecord) {
            console.log("Invalid PAN or Aadhaar details. Verification failed." );
            return res.status(400).json({ message: "Invalid PAN or Aadhaar details. Verification failed." });
        }
        
        // 2. Hash PAN & Check for duplicates in Lender Collection
        const hashedPan = hashField(panNumber);
        const existingLender = await Lender.findOne({ panHash: hashedPan });
        
        if (existingLender && existingLender._id.toString() !== lenderId.toString()) {
            console.log("This PAN is already registered with another Lender account.");
            return res.status(400).json({ message: "This PAN is already registered with another Lender account." });
        }

        // 3. Check for duplicate Aadhaar in Lender Collection (✅ THE FIX)
        const existingAadhaarLender = await Lender.findOne({ aadhaarNumber: Number(aadhaarNumber) });
        if (existingAadhaarLender && existingAadhaarLender._id.toString() !== lenderId.toString()) {
            console.log("This Aadhaar is already registered with another Lender account.");
            return res.status(400).json({ message: "This Aadhaar is already registered with another Lender account." });
        }

        // 4. Update the Lender Profile
        const lender = await Lender.findById(lenderId);
        if (!lender) {
            console.log("Lender not found.")
            return res.status(404).json({ message: "Lender not found." });
        }

        if (lender.kycStatus === "verified") {
            console.log("KYC is already verified.");
            return res.status(400).json({ message: "KYC is already verified." });
        }

        lender.panNumber = panNumber; 
        lender.panHash = hashedPan;  
        lender.aadhaarNumber = aadhaarNumber; 
        
        if (bankAccount) {
            lender.bankAccount = [{
                accountNumber: bankAccount.accountNumber,
                ifscCode: bankAccount.ifscCode,
                beneficiaryName: name,
                bankName: bankAccount.bankName
            }];
        }

        lender.isOnboarded = true; 
        lender.kycStatus = "verified"; 
        
        // 🏦 TREASURY INIT
        // lender.totalCreditLimit = 1000000; 

        await lender.save(); // Pre-save hook handles encryption

        return res.status(200).json({
            success: true,
            message: "Lender KYC Verified successfully! Wallet is active.",
            isOnboarded: true,
            kycStatus: "verified" 
        });

    } catch (error) {
        console.error("Lender KYC Error:", error);
        
        // Catch MongoDB duplicate key errors gracefully (✅ THE FIX)
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `This ${duplicateField} is already registered to another account.` });
        }

        res.status(500).json({ message: "Internal Server Error during Lender KYC." });
    }
};