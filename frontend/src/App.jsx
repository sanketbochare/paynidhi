// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SolutionsPage from './pages/SolutionsPage';
import MarketplacePage from './pages/MarketplacePage';
import TrustScorePage from './pages/TrustScorePage';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/trustscore" element={<TrustScorePage />} /> 
      </Routes>
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
