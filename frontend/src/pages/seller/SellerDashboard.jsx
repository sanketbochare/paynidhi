// frontend/src/pages/seller/SellerDashboard.jsx
import React, { useState } from "react";
import SellerNav from "../../components/seller/SellerNav";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerFooter from "../../components/seller/SellerFooter";
import { Plus, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SellerDashboard = () => {
  const [activeKey, setActiveKey] = useState("overview");
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // optionally navigate to /login
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed sidebar */}
      <SellerNav activeKey={activeKey} onChange={setActiveKey} />

      {/* Right side: fixed header + footer, scrollable content */}
      <div className="lg:ml-64 flex flex-col max-h-screen">
        {/* Fixed header */}
        <SellerHeader onLogout={handleLogout} />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Top intro + CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-[0.18em]">
                  Overview
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Working capital snapshot
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
                  Monitor invoices, payouts and limits in a view that matches the rest of your PayNidhi experience.
                </p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 shadow-sm hover:bg-slate-800">
                <Plus size={16} />
                New invoice
              </button>
            </div>

            {/* Simple responsive stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total disbursed"
                value="₹84,25,000"
                helper="+14.2% this month"
              />
              <StatCard
                label="Active credit limit"
                value="₹2.50 Cr"
                helper="Available to draw"
              />
              <StatCard
                label="Invoices under review"
                value="3"
                helper="₹12,40,000 in pipeline"
              />
              <StatCard
                label="Upcoming settlement"
                value="₹5,20,000"
                helper="Due today"
              />
            </section>

            {/* Two-column layout */}
            <section className="grid lg:grid-cols-3 gap-4">
              {/* Recent invoices table placeholder */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Recent invoices
                  </h3>
                  <button className="text-xs font-semibold text-indigo-600">
                    View all
                  </button>
                </div>
                <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center">
                  <p className="text-xs text-slate-500 mb-1">
                    No invoices yet.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Upload your first invoice to unlock offers from institutional lenders.
                  </p>
                  <button className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-600">
                    <ArrowRight size={14} />
                    Upload invoice
                  </button>
                </div>
              </div>

              {/* Right column: trust + checklist */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    Trust score
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Your reliability signal for lenders on PayNidhi.
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">742</p>
                      <p className="text-[11px] text-slate-400">out of 900</p>
                    </div>
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-100 flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-indigo-600">
                        Stable
                      </span>
                    </div>
                  </div>
                  <button className="mt-3 text-[11px] font-semibold text-indigo-600">
                    View how this is calculated
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    Next steps
                  </h4>
                  <ul className="mt-2 space-y-2 text-xs text-slate-500">
                    <li>• Complete KYC and bank details</li>
                    <li>• Add your first set of buyers</li>
                    <li>• Upload invoices to generate offers</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Fixed footer */}
        <SellerFooter />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, helper }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4">
    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em] mb-1">
      {label}
    </p>
    <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
    <p className="mt-1 text-[11px] text-slate-400">{helper}</p>
  </div>
);

export default SellerDashboard;
