import Razorpay from "razorpay";
import crypto from "crypto";
import Bid from "../models/Bid.model.js";
import Invoice from "../models/Invoice.model.js";

// 1. Create Order
export const createOrder = async (req, res) => {
  try {
    // 🔥 We initialize Razorpay INSIDE the function now!
    // This guarantees the .env variables are fully loaded.
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { bidId } = req.body;

    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ error: "Bid not found" });

    const amountInPaise = Math.round(bid.loanAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${bidId}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

// 2. Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bidId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const bid = await Bid.findById(bidId);
      bid.status = "Funded";
      await bid.save();

      await Invoice.findByIdAndUpdate(bid.invoice, { status: "Funded" });

      return res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};