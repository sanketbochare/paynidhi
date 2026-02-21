// backend/src/routes/sellerDashboard.routes.js
import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getSellerDashboardSummary } from "../controllers/sellerDashboard.controller.js";

const router = Router();

router.get(
  "/seller/dashboard-summary",
  protect,
  authorize("seller"),
  getSellerDashboardSummary
);

export default router;
