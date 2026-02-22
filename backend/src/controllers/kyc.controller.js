import Seller from "../models/Seller.model.js";
import MockIdentityModel from "../models/MockIdentity.model.js"
import { hashField } from "../utils/encryption.utils.js";

export const kycVerification = async (req, res) => {
    try {
        console.log("KYC verification started...");

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
        
        const hashedPan = hashField(panNumber);
        const existingSeller = await Seller.findOne({ panHash: hashedPan });
        
        if (existingSeller && existingSeller._id.toString() !== sellerId.toString()) {
            return res.status(400).json({ message: "This PAN is already registered with another account." });
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
        seller.kycStatus = "verified"; // ✅ FIX: explicitly set to verified
        await seller.save();

        return res.status(200).json({
            success: true,
            message: "KYC Verified successfully",
            isOnboarded: true,
            kycStatus: "verified" // ✅ FIX: return verified status
        });

    } catch (error) {
        console.error("KYC Error:", error);
        res.status(500).json({ message: "Internal Server Error during KYC." });
    }
};