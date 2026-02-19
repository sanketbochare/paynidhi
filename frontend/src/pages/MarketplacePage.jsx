import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Banknote, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Globe, 
  Cpu, 
  Plus,
  LineChart
} from 'lucide-react';

const rails = [
  { 
    title: 'Anchor & Vendor Rails', 
    desc: 'Working capital lines for vendor ecosystems linked to blue‑chip buyers.',
    stats: 'Limit: Up to ₹5Cr',
    icon: <Cpu className="text-blue-500 dark:text-blue-400" />
  },
  { 
    title: 'Export Receivable Pools', 
    desc: 'FX‑aware limits for MSMEs billing in USD, EUR and GBP.',
    stats: 'Limit: Up to ₹10Cr',
    icon: <Globe className="text-emerald-500 dark:text-emerald-400" />
  },
  { 
    title: 'GST‑Linked MSME Lines', 
    desc: 'Collateral‑light lines sized on GST turnover and PayNidhi Score.',
    stats: 'Limit: Up to ₹1.5Cr',
    icon: <Banknote className="text-indigo-500 dark:text-indigo-400" />
  }
];

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />

      <main className="relative">
        {/* Soft background accents */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-[-140px] left-1/4 w-[420px] h-[420px] bg-emerald-100/70 blur-[120px] rounded-full dark:bg-emerald-500/10" />
          <div className="absolute bottom-[-140px] right-1/4 w-[420px] h-[420px] bg-indigo-100/70 blur-[120px] rounded-full dark:bg-indigo-500/10" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 sm:pb-24">
          {/* HERO SECTION */}
          <section className="mb-12 sm:mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="h-[1px] w-10 bg-emerald-500" />
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-400">
                  PayNidhi Marketplace
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black tracking-tight leading-[1.05] mb-4 sm:mb-5">
                A lighter way to
                <br className="hidden sm:block" />
                <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">
                  discover capital partners.
                </span>
              </h1>
              
              <p className="max-w-xl text-slate-600 text-sm sm:text-base md:text-[15px] leading-relaxed dark:text-slate-300">
                The PayNidhi marketplace connects MSMEs and institutional lenders on top of the same rails—
                invoices, GST data and the PayNidhi Score—so you see curated programs instead of generic offers.
              </p>
            </motion.div>
          </section>

          {/* HOW MATCHING WORKS STRIP */}
          <section className="mb-10 sm:mb-12">
            <div className="rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur border border-slate-200 px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] sm:text-xs dark:bg-slate-900/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <LineChart size={14} className="text-emerald-500" />
                <span className="font-semibold text-slate-900 dark:text-slate-50">How matching works</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Your buyers, GST behaviour and PayNidhi Score shape which rails and programs are highlighted—so the
                marketplace feels tailored, not noisy.
              </p>
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN – DISCOVERY ENGINE */}
            <div className="lg:col-span-4 space-y-5 sm:space-y-6 lg:sticky lg:top-28">
              <div className="p-5 sm:p-6 md:p-7 bg-white shadow-sm border border-slate-200 rounded-2xl sm:rounded-[1.75rem] dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
                <h3 className="text-base sm:text-lg font-black mb-3 sm:mb-4 text-slate-900 dark:text-slate-50">
                  Discovery engine for capital
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 sm:mb-6 dark:text-slate-300">
                  Lenders on PayNidhi see more than static financials. They see how your invoices behave over time,
                  how buyers pay, and how your GST profile looks in one place.
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    { icon: <Globe size={15} />, label: 'Cross‑border friendly rails' },
                    { icon: <Cpu size={15} />, label: 'AI‑assisted underwriting signals' },
                    { icon: <ShieldCheck size={15} />, label: 'Lender‑ready data room' }
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200"
                    >
                      <span className="text-emerald-500">{item.icon}</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full py-4 sm:py-4.5 bg-slate-900 text-white rounded-2xl sm:rounded-3xl font-black text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-2 sm:gap-3 hover:bg-slate-800 transition-all group mt-2 sm:mt-3 shadow-sm dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
                Get pre‑qualified
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            {/* RIGHT COLUMN – RAIL CARDS */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              {rails.map((rail) => (
                <motion.div
                  key={rail.title}
                  whileHover={{ x: 4 }}
                  className="p-5 sm:p-6 md:p-7 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl sm:rounded-[1.9rem] flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 group hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-lg dark:bg-slate-900/90 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:shadow-xl"
                >
                  <div className="flex gap-4 sm:gap-6 items-start">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-[1.3rem] bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-all shrink-0 dark:bg-slate-800 dark:border-slate-700 dark:group-hover:bg-slate-800/80 dark:group-hover:border-emerald-400/60">
                      {rail.icon}
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-black mb-1 text-slate-900 dark:text-slate-50">
                        {rail.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md dark:text-slate-300">
                        {rail.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 dark:border-slate-700">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1 dark:text-slate-400">
                        Standard limit
                      </p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50">
                        {rail.stats}
                      </p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0 border border-slate-200 group-hover:border-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:border-slate-50">
                      <Plus size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* LENDER STRIP */}
          <section className="mt-12 sm:mt-14 mb-8 sm:mb-10 rounded-3xl bg-white/90 backdrop-blur border border-slate-200 px-4 py-4 sm:px-5 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 dark:bg-slate-900/90 dark:border-slate-800">
            <div>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                For lenders
              </p>
              <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-xl dark:text-slate-200">
                Access MSMEs whose receivables are already digitised, matched and scored. One integration, one
                workflow, multiple programs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-slate-50 px-3 py-1 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                Banks
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                NBFCs
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                Fintech lenders
              </span>
            </div>
          </section>

          {/* FOOTER CTA */}
          <section className="border-t border-slate-200 pt-8 sm:pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 dark:border-slate-800">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Let us map the right rails to your invoices.
            </h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button className="px-6 sm:px-8 py-3 rounded-xl border border-slate-300 bg-white font-bold text-[11px] sm:text-xs uppercase tracking-[0.22em] text-slate-800 hover:bg-slate-50 transition-all dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                Partner with us
              </button>
              <button className="px-6 sm:px-8 py-3 rounded-xl bg-slate-900 text-white font-black text-[11px] sm:text-xs uppercase tracking-[0.22em] hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
                Access marketplace
                <Zap size={14} />
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketplacePage;
