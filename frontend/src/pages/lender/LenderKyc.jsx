import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Info,
  IdCard,
  Banknote,
  User,
} from "lucide-react";

import LenderNav from "../../components/lender/LenderNav";
import LenderHeader from "../../components/lender/LenderHeader";
import SellerFooter from "../../components/seller/SellerFooter";

const API_BASE_URL = "http://localhost:5001";

const LenderKyc = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    aadhaarNumber: "",
    panNumber: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [loading, setLoading] = useState(false);
  const [kycComplete, setKycComplete] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); 

  const { user, login } = useAuth();
  const navigate = useNavigate();

  const isKycComplete = Boolean(user?.isOnboarded && user?.kycStatus === "verified");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "panNumber") {
      setForm((prev) => ({ ...prev, panNumber: value.toUpperCase() }));
    } else if (name === "ifscCode") {
      setForm((prev) => ({ ...prev, ifscCode: value.toUpperCase() }));
    } else if (name === "aadhaarNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 12);
      setForm((prev) => ({ ...prev, aadhaarNumber: cleaned }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const validateIfsc = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  const validateAadhaar = (val) => /^\d{12}$/.test(val);

  const handleNext = () => {
    if (step === 1) {
      if (!form.name.trim()) {
        toast.error("Enter full name as per PAN/Aadhaar");
        return;
      }
      if (!validateAadhaar(form.aadhaarNumber)) {
        toast.error("Enter valid Aadhaar number (12 digits)");
        return;
      }
      if (!form.panNumber || !validatePan(form.panNumber)) {
        toast.error("Enter valid PAN number (ABCDE1234F)");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.accountNumber.trim()) {
        toast.error("Enter valid bank account number");
        return;
      }
      if (!form.ifscCode || !validateIfsc(form.ifscCode)) {
        toast.error("Enter valid IFSC code");
        return;
      }
      if (!form.bankName.trim()) {
        toast.error("Enter bank name");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitKyc = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/lender/kyc-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          panNumber: form.panNumber,
          aadhaarNumber: form.aadhaarNumber,
          bankAccount: {
            accountNumber: form.accountNumber,
            ifscCode: form.ifscCode,
            bankName: form.bankName,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "KYC verification failed");
      }

      toast.success("KYC verified successfully!");
      
      // Update context with new KYC status so sidebar unlocks immediately
      login({ ...user, isOnboarded: true, kycStatus: "verified" });
      
      setKycComplete(true);
      setJustCompleted(true);
      setIsEditing(false); 
      
    } catch (error) {
      toast.error(error.message || "Failed to complete KYC");
    } finally {
      setLoading(false);
    }
  };

  const navigateToDashboard = () => {
    if (!isKycComplete && !justCompleted) return;
    navigate("/lender/dashboard");
  };

  const renderSuccess = () => (
    <main className="flex-1 overflow-y-auto">
      <div className="min-h-[calc(100vh-4rem-3rem)] flex items-center justify-center px-4 pt-6 pb-28 sm:pb-6 bg-gradient-to-br from-[#0f8f79]/5 via-emerald-50/30 to-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-emerald-100/60 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-[#0f8f79]"></div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-[#0f8f79]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100/50">
            <ShieldCheck className="h-10 w-10 text-[#0f8f79]" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
            KYC Verified
          </h2>
          <p className="text-slate-500 mb-6 text-[13px] leading-relaxed max-w-[90%] mx-auto">
            Your corporate identity and treasury details are verified. You have full access to the investor dashboard.
          </p>
          
          <div className="inline-flex items-center gap-2 bg-emerald-50/80 text-emerald-700 text-[12px] px-4 py-2.5 rounded-xl font-semibold mb-8 border border-emerald-200/50 shadow-sm">
            <span className="flex items-center justify-center bg-emerald-200/50 rounded-full w-5 h-5 text-[10px]">✅</span>
            <span>All investor features unlocked</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* ✅ FIXED: Removed window.location.reload() for smooth SPA transition */}
            <button
              onClick={() => navigate("/lender/dashboard", { replace: true })}
              className="flex-1 px-5 py-2.5 bg-[#0f8f79] text-white text-sm font-semibold rounded-xl hover:bg-[#0c6b5f] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setJustCompleted(false);
                setStep(1); 
              }}
              className="flex-1 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 hover:border-slate-300"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </main>
  );

  const renderStepContent = () => (
    <main className="flex-1 overflow-y-auto">
      <div className="min-h-[calc(100vh-4rem-3rem)] flex items-center justify-center px-4 pt-6 pb-28 sm:pb-10 bg-gradient-to-br from-[#0f8f79]/5 via-slate-50 to-slate-100">
        <div className="w-full max-w-5xl">
          <div className="bg-white/95 border border-slate-200 rounded-3xl shadow-2xl backdrop-blur px-4 py-6 sm:px-10 sm:py-8">
            <div className="flex items-start justify-between mb-4 gap-3">
              <button
                onClick={() => navigate("/lender/dashboard")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs px-2.5 py-1.5 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to dashboard</span>
              </button>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
                <Lock size={12} className="text-[#0f8f79]" />
                <span>Bank‑grade TLS & encryption</span>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-[#0f8f79] uppercase tracking-[0.22em]">
                    Regulatory KYC verification
                  </p>
                  <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                    {isEditing ? "Update your details" : "Verify your corporate identity & treasury"}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-xl">
                    As per RBI & AML guidelines, we are required to validate
                    your PAN, Aadhaar and settlement account before activating
                    full investment access.
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <p className="text-[11px] text-slate-500">Step {step} of 3</p>
                  <div className="w-32 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0f8f79] transition-all"
                      style={{
                        width:
                          step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                      }}
                    />
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                    <Lock size={12} className="text-[#0f8f79]" />
                    <span>Data encrypted at rest</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-[220px_minmax(0,1fr)] gap-6">
                <aside className="hidden sm:flex flex-col gap-4 border-r border-slate-100 pr-4">
                  {[
                    { id: 1, label: "Identity details" },
                    { id: 2, label: "Treasury account" },
                    { id: 3, label: "Review & submit" },
                  ].map((s) => {
                    const active = step === s.id;
                    const completed = step > s.id;
                    return (
                      <div key={s.id} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 h-7 w-7 flex items-center justify-center rounded-full border text-[11px] font-semibold ${
                            active
                              ? "bg-[#0f8f79] text-white border-[#0f8f79]"
                              : completed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          }`}
                        >
                          {completed ? "✓" : s.id}
                        </div>
                        <div>
                          <p
                            className={`text-[12px] font-semibold ${
                              active ? "text-slate-900" : "text-slate-600"
                            }`}
                          >
                            {s.label}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {s.id === 1 && "PAN & Aadhaar verification"}
                            {s.id === 2 && "Settlement account verification"}
                            {s.id === 3 && "Confirm details & submit"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </aside>

                <div className="grid sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-5">
                  <div className="space-y-6">
                    {step === 1 && (
                      <>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-xl bg-[#0f8f79]/10 flex items-center justify-center">
                              <User size={16} className="text-[#0f8f79]" />
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold text-slate-900">
                                Identity details
                              </h2>
                              <p className="text-[11px] text-slate-500">
                                Name, Aadhaar and PAN as per official documents.
                              </p>
                            </div>
                          </div>

                          <label className="block text-[11px] font-semibold text-slate-700 mb-2 mt-3">
                            Full name as per PAN/Aadhaar <span className="text-amber-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter full legal name"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] focus:ring-2 focus:ring-[#0f8f79]/70 outline-none"
                          />

                          <div className="mt-4 grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                                Aadhaar number <span className="text-amber-600">*</span>
                              </label>
                              <input
                                type="text"
                                name="aadhaarNumber"
                                value={form.aadhaarNumber}
                                onChange={handleChange}
                                maxLength={12}
                                placeholder="1234 5678 9012"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] focus:ring-2 focus:ring-[#0f8f79]/70 outline-none"
                              />
                              {!validateAadhaar(form.aadhaarNumber) &&
                                form.aadhaarNumber && (
                                  <p className="mt-1 text-[10px] text-rose-500">
                                    Aadhaar must be 12 digits.
                                  </p>
                                )}
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                                Corporate PAN number <span className="text-amber-600">*</span>
                              </label>
                              <input
                                type="text"
                                name="panNumber"
                                value={form.panNumber}
                                onChange={handleChange}
                                maxLength={10}
                                autoComplete="off"
                                placeholder="ABCDE1234F"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] focus:ring-2 focus:ring-[#0f8f79]/70 outline-none"
                              />
                              {!validatePan(form.panNumber) &&
                                form.panNumber && (
                                  <p className="mt-1 text-[10px] text-rose-500">
                                    Invalid PAN format.
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleNext}
                          className="w-full rounded-xl bg-[#0f8f79] text-white text-sm font-semibold py-3 shadow-lg hover:bg-[#0c6b5f] hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          Continue to bank details
                        </button>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-8 w-8 rounded-xl bg-[#0f8f79]/10 flex items-center justify-center">
                              <Banknote size={16} className="text-[#0f8f79]" />
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold text-slate-900">
                                Treasury bank account
                              </h2>
                              <p className="text-[11px] text-slate-500">
                                This account will be used for deploying capital and receiving settlements.
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                              Bank account number <span className="text-amber-600">*</span>
                            </label>
                            <input
                              type="text"
                              name="accountNumber"
                              value={form.accountNumber}
                              onChange={handleChange}
                              placeholder="Enter account number"
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] focus:ring-2 focus:ring-[#0f8f79]/70 outline-none"
                            />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                                IFSC code <span className="text-amber-600">*</span>
                              </label>
                              <input
                                type="text"
                                name="ifscCode"
                                value={form.ifscCode}
                                onChange={handleChange}
                                maxLength={11}
                                placeholder="HDFC0001234"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] focus:ring-2 focus:ring-[#0f8f79]/70 outline-none"
                              />
                              {!validateIfsc(form.ifscCode) &&
                                form.ifscCode && (
                                  <p className="mt-1 text-[10px] text-rose-500">
                                    Invalid IFSC format.
                                  </p>
                                )}
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-2">
                                Bank name <span className="text-amber-600">*</span>
                              </label>
                              <input
                                type="text"
                                name="bankName"
                                value={form.bankName}
                                onChange={handleChange}
                                placeholder="e.g. State Bank of India"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] focus:ring-2 focus:ring-[#0f8f79]/70 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={() => setStep(1)}
                            className="flex-1 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold py-3 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          >
                            Previous
                          </button>
                          <button
                            onClick={handleNext}
                            className="flex-1 rounded-xl bg-[#0f8f79] text-white text-sm font-semibold py-3 shadow-lg hover:bg-[#0c6b5f] hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                          >
                            Review & submit
                          </button>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-8 w-8 rounded-xl bg-[#0f8f79]/10 flex items-center justify-center">
                              <IdCard size={16} className="text-[#0f8f79]" />
                            </div>
                            <div>
                              <h2 className="text-sm font-semibold text-slate-900">
                                Review your details
                              </h2>
                              <p className="text-[11px] text-slate-500">
                                Confirm that these details match your official
                                records.
                              </p>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Entity Name</span>
                              <span className="font-medium text-slate-900">
                                {form.name || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Aadhaar</span>
                              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                                {form.aadhaarNumber || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">PAN</span>
                              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                                {form.panNumber || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Account number</span>
                              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                                {form.accountNumber ? form.accountNumber.replace(/(.{4})/g, "$1 ").trim() : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">IFSC</span>
                              <span className="font-mono font-semibold bg-slate-100 px-2 py-1 rounded text-slate-900">
                                {form.ifscCode || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Bank name</span>
                              <span>{form.bankName || "-"}</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-2">
                            <Info size={14} className="mt-0.5 text-slate-400" />
                            <div>
                              <p className="mb-1">
                                Your identity and bank data are hashed and
                                stored using industry‑standard encryption.
                              </p>
                              <p>
                                Only authorized smart contracts and our automated 
                                treasury system use this information for payouts.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={() => setStep(2)}
                            className="flex-1 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold py-3 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          >
                            Edit details
                          </button>
                          <button
                            onClick={handleSubmitKyc}
                            disabled={loading}
                            className="flex-1 rounded-xl bg-[#0f8f79] text-white text-sm font-semibold py-3 shadow-lg hover:bg-[#0c6b5f] hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
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

                  {/* Far Right Sidebar Info Box */}
                  <aside className="hidden sm:flex flex-col gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 p-4">
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
                        <span className="px-2 py-1 rounded-full bg-[#0f8f79]/10 text-[#0f8f79] border border-[#0f8f79]/30">
                          RBI‑aligned KYC
                        </span>
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Data encrypted at rest
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-[#0f8f79]" />
                        <p className="text-xs font-semibold text-slate-900">
                          Why we collect this
                        </p>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-500">
                        <li>• Verify legal identity of the entity</li>
                        <li>• Satisfy KYC / AML obligations</li>
                        <li>• Prevent fraud and unauthorized use</li>
                      </ul>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <LenderNav
        activeKey="overview"
        onChange={() => {}}
        isKycComplete={isKycComplete}
        navigateToKyc={navigateToDashboard}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div className="lg:ml-64 flex flex-col max-h-screen">
        <LenderHeader 
          onLogout={() => navigate("/login")} 
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)} 
        />
        {(isKycComplete || justCompleted) && !isEditing ? renderSuccess() : renderStepContent()}
        <SellerFooter />
      </div>
    </div>
  );
};

export default LenderKyc;