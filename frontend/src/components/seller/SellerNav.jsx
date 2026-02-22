import React from "react";
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Users,
  ShieldCheck,
  Settings,
  X,
  Lock,
  BadgeCheck
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
  isMobileOpen = false,
  onCloseMobile,
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

  const closeMobile = () => {
    onCloseMobile?.();
  };

  const handleNavClick = (key) => {
    if (!isKycComplete && key !== "overview") {
      toast.error("Please complete KYC first to unlock this feature.");
      if (navigateToKyc) navigateToKyc();
      closeMobile();
      return;
    }
    
    // ✅ Updated to handle redirection
    if (key === "overview") {
      navigate("/seller/dashboard");
    } else if (key === "invoices") {
      navigate("/seller/invoices");
    } else {
      onChange?.(key);
    }
    closeMobile();
  };

  const handleKycClick = () => {
    if (isKycComplete) return;
    if (navigateToKyc) {
      navigateToKyc();
    } else {
      navigate("/seller/kyc");
    }
    closeMobile();
  };

  const handleSettingsClick = () => {
    navigate("/seller/settings");
    closeMobile();
  };

  return (
    <>
      {/* DESKTOP SIDEBAR - Clean White Background */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Highly Attractive & Professional Identity Block */}
        <div className="px-4 py-1.5 border-b border-slate-100">
          <div className="relative flex items-center gap-3 rounded-2xl bg-white border border-slate-200/60 p-1 shadow-[0_2px_12px_-4px_rgba(15,143,121,0.15)] hover:border-[#7FE0CC]/60 transition-all duration-300">
            
            <div className="relative flex-shrink-0">
              {/* Subtle professional glow behind avatar */}
              <div className="absolute inset-0 rounded-full bg-[#0f8f79]/20 blur-md"></div>
              <img
                src={avatarSrc}
                alt="Seller avatar"
                className="relative h-10 w-10 rounded-full object-cover border border-slate-100 shadow-sm bg-white"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-[0.04em] text-slate-900 truncate">
                {companyName}
              </p>
              <div className="flex items-center mt-1">
                <div
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-medium border ${
                    isKycComplete
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100/60"
                      : "bg-amber-50 text-amber-700 border-amber-100/60"
                  }`}
                >
                  {isKycComplete ? (
                    <>
                      <ShieldCheck size={10} className="text-emerald-500" />
                      Verified
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      KYC Required
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.16em]">
            Main menu
          </p>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-3 pb-4 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;
            const isDisabled = !isKycComplete && item.key !== "overview";

            const baseClasses =
              "relative w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[11px] font-medium border transition-all duration-200 group";

            const stateClasses = isActive
              ? "bg-gradient-to-r from-[#D9FAF2] via-white to-[#D9FAF2] text-[#0f8f79] border-[#7FE0CC] shadow-sm"
              : isDisabled
              ? "bg-amber-25/80 text-amber-400 border border-amber-100 cursor-not-allowed"
              : "bg-transparent text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-100";

            const motionClasses = isDisabled
              ? "hover:bg-amber-25/80"
              : "hover:shadow-sm hover:scale-[1.01]";

            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                disabled={isDisabled}
                className={`${baseClasses} ${stateClasses} ${motionClasses}`}
              >
                {!isDisabled && (
                  <span
                    className={`absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#47C4B7] to-emerald-500 transform origin-left transition-all duration-200 ${
                      isActive
                        ? "opacity-100 scale-y-100"
                        : "opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100"
                    }`}
                  />
                )}
                {!isDisabled && (
                  <span
                    className={`absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#47C4B7] blur-[1px] transition-opacity duration-200 ${
                      isActive ? "opacity-80" : "opacity-0 group-hover:opacity-60"
                    }`}
                  />
                )}
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#C9EFE6] text-[#0f8f79] scale-105"
                      : isDisabled
                      ? "bg-amber-50 text-amber-400"
                      : "bg-slate-100 text-slate-500 group-hover:bg-[#DDF5F1] group-hover:text-[#0f8f79] group-hover:scale-105"
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span
                  className={`truncate ${
                    isDisabled ? "font-normal" : "font-medium"
                  } ${
                    !isDisabled
                      ? "transition-all duration-200 group-hover:translate-x-[1px] group-hover:text-slate-900"
                      : ""
                  }`}
                >
                  {item.label}
                </span>
                {isDisabled && (
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-amber-500">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-50 border border-amber-100">
                      !
                    </span>
                    <span className="hidden xl:inline">KYC first</span>
                  </div>
                )}
                {!isDisabled && (
                  <div className="ml-auto flex items-center gap-1">
                    <span className="h-[1px] w-4 bg-gradient-to-r from-transparent via-[#0f8f79]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="opacity-0 translate-x-1 text-[#0f8f79] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[10px] font-semibold">
                      →
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Action */}
        {!isKycComplete ? (
          <div className="px-3 pb-3 pt-2 border-t border-slate-100 bg-white">
            <button
              onClick={handleKycClick}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all duration-200 border shadow-sm group bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-200 hover:from-amber-100 hover:to-orange-100 hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110 bg-amber-100">
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
          <div className="px-3 pb-1 pt-1 border-t border-slate-100 bg-white">
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-1 text-[11px] font-semibold transition-all duration-200 border shadow-sm bg-slate-50 text-slate-800 hover:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 border-slate-200"
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

      {/* MOBILE DRAWER */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={closeMobile}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[82%] max-w-xs bg-white shadow-2xl border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt="Seller avatar"
                  className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">
                  {companyName}
                </p>
                <div className="mt-0.5">
                  {isKycComplete ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-medium border border-emerald-100">
                      <ShieldCheck size={8} className="text-emerald-500" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded-md bg-amber-50 text-amber-700 text-[9px] font-medium border border-amber-100">
                      Action Needed
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={closeMobile}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Navigation
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeKey === item.key;
              const isDisabled = !isKycComplete && item.key !== "overview";

              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium border transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#D9FAF2] via-white to-[#D9FAF2] text-[#0f8f79] border-[#7FE0CC] shadow-sm"
                      : isDisabled
                      ? "bg-amber-50 text-amber-400 border border-amber-200 cursor-not-allowed"
                      : "bg-transparent text-slate-700 border-transparent hover:bg-[#F3FBF9]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#C9EFE6] text-[#0f8f79] scale-105"
                        : isDisabled
                        ? "bg-amber-100 text-amber-500"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {!isDisabled && (
                    <span
                      className={`text-xs transition-all duration-200 ${
                        isActive ? "text-[#0f8f79]" : "text-slate-400"
                      }`}
                    >
                      →
                    </span>
                  )}
                  {isDisabled && (
                    <span className="text-[10px] font-semibold text-amber-500">
                      KYC
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 bg-white px-3 py-3 space-y-2">
            {!isKycComplete ? (
              <button
                onClick={handleKycClick}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 text-amber-900 border border-amber-200 hover:from-amber-100 hover:to-orange-100 hover:shadow-md transition-all duration-150"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
                  <ShieldCheck size={16} className="text-amber-700" />
                </span>
                <div className="flex flex-col items-start flex-1">
                  <span>Complete KYC</span>
                  <span className="text-[10px] text-amber-700/80">
                    Unlock all seller features
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all duration-150"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
                  <Settings size={16} className="text-slate-700" />
                </span>
                <div className="flex flex-col items-start flex-1">
                  <span>Settings</span>
                  <span className="text-[10px] text-slate-500">
                    Profile & bank details
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MOBILE BOTTOM NAVIGATION BAR (Flush to bottom edges, no spacing around it) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center h-[68px] z-40 pb-safe transition-all">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const isDisabled = !isKycComplete && item.key !== "overview";

          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              disabled={isDisabled}
              className={`relative rounded-full flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {/* Animated Icon Container */}
              <div 
                className={`relative flex items-center justify-center w-11 h-11 rounded-[14px] transition-all duration-500 ${
                  isActive 
                    ? "bg-gradient-to-br from-[#0f8f79] to-emerald-400 text-white shadow-lg shadow-[#0f8f79]/30 -translate-y-[14px]" 
                    : "text-slate-400 bg-transparent hover:text-slate-600"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Lock Badge for Disabled Items */}
                {isDisabled && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-[3px] shadow-sm border border-slate-100">
                    <Lock size={8} className="text-amber-500" />
                  </div>
                )}
              </div>

              {/* Animated Text */}
              <span 
                className={`absolute bottom-1.5 text-[9px] transition-all duration-500 ${
                  isActive 
                    ? "font-bold text-[#0f8f79] translate-y-0 opacity-100 tracking-wide" 
                    : "translate-y-2 opacity-0 font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default SellerNav;