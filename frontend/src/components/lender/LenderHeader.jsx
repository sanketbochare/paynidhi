import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Bell, ChevronDown, User2, Menu } from "lucide-react";

const API_BASE_URL = "http://localhost:5001";

const LenderHeader = ({ onLogout, onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const companyName = user?.companyName || "Your business";
  const email = user?.email || "you@business.in";

  const initials = (user?.companyName || "PN")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ✅ FIXED: Changed initialAvatar to avatarSrc
  let avatarSrc = "/avatars/avatar-1.png";
  if (user?.avatarUrl) {
    avatarSrc = user.avatarUrl.startsWith("/uploads") 
      ? `${API_BASE_URL}${user.avatarUrl}` 
      : user.avatarUrl;
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
  };

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur flex items-center sticky top-0 z-40">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#E0F6F2] hover:text-[#0f8f79] transition-all shadow-sm z-50"
          >
            <Menu size={18} />
          </button>
          <div className="flex flex-col">
            <p className="text-[11px] font-bold text-[#0f8f79] uppercase tracking-widest">
              Investor Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>
          <button className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0f8f79] transition-colors">
            <Bell size={16} />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="hidden sm:flex flex-col items-end leading-none mr-1">
              <span className="text-[12px] font-bold text-slate-800">{companyName}</span>
              <span className="text-[10px] font-medium text-slate-500">Lender Account</span>
            </div>
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="h-7 w-7 rounded-full object-cover border border-slate-200 shadow-sm" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-[#E0F6F2] border border-[#7FE0CC] flex items-center justify-center text-[10px] font-bold text-[#0f8f79]">
                {initials}
              </div>
            )}
            <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl py-2 text-xs text-slate-700 z-50">
              <div className="px-3 pb-2 pt-2 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
                <p className="mt-1 text-sm font-bold text-slate-900 truncate">{companyName}</p>
                <p className="text-[11px] font-medium text-slate-500 truncate">{email}</p>
              </div>
              <button onClick={() => { setOpen(false); navigate("/lender/kyc"); }} className="w-full flex items-center gap-3 px-4 py-2.5 font-semibold hover:bg-slate-50 hover:text-[#0f8f79] transition-colors">
                <User2 size={16} className="text-slate-400" /> Profile & KYC
              </button>
              <button onClick={() => { setOpen(false); navigate("/lender/settings"); }} className="w-full flex items-center gap-3 px-4 py-2.5 font-semibold hover:bg-slate-50 hover:text-[#0f8f79] transition-colors">
                <Settings size={16} className="text-slate-400" /> Settings
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LenderHeader;