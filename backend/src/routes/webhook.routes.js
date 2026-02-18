import { Router } from "express";
import Transaction from "../models/Transaction.model.js";
import Bid from "../models/Bid.model.js";
import Seller from "../models/Seller.model.js";

const router = Router();

// Endpoint: POST /api/webhooks/razorpay
router.post("/razorpay", async (req, res) => {
  const { event, payload } = req.body;

  // We are looking for "virtual_account.credited" (Money has arrived)
  if (event === "virtual_account.credited") {
    const va_id = payload.virtual_account.id;
    const amountReceived = payload.payment.amount / 100; // Convert Paise to INR

    try {
      const bid = await Bid.findOne({ "paymentDetails.va_id": va_id }).populate("seller");

      if (bid && bid.status !== "Financed") {
        const fee = bid.processingFee || 1000;
        const netDisbursement = amountReceived - fee;

        // 1. Credit the Seller Wallet
        await Seller.findByIdAndUpdate(bid.seller._id, {
          $inc: { walletBalance: netDisbursement }
        });

        // 2. Create the Transaction Record (Passbook)
        await Transaction.create({
          seller: bid.seller._id,
          lender: bid.lender,
          bid: bid._id,
          type: "FUNDING_INFLOW",
          amount: amountReceived,
          fee: fee,
          utr_number: payload.payment.bank_reference || `RTGS${Date.now()}`,
          razorpay_va_id: va_id,
          description: `Invoice Funding - #${bid.invoice}`
        });

        // 3. Update Bid Status
        bid.status = "Financed";
        await bid.save();

        console.log(`✅ [PAYNIDHI] Webhook Success: ₹${netDisbursement} credited to Wallet.`);
      }
    } catch (err) {
      console.error("Webhook Processing Error:", err);
    }
  }
  
  res.status(200).send("OK"); // Always return 200 to Razorpay
});

export default router;