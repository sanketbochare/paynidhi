import Invoice from "../models/Invoice.model.js";
import Transaction from "../models/Transaction.model.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/razorpay.service.js";

// @desc    Step 1: Lender clicks "Pay" -> Create Order
// @route   POST /api/payment/create-order/:invoiceId
export const createOrder = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const lenderId = req.user._id;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    // Ensure only the assigned Lender can pay
    if (invoice.lender.toString() !== lenderId.toString()) {
      return res.status(403).json({ error: "Unauthorized lender" });
    }

    // Call Razorpay Service
    const order = await createRazorpayOrder(invoice.totalAmount);

    res.json({
      success: true,
      orderId: order.id,
      amount: invoice.totalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID // Send Key ID to frontend
    });

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

// @desc    Step 2: Payment Success -> Verify & Finance
// @route   POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = req.body;
    const lenderId = req.user._id;

    // 1. Verify Signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid Payment Signature. Potential Fraud." });
    }

    // 2. Find Invoice & Update Status
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    if (invoice.status === "Financed") {
      return res.status(400).json({ error: "Invoice is already financed." });
    }

    invoice.status = "Financed";
    invoice.fundedAt = new Date();
    await invoice.save();

    // 3. Log Transaction
    await Transaction.create({
      user: lenderId,
      userType: 'Lender',
      amount: invoice.totalAmount,
      type: 'DISBURSEMENT',
      description: `Razorpay Payment: ${razorpay_payment_id}`,
      status: 'SUCCESS',
      invoiceId: invoice._id
    });

    res.json({
      success: true,
      message: "Payment Verified! Invoice Financed Successfully."
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};