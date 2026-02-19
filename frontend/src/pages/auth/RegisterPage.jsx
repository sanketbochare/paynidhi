// frontend/src/pages/auth/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp, verifyOtp } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import OtpVerifyCard from "../../components/auth/OtpVerifyCard";
import { ShieldCheck } from "lucide-react";

const RegisterPage = () => {
  const [mode, setMode] = useState("seller");
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    gstNumber: "",
    panNumber: "",
    beneficiaryName: "",
    ifsc: "",
    accountNumber: "",
    businessType: "",
    industry: "",
    annualTurnover: "",
    lenderType: "",
    lenderLicense: "",
    maxInvestment: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
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

  // Step 1: submit form -> send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.companyName) {
      toast.error("Fill required fields");
      return;
    }

    try {
      await requestOtp({ email: form.email, purpose: "register" });
      toast.success("Verification code sent to your email");
      setStep(2);
    } catch (err) {
      const msg = err?.error || "Failed to send OTP";
      setError(msg);
      toast.error(msg);
    }
  };

  // Step 2: verify OTP -> create account
  const handleVerifyOtp = async (code) => {
    try {
      const payload = isSeller
        ? {
            email: form.email,
            password: form.password,
            companyName: form.companyName,
            gstNumber: form.gstNumber,
            panNumber: form.panNumber,
            bankAccount: {
              beneficiaryName: form.beneficiaryName,
              ifsc: form.ifsc,
              accountNumber: form.accountNumber,
            },
            businessType: form.businessType,
            industry: form.industry,
            annualTurnover: Number(form.annualTurnover) || 0,
          }
        : {
            email: form.email,
            password: form.password,
            companyName: form.companyName,
            lenderType: form.lenderType,
            lenderLicense: form.lenderLicense,
            bankAccount: {
              beneficiaryName: form.beneficiaryName,
              ifsc: form.ifsc,
              accountNumber: form.accountNumber,
            },
            maxInvestment: Number(form.maxInvestment) || 0,
            address: form.address,
          };

      const data = await verifyOtp({
        email: form.email,
        code,
        purpose: "register",
        mode,
        payload,
      });

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

  // OTP view – same background, centered card
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
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

  // Form view – same vibe as login: hero left, form right
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.1fr_1.2fr] gap-6 lg:gap-10 items-stretch">
        {/* Left: mini hero, matches login tone */}
        <section className="hidden md:flex flex-col gap-5 border border-slate-200 rounded-2xl shadow-md px-6 py-6">
          <div className="inline-flex items-center gap-3">
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.45)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShieldCheck className="text-white w-5 h-5 relative z-10" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900">
                PayNidhi
              </span>
              <span className="text-[11px] text-slate-500">
                Business Receivables & Credit
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 leading-snug">
            Open your{" "}
            <span className="text-indigo-600">seller</span> or{" "}
            <span className="text-emerald-500">lender</span> account in a few steps.
          </h1>

          <p className="text-sm text-slate-500">
            Create a workspace to track payouts, credit utilization, and invoice
            settlements in one secure console designed for finance teams.
          </p>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3 shadow-sm">
              <div className="text-slate-500 mb-1">Disbursed this month</div>
              <div className="text-lg font-semibold text-slate-900">₹3.8Cr</div>
              <div className="text-[10px] text-emerald-500 mt-1">
                Across verified partners
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>On‑time settlements</span>
                <span>96%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Under 48 hours SLA
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            By creating an account, you agree to PayNidhi&apos;s{" "}
            <span className="text-indigo-500">Terms</span> and{" "}
            <span className="text-indigo-500">Privacy Policy</span>.
          </p>
        </section>

        {/* Right: wide, responsive form – no internal scroll */}
        <section className="w-full">
          <div className="w-full bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur px-5 py-6 sm:px-7 sm:py-7">
            {/* Top row: title + login link */}
            <div className="flex items-start justify-between gap-3 mb-4">
  <div className="flex items-start gap-3">
    {/* Logo */}
    <div className="group relative mt-[2px]">
      <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.45)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
        <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        <ShieldCheck className="text-white w-5 h-5 relative z-10" />
      </div>
    </div>

    {/* Title + subtitle */}
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
        Create your PayNidhi account
      </h2>
      <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
        Register as a seller or lender. We&apos;ll verify your email with an OTP.
      </p>
    </div>
  </div>
</div>


            {/* Mobile login text */}
            <p className="sm:hidden text-[11px] text-slate-500 mb-3">
              Already registered?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-indigo-500 font-semibold"
              >
                Log in
              </button>
            </p>

            {/* Seller / Lender toggle */}
            <div className="flex mb-4 rounded-full bg-slate-100 p-1 max-w">
              <button
                type="button"
                onClick={() => setMode("seller")}
                className={`flex-1 text-[11px] sm:text-xs font-semibold py-2 rounded-full transition-colors ${
                  isSeller
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => setMode("lender")}
                className={`flex-1 text-[11px] sm:text-xs font-semibold py-2 rounded-full transition-colors ${
                  !isSeller
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Lender
              </button>
            </div>

            {/* Avatar row */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full border border-slate-300 bg-slate-50 overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                    Logo
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Business logo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-[11px] text-slate-500"
                />
                <p className="text-[10px] text-slate-400">
                  PNG / JPG, up to 2MB. You can update this later.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-3 text-xs sm:text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Form – grouped into a few rows so it fits nicely on laptop, stacks on mobile */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Shared fields */}
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
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/70"
                    placeholder="PayNidhi Pvt Ltd"
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
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/70"
                    placeholder="you@business.in"
                  />
                </div>
              </div>

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
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/70"
                  placeholder="At least 8 characters"
                />
              </div>

              {/* Seller-specific */}
              {isSeller && (
                <>
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
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        placeholder="27ABCDE1234F1Z5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        required
                        value={form.panNumber}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>

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
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
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
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Annual turnover (₹)
                    </label>
                    <input
                      type="number"
                      name="annualTurnover"
                      value={form.annualTurnover}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      placeholder="0"
                    />
                  </div>
                </>
              )}

              {/* Lender-specific */}
              {!isSeller && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Lender type
                      </label>
                      <input
                        type="text"
                        name="lenderType"
                        required
                        value={form.lenderType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        placeholder="NBFC / Bank / Fintech"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        License number
                      </label>
                      <input
                        type="text"
                        name="lenderLicense"
                        required
                        value={form.lenderLicense}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        placeholder="RBI / NBFC license"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Bank + common */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                    placeholder="Account holder name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    IFSC
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    required
                    value={form.ifsc}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                    placeholder="HDFC0001234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Account number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    required
                    value={form.accountNumber}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                    placeholder="123456789012"
                  />
                </div>

                {!isSeller && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Max investment (₹)
                    </label>
                    <input
                      type="number"
                      name="maxInvestment"
                      required
                      value={form.maxInvestment}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      placeholder="50000000"
                    />
                  </div>
                )}
              </div>

              {!isSeller && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Registered address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                    placeholder="Registered office address"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-1 inline-flex justify-center items-center rounded-xl bg-slate-900 text-white text-sm font-semibold py-2.5 shadow-[0_14px_30px_rgba(15,23,42,0.45)] hover:bg-slate-800 active:scale-95 transition-all"
              >
                Continue & verify email
              </button>
              <div className="hidden sm:block text-[11px] text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-indigo-500 font-semibold hover:text-indigo-600"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
