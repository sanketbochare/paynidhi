import React from "react";

const LenderFooter = () => {
  return (
    <footer className="hidden sm:flex h-12 border-t border-slate-200 bg-white items-center">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} PayNidhi Institutional Finance</p>
        <div className="flex gap-4">
          <button className="hover:text-[#0f8f79] transition-colors">Security</button>
          <button className="hover:text-[#0f8f79] transition-colors">API status</button>
          <button className="hover:text-[#0f8f79] transition-colors">Support</button>
        </div>
      </div>
    </footer>
  );
};

export default LenderFooter;