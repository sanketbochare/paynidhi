// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Moon, Sun, ShieldCheck, Menu, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handlePrimaryClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role === 'seller') {
      navigate('/seller/dashboard');
    } else if (role === 'lender') {
      navigate('/lender/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300
        ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-white/40 dark:border-slate-800/70 shadow-[0_10px_40px_rgba(15,23,42,0.18)] py-3'
            : 'bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group/logo cursor-pointer"
        >
          <div className="relative bg-gradient-to-br from-[#47C4B7] to-emerald-500 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(71,196,183,0.45)] dark:shadow-[0_10px_30px_rgba(15,23,42,0.8)] group-hover/logo:scale-110 group-hover/logo:-translate-y-0.5 transition-transform duration-300">
            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover/logo:opacity-100 transition-opacity" />
            <ShieldCheck className="text-white w-6 h-6 relative z-10" />
          </div>
          <span className="text-2xl sm:text-[26px] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-50 dark:via-slate-100 dark:to-slate-200">
            Pay
            <span className="text-[#47C4B7] dark:text-[#47C4B7] group-hover/logo:text-emerald-400 transition-colors duration-200">
              Nidhi
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/solutions', label: 'Solutions' },
            { to: '/marketplace', label: 'Marketplace' },
            { to: '/trustscore', label: 'Trust Score' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-[14px] font-semibold text-slate-600 dark:text-slate-300 hover:text-[#47C4B7] dark:hover:text-[#47C4B7] transition-colors group"
            >
              <span>{item.label}</span>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[#47C4B7] to-emerald-500 rounded-full transition-all duration-300 group-hover:w-8" />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="relative p-2.5 text-slate-500 dark:text-slate-400 rounded-full bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-700/70 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all active:scale-90 shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Primary button: Login / Dashboard */}
          <button
            onClick={handlePrimaryClick}
            className="relative group overflow-hidden px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm flex items-center gap-1.5 bg-slate-900/90 dark:bg-slate-900/90 text-white border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.55)] hover:shadow-[0_0_30px_rgba(71,196,183,0.7)] active:scale-95 transition-all"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {isAuthenticated ? 'Dashboard' : 'Log in'}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300 text-[#47C4B7]"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#47C4B7] via-emerald-500 to-[#47C4B7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -inset-10 bg-gradient-to-r from-white/15 via-transparent to-white/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-900 dark:text-slate-100 bg-white/40 dark:bg-slate-900/50 border border-white/60 dark:border-slate-800/80 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-slate-800/80 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-white/50 dark:border-slate-800 px-6 py-6 flex flex-col gap-4 shadow-[0_18px_40px_rgba(15,23,42,0.35)]">
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/solutions', label: 'Solutions' },
            { to: '/marketplace', label: 'Marketplace' },
            { to: '/trustscore', label: 'Trust Score' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-base font-semibold text-slate-800 dark:text-slate-200 flex justify-between items-center border-b border-slate-100/70 dark:border-slate-800/80 pb-3"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
              <span className="h-1.5 w-1.5 rounded-full bg-[#47C4B7]" />
            </Link>
          ))}

          <button
            onClick={() => {
              setIsMenuOpen(false);
              handlePrimaryClick();
            }}
            className="mt-2 w-full bg-gradient-to-r from-[#47C4B7] to-emerald-500 hover:from-emerald-500 hover:to-[#47C4B7] text-white py-3.5 rounded-xl font-semibold text-sm shadow-[0_10px_30px_rgba(71,196,183,0.6)] transition-all"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Log in'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
