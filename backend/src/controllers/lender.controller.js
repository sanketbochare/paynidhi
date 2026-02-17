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
// @desc    Place a Detailed Bid
// @route   POST /api/lender/bid/:invoiceId
export const placeBid = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { 
      loanAmount,      // e.g. 45000
      interestRate,    // e.g. 1.2 (Monthly %)
      processingFee    // e.g. 200
    } = req.body;

    const lenderId = req.user._id;

    // 1. Get Invoice Details (We need the Due Date to calculate tenure)
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    // 2. Calculate Tenure (Days remaining until Due Date)
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining <= 0) {
      return res.status(400).json({ error: "Invoice is already due or overdue. Cannot finance." });
    }

    // 3. 🧮 FINANCIAL MATH (The "Term Sheet")
    // Formula: Interest = Principal * (Rate/100) * (Days/30)
    // Note: Lenders usually quote Monthly rates
    const interestAmount = Math.ceil(loanAmount * (interestRate / 100) * (daysRemaining / 30));
    
    const repaymentAmount = loanAmount + interestAmount;
    const netDisbursement = loanAmount - (processingFee || 0);

    // 4. Create the Bid
    const newBid = await Bid.create({
      invoice: invoiceId,
      lender: lenderId,
      
      loanAmount: loanAmount,
      interestRate: interestRate,
      processingFee: processingFee || 0,
      
      repaymentAmount: repaymentAmount,
      netDisbursement: netDisbursement,
      tenureDays: daysRemaining,

      // 📅 SET EXPIRY TO 1 WEEK (7 Days)
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    });

    // 5. Update Invoice Status
    await Invoice.findByIdAndUpdate(invoiceId, { status: "Pending_Bids" });

    res.status(201).json({
      success: true,
      message: "Bid Placed Successfully!",
      data: newBid,
      breakdown: {
        sellerReceives: netDisbursement,
        sellerPaysBack: repaymentAmount,
        profit: interestAmount + (processingFee || 0)
      }
    });

  } catch (error) {
    console.error("Bidding Error:", error);
    // Handle Duplicate Bid Error
    if (error.code === 11000) {
      return res.status(400).json({ error: "You have already placed a bid on this invoice." });
    }
    res.status(500).json({ error: "Failed to place bid" });
  }
};