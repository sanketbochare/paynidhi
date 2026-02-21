import Seller from "../models/Seller.model.js";
import MockCompanyModel from "../models/MockCompany.model.js";
import MockIdentityModel from "../models/MockIdentity.model.js"
import { hashField } from "../utils/encryption.utils.js";

export const kycVerification = async (req, res) => {
    try {
        console.log("KYC verification started...");

        const { name, panNumber, aadhaarNumber, bankAccount } = req.body;

        // 1. Get Seller ID from request (set by your auth middleware)
        const sellerId = req.user?._id; 
        if (!sellerId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        console.log("Authorization success!!!", panNumber, "   ", aadhaarNumber)
        // 2. Validate with Mock Identity (Simulating a Govt API call)
        const identityRecord = await MockIdentityModel.findOne({ 
            panNo: panNumber,
            aadhaarNo: Number(aadhaarNumber)
        });

        if (!identityRecord) {
            console.log("Invalid pan or aadhaar!!!")
            return res.status(400).json({ message: "Invalid PAN or Aadhaar details. Verification failed." });
        }
        console.log("Pan and aadhaar success!!!")
        // 3. Check if this PAN is already used by another seller (Uniqueness check)
        const hashedPan = hashField(panNumber);
        const existingSeller = await Seller.findOne({ panHash: hashedPan });
        
        if (existingSeller && existingSeller._id.toString() !== sellerId.toString()) {
            return res.status(400).json({ message: "This PAN is already registered with another account." });
        }

        // 4. Update the Seller Document
        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found." });
        }

        let tempAccno = bankAccount.accountNumber;
        if(seller.bankAccount.length > 0) {
            seller.bankAccount.forEach(acc => {
                // console.log(acc.accountNumber, " ", tempAccno)
                if(acc.accountNumberHash === hashField(tempAccno)) {
                    console.log("duplicate account number found!!");
                    return res.status(404).json({"message": "duplicate account number found"})
                }
            })
        }

        // Update fields
        seller.panNumber = panNumber; // Will be encrypted by pre-save hook
        seller.panHash = hashedPan;   // Our Blind Index for searching
        seller.aadhaarNumber = aadhaarNumber; 
        // Add Bank Details (assuming bankAccount is an object {accountNumber, ifsc, bankName})
        if (bankAccount) {
            seller.bankAccount = [{
                accountNumber: bankAccount.accountNumber,
                ifscCode: bankAccount.ifscCode,
                beneficiaryName: name,
                bankName: bankAccount.bankName
            }];
        }

        seller.isOnboarded = true; // Mark KYC as complete
        await seller.save();

        return res.status(200).json({
            success: true,
            message: "KYC Verified successfully",
            isOnboarded: true
        });

    } catch (error) {
        console.error("KYC Error:", error);
        res.status(500).json({ message: "Internal Server Error during KYC." });
    }
};