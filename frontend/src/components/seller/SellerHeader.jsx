// frontend/src/components/seller/SellerHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Settings, Bell, ChevronDown, User2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5001";

const SellerHeader = ({ onLogout }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const companyName = user?.companyName || "Your business on PayNidhi";
  const email = user?.email || "you@business.in";

  const initials = (user?.companyName || "PN")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Same avatar logic as SellerNav
  let avatarSrc = "/avatars/avatar-1.png"; // default
  if (user?.avatarUrl) {
    if (user.avatarUrl.startsWith("/uploads")) {
      avatarSrc = `${API_BASE_URL}${user.avatarUrl}`;
    } else {
      avatarSrc = user.avatarUrl;
    }
  }

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Left: title */}
        <div className="flex flex-col">
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.18em]">
            Seller dashboard
          </p>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900">
            {companyName}
          </h1>
        </div>

        {/* Right: user block with dropdown */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {/* Notification icon (always visible on md+) */}
          <button
            type="button"
            className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
          >
            <Bell size={15} />
          </button>

          {/* User dropdown trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
          >
            <div className="hidden sm:flex flex-col items-end leading-tight mr-1">
              <span className="max-w-[140px] truncate">{email}</span>
              <span className="text-[10px] font-normal text-slate-500 sm:text-slate-300">
                Seller · PayNidhi
              </span>
            </div>
            <img
              src={avatarSrc}
              alt="Seller avatar"
              className="h-7 w-7 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <ChevronDown
              size={14}
              className={`hidden sm:block transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-4 top-14 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl py-2 text-xs text-slate-700 z-50">
              <div className="px-3 pb-2 pt-2 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                  Account
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                  {companyName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {email}
                </p>
              </div>

              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50"
              >
                <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User2 size={14} />
                </span>
                <span>Profile & KYC</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50"
              >
                <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Bell size={14} />
                </span>
                <span>Notifications</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50"
              >
                <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Settings size={14} />
                </span>
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50"
              >
                <span className="h-6 w-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <LogOut size={14} />
                </span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
