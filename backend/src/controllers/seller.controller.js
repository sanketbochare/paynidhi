import Invoice from "../models/Invoice.model.js";
import Bid from "../models/Bid.model.js";

// @desc    Get Seller's Invoices & Associated Bids
// @route   GET /api/seller/invoices
export const getMyInvoices = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1. Find all invoices by this seller
    const invoices = await Invoice.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Attach Bids to each invoice
    const dashboardData = await Promise.all(
      invoices.map(async (invoice) => {
        const bids = await Bid.find({ invoice: invoice._id, status: "Pending" })
          .populate("lender", "companyName lenderType") // Show who is bidding
          .sort({ interestRate: 1 }); // Best rates first

        return {
          ...invoice,
          bids: bids,
          bidCount: bids.length
        };
      })
    );

    res.json(dashboardData);
  } catch (error) {
    console.error("Seller Dashboard Error:", error);
    res.status(500).json({ error: "Failed to load invoices" });
  }
};

// @desc    Accept or Reject a Bid
// @route   POST /api/seller/bid-response/:bidId
export const respondToBid = async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Rejected"
    const { bidId } = req.params;
    const sellerId = req.user._id;

    // 1. Find the Bid
    const bid = await Bid.findById(bidId).populate("invoice");
    if (!bid) return res.status(404).json({ error: "Bid not found" });

    // 2. Verify Ownership (Security Check)
    if (bid.invoice.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ error: "Not authorized to manage this bid" });
    }

    // 3. Handle REJECTION
    if (status === "Rejected") {
      bid.status = "Rejected";
      await bid.save();
      return res.json({ message: "Bid rejected successfully" });
    }

    // 4. Handle ACCEPTANCE (The Big Moment!)
    // 4. Handle ACCEPTANCE (Create the Payment Order)
    if (status === "Accepted") {
      
      // A. Lock the Bid
      bid.status = "Accepted";
      await bid.save();

      // B. Update Invoice to "Awaiting Payment"
      // This stops other lenders from bidding, but doesn't mark it "Financed" yet.
      const invoice = await Invoice.findById(bid.invoice._id);
      invoice.status = "Awaiting_Payment"; 
      invoice.lender = bid.lender; // Link the Lender
      await invoice.save();

      // C. Reject all OTHER bids
      await Bid.updateMany(
        { invoice: invoice._id, _id: { $ne: bidId } },
        { status: "Rejected" }
      );

      return res.json({ 
        success: true, 
        message: "Bid Accepted! Waiting for Lender to transfer funds.",
        data: invoice 
      });
    }

    res.status(400).json({ error: "Invalid status" });

  } catch (error) {
    console.error("Bid Response Error:", error);
    res.status(500).json({ error: "Transaction failed" });
  }
};