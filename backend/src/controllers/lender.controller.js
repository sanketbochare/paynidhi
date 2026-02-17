import Invoice from "../models/Invoice.model.js";
import Bid from "../models/Bid.model.js";

// @desc    Get Feed of Invoices + Bids
// @route   GET /api/lender/marketplace
export const getMarketplace = async (req, res) => {
  try {
    // 1. Get all Active Invoices
    const invoices = await Invoice.find({ status: { $in: ["Verified", "Pending_Bids"] } })
      .populate("seller", "companyName businessType trustScore")
      .lean(); // .lean() converts Mongoose object to plain JSON so we can add 'bids' to it

    // 2. Attach Bids to each Invoice
    const feed = await Promise.all(
      invoices.map(async (invoice) => {
        // Get all bids for this invoice
        const bids = await Bid.find({ invoice: invoice._id })
          .populate("lender", "companyName") // Show who bid
          .sort({ interestRate: 1 }); // Sort by BEST rate (Lowest first)

        return {
          ...invoice,
          bids: bids, // List of all bids
          bidCount: bids.length,
          bestBid: bids.length > 0 ? bids[0].interestRate + "%" : "No Bids Yet"
        };
      })
    );

    res.json(feed);
  } catch (error) {
    console.error("Marketplace Error:", error);
    res.status(500).json({ error: "Could not load dashboard" });
  }
};

// @desc    Place a Bid
// @route   POST /api/lender/bid/:invoiceId
export const placeBid = async (req, res) => {
  try {
    const { interestRate, proposedAmount } = req.body;
    const { invoiceId } = req.params;

    // 1. Create the Bid
    const newBid = await Bid.create({
      invoice: invoiceId,
      lender: req.user._id,
      interestRate,
      proposedAmount
    });

    // 2. Update Invoice Status to show it has activity
    await Invoice.findByIdAndUpdate(invoiceId, { status: "Pending_Bids" });

    res.status(201).json({
      success: true,
      message: "Bid Placed Successfully!",
      data: newBid
    });

  } catch (error) {
    console.error("Bidding Error:", error);
    res.status(500).json({ error: "Failed to place bid" });
  }
};