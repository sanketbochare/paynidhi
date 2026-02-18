// frontend/src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSeller, loginLender } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [mode, setMode] = useState("seller");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const fn = mode === "seller" ? loginSeller : loginLender;
      const data = await fn(form); // { _id, email, companyName?, token, message }
      login(data);

      // role comes from token, but we can use mode to redirect
      if (mode === "seller") {
        navigate("/seller/dashboard", { replace: true });
      } else {
        navigate("/lender/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-950/90 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
          Log in as a seller or lender to continue.
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex justify-center items-center rounded-xl bg-slate-900 dark:bg-slate-900 text-white text-sm font-semibold py-2.5 shadow-[0_10px_25px_rgba(15,23,42,0.6)] hover:bg-slate-800 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Log in as {mode === "seller" ? "Seller" : "Lender"}
          </button>
        </form>

        <p className="mt-4 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
