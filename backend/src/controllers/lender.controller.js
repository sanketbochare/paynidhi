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
    // 1. Get Params from URL
    const { invoiceId } = req.params; 
    
    // 2. Get Data from Body
    const { 
      loanAmount,      // e.g. 80000
      interestRate,    // e.g. 1.5 (Monthly %)
      processingFee,   // e.g. 1000
      tenureDays       // Optional override, otherwise calculated from Due Date
    } = req.body;

    const lenderId = req.user._id;

    // 3. Validate Invoice
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    // 4. Calculate Tenure (Days until Due Date)
    // If tenure is not provided, calculate it based on today vs due date
    let calculatedTenure = tenureDays;
    if (!calculatedTenure) {
        const today = new Date();
        const dueDate = new Date(invoice.dueDate);
        const timeDiff = dueDate.getTime() - today.getTime();
        calculatedTenure = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    if (calculatedTenure <= 0) {
      return res.status(400).json({ error: "Invoice is already due. Cannot finance." });
    }

    // 5. 🧮 FINANCIAL MATH (The "Term Sheet")
    // A. Interest = Principal * (MonthlyRate/100) * (Months)
    // We treat 30 days as 1 month standard in finance
    const interestAmount = Math.ceil(loanAmount * (interestRate / 100) * (calculatedTenure / 30));
    
    // B. Total Repayment (What Seller pays back)
    const repaymentAmount = loanAmount + interestAmount;
    
    // C. Net Disbursement (What Seller gets in hand)
    // Loan Amount - Processing Fee
    const netDisbursement = loanAmount - (processingFee || 0);

    // 6. Create the Bid
    const newBid = await Bid.create({
      invoice: invoiceId,
      lender: lenderId,
      
      loanAmount: loanAmount,
      interestRate: interestRate,
      processingFee: processingFee || 0,
      
      // Calculated Fields
      repaymentAmount: repaymentAmount,
      netDisbursement: netDisbursement,
      tenureDays: calculatedTenure,

      // Expiry (7 Days from now)
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    });

    // 7. Update Invoice Status to indicate activity
    await Invoice.findByIdAndUpdate(invoiceId, { status: "Pending_Bids" });

    res.status(201).json({
      success: true,
      message: "Bid Placed Successfully!",
      data: newBid,
      breakdown: {
        loanAmount: loanAmount,
        interest: interestAmount,
        fee: processingFee,
        netDisbursement: netDisbursement, // Seller gets this
        repaymentAmount: repaymentAmount  // Seller pays this
      }
    });

  } catch (error) {
    console.error("Bidding Error:", error);
    // Handle Duplicate Bid Error (MongoDB 11000)
    if (error.code === 11000) {
      return res.status(400).json({ error: "You have already placed a bid on this invoice." });
    }
    res.status(500).json({ error: "Failed to place bid" });
  }
};

// @desc    Get All Active Invoices (Marketplace)
// @route   GET /api/lender/invoices
export const getAllActiveInvoices = async (req, res) => {
    try {
      // Find invoices that are NOT yet financed
      const invoices = await Invoice.find({ 
          status: { $in: ["Verified", "Pending_Bids"] } 
      })
      .populate("seller", "companyName annualTurnover trustScore")
      .sort({ createdAt: -1 });
  
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  };