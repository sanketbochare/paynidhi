import React from "react";
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MENU_ITEMS = [
  { key: "overview", icon: LayoutDashboard, label: "Overview" },
  { key: "invoices", icon: Receipt, label: "Invoices" },
  { key: "payments", icon: CreditCard, label: "Payments" },
  { key: "buyers", icon: Users, label: "Buyers" },
];

const API_BASE_URL = "http://localhost:5001";

const SellerNav = ({
  activeKey = "overview",
  onChange,
  isKycComplete,
  navigateToKyc,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  let avatarSrc = "/avatars/avatar-1.png";
  if (user?.avatarUrl) {
    if (user.avatarUrl.startsWith("/uploads")) {
      avatarSrc = `${API_BASE_URL}${user.avatarUrl}`;
    } else {
      avatarSrc = user.avatarUrl;
    }
  }

  const companyName = user?.companyName || "PayNidhi Seller";

  const handleNavClick = (key) => {
    if (!isKycComplete && key !== "overview") {
      toast.error("Please complete KYC first");
      navigateToKyc?.();
      return;
    }
    onChange?.(key);
  };

  const handleKycClick = () => {
    if (isKycComplete) return;
    if (navigateToKyc) {
      navigateToKyc();
    } else {
      navigate("/seller/kyc");
    }
  };

  const handleSettingsClick = () => {
    navigate("/seller/settings");
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
      {/* Identity */}
      <div className="px-5 py-1 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-1 shadow-sm">
          <img
            src={avatarSrc}
            alt="Seller avatar"
            className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {companyName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-medium ${
                  !isKycComplete
                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                }`}
              >
                {isKycComplete ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Verified
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    KYC Required
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-3 pb-1">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
          Main menu
        </p>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const isDisabled = !isKycComplete && item.key !== "overview";

          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all border group ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm"
                  : isDisabled
                  ? "text-slate-300 border-transparent cursor-not-allowed bg-slate-50/50"
                  : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200"
              } ${
                isDisabled
                  ? "hover:bg-slate-50/50 hover:text-slate-300"
                  : ""
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : isDisabled
                    ? "bg-slate-50 text-slate-300"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                <Icon size={16} />
              </span>
              <span
                className={`truncate ${
                  isDisabled ? "font-normal" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {isDisabled && (
                <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-500 text-[10px] font-bold">
                  !
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom KYC / Settings button */}
      {!isKycComplete ? (
        <div className="px-3 pb-0.5 pt-1 border-t border-slate-200 bg-white/95">
          <button
            onClick={handleKycClick}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all border shadow-sm group bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-200 hover:from-amber-100 hover:to-orange-100 hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl transition-all group-hover:scale-110 bg-amber-100">
              <ShieldCheck size={16} className="text-amber-600" />
            </span>
            <div className="flex flex-col items-start flex-1">
              <span className="font-semibold">Complete KYC</span>
              <span className="text-[10px] font-normal text-slate-500">
                Unlock full features
              </span>
            </div>
          </button>
        </div>
      ) : (
        <div className="px-3 pb-0.5 pt-1 border-t border-slate-200 bg-white/95">
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all border shadow-sm bg-slate-50 text-slate-800 hover:bg-slate-100 hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
              <Settings size={16} className="text-slate-700" />
            </span>
            <div className="flex flex-col items-start flex-1">
              <span className="font-semibold">Settings</span>
              <span className="text-[10px] font-normal text-slate-500">
                Profile, bank & security
              </span>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
};

export default SellerNav;
