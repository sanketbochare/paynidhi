// frontend/src/pages/AboutPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  Users2,
  Building2,
  IndianRupee,
  LineChart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-20 space-y-16 lg:space-y-20">
        {/* HERO – LEFT COPY / RIGHT VISUAL STRIP */}
        <section className="relative">
          {/* soft gradient glow */}
          <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-10 bg-gradient-to-br from-indigo-500/5 via-emerald-500/8 to-transparent blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr,0.85fr] items-center">
            {/* Left */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 border border-slate-200 dark:border-slate-800">
                <Sparkles size={14} className="text-indigo-500" />
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300">
                  About PayNidhi
                </p>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-tight">
                Working capital
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">
                  built around MSME invoices.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                PayNidhi helps MSMEs turn pending invoices into reliable working capital using GST and payment data,
                so finance teams can plan payouts, inventory and growth with more certainty, not more collateral.
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                We act as infrastructure between businesses and lenders—standardising data, risk and workflows so
                both sides can work together with less friction and more trust.
              </p>
            </div>

            {/* Right – image + small stat cards stacked */}
            <div className="space-y-4">
              <div className="w-full flex justify-center lg:justify-end">
                <img
                    src="/finance.svg"
                    alt="Finance professional reviewing invoice analytics"
                    className="w-full h-auto object-contain"
                  />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 text-xs sm:text-sm">
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2.5 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Live receivables
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">₹42.5L</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    18 invoices in cycle
                  </p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2.5 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Eligible capital
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">Up to ₹30L</p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400">
                    Linked to GST turnover
                  </p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2.5 flex items-center gap-2 shadow-sm">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      PayNidhi Score
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-200">
                      GST × buyer rating × repayment speed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline strip */}
          <div className="relative hidden sm:flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-6">
            <div className="flex items-center gap-2">
              <span className="relative">
                <span className="absolute inset-[-4px] rounded-full bg-emerald-400/40 motion-safe:animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              </span>
              <span>Upload / sync invoices</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 dark:from-slate-700 via-slate-200 dark:via-slate-800 to-slate-300 dark:to-slate-700 mx-3" />
            <div className="flex items-center gap-2">
              <span className="relative">
                <span className="absolute inset-[-4px] rounded-full bg-indigo-400/40 motion-safe:animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-indigo-500 inline-block" />
              </span>
              <span>PayNidhi Score generated</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 dark:from-slate-700 via-slate-200 dark:via-slate-800 to-slate-300 dark:to-slate-700 mx-3" />
            <div className="flex items-center gap-2">
              <span className="relative">
                <span className="absolute inset-[-4px] rounded-full bg-teal-400/40 motion-safe:animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-teal-500 inline-block" />
              </span>
              <span>Capital offer shared</span>
            </div>
          </div>
        </section>

        {/* WHAT WE DO – BENTO STYLE */}
        <section className="space-y-6 pt-8 border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-500">
                What PayNidhi does
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">
                Turning receivables into a predictable capital line.
              </h2>
            </div>
            <div className="inline-flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                Invoice‑first rails
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                PayNidhi Score
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                Multi‑lender marketplace
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            PayNidhi connects invoice‑heavy MSMEs to institutional lenders through a single, standardised flow.
            Instead of one‑off, paper‑heavy loans, we enable repeatable, invoice‑linked working capital that fits
            into existing finance operations.
          </p>

          <div className="grid gap-5 md:grid-cols-2 text-sm">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <IndianRupee size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  Receivables → live capacity
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                Finance teams see, in one view, which invoices and buyers can convert into limits over the next
                few weeks—without disturbing core banking lines.
              </p>
              <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <p className="text-slate-500 dark:text-slate-400">Live receivables mapped</p>
                  <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-50">
                    By buyer &amp; ageing
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <p className="text-slate-500 dark:text-slate-400">Limit insight</p>
                  <p className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    “If funded, what changes?”
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-9 w-9 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <LineChart size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  One view for lenders
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                Lenders get a clean, exportable view of invoices, GST, buyers and PayNidhi Score—so product,
                risk and business teams are all looking at the same picture.
              </p>
              <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <p className="text-slate-500 dark:text-slate-400">Structured data room</p>
                  <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-50">
                    GST × invoices × buyers
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <p className="text-slate-500 dark:text-slate-400">Plug into programs</p>
                  <p className="mt-0.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    Anchor, export, GST‑linked
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW PAYNIDHI IS BUILT – 3 CARDS */}
        <section className="space-y-5 pt-8 border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-500">
                How PayNidhi is built
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">
                Infrastructure for invoice‑linked capital.
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Product decisions are driven by how invoices flow, not just by where balance sheets sit.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 text-sm">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <IndianRupee size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  Revenue‑linked limits
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                Limits grow with GST‑reported turnover and invoice volumes, keeping capital aligned with how the
                business is actually performing.
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Designed to move in step with your books, not your last collateral document.
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <LineChart size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  Behaviour‑based risk
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                PayNidhi Score blends repayment history, buyer concentration, sectors and cycles into an evolving
                signal—not a one‑time rating.
              </p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400">
                Every cycle of invoices updates the view, for MSMEs and lenders.
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Building2 size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  Multi‑lender rails
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                Banks, NBFCs and fintech lenders plug into one integration and one MSME workflow, instead of building
                separate rails each time.
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                The same data room can power multiple programs on the marketplace.
              </p>
            </div>
          </div>
        </section>


        {/* TRUST & CTA ROW – SIMPLE */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] pt-8 border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-bold">Trust, security and compliance</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
              As an infrastructure layer, PayNidhi is designed with strong encryption, consent‑driven data access
              and clear auditability, so clients and partners understand how information flows across the platform.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3 text-sm shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Next steps
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Share a snapshot of your receivables, credit terms and key buyers, and our team will outline how
              PayNidhi can fit into your existing finance stack.
            </p>
            <button className="mt-1 inline-flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg self-start">
              Talk to our team
              <ArrowRight className="ml-1" size={16} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
