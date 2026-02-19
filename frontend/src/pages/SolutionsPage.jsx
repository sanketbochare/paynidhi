// frontend/src/pages/SolutionsPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  IndianRupee,
  LineChart,
  ShieldCheck,
  Users2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-20 space-y-14 lg:space-y-16">
        {/* HERO */}
        <section className="space-y-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 border border-slate-200 dark:border-slate-800">
            <Sparkles size={14} className="text-indigo-500" />
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300">
              PayNidhi solutions
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-tight">
            AI‑driven invoice finance
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">
              that feels simple to use.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Instead of long forms and spreadsheets, PayNidhi wraps AI‑OCR, a three‑way matching trust layer and the
            PayNidhi Score into three clear blocks any MSME or lender can understand in a minute.
          </p>
        </section>

        {/* MAIN 3 CARDS – BIG, SIMPLE, RESPONSIVE */}
        <section className="grid gap-5 md:grid-cols-3">
          {/* CARD 1: AI‑OCR */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-5 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/60 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <LineChart size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                  AI‑OCR intake
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Step 1
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Gemini‑powered reading of invoices and POs
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Upload or sync invoices and POs; PayNidhi auto‑fills buyer, GSTIN, dates, line items, tax and totals so
              finance teams don’t have to type everything again.
            </p>

            {/* tiny “preview” row */}
            <div className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
              <span>INV‑0923 · Buyer A</span>
              <span className="text-emerald-500">GSTIN ✓ · PO linked</span>
            </div>
          </div>

          {/* CARD 2: TRUST LAYER */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-5 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/60 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                  Trust layer
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Step 2
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Three‑way matching: Buyer × MSME × PO
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              PayNidhi checks that what was ordered, invoiced and actually fulfilled match up, so each financed
              invoice is tied to a real PO and delivery.
            </p>

            <div className="mt-1 grid grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 px-2 py-1.5">
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-50">Buyer</p>
                <p>GSTIN, history</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 px-2 py-1.5">
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-50">MSME</p>
                <p>Books, GST</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 px-2 py-1.5">
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-50">PO</p>
                <p>Qty, value</p>
              </div>
            </div>
          </div>

          {/* CARD 3: PAYNIDHI SCORE */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-5 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/60 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <LineChart size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                  PayNidhi Score
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Step 3
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              GST × buyer rating × repayment speed
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              A single score that explains, in plain language, why an MSME and a set of invoices deserve a certain
              limit and price.
            </p>

            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Score: A‑ (stable)</span>
              <span className="text-emerald-500">Limit adjusts as data updates</span>
            </div>
          </div>
        </section>

        {/* SIMPLE “HOW IT WORKS” ROW */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 text-[11px] sm:text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              1 · Upload
            </span>
            <span className="text-slate-500 dark:text-slate-400">Invoices, POs, GST docs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              2 · Verify
            </span>
            <span className="text-slate-500 dark:text-slate-400">Three‑way match + PayNidhi Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              3 · Finance
            </span>
            <span className="text-slate-500 dark:text-slate-400">Limit and offers on trusted invoices</span>
          </div>
        </section>

        {/* TWO SHORT DETAIL BLOCKS – EASY TEXT */}
        <section className="grid gap-6 md:grid-cols-2 text-sm">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold">
              For MSMEs
            </h2>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
              <li>Use existing invoices to unlock working capital without changing your main bank.</li>
              <li>See, in one place, which buyers are strong and which slow you down.</li>
              <li>Plan salaries, vendor payments and purchases on more predictable cash‑flows.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold">
              For lenders
            </h2>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
              <li>Review AI‑extracted documents, trust checks and scores instead of raw PDFs.</li>
              <li>Filter by MSME, buyer or invoice‑pool to shape portfolios the way you want.</li>
              <li>Plug the PayNidhi Score into your own models if you prefer.</li>
            </ul>
          </div>
        </section>

        {/* SMALL “LIMIT SNAPSHOT” CARD – VISUAL */}
        <section className="rounded-3xl bg-slate-900 text-slate-50 border border-slate-800 px-4 py-4 sm:px-5 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs sm:text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Example snapshot
            </p>
            <p className="mt-1 text-sm sm:text-base font-semibold">
              How PayNidhi can change one MSME’s day
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-1">
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-3 py-2">
              <p className="text-[11px] text-slate-400">Live invoices</p>
              <p className="text-sm font-semibold">₹42.5L</p>
              <p className="text-[11px] text-slate-400">18 in cycle</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-3 py-2">
              <p className="text-[11px] text-slate-400">Eligible capital</p>
              <p className="text-sm font-semibold text-emerald-400">Up to ₹30L</p>
              <p className="text-[11px] text-slate-400">Linked to PayNidhi Score</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-3 py-2">
              <p className="text-[11px] text-slate-400">Score</p>
              <p className="text-sm font-semibold">A+</p>
              <p className="text-[11px] text-slate-400">Stable trend</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Try it on a few real invoices.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Share 3–5 sample invoices and buyer names, and we’ll show you, in a simple view, how AI‑OCR,
              three‑way matching and the PayNidhi Score would look for your business.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            Talk to our team
            <ArrowRight className="ml-1" size={16} />
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SolutionsPage;
