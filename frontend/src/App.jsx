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
import LenderDashboard from "./pages/lender/LenderDashboard";
import SellerOnboarding from "./pages/seller/SellerOnboarding";
import LenderOnboarding from "./pages/lender/LenderOnboarding";
import UploadInvoice from "./pages/seller/UploadInvoice";
import SellerSettings from "./pages/seller/SellerSettings";

import KycPage from "./pages/seller/KycPage";
import PublicLayout from "./layouts/PublicLayout";

function App() {
  return (
    <>
      <Routes>
        {/* Public marketing pages (with BackToTop via PublicLayout) */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/solutions"
          element={
            <PublicLayout>
              <SolutionsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/marketplace"
          element={
            <PublicLayout>
              <MarketplacePage />
            </PublicLayout>
          }
        />
        <Route
          path="/trustscore"
          element={
            <PublicLayout>
              <TrustScorePage />
            </PublicLayout>
          }
        />
        <Route
          path="/otp-verify"
          element={
            <PublicLayout>
              <OtpVerifyCard />
            </PublicLayout>
          }
        />

        {/* Auth pages – if you want BackToTop here too, also wrap with PublicLayout */}
        <Route
          path="/login"
          element={
              <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
              <RegisterPage />
          }
        />

        {/* Seller protected area (no BackToTop) */}
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller/onboarding" element={<SellerOnboarding />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/kyc" element={<KycPage />} />
          <Route path="/seller/invoices" element={<UploadInvoice />} />
          <Route path="/seller/settings" element={<SellerSettings />} />
        </Route>

        {/* Lender protected area (no BackToTop) */}
        <Route element={<ProtectedRoute allowedRoles={["lender"]} />}>
          <Route path="/lender/onboarding" element={<LenderOnboarding />} />
          <Route path="/lender/dashboard" element={<LenderDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
