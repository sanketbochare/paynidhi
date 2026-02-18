import Invoice from "../models/Invoice.model.js";
import Bid from "../models/Bid.model.js";
import Lender from "../models/Lender.model.js";
import Razorpay from "razorpay"; // 👈 New Import

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// 1. DASHBOARD: Get Invoices (This part was perfect ✅)
// ==========================================
export const getMyInvoices = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const invoices = await Invoice.find({ seller: sellerId }).sort({ createdAt: -1 }).lean();

    const dashboardData = await Promise.all(
      invoices.map(async (invoice) => {
        const bids = await Bid.find({ invoice: invoice._id })
          .populate("lender", "companyName lenderType")
          .sort({ interestRate: 1 });

        return { ...invoice, bids: bids, bidCount: bids.length };
      })
    );
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: "Failed to load invoices" });
  }
};

// ==========================================
// 2. DEAL CLOSURE: Generate Banking Instructions (Updated ⚡️)
// ==========================================
export const respondToBid = async (req, res) => {
  try {
    const { status } = req.body;
    const { bidId } = req.params;
    const sellerId = req.user._id;

    const bid = await Bid.findById(bidId).populate("invoice");
    if (!bid) return res.status(404).json({ error: "Bid not found" });

    // A. HANDLE REJECTION
    if (status === "Rejected") {
      bid.status = "Rejected";
      await bid.save();
      return res.json({ message: "Bid rejected successfully." });
    }

    // B. HANDLE ACCEPTANCE (The "Real" Logic)
    if (status === "Accepted") {
      
      // 1. Don't move money yet! Create the Virtual Account first.
      // This is the "Bank Account" the Lender must pay into.
      const va = await razorpay.virtualAccounts.create({
        receiver_types: ["bank_account"],
        description: `Funding for Invoice #${bid.invoice.invoiceNumber}`,
        notes: { 
            bidId: bidId,
            invoiceId: bid.invoice._id.toString() 
        }
      });

      // 2. Save these details so the Lender can see them
      bid.paymentDetails = {
        va_id: va.id,
        accountNumber: va.receivers[0].account_number, // e.g. 111222000345
        ifsc: va.receivers[0].ifsc,                   // e.g. UTIB0000000
        bankName: va.receivers[0].bank_name,
        status: "AWAITING_RTGS"
      };

      // 3. Lock the Deal
      bid.status = "Accepted"; // Accepted, but not yet "Financed" (Funded)
      await bid.save();

      // 4. Update Invoice Status
      await Invoice.findByIdAndUpdate(bid.invoice._id, { status: "Pending_Payment" });

      // 5. Reject other bids
      await Bid.updateMany(
        { invoice: bid.invoice._id, _id: { $ne: bidId } },
        { status: "Rejected" }
      );

      return res.json({
        success: true,
        message: "Bid Accepted! Banking Instructions Generated.",
        data: {
            bankDetails: bid.paymentDetails, // Frontend shows this to user
            instructions: "Please share these details with the Lender for RTGS Transfer."
        }
      });
    }

  } catch (error) {
    console.error("Deal Closure Error:", error);
    res.status(500).json({ error: "Failed to generate banking instructions." });
  }
};