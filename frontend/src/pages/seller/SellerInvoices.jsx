// src/pages/seller/SellerInvoices.jsx
import React from "react";

const SellerInvoices = () => {
  return (
    <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Invoices
        </h2>
        <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          New invoice
        </button>
      </div>
      <div className="border border-dashed rounded-lg border-slate-200 dark:border-slate-800 p-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Invoice list will appear here.
        </p>
      </div>
    </section>
  );
};

export default SellerInvoices;
