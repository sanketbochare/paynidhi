// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import SolutionsPage from "./pages/SolutionsPage";
import MarketplacePage from "./pages/MarketplacePage";
import TrustScorePage from "./pages/TrustScorePage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import OtpVerifyCard from "./components/auth/OtpVerifyCard";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOnboarding from "./pages/seller/SellerOnboarding";
import UploadInvoice from "./pages/seller/UploadInvoice";
import SellerSettings from "./pages/seller/SellerSettings";
import KycPage from "./pages/seller/KycPage";

// ✅ Import your new Lender pages
import LenderDashboard from "./pages/lender/LenderDashboard";
import LenderOnboarding from "./pages/lender/LenderOnboarding";
import LenderKyc from "./pages/lender/LenderKyc";
// import LenderSettings from "./pages/lender/LenderSettings";

import PublicLayout from "./layouts/PublicLayout";

function App() {
  return (
    <>
      <Routes>
        {/* Public marketing pages */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/solutions" element={<PublicLayout><SolutionsPage /></PublicLayout>} />
        <Route path="/marketplace" element={<PublicLayout><MarketplacePage /></PublicLayout>} />
        <Route path="/trustscore" element={<PublicLayout><TrustScorePage /></PublicLayout>} />
        <Route path="/otp-verify" element={<PublicLayout><OtpVerifyCard /></PublicLayout>} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Seller protected area */}
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller/onboarding" element={<SellerOnboarding />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/kyc" element={<KycPage />} />
          <Route path="/seller/invoices" element={<UploadInvoice />} />
          <Route path="/seller/settings" element={<SellerSettings />} />
        </Route>

        {/* ✅ Lender protected area (Added KYC and Settings here!) */}
        <Route element={<ProtectedRoute allowedRoles={["lender"]} />}>
          <Route path="/lender/onboarding" element={<LenderOnboarding />} />
          <Route path="/lender/dashboard" element={<LenderDashboard />} />
          <Route path="/lender/kyc" element={<LenderKyc />} />
          {/* <Route path="/lender/settings" element={<LenderSettings />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;