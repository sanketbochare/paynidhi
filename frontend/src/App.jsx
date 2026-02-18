// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SolutionsPage from './pages/SolutionsPage';
import MarketplacePage from './pages/MarketplacePage';
import TrustScorePage from './pages/TrustScorePage';
import BackToTop from './components/BackToTop';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';

import SellerDashboard from './pages/seller/SellerDashboard';
import LenderDashboard from './pages/lender/LenderDashboard';
import SellerOnboarding from './pages/seller/SellerOnboarding';
import LenderOnboarding from './pages/lender/LenderOnboarding';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <>

      <Routes>
        {/* Public marketing pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/trustscore" element={<TrustScorePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Seller protected area */}
        <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
          <Route path="/seller/onboarding" element={<SellerOnboarding />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
        </Route>

        {/* Lender protected area */}
        <Route element={<ProtectedRoute allowedRoles={['lender']} />}>
          <Route path="/lender/onboarding" element={<LenderOnboarding />} />
          <Route path="/lender/dashboard" element={<LenderDashboard />} />
        </Route>
      </Routes>

      <BackToTop />
    </>
  );
}

export default App;
