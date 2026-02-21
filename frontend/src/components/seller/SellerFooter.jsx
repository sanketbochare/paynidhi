// frontend/src/components/seller/SellerFooter.jsx
import React from "react";

const SellerFooter = () => {
  return (
    <footer className="h-12 border-t border-slate-200 bg-white flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between text-[11px] text-slate-400">
        <p>© 2026 PayNidhi Institutional Finance</p>
        <div className="flex gap-4">
          <button className="hover:text-indigo-600">Security</button>
          <button className="hover:text-indigo-600">API status</button>
          <button className="hover:text-indigo-600">Support</button>
        </div>
      </div>
    </footer>
  );
};

export default SellerFooter;
