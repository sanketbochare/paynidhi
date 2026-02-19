// frontend/src/components/DashboardPreview.jsx
import React from 'react';
import { CheckCircle, ArrowUpRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
  const invoices = [
    { id: 'INV-992', client: 'Reliance Ind.', amt: '₹4.5L', status: 'Verified', color: 'text-emerald-500' },
    { id: 'INV-881', client: 'Tata Motors', amt: '₹1.2L', status: 'Pending', color: 'text-amber-500' },
  ];

  return (
    <div className="relative w-full flex justify-center">
      {/* Top-right floating badge (different position) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="hidden sm:flex absolute -top-4 right-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl z-30 border border-emerald-100 dark:border-emerald-500/40 items-center gap-2 hover:shadow-emerald-100 dark:hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300"
      >
        <div className="bg-emerald-500 p-1.5 rounded-full text-white shadow-md">
          <CheckCircle size={16} />
        </div>
        <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-[0.18em]">
          GST + AI VERIFIED
        </p>
      </motion.div>

      {/* Main card wrapper */}
      <motion.div
        whileHover={{ y: -4 }}
        className="w-full max-w-[420px] bg-white/95 dark:bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl shadow-slate-200 dark:shadow-[0_18px_45px_rgba(15,23,42,0.8)] border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all duration-300"
      >
        {/* Soft background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 opacity-80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:opacity-90" />
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        {/* Row 1: Limit + brief stat */}
        <div className="relative flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">
              MSME LIMIT
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">
              ₹25,00,000
            </h2>
            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              70–80% of unpaid invoices as instant capital.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.07, rotate: 6 }}
            className="h-10 w-10 sm:h-11 sm:w-11 bg-indigo-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-300 shadow-md shadow-indigo-100 dark:shadow-[0_0_20px_rgba(79,70,229,0.55)]"
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>

        {/* Row 2: Mini stats grid (card‑based feel) */}
        <div className="relative grid grid-cols-2 gap-2 mb-4 text-[11px]">
          <div className="rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 px-3 py-2 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-400/60 hover:shadow-md hover:shadow-emerald-50 dark:hover:shadow-[0_0_22px_rgba(16,185,129,0.25)] transition-all duration-300">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
              PayNidhi Score
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-emerald-300">
                762
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">Low risk</span>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 px-3 py-2 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-400/60 hover:shadow-md hover:shadow-indigo-50 dark:hover:shadow-[0_0_22px_rgba(79,70,229,0.35)] transition-all duration-300">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
              Lender Offers
            </p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
              5 live · best rate auto‑picked
            </p>
          </div>
        </div>

        {/* Row 3: Active invoices list – simplified */}
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-2">
          Active Invoices
        </p>

        <div className="space-y-2.5">
          {invoices.map((inv, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4, scale: 1.01 }}
              className="flex justify-between items-center p-3 bg-slate-50/90 dark:bg-slate-900/80 rounded-2xl hover:bg-indigo-50/80 dark:hover:bg-slate-800/90 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md hover:shadow-indigo-50 dark:hover:shadow-[0_0_22px_rgba(79,70,229,0.3)]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm shadow-slate-100 dark:shadow-slate-900/60">
                  <FileText size={16} className="text-slate-400 dark:text-slate-300" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {inv.client}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {inv.id} · GST synced
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-slate-50 text-sm">
                  {inv.amt}
                </p>
                <p
                  className={`${inv.color} text-[9px] font-bold uppercase tracking-[0.25em]`}
                >
                  {inv.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 4: Tiny sparkline‑style growth – very compact */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">
              Weekly Payout
            </p>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              +18% <ArrowUpRight size={10} />
            </span>
          </div>
          <div className="flex items-end gap-1 h-10 bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl px-2 py-1.5 overflow-hidden">
            {[30, 60, 45, 80, 55, 90, 100].map((h, i) => (
              <motion.div
                key={i}
                whileHover={{ scaleY: 1.08 }}
                className="flex-1 bg-gradient-to-t from-indigo-200 via-indigo-400 to-emerald-400 dark:from-slate-700 dark:via-indigo-500 dark:to-emerald-400 rounded-t-md transition-transform duration-200"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPreview;
