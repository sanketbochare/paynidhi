// backend/src/controllers/sellerDashboard.controller.js
import Invoice from "../models/Invoice.model.js";
import Seller from "../models/Seller.model.js";

export const getSellerDashboardSummary = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1) Basic seller info
    const seller = await Seller.findById(sellerId).select(
      "trustScore walletBalance isOnboarded"
    );

    // 2) All invoices for this seller
    const invoices = await Invoice.find({ seller: sellerId });

    // Basic derived metrics
    const totalFinanced = invoices
      .filter((inv) => inv.status === "Financed")
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const invoicesUnderReview = invoices.filter(
      (inv) => inv.status === "Verified" || inv.status === "Pending_Bids"
    ).length;

    const pipelineAmount = invoices
      .filter(
        (inv) => inv.status === "Verified" || inv.status === "Pending_Bids"
      )
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const upcomingSettlementAmount = invoices
      .filter(
        (inv) =>
          inv.status === "Financed" &&
          inv.dueDate &&
          inv.dueDate >= new Date()
      )
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    // status breakdown (for pie chart)
    const invoiceStatusCounts = invoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {});

    // financed amount per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const financedByMonthAgg = await Invoice.aggregate([
      {
        $match: {
          seller: sellerId,
          status: "Financed",
          invoiceDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$invoiceDate" },
            month: { $month: "$invoiceDate" },
          },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const financedByMonth = financedByMonthAgg.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      totalAmount: item.totalAmount,
    }));

    // top buyers by financed amount
    const topBuyersAgg = await Invoice.aggregate([
      {
        $match: {
          seller: sellerId,
          status: "Financed",
        },
      },
      {
        $group: {
          _id: "$buyerName",
          totalFinanced: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalFinanced: -1 } },
      { $limit: 5 },
    ]);

    const topBuyers = topBuyersAgg.map((b) => ({
      buyerName: b._id,
      totalFinanced: b.totalFinanced,
    }));

    res.json({
      trustScore: seller?.trustScore || 0,
      walletBalance: seller?.walletBalance || 0,
      isOnboarded: !!seller?.isOnboarded,

      totalFinanced,
      invoicesUnderReview,
      pipelineAmount,
      upcomingSettlementAmount,

      invoiceStatusCounts,
      financedByMonth,
      topBuyers,
    });
  } catch (err) {
    console.error("Seller dashboard summary error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
