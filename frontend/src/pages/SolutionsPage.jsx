// frontend/src/pages/SolutionsPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  IndianRupee,
  LineChart,
  Building2,
  ShieldCheck,
  Users2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-20 space-y-16 lg:space-y-20">
        {/* HERO */}
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 border border-slate-200 dark:border-slate-800">
            <Sparkles size={14} className="text-indigo-500" />
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300">
              PayNidhi solutions
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-tight">
            AI‑driven invoice finance
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">
              built on documents, data and trust.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            PayNidhi combines AI‑OCR, three‑way matching and the PayNidhi Score to turn raw invoices and POs into
            trusted, finance‑ready assets—so MSMEs and lenders can move from manual entry to intelligent capital.
          </p>
        </section>

        {/* HIGH‑LEVEL OVERVIEW */}
        <section className="space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-500">
            At a glance
          </p>
          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                AI‑OCR powered intake
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Gemini‑class AI reads invoices, POs and statements, turning documents into structured data.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Three‑way matching trust layer
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Buyer + MSME + PO logic validates what was ordered, invoiced and financed.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                PayNidhi Score
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                GST signals, buyer rating and repayment speed combined into a single, lender‑grade score.
              </p>
            </div>
          </div>
        </section>

        {/* SOLUTION 1: AI‑OCR INTEGRATION (GEMINI) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <LineChart size={20} className="text-teal-500" />
            <h2 className="text-xl sm:text-2xl font-bold">
              1. AI‑OCR Invoice & PO Extraction (Gemini‑powered)
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            PayNidhi plugs into your existing workflows and uses Gemini‑class AI‑OCR to read invoices, purchase
            orders and supporting documents—eliminating manual data entry and reducing errors before financing.
          </p>

          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                What AI‑OCR captures
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Invoice details: buyer, seller, GSTINs, invoice number, date and line items.</li>
                <li>Financials: taxable value, tax components, total amount, due date and currency.</li>
                <li>PO data: PO number, ordered quantities, agreed rates, delivery terms.</li>
                <li>Supporting docs: e‑way bills, GRNs and signatures where available.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Why it matters
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Removes repetitive, manual key‑in for finance teams.</li>
                <li>Standardises data for the PayNidhi Score and lender systems.</li>
                <li>Reduces mismatch risk before credit decisions are even made.</li>
                <li>Makes onboarding faster for both MSMEs and lenders.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SOLUTION 2: THREE‑WAY MATCHING TRUST LAYER */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-bold">
              2. Three‑Way Matching Trust Layer (Buyer × MSME × PO)
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            Before an invoice is financed, PayNidhi runs a three‑way match between the purchase order, the invoice
            and the MSME’s records—building a trust layer that reduces disputes and gives lenders confidence.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Buyer dimension
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Checks if the buyer, GSTIN and billing details match the PO and past behaviour.</li>
                <li>Verifies typical order size, frequency and historical payment patterns.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                MSME dimension
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Confirms that the MSME has recognised the sale in its GST and books.</li>
                <li>Validates that quantities, pricing and tax treatment are consistent.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                PO & fulfilment dimension
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Matches what was ordered (PO) with what was invoiced and shipped.</li>
                <li>Flags partial deliveries, over‑billing or unusual adjustments for review.</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
            This trust layer is what differentiates PayNidhi from a generic lending form: every financed invoice
            is anchored to a real buyer, a real PO and a real fulfilment trail.
          </p>
        </section>

        {/* SOLUTION 3: PAYNIDHI SCORE (GST + BUYER RATING + REPAYMENT SPEED) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <LineChart size={20} className="text-indigo-500" />
            <h2 className="text-xl sm:text-2xl font-bold">
              3. The PayNidhi Score
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            The PayNidhi Score turns raw operational data into a single, lender‑grade view of risk for each MSME
            and invoice pool—built from the signals that actually matter in Indian B2B trade.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                GST behaviour
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Consistency of GST filings and reported turnover over time.</li>
                <li>Match between invoice patterns and declared sales.</li>
                <li>Sector and seasonality context for reported revenues.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Buyer rating
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Historical on‑time payment ratio for each buyer.</li>
                <li>Average delay days and dispute frequency on past invoices.</li>
                <li>Concentration risk: how much exposure sits with a few large buyers.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Repayment speed
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Time from invoice date to actual repayment across cycles.</li>
                <li>Behaviour under stress: how the MSME behaves in tight months.</li>
                <li>Trend line: improving, stable or deteriorating repayment patterns.</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
            Lenders can plug the PayNidhi Score into their own models, while MSMEs get a transparent sense of what
            is driving their financing capacity and how to improve it.
          </p>
        </section>

        {/* CLASSIC INVOICE FINANCE LINE (BUILT ON TOP OF THE ABOVE) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <IndianRupee size={20} className="text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-bold">
              4. Invoice Finance Line (on top of AI‑OCR + Trust + Score)
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            Once documents are extracted by AI‑OCR, validated by three‑way matching and scored by PayNidhi, MSMEs
            can access a flexible credit line linked to their approved invoices.
          </p>

          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                For MSMEs
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Draw down against eligible invoices as and when you need working capital.</li>
                <li>Keep existing banking relationships; use PayNidhi as an additional rail.</li>
                <li>Align repayments with actual customer payment dates and cycles.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                For lenders
              </h3>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Underwrite against verified, matched and scored receivables.</li>
                <li>Configure limits, pricing and covenants based on PayNidhi data.</li>
                <li>Monitor performance over time at MSME, buyer and invoice‑pool level.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* WHO BENEFITS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users2 size={18} className="text-indigo-500" />
            <h2 className="text-xl sm:text-2xl font-bold">
              Built for finance, ops and credit teams.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            Each layer—AI‑OCR, three‑way matching and the PayNidhi Score—is designed to remove manual work for MSMEs
            while giving credit and risk teams a clearer, more defensible view of every rupee financed.
          </p>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              See these layers in action on your invoices.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Share sample invoices, POs and buyer details, and we’ll walk you through how AI‑OCR, three‑way
              matching and the PayNidhi Score can change your working‑capital options.
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

export default SolutionsPage;
