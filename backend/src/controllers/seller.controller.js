import Invoice from "../models/Invoice.model.js";
import Bid from "../models/Bid.model.js";
import Lender from "../models/Lender.model.js";
// ==========================================
// 1. DASHBOARD: Get Invoices (This part was perfect ✅)
// ==========================================
export const getMyInvoices = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1. Find all invoices by this seller
    const invoices = await Invoice.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Attach ONLY the Bid Count to each invoice
    const dashboardData = await Promise.all(
      invoices.map(async (invoice) => {
        // ⚡️ PRO MOVE: Use countDocuments instead of fetching full bid objects
        const bidCount = await Bid.countDocuments({ invoice: invoice._id });

        return {
          ...invoice,
          bidCount: bidCount // We removed the heavy 'bids' array entirely!
        };
      })
    );

    res.json(dashboardData);
  } catch (error) {
    console.error("Seller Dashboard Error:", error);
    res.status(500).json({ error: "Failed to load invoices" });
  }
};

// ==========================================
// 2. DEAL CLOSURE: Generate Banking Instructions (Updated ⚡️)
// ==========================================
// ==========================================
// 2. DEAL CLOSURE: Accept/Reject Bid (Simplified)
// ==========================================
export const respondToBid = async (req, res) => {
  try {
    const { status } = req.body;
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId).populate("invoice");
    if (!bid) return res.status(404).json({ error: "Bid not found" });

    // A. HANDLE REJECTION
    if (status === "Rejected") {
      bid.status = "Rejected";
      await bid.save();
      return res.json({ message: "Bid rejected successfully." });
    }

    // B. HANDLE ACCEPTANCE (Simple State Update)
    if (status === "Accepted") {
      
      // 1. Lock the Deal
      bid.status = "Accepted"; 
      await bid.save();

      // 2. Update Invoice Status to "Financed" (or "Accepted")
      // We also link the winning Lender to the Invoice for easy tracking
      await Invoice.findByIdAndUpdate(bid.invoice._id, { 
        status: "Financed",
        lender: bid.lender 
      });

      // 3. Reject all other competing bids for this invoice
      await Bid.updateMany(
        { invoice: bid.invoice._id, _id: { $ne: bidId } },
        { status: "Rejected" }
      );

      return res.json({
        success: true,
        message: "Bid Accepted! Deal Closed.",
        data: {
            bidId: bid._id,
            status: "Accepted"
        }
      });
    }

  } catch (error) {
    console.error("Deal Closure Error:", error);
    res.status(500).json({ error: "Failed to process bid." });
  }
};
// @desc    Get a single invoice and all bids placed on it
// @route   GET /api/seller/invoice/:invoiceId/bids
export const getInvoiceWithBids = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const sellerId = req.user._id;

    // 1. Fetch the specific invoice (and ensure it belongs to this seller)
    const invoice = await Invoice.findOne({ _id: invoiceId, seller: sellerId }).lean();
    
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found or unauthorized" });
    }

    // 2. Fetch all bids for this invoice
    const bids = await Bid.find({ invoice: invoiceId })
      .populate("lender", "companyName lenderType") // Bring in Lender details
      .sort({ interestRate: 1 }) // Sort: Lowest interest rate first (Best for Seller)
      .lean();

    // 3. Send it all together to the frontend
    res.json({
      success: true,
      data: {
        invoice,
        bids,
        totalBids: bids.length
      }
    });

  } catch (error) {
    console.error("Error fetching invoice bids:", error);
    res.status(500).json({ error: "Failed to load bids" });
  }
};