// frontend/src/pages/auth/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller, registerLender } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const [mode, setMode] = useState("seller");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    gstNumber: "",
    panNumber: "",
    bankAccount: "",
    businessType: "",
    industry: "",
    annualTurnover: "",
    lenderType: "",
    lenderLicense: "",
    maxInvestment: "",
    address: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let payload;
      let data;

      if (mode === "seller") {
        payload = {
          email: form.email,
          password: form.password,
          companyName: form.companyName,
          gstNumber: form.gstNumber,
          panNumber: form.panNumber,
          bankAccount: form.bankAccount,
          businessType: form.businessType,
          industry: form.industry,
          annualTurnover: Number(form.annualTurnover) || 0,
        };
        data = await registerSeller(payload);
      } else {
        payload = {
          email: form.email,
          password: form.password,
          companyName: form.companyName,
          lenderType: form.lenderType,
          lenderLicense: form.lenderLicense,
          bankAccount: form.bankAccount,
          maxInvestment: Number(form.maxInvestment) || 0,
          address: form.address,
        };
        data = await registerLender(payload);
      }

      login(data);

      if (mode === "seller") {
        navigate("/seller/dashboard", { replace: true });
      } else {
        navigate("/lender/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err?.error || "Registration failed");
    }
  };

  const isSeller = mode === "seller";

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-950/90 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
          Create your account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
          Sign up as a seller or lender to get started.
        </p>

        <div className="flex mb-5 rounded-full bg-slate-100 dark:bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => setMode("seller")}
            className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-full transition-colors ${
              mode === "seller"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Seller
          </button>
          <button
            type="button"
            onClick={() => setMode("lender")}
            className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-full transition-colors ${
              mode === "lender"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow"
                : "text-slate-500 dark:text-slate-400"
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
          {/* Shared fields */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Company name
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={form.companyName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/70"
              placeholder="PayNidhi Pvt Ltd"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/70"
              placeholder="you@business.in"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/70"
              placeholder="At least 8 characters"
            />
          </div>

          {/* Seller-specific fields */}
          {isSeller && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  required
                  value={form.gstNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm"
                  placeholder="27ABCDE1234F1Z5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="panNumber"
                  required
                  value={form.panNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm"
                  placeholder="ABCDE1234F"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Bank Account
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  required
                  value={form.bankAccount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm"
                  placeholder="Account number / IFSC"
                />
              </div>
            </>
          )}

          {/* Lender-specific fields */}
          {!isSeller && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Lender type
                </label>
                <input
                  type="text"
                  name="lenderType"
                  required
                  value={form.lenderType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm"
                  placeholder="NBFC / Bank / Fintech"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  License number
                </label>
                <input
                  type="text"
                  name="lenderLicense"
                  required
                  value={form.lenderLicense}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm"
                  placeholder="RBI / NBFC license"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Max investment (₹)
                </label>
                <input
                  type="number"
                  name="maxInvestment"
                  required
                  value={form.maxInvestment}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5 text-sm"
                  placeholder="50000000"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-2 inline-flex justify-center items-center rounded-xl bg-slate-900 dark:bg-slate-900 text-white text-sm font-semibold py-2.5 shadow-[0_10px_25px_rgba(15,23,42,0.6)] hover:bg-slate-800 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Create {mode === "seller" ? "seller" : "lender"} account
          </button>
        </form>

        <p className="mt-4 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
