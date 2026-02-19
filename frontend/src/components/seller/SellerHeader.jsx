// frontend/src/components/seller/SellerHeader.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

const SellerHeader = ({ onLogout }) => {
  const { user } = useAuth();

  const initials =
    (user?.companyName || "PN")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.18em]">
            Seller dashboard
          </p>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900">
            {user?.companyName || "Your business on PayNidhi"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* User info block */}
          <div className="flex items-center gap-3 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">
                {user?.email || "you@business.in"}
              </p>
              <p className="text-[11px] text-slate-500">Signed in · Seller</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {initials}
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
