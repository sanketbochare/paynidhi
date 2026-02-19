// frontend/src/components/seller/SellerNav.jsx
import React, { useMemo } from "react";
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";

const MENU_ITEMS = [
  { key: "overview", icon: LayoutDashboard, label: "Overview" },
  { key: "invoices", icon: Receipt, label: "Invoices" },
  { key: "payments", icon: CreditCard, label: "Payments" },
  { key: "buyers", icon: Users, label: "Buyers" },
];

const AVATAR_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // any list of IDs you like

const SellerNav = ({ activeKey = "overview", onChange }) => {
  const randomAvatar = useMemo(() => {
    const idx = Math.floor(Math.random() * AVATAR_IDS.length);
    return `/avatars/avatar-${AVATAR_IDS[idx]}.png`; // place images in public/avatars
  }, []);

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
      {/* Top identity */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
        <img
          src={randomAvatar}
          alt="Seller avatar"
          className="h-10 w-10 rounded-full object-cover border border-slate-200"
        />
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.14em]">
            Seller portal
          </p>
          <p className="text-sm font-semibold text-slate-900">PayNidhi</p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange?.(item.key)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-3 pb-4 pt-2 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default SellerNav;
