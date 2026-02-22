import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp, verifyOtp } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import OtpVerifyCard from "../../components/auth/OtpVerifyCard";
import { ShieldCheck, Camera } from "lucide-react"; // Added Camera for the avatar icon

const RegisterPage = () => {
  const [mode, setMode] = useState("seller");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    companyName: "",
    gstNumber: "",
    businessType: "",
    industry: "",
    annualTurnover: "",
    beneficiaryName: "",
    lenderType: "", // Added for lender
    lenderLicense: "", // Added for lender
  });
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isSeller = mode === "seller";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate Core Fields
    if (!form.email || !form.password || !form.companyName) {
      toast.error("Fill required core fields");
      setIsLoading(false);
      return;
    }

    // Validate specific fields based on mode
    if (isSeller && !form.gstNumber) {
      toast.error("GST Number is required for Sellers");
      setIsLoading(false);
      return;
    }

    if (!isSeller && (!form.lenderType || !form.lenderLicense || !form.gstNumber)) {
      toast.error("Type, License, and GSTIN are required for Lenders");
      setIsLoading(false);
      return;
    }

    try {
      await requestOtp({ email: form.email, purpose: "register" });
      toast.success("✅ Verification code sent to your email");
      setStep(2);
    } catch (err) {
      const msg = err?.error || "Failed to send OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (code) => {
    try {
      // Send different payloads based on mode
      const payload = isSeller ? {
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        gstNumber: form.gstNumber,
        businessType: form.businessType,
        industry: form.industry,
        annualTurnover: Number(form.annualTurnover) || 0,
        beneficiaryName: form.beneficiaryName,
      } : {
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        gstNumber: form.gstNumber,
        lenderType: form.lenderType,
        lenderLicense: form.lenderLicense,
      };

      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("code", code);
      formData.append("purpose", "register");
      formData.append("mode", mode);
      formData.append("payload", JSON.stringify(payload));
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const data = await verifyOtp(formData);

      login(data);
      toast.success("Email verified and account created");

      if (isSeller) {
        navigate("/seller/dashboard", { replace: true });
      } else {
        navigate("/lender/dashboard", { replace: true });
      }
    } catch (err) {
      const msg = err?.error || "Wrong or expired code";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleResendOtp = async () => {
    await requestOtp({ email: form.email, purpose: "register" });
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden">
        <OtpVerifyCard
          email={form.email}
          purpose="register"
          mode={mode}
          onSubmitOtp={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden">
      {/* Animated Background - #47C4B7 color */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#47C4B7]/20 rounded-full blur-3xl animate-bounce-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#47C4B7]/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.1fr_1.2fr] gap-6 lg:gap-10 items-stretch relative z-10">
        
        {/* Left: mini hero - Added #47C4B7 accents */}
        <section className="hidden md:flex flex-col gap-5 border border-slate-200 rounded-2xl shadow-md px-6 py-6 hover:shadow-xl transition-all duration-300 hover:border-[#47C4B7]/30 group">
          <div className="inline-flex items-center gap-3 group/logo">
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-[#47C4B7] to-emerald-500 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(71,196,183,0.45)] group-hover/logo:scale-110 group-hover/logo:-translate-y-0.5 transition-transform duration-300">
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                <ShieldCheck className="text-white w-5 h-5 relative z-10" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-[#47C4B7] bg-clip-text text-transparent">
                PayNidhi
              </span>
              <span className="text-[11px] text-slate-500">
                Business Receivables & Credit
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 leading-snug group-hover:scale-[1.02] transition-transform duration-300">
            Open your{" "}
            <span className="text-[#47C4B7] font-bold">seller</span> or{" "}
            <span className="text-emerald-500">lender</span> account in a few steps.
          </h1>

          <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
            Create a workspace to track payouts, credit utilization, and invoice
            settlements in one secure console designed for finance teams.
          </p>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-xl bg-gradient-to-br from-[#47C4B7]/10 to-emerald-500/10 border border-[#47C4B7]/30 px-3 py-3 shadow-sm hover:scale-105 transition-all duration-200 group/card">
              <div className="text-slate-500 mb-1">Disbursed this month</div>
              <div className="text-lg font-semibold text-[#47C4B7]">₹3.8Cr</div>
              <div className="text-[10px] text-emerald-500 mt-1">
                Across verified partners
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3 shadow-sm flex flex-col justify-between hover:scale-105 transition-all duration-200 group/card">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>On‑time settlements</span>
                <span>96%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-[#47C4B7] to-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Under 48 hours SLA
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            By creating an account, you agree to PayNidhi's{" "}
            <span className="text-[#47C4B7] hover:text-[#47C4B7]/80 font-semibold transition-colors cursor-pointer">Terms</span> and{" "}
            <span className="text-[#47C4B7] hover:text-[#47C4B7]/80 font-semibold transition-colors cursor-pointer">Privacy Policy</span>.
          </p>
        </section>

        {/* Right: form - Added #47C4B7 accents */}
        <section className="w-full">
          <div className="w-full bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur hover:shadow-2xl transition-all duration-300 hover:border-[#47C4B7]/30 px-5 py-6 sm:px-7 sm:py-7">
            
            {/* Top row: title + login link */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="group relative mt-[2px]">
                  <div className="relative bg-gradient-to-br from-[#47C4B7] to-emerald-500 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(71,196,183,0.45)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ShieldCheck className="text-white w-5 h-5 relative z-10" />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Create your PayNidhi account
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                    Register as a seller or lender. We'll verify your email with an OTP.
                  </p>
                </div>
              </div>
            </div>

            {/* Seller / Lender toggle - Enhanced with #47C4B7 */}
            <div className="flex mb-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 p-1.5 shadow-inner hover:shadow-md transition-all duration-200">
              <button
                type="button"
                onClick={() => setMode("seller")}
                className={`flex-1 text-[11px] sm:text-xs font-semibold py-3 px-3 rounded-full transition-all duration-300 relative overflow-hidden group ${
                  isSeller
                    ? "bg-white text-slate-900 shadow-md border-2 border-[#47C4B7]/30 hover:scale-105 hover:shadow-lg"
                    : "text-slate-500 hover:text-[#47C4B7] hover:bg-[#47C4B7]/10 hover:border-[#47C4B7]/20"
                }`}
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => setMode("lender")}
                className={`flex-1 text-[11px] sm:text-xs font-semibold py-3 px-3 rounded-full transition-all duration-300 relative overflow-hidden group ${
                  !isSeller
                    ? "bg-white text-slate-900 shadow-md border-2 border-emerald-400/30 hover:scale-105 hover:shadow-lg"
                    : "text-slate-500 hover:text-[#47C4B7] hover:bg-[#47C4B7]/10 hover:border-[#47C4B7]/20"
                }`}
              >
                Lender
              </button>
            </div>

            {/* Avatar row - Enhanced with #47C4B7 */}
            <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-gradient-to-r from-slate-50/80 to-slate-100/80 rounded-xl border border-[#47C4B7]/20 hover:border-[#47C4B7]/40 hover:shadow-md transition-all duration-200">
              <div className={`h-12 w-12 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center overflow-hidden shadow-sm transition-all hover:scale-110 hover:border-[#47C4B7]/60 cursor-pointer ${avatarPreview ? 'border-[#47C4B7]/50 shadow-[#47C4B7]/10' : ''}`} onClick={() => document.getElementById('avatar-upload').click()}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                  />
                ) : (
                  <Camera className="text-slate-400 w-5 h-5" />
                )}
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <label className="text-[11px] font-semibold text-slate-700 cursor-pointer" htmlFor="avatar-upload">
                  Business logo (optional)
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-[11px] text-slate-500 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#47C4B7]/90 file:text-white hover:file:bg-[#47C4B7] transition-colors hidden"
                />
                <p className="text-[10px] text-slate-400">
                  PNG / JPG, up to 2MB. You can update this later.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-3 text-xs sm:text-sm text-red-500 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-lg px-3 py-2 shadow-sm">
                {error}
              </div>
            )}

            {/* Form - Added #47C4B7 focus states */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Company name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Company name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Work email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                    placeholder="yourname@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>

              {/* DYNAMIC FIELDS: Seller vs Lender */}
              {isSeller ? (
                <>
                  {/* SELLER: GST Number + Beneficiary Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        GST Number
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        required
                        value={form.gstNumber}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200 uppercase tracking-wider"
                        placeholder="27ABCDE1234F1Z5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Beneficiary name
                      </label>
                      <input
                        type="text"
                        name="beneficiaryName"
                        required
                        value={form.beneficiaryName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                        placeholder="Account holder name"
                      />
                    </div>
                  </div>

                  {/* SELLER: Business type + Industry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Business type
                      </label>
                      <select
                        name="businessType"
                        required
                        value={form.businessType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                      >
                        <option value="">Select</option>
                        <option value="Services">Services</option>
                        <option value="Trading">Trading</option>
                        <option value="Manufacturing">Manufacturing</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Industry
                      </label>
                      <select
                        name="industry"
                        required
                        value={form.industry}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                      >
                        <option value="">Select</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                      </select>
                    </div>
                  </div>

                  {/* SELLER: Annual turnover */}
                  <div className="space-y-1.5 relative">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Annual turnover (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#47C4B7] font-bold text-sm">₹</span>
                      <input
                        type="number"
                        name="annualTurnover"
                        value={form.annualTurnover}
                        onChange={handleChange}
                        className="w-full pl-8 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* LENDER: Type + License */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Lender Type
                      </label>
                      <select
                        name="lenderType"
                        required
                        value={form.lenderType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200"
                      >
                        <option value="">Select</option>
                        <option value="Bank">Bank</option>
                        <option value="NBFC">NBFC</option>
                        <option value="Institutional">Institutional</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        RBI License No.
                      </label>
                      <input
                        type="text"
                        name="lenderLicense"
                        required
                        value={form.lenderLicense}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200 uppercase"
                        placeholder="e.g. RBI-12345"
                      />
                    </div>
                  </div>
                  {/* LENDER: GST Number */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Corporate GST Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      required
                      value={form.gstNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#47C4B7]/70 hover:border-slate-300 transition-all duration-200 uppercase tracking-wider"
                      placeholder="27ABCDE1234F1Z5"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-[#47C4B7] to-emerald-500 text-white text-sm font-semibold py-2.5 shadow-[0_14px_30px_rgba(71,196,183,0.45)] hover:shadow-[0_20px_40px_rgba(71,196,183,0.6)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Continue & verify email"
                )}
              </button>
              
              {/* Mobile login text */}
              <p className="sm:hidden text-[11px] text-slate-500 mb-3 text-center">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#47C4B7] font-semibold hover:text-[#47C4B7]/80 transition-colors"
                >
                  Log in
                </button>
              </p>
              <div className="hidden sm:block text-[11px] text-slate-500 text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#47C4B7] font-semibold hover:text-[#47C4B7]/80  px-2 py-1 rounded-lg hover:bg-[#47C4B7]/20 transition-all duration-200"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default RegisterPage;