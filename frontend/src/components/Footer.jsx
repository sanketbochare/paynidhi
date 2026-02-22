// frontend/src/components/Footer.jsx
import React from 'react';
import { ShieldCheck, Linkedin, Twitter, Youtube, Instagram, ArrowRight, IndianRupee } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-14">
      {/* Main footer */}
      <div className="mt-10 border-t border-slate-200/70 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          {/* Upper grid */}
          <div className="grid gap-8 md:grid-cols-5">
            {/* Brand + description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative bg-gradient-to-br from-[#47C4B7] to-emerald-500 p-2 rounded-2xl shadow-[0_10px_30px_rgba(71,196,183,0.5)]">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-50 dark:via-slate-100 dark:to-slate-200">
                  Pay
                  <span className="text-[#47C4B7] dark:text-[#47C4B7]">
                    Nidhi
                  </span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
                A modern invoice‑financing layer that helps GST‑registered MSMEs convert receivables into reliable working capital—without extra collateral.
              </p>

              {/* Social row */}
              <div className="mt-4 flex items-center gap-3">
                {[Linkedin, Twitter, Youtube, Instagram].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    aria-label="Social link"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#47C4B7] hover:text-white dark:hover:bg-[#47C4B7] dark:hover:text-slate-950 transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Columns */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400 mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <a href="#solutions" className="hover:text-[#47C4B7] transition-colors">
                    Invoice Financing
                  </a>
                </li>
                <li>
                  <a href="#marketplace" className="hover:text-[#47C4B7] transition-colors">
                    Lender Marketplace
                  </a>
                </li>
                <li>
                  <a href="#trust-score" className="hover:text-[#47C4B7] transition-colors">
                    PayNidhi Trust Score
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400 mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <a href="#about" className="hover:text-[#47C4B7] transition-colors">
                    About PayNidhi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#47C4B7] transition-colors">
                    For Lenders
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#47C4B7] transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400 mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <a href="#" className="hover:text-[#47C4B7] transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#47C4B7] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#47C4B7] transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider + bottom row */}
          <div className="mt-7 border-t border-slate-200/70 dark:border-slate-800/80 pt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Compact CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm w-full sm:w-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 dark:bg-slate-900/70 px-3 py-1">
                <IndianRupee size={14} className="text-[#47C4B7]" />
                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-200">
                  Built for India’s MSMEs
                </span>
              </div>
              <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-100 hover:bg-[#47C4B7]/10 dark:hover:bg-[#47C4B7]/15 hover:text-[#47C4B7] dark:hover:text-[#47C4B7] transition-colors">
                Talk to our team
                <ArrowRight size={14} className="ml-1 text-[#47C4B7]" />
              </button>
            </div>

            {/* Legal */}
            <div className="flex flex-col items-start sm:items-end text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 gap-1">
              <p>© {new Date().getFullYear()} PayNidhi. All rights reserved.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="hover:text-[#47C4B7] transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-[#47C4B7] transition-colors">
                  Terms of Use
                </a>
                <a href="#" className="hover:text-[#47C4B7] transition-colors">
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
