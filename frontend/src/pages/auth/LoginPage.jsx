// frontend/src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginSeller,
  loginLender,
  requestOtp,
  verifyOtp,
} from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import OtpVerifyCard from "../../components/auth/OtpVerifyCard";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [mode, setMode] = useState("seller");
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      toast.error("Enter email and password");
      return;
    }

    try {
      const fn = mode === "seller" ? loginSeller : loginLender;
      await fn(form);

      await requestOtp({ email: form.email, purpose: "login" });
      toast.success("Verification code sent to your email");
      setStep(2);
    } catch (err) {
      const msg = err?.error || "Login failed";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleVerifyOtp = async (code) => {
    try {
      const data = await verifyOtp({
        email: form.email,
        code,
        purpose: "login",
        mode,
      });

      login(data);
      toast.success(`Logged in as ${mode}`);

      if (mode === "seller") {
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
    await requestOtp({ email: form.email, purpose: "login" });
  };

  const isSeller = mode === "seller";

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <OtpVerifyCard
          email={form.email}
          purpose="login"
          mode={mode}
          onSubmitOtp={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4 sm:py-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center">
        {/* Brand / illustration side */}
        <div className="hidden md:flex flex-col gap-5">
          <div className="inline-flex items-center gap-3">
            <div className="group relative">
              <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.45)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShieldCheck className="text-white w-6 h-6 relative z-10" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">
                PayNidhi
              </span>
              <span className="text-[11px] text-slate-500">
                Secure receivables & credit platform
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-semibold text-slate-900 leading-snug">
            Log in to manage{" "}
            <span className="text-indigo-600">seller payouts</span> and{" "}
            <span className="text-emerald-500">lender credit lines</span>.
          </h1>

          <p className="text-sm text-slate-500 max-w-md">
            Centralized access for founders, finance teams, and lending partners.
            Monitor disbursements, utilization, and settlements in real time.
          </p>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-xl bg-white/95 border border-slate-200 px-3 py-3 shadow-sm">
              <div className="text-slate-500 mb-1">Live credit lines</div>
              <div className="text-lg font-semibold text-slate-900">₹3.2Cr</div>
              <div className="text-[10px] text-emerald-500 mt-1">
                +9% this quarter
              </div>
            </div>
            <div className="rounded-xl bg-white/95 border border-slate-200 px-3 py-3 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Settlement SLA</span>
                <span>96%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Paid under 48 hours
              </div>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="w-full">
          <div className="w-full bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Sign in to PayNidhi
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Use your registered business email. We’ll confirm with OTP.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-[10px] text-slate-400">
                  Environment
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2 py-[2px] text-[10px] text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure · MFA
                </span>
              </div>
            </div>

            {/* Seller / Lender toggle */}
            <div className="flex mb-5 rounded-full bg-slate-100 p-1">
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

            {error && (
              <div className="mb-3 text-xs sm:text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Work email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70 placeholder:text-slate-400"
                  placeholder="finance@yourcompany.in"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-indigo-500 hover:text-indigo-600"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70 placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center px-1 text-slate-500 hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="inline-flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-500 focus:ring-0" required
                  />
                <label htmlFor="remember" >Keep me signed in</label>
                </div>
                <span className="text-slate-500">
                  OTP will be sent to your email
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-1 inline-flex justify-center items-center rounded-xl bg-slate-900 text-white text-sm font-semibold py-2.5 shadow-[0_14px_30px_rgba(15,23,42,0.45)] hover:bg-slate-800 active:scale-95 transition-all"
              >
                Continue with email
              </button>
            </form>

            <p className="mt-4 text-[11px] sm:text-xs text-slate-500 text-center">
              New to PayNidhi?{" "}
              <span
                onClick={() => (window.location.href = "/register")}
                className="text-indigo-500 font-semibold cursor-pointer hover:text-indigo-600"
              >
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
