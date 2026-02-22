// frontend/src/pages/lender/LenderDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import LenderNav from "../../components/lender/LenderNav";
import LenderHeader from "../../components/lender/LenderHeader"; 
import SellerFooter from "../../components/seller/SellerFooter";
import { 
  ArrowRight, ShieldCheck, Store, Wallet, TrendingUp, Activity,
  Gavel, AlertCircle, BarChart3
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";

const API_BASE_URL = "http://localhost:5001";
const PIE_COLORS = ["#0f8f79", "#47C4B7", "#f59e0b", "#e11d48", "#64748b"];

const LenderDashboard = () => {
  const [activeKey, setActiveKey] = useState("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  const [animatedScore, setAnimatedScore] = useState(0);

  const [recentBids, setRecentBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [bidsError, setBidsError] = useState(null);

  const isKycComplete = Boolean(user?.isOnboarded && user?.kycStatus === "verified");

  const navigateToKyc = useCallback(() => navigate("/lender/kyc"), [navigate]);

  const handleNavClick = useCallback(
    (key) => {
      if (!isKycComplete && key !== "overview") {
        toast.error("Complete KYC first");
        navigateToKyc();
        return;
      }
      setActiveKey(key);
      setIsMobileOpen(false);
    },
    [isKycComplete, navigateToKyc]
  );

  // Fetch dashboard summary
  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await fetch(`${API_BASE_URL}/api/lender/dashboard-summary`, { credentials: "include" });
        if (!res.ok) throw new Error("Dashboard API not yet implemented");
        const data = await res.json();
        if (isMounted) setSummary(data);
      } catch (err) {
        if (isMounted) setSummaryError("Backend route pending. Showing mock data.");
        // Fallback Mock Data so UI doesn't break while building backend
        if (isMounted) setSummary({
            totalInvested: 28000000, availableCapital: 50000000, activeBids: 12, avgYield: "16.4%", trustScore: 850
        });
      } finally {
        if (isMounted) setLoadingSummary(false);
      }
    };
    fetchSummary();
    return () => { isMounted = false; };
  }, []);

  // Trigger trust score animation
  useEffect(() => {
    if (summary?.trustScore || 850) {
      const timer = setTimeout(() => setAnimatedScore(summary?.trustScore || 850), 300);
      return () => clearTimeout(timer);
    }
  }, [summary?.trustScore]);

  // Fetch recent bids
  useEffect(() => {
    let isMounted = true;
    const fetchBids = async () => {
      try {
        setLoadingBids(true);
        const res = await fetch(`${API_BASE_URL}/api/lender/my-bids`, { credentials: "include" });
        if (!res.ok) throw new Error("Bids API not yet implemented");
        const data = await res.json();
        if (isMounted) setRecentBids(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setBidsError("Cannot load bids at this time.");
      } finally {
        if (isMounted) setLoadingBids(false);
      }
    };
    fetchBids();
    return () => { isMounted = false; };
  }, []);

  const statusData = summary?.portfolioStatusCounts
    ? Object.entries(summary.portfolioStatusCounts).map(([name, value]) => ({ name, value }))
    : [ { name: "Active", value: 5 }, { name: "Pending", value: 2 }, { name: "Completed", value: 12 } ];

  const areaChartData = summary?.deployedByMonth && summary.deployedByMonth.length > 0 
    ? summary.deployedByMonth 
    : [ { name: 'Jan', value: 400000 }, { name: 'Feb', value: 700000 }, { name: 'Mar', value: 500000 }, { name: 'Apr', value: 900000 }, { name: 'May', value: 1200000 }, { name: 'Jun', value: 1800000 } ];

  return (
    <div className="flex bg-[#F8FAFC]" style={{ height: '100dvh', overflow: 'hidden' }}>
      <LenderNav activeKey={activeKey} onChange={handleNavClick} isKycComplete={isKycComplete} navigateToKyc={navigateToKyc} isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-64 relative min-w-0 h-full">
        <header className="flex-none z-30">
          <LenderHeader onLogout={logout} onToggleSidebar={() => setIsMobileOpen(true)} />
        </header>

        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-10 pb-[100px] lg:pb-10 custom-scrollbar">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            {summaryError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-medium text-amber-700 flex items-center gap-2">
                <AlertCircle size={16}/> {summaryError}
              </div>
            )}

            {!isKycComplete && (
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm border border-amber-200/50">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">KYC Registration Required</h3>
                    <p className="text-[12px] text-slate-600 mt-0.5">Complete your corporate identity verification to access the marketplace.</p>
                  </div>
                </div>
                <button onClick={navigateToKyc} className="w-full sm:w-auto px-5 py-2 bg-amber-600 text-white text-[12px] font-semibold rounded-lg shadow-sm hover:bg-amber-700 transition-all active:scale-95 text-center">
                  Complete Verification
                </button>
              </div>
            )}

            {/* TOP STATS GRID */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingSummary ? (
                <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
              ) : (
                <>
                  <StatCard label="Total Invested" value={summary?.totalInvested || 0} trend="+24% this month" theme="emerald" />
                  <StatCard label="Available Capital" value={summary?.availableCapital || 50000000} trend="Liquid Treasury" theme="indigo" />
                  <StatCard label="Active Bids" value={summary?.activeBids || 12} trend="Awaiting acceptance" theme="amber" />
                  <StatCard label="Avg Yield (IRR)" value={summary?.avgYield || "16.4%"} trend="Annualized Return" theme="rose" isPercentage />
                </>
              )}
            </section>

            <section className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. DYNAMIC AREA CHART (WITH EXPLICIT HEIGHT FIX) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Deployment Trajectory</h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Capital invested over time</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="h-2 w-2 rounded-full bg-[#0f8f79] animate-pulse"></span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Live</span>
                    </div>
                  </div>
                  
                  {/* ✅ FIXED: Applied height={260} directly to ResponsiveContainer */}
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0f8f79" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#0f8f79" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} tickFormatter={(val) => `₹${val/100000}L`} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: '600' }}
                          itemStyle={{ color: '#0f8f79' }}
                          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Invested']}
                        />
                        <Area type="monotone" dataKey="value" stroke="#0f8f79" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInvest)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. RECENT ACTIVITY LIST */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                    <button onClick={() => navigate("/lender/marketplace")} className="text-xs font-semibold text-[#0f8f79] hover:underline" disabled={!isKycComplete}>
                      View All
                    </button>
                  </div>

                  {loadingBids ? (
                    <div className="space-y-3">
                      {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl" />)}
                    </div>
                  ) : recentBids.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/40">
                      <p className="text-sm font-medium text-slate-600 mb-1">No active bids.</p>
                      <p className="text-[12px] text-slate-500 mb-4">Visit the marketplace to start deploying your capital.</p>
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:border-[#0f8f79] hover:text-[#0f8f79] transition-all shadow-sm" disabled={!isKycComplete} onClick={() => navigate("/marketplace")}>
                        <Store size={14} /> Go to Marketplace
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 border border-slate-100 rounded-xl overflow-hidden">
                      {recentBids.slice(0,5).map((bid, index) => (
                        <div key={bid._id} className={`flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors ${index !== recentBids.length - 1 ? 'border-b border-slate-100' : ''}`}>
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-800">{bid.invoice?.invoiceNumber || "INV-0000"}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{bid.invoice?.seller?.companyName || "Borrower"}</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <p className="text-sm font-bold text-slate-900">₹{bid.loanAmount?.toLocaleString('en-IN')}</p>
                            <span className="mt-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {bid.interestRate}% IRR
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                
                {/* MARKETPLACE ACTION CARD */}
                <div onClick={() => { if (!isKycComplete) { toast.error("Complete KYC to enter marketplace"); navigateToKyc(); } else { navigate("/marketplace"); } }} className="cursor-pointer rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 bg-white hover:border-[#47C4B7] hover:shadow-md group">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 bg-[#F0FDF4] text-[#0f8f79] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Store size={24} />
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900 mb-1">Live Marketplace</h2>
                    <p className="text-[11px] text-slate-500 mb-5 px-2">Browse verified invoices and deploy capital securely.</p>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                      Enter Market <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* TRUST SCORE CARD */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Trust score</h4>
                  <p className="text-[11px] text-slate-500 mb-6">Your reliability signal for the platform.</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                        <circle cx="40" cy="40" r="34" stroke="#0f8f79" strokeWidth="6" fill="transparent" strokeDasharray="213.6" strokeDashoffset={213.6 - ((animatedScore || 850) / 900) * 213.6} className="transition-all duration-1500 ease-out" strokeLinecap="round" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-slate-800">{animatedScore || 850}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[11px] text-slate-500 mb-1.5">out of 900</p>
                      <div className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100">
                        <span className="text-[10px] font-semibold text-emerald-700">Stable</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DONUT CHART (WITH EXPLICIT HEIGHT FIX) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Portfolio Mix</h4>
                  <p className="text-[11px] text-slate-500 mb-4">Distribution by investment stage.</p>
                  
                  {/* ✅ FIXED: Applied height={190} directly to ResponsiveContainer */}
                  <div className="w-full relative mt-4">
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2} stroke="none">
                          {statusData.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", fontSize: "11px" }} formatter={(value, name) => [`${value} items`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-xl font-bold text-slate-800">{statusData.reduce((a,b)=>a+b.value,0)}</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>
        </main>
        
        <div className="flex-none hidden lg:block bg-white border-t border-slate-200 z-20">
          <SellerFooter />
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}} />
    </div>
  );
};

const StatCard = ({ label, value, helper, trend, theme = "default", isPercentage = false }) => {
  const themeStyles = {
    emerald: "bg-emerald-50/40 border-emerald-100 text-emerald-700",
    indigo: "bg-indigo-50/40 border-indigo-100 text-indigo-700",
    amber: "bg-amber-50/40 border-amber-100 text-amber-700",
    rose: "bg-rose-50/40 border-rose-100 text-rose-700",
    default: "bg-white border-slate-200 text-slate-900"
  };
  
  const helperColor = {
    emerald: "text-emerald-600",
    indigo: "text-indigo-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    default: "text-slate-500"
  };

  const currentTheme = themeStyles[theme];
  const currentHelperColor = helperColor[theme];
  const displayValue = isPercentage ? value : (typeof value === 'number' ? formatCurrency(value) : value);

  return (
    <div className={`rounded-2xl p-5 shadow-sm transition-all hover:shadow-md border ${currentTheme}`}>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-2xl font-bold mb-1">{displayValue}</p>
      <p className={`text-[11px] font-medium ${currentHelperColor}`}>{trend || helper}</p>
    </div>
  );
};

const StatCardSkeleton = () => (
  <div className="bg-slate-50 border border-slate-100 shadow-sm rounded-2xl p-5 animate-pulse">
    <div className="h-2 w-20 bg-slate-200 rounded mb-3" />
    <div className="h-6 w-28 bg-slate-200 rounded mb-2" />
    <div className="h-2 w-16 bg-slate-200 rounded" />
  </div>
);

const formatCurrency = (amount) => {
  if (amount == null) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
};

export default LenderDashboard;