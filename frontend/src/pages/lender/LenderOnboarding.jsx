// frontend/src/pages/lender/LenderOnboarding.jsx
import React from "react";

const LenderOnboarding = () => {
  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
        Complete your lender profile
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Tell us your ticket sizes, sectors and risk preferences to start seeing qualified MSMEs.
      </p>
      {/* Replace this with your actual onboarding form */}
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-sm text-slate-500 dark:text-slate-400">
        Lender onboarding form goes here.
      </div>
    </div>
  );
};

export default LenderOnboarding;
