// frontend/src/pages/seller/KycPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ShieldCheck, ArrowLeft, Lock, Info } from "lucide-react";

import SellerNav from "../../components/seller/SellerNav";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerFooter from "../../components/seller/SellerFooter";

const API_BASE_URL = "http://localhost:5001";

const KycPage = () => {
  const [step, setStep] = useState(1); // 1: PAN, 2: Bank, 3: Review
  const [form, setForm] = useState({
    panNumber: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    beneficiaryName: "",
  });
  const [loading, setLoading] = useState(false);
  const [kycComplete, setKycComplete] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const isKycComplete = user?.isOnboarded && user?.kycStatus === "verified";

  const handleChange = (e) => {
    const { name, value } = e.target;
    // PAN & IFSC uppercased, others unchanged
    if (name === "panNumber" || name === "ifsc") {
      setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const validateIfsc = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  const handleNext = () => {
    if (step === 1) {
      if (!form.panNumber || !validatePan(form.panNumber)) {
        toast.error("Enter valid PAN number (ABCDE1234F)");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.accountNumber || !form.ifsc || !validateIfsc(form.ifsc)) {
        toast.error("Enter valid account number and IFSC");
        return;
      }
      if (!form.beneficiaryName) {
        setForm((prev) => ({
          ...prev,
          beneficiaryName: user?.companyName || "",
        }));
      }
      setStep(3);
    }
  };

  const handleSubmitKyc = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/seller/complete-kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          panNumber: form.panNumber,
          bankAccount: {
            accountNumber: form.accountNumber,
            ifsc: form.ifsc,
            bankName: form.bankName,
            beneficiaryName: form.beneficiaryName || user?.companyName || "",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "KYC submission failed");
      }

      toast.success("KYC completed successfully. Redirecting to dashboard...");
      setKycComplete(true);

      setTimeout(() => {
        navigate("/seller/dashboard", { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Failed to complete KYC");
    } finally {
      setLoading(false);
    }
  };

  const navigateToKyc = () => {
    // already here, but keeps SellerNav API consistent
    if (!isKycComplete) return;
    navigate("/seller/dashboard");
  };

  // Success full-screen state (kept, but wrapped in layout)
  const renderSuccess = () => (
    <main className="flex-1 overflow-y-auto">
      <div className="min-h-[calc(100vh-4rem-3rem)] flex items-center justify-center px-4 py-6 bg-gradient-to-br from-emerald-50 via-emerald-100 to-slate-200">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            KYC Verified!
          </h2>
          <p className="text-slate-600 mb-8 text-sm">
            Your account is now fully verified. Redirecting to your seller
            dashboard.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs px-4 py-2 rounded-full font-semibold">
            <span>✅</span>
            Full platform access unlocked
          </div>
        </div>
      </div>
    </main>
  );

  const renderStepContent = () => (
    <main className="flex-1 overflow-y-auto">
      <div className="min-h-[calc(100vh-4rem-3rem)] flex items-center justify-center px-4 py-6 sm:py-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <div className="w-full max-w-2xl">
          <div className="bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur px-4 py-6 sm:px-8 sm:py-8">
            {/* Top back + badge row */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate("/seller/dashboard")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs px-2.5 py-1.5 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to dashboard</span>
              </button>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
                <Lock size={12} className="text-emerald-600" />
                <span>Bank-grade encryption</span>
              </div>
            </div>

            {/* Title + progress */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Complete financial KYC
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  We securely verify your PAN and bank details to enable
                  invoice financing and settlements to your account.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[11px] text-slate-500">
                  Step {step} of 3
                </p>
                <div className="w-32 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{
                      width:
                        step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-5">
              {/* Left: form steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 mb-2">
                        Permanent Account Number (PAN)
                      </h2>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Enter the registered PAN of your business or
                        proprietor. This will be hashed and stored securely.
                      </p>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                        PAN Number <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={form.panNumber}
                        onChange={handleChange}
                        maxLength={10}
                        autoComplete="off"
                        placeholder="ABCDE1234F"
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/70 outline-none"
                      />
                      <p className="mt-1 text-[10px] text-slate-500">
                        Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
                      </p>
                      {!validatePan(form.panNumber) && form.panNumber && (
                        <p className="mt-1 text-[10px] text-rose-500">
                          Invalid PAN format. Please check again.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full rounded-xl bg-indigo-600 text-white text-sm font-semibold py-2.5 shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    >
                      Continue to bank details
                    </button>
                  </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-sm font-semibold text-slate-900 mb-2">
                          Primary settlement account
                        </h2>
                        <p className="text-[11px] text-slate-500 mb-3">
                          This account will be used for disbursements and
                          repayments linked to your financed invoices.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                          Bank Account Number{" "}
                          <span className="text-amber-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={form.accountNumber}
                          onChange={handleChange}
                          placeholder="123456789012"
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/70 outline-none"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                            IFSC Code{" "}
                            <span className="text-amber-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="ifsc"
                            value={form.ifsc}
                            onChange={handleChange}
                            maxLength={11}
                            placeholder="HDFC0001234"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/70 outline-none"
                          />
                          {!validateIfsc(form.ifsc) && form.ifsc && (
                            <p className="mt-1 text-[10px] text-rose-500">
                              Invalid IFSC format.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={form.bankName}
                            onChange={handleChange}
                            placeholder="HDFC Bank"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/70 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                          Beneficiary Name
                        </label>
                        <input
                          type="text"
                          name="beneficiaryName"
                          value={form.beneficiaryName || user?.companyName || ""}
                          onChange={handleChange}
                          placeholder={user?.companyName || "Beneficiary name"}
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/70 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex-1 rounded-xl bg-indigo-600 text-white text-sm font-semibold py-2.5 shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                      >
                        Review & submit
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-sm font-semibold text-slate-900 mb-2">
                          Review your KYC information
                        </h2>
                        <p className="text-[11px] text-slate-500 mb-3">
                          Confirm that these details match your official
                          bank and tax records before submitting.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">PAN Number</span>
                          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                            {form.panNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Account Number</span>
                          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                            {form.accountNumber
                              ? form.accountNumber
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim()
                              : ""}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">IFSC</span>
                          <span className="font-mono font-semibold bg-slate-100 px-2 py-1 rounded text-slate-900">
                            {form.ifsc}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bank Name</span>
                          <span>{form.bankName || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Beneficiary Name
                          </span>
                          <span>{form.beneficiaryName || user?.companyName}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-2">
                        <Info size={14} className="mt-0.5 text-slate-400" />
                        <div>
                          <p className="mb-1">
                            Your PAN and bank details are hashed and stored
                            using industry-standard encryption.
                          </p>
                          <p>
                            Only regulated lenders and our risk engine will
                            use this information for underwriting and payouts.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      >
                        Edit details
                      </button>
                      <button
                        onClick={handleSubmitKyc}
                        disabled={loading}
                        className="flex-1 rounded-xl bg-indigo-600 text-white text-sm font-semibold py-2.5 shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying…
                          </>
                        ) : (
                          "Submit for verification"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Right: summary card */}
              <aside className="hidden sm:flex flex-col gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em] mb-2">
                    Your business
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.companyName || "Your business on PayNidhi"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {user?.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      CIN / GST linked entity
                    </span>
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Data encrypted at rest
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-semibold text-slate-900">
                      Why we need this
                    </p>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-500">
                    <li>• Verify ownership of the settlement account</li>
                    <li>• Comply with RBI and AML guidelines</li>
                    <li>• Protect against fraud and misuse</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <SellerNav
        activeKey="overview"
        onChange={() => {}}
        isKycComplete={isKycComplete}
        navigateToKyc={navigateToKyc}
      />
      <div className="lg:ml-64 flex flex-col max-h-screen">
        <SellerHeader onLogout={() => navigate("/login")} />
        {kycComplete ? renderSuccess() : renderStepContent()}
        <SellerFooter />
      </div>
    </div>
  );
};

export default KycPage;
