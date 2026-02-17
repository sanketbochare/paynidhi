// frontend/src/pages/AboutPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  Users2,
  Target,
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
        {/* HERO: LEFT COPY, RIGHT SVG (NO CARD) */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 border border-slate-200 dark:border-slate-800 mb-4">
              <Sparkles size={14} className="text-indigo-500" />
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300">
                About PayNidhi
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-tight mb-4">
              Working capital
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">
                built around MSME invoices.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              PayNidhi helps MSMEs turn pending invoices into reliable working capital using GST and payment data,
              so finance teams can plan payouts, inventory and growth with more certainty, not more collateral.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We act as infrastructure between businesses and lenders—standardising data, risk and workflows so
              both sides can work together with less friction and more trust.
            </p>
          </div>

          {/* SVG placed directly, no card */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <img
                src="/finance.svg"
                alt="Finance professional reviewing invoice analytics"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* SECTION: WHAT WE DO */}
        <section className="space-y-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-500">
            What PayNidhi does
          </p>
          <h2 className="text-xl sm:text-2xl font-bold">
            Turning receivables into a predictable capital line.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            PayNidhi connects invoice‑heavy MSMEs to institutional lenders through a single, standardised flow.
            Instead of one‑off, paper‑heavy loans, we enable repeatable, invoice‑linked working capital that fits
            into existing finance operations.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                For finance teams
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Plan payouts, purchases and salaries around a clearer view of when invoices can convert into
                capital, not just when customers pay.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                For founders
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Accept larger orders and longer credit terms with more confidence, while preserving existing
                banking relationships and limits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                For lenders
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Access structured, consented MSME data in one place and deploy capital into diversified receivables
                with clearer risk signals.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: MISSION & PRINCIPLES */}
        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-500 mb-2">
              Our mission
            </p>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Make invoice‑based working capital as standard as digital payments.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The goal is not a one‑time cash fix; it is a reliable system where qualified invoices can be funded
              quickly, repeatedly and transparently, so MSMEs can plan instead of react.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              That means clear pricing, predictable timelines and a product that fits into monthly close, not
              outside of it.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              How this shapes the product
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>We start from the MSME’s cash‑flow calendar, not our internal processes.</li>
              <li>We prefer precise, finance‑friendly language over generic fintech buzzwords.</li>
              <li>We expose how we use data and how decisions are made, instead of treating risk as a black box.</li>
              <li>We optimise flows for both founders and lenders, so each side sees what they actually need.</li>
            </ul>
          </div>
        </section>

        {/* SECTION: HOW PAYNIDHI IS BUILT */}
        <section className="space-y-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-500">
            How PayNidhi is built
          </p>
          <h2 className="text-xl sm:text-2xl font-bold">
            Infrastructure for invoice‑linked capital.
          </h2>

          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div className="flex items-start gap-2.5">
              <IndianRupee className="mt-0.5 text-emerald-500" size={18} />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  Revenue‑linked limits
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Limits grow with GST‑reported turnover and invoice volumes, aligning capital with real business
                  performance rather than static collateral.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <LineChart className="mt-0.5 text-teal-500" size={18} />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  Behaviour‑based risk
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  PayNidhi Score blends repayment history, buyer patterns and sectors into a signal that updates
                  with each cycle.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="mt-0.5 text-indigo-500" size={18} />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  Multi‑lender rails
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Banks, NBFCs and fintech lenders connect through one integration and a consistent MSME journey,
                  simplifying operations on both sides.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WHO WE SERVE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users2 size={18} className="text-indigo-500" />
            <h2 className="text-xl sm:text-2xl font-bold">Who we serve</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            PayNidhi is built for MSMEs that sell on credit—manufacturers, distributors, service businesses and
            exporters—and for lenders who want to reach them at scale with better data and controls.
          </p>

          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                MSMEs use PayNidhi to:
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Finance select invoices without disturbing existing banking limits.</li>
                <li>Accept larger, longer‑tenor orders while keeping cash‑flow predictable.</li>
                <li>Align vendor and payroll commitments with expected inflows, not guesses.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Lenders use PayNidhi to:
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>See consented, structured MSME data instead of fragmented documents.</li>
                <li>Underwrite based on recurring invoice behaviour and sector patterns.</li>
                <li>Deploy capital into diversified MSME portfolios with clearer governance.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION: TRUST & SECURITY */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-bold">Trust, security and compliance</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            As an infrastructure layer, PayNidhi is designed with strong encryption, consent‑driven data access
            and clear auditability, so clients and partners understand how information flows across the platform.
          </p>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Explore what your invoices can unlock with PayNidhi.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Share a snapshot of your receivables, credit terms and key buyers, and our team will outline how
              PayNidhi can fit into your existing finance stack.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors">
            Talk to our team
            <ArrowRight className="ml-1" size={16} />
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
