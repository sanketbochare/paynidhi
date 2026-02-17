import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create an Order (This ID goes to Frontend)
export const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // Amount in paise (₹500 -> 50000 paise)
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error("Razorpay Order Creation Failed: " + error.message);
  }
};

// 2. Verify Signature (Security Check)
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return generated_signature === signature;
};