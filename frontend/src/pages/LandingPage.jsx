// frontend/src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardPreview from '../components/DashboardPreview';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  IndianRupee,
  Building2,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  ArrowDownRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-20 lg:pb-28">
        {/* HERO + DASHBOARD */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* HERO LEFT */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-xl shadow-sm mb-6">
              <Zap size={16} className="text-emerald-500" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Invoice Financing for MSMEs · Get paid in under 24 hours
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-4xl font-black tracking-tight leading-tight mb-4">
              Turn your unpaid invoices
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 mt-1">
                into instant working capital.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              PayNidhi unlocks <span className="font-semibold text-emerald-600 dark:text-emerald-400">70–80% of invoice value</span>{' '}
              for GST‑registered MSMEs so you can pay vendors, salaries, and accept bigger orders—without waiting 30–90 days
            </p>

            {/* Hero stats strip */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
              <div className="rounded-2xl px-3 py-3 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
                <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock size={14} /> Avg. disbursal
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  &lt; 24 hours
                </p>
              </div>
              <div className="rounded-2xl px-3 py-3 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
                <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <IndianRupee size={14} /> Funding range
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  ₹5L – ₹5Cr
                </p>
              </div>
              <div className="rounded-2xl px-3 py-3 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
                <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Users size={14} /> MSMEs onboarded
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  5,000+
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white px-8 py-3.5 text-sm sm:text-base font-semibold shadow-[0_16px_40px_rgba(15,23,42,0.35)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Start as MSME Seller
                <ArrowRight size={18} />
              </button>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 px-8 py-3.5 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Explore Lender Marketplace
              </button>
            </div>

            {/* Short benefit bullets */}
            <ul className="mt-6 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                No collateral, no long paperwork—funding based on invoice & GST data.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Flexible: finance only the invoices you choose, when you need it. [web:107]
              </li>
            </ul>
          </motion.section>

          {/* HERO RIGHT: Dashboard */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex justify-center"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-indigo-500/20 blur-3xl rounded-[40px] dark:opacity-80" />
            <DashboardPreview />
          </motion.section>
        </div>

       
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
