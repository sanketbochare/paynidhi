import React, { useState, useEffect, useRef, useCallback } from "react";
import SellerNav from "../../components/seller/SellerNav";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerFooter from "../../components/seller/SellerFooter";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const API_BASE_URL = "http://localhost:5001";
const PIE_COLORS = ["#4f46e5", "#0ea5e9", "#22c55e", "#e11d48", "#f59e0b"];

const SellerDashboard = () => {
  const [activeKey, setActiveKey] = useState("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Summary (KPIs, charts)
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  // Trust Score Animation State
  const [animatedScore, setAnimatedScore] = useState(0);

  // Recent invoices
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [invoiceError, setInvoiceError] = useState(null);

  // Single toast reference
  const kycToastRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  const isKycComplete = !!user && user.isOnboarded && user.kycStatus === "verified";

  const showKycToast = useCallback(() => {
    if (kycToastRef.current) {
      toast.dismiss(kycToastRef.current);
    }

    kycToastRef.current = toast(
      "Please complete KYC to unlock full features",
      {
        duration: 4000,
        position: "top-right",
        id: "kyc-simple-toast",
        style: {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #f59e0b",
          padding: "12px",
          fontSize: "14px",
        },
      }
    );
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!isKycComplete) {
      const timeout = setTimeout(() => {
        showKycToast();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isKycComplete, showKycToast, user]);

  const navigateToKyc = useCallback(() => {
    navigate("/seller/kyc");
  }, [navigate]);

  const handleNavClick = useCallback(
    (key) => {
      if (!isKycComplete && key !== "overview") {
        toast.error("Complete KYC first", { id: "nav-kyc-error" });
        navigateToKyc();
        return;
      }
      setActiveKey(key);
      setIsMobileOpen(false);
    },
    [isKycComplete, navigateToKyc]
  );

  const handleToggleSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  // Fetch dashboard summary
  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        setSummaryError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/seller/dashboard-summary`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to load dashboard data");

        const data = await res.json();
        if (isMounted) setSummary(data);
      } catch (err) {
        if (isMounted)
          setSummaryError(err.message || "Failed to load dashboard data");
      } finally {
        if (isMounted) setLoadingSummary(false);
      }
    };

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  // Trigger trust score animation when summary data loads
  useEffect(() => {
    if (summary?.trustScore) {
      const timer = setTimeout(() => {
        setAnimatedScore(summary.trustScore);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [summary?.trustScore]);

  // Fetch seller invoices
  useEffect(() => {
    let isMounted = true;

    const fetchInvoices = async () => {
      try {
        setLoadingInvoices(true);
        setInvoiceError(null);

        const res = await fetch(`${API_BASE_URL}/api/invoice/my`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load invoices");

        const data = await res.json();
        if (isMounted) setInvoices(data);
      } catch (err) {
        if (isMounted)
          setInvoiceError(err.message || "Failed to load invoices");
      } finally {
        if (isMounted) setLoadingInvoices(false);
      }
    };

    fetchInvoices();
    return () => {
      isMounted = false;
    };
  }, []);

  const statusData =
    summary?.invoiceStatusCounts
      ? Object.entries(summary.invoiceStatusCounts).map(
          ([status, value]) => ({
            name: status,
            value,
          })
        )
      : [];

  const financedByMonth = summary?.financedByMonth || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <SellerNav
        activeKey={activeKey}
        onChange={handleNavClick}
        isKycComplete={isKycComplete}
        navigateToKyc={navigateToKyc}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      <div className="lg:ml-64 flex flex-col max-h-screen">
        <SellerHeader
          onLogout={handleLogout}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="flex-1 overflow-y-auto">
          {/* ✅ Removed the extra bottom padding here */}
          <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
            {summaryError && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {summaryError}
              </div>
            )}

            {/* KYC Banner – only when NOT complete */}
            {!isKycComplete && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">
                      KYC Required
                    </h3>
                    <p className="text-xs text-slate-600">
                      Complete your financial and bank details to access
                      invoices, payments & financing.
                    </p>
                  </div>
                  <button
                    onClick={navigateToKyc}
                    className="px-4 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                  >
                    Complete KYC
                  </button>
                </div>
              </div>
            )}

            {/* Stats - Colored Themes */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingSummary ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : summary ? (
                <>
                  <StatCard
                    label="Total disbursed"
                    value={formatCurrency(summary.totalFinanced)}
                    helper="+14.2% this month"
                    theme="emerald"
                  />
                  <StatCard
                    label="Active credit limit"
                    value="₹2.50 Cr"
                    helper="(static for now)"
                    theme="indigo"
                  />
                  <StatCard
                    label="Invoices under review"
                    value={summary.invoicesUnderReview}
                    helper={
                      summary.pipelineAmount
                        ? `${formatCurrency(
                            summary.pipelineAmount
                          )} in pipeline`
                        : "No pipeline yet"
                    }
                    theme="amber"
                  />
                  <StatCard
                    label="Upcoming settlement"
                    value={formatCurrency(
                      summary.upcomingSettlementAmount
                    )}
                    helper={
                      summary.upcomingSettlementAmount > 0
                        ? "Due soon"
                        : "No dues today"
                    }
                    theme="rose"
                  />
                </>
              ) : null}
            </section>

            {/* Dashboard content */}
            <section className="grid lg:grid-cols-3 gap-4">
              {/* Recent invoices */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Recent invoices
                  </h3>
                  <button
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isKycComplete}
                    onClick={!isKycComplete ? navigateToKyc : () => {}}
                  >
                    View all
                  </button>
                </div>

                {invoiceError && (
                  <div className="mb-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                    {invoiceError}
                  </div>
                )}

                {loadingInvoices ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center animate-pulse">
                    <p className="h-3 w-24 bg-slate-100 rounded mx-auto mb-2" />
                    <p className="h-3 w-40 bg-slate-100 rounded mx-auto" />
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/40">
                    <p className="text-xs text-slate-500 mb-1">
                      No invoices yet.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Upload your first invoice to unlock offers from
                      institutional lenders.
                    </p>
                    <button
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isKycComplete}
                      onClick={!isKycComplete ? navigateToKyc : () => {}}
                    >
                      <ArrowRight size={14} />
                      Upload invoice
                    </button>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="p-4 text-[11px] text-slate-500 text-center">
                      Invoice list placeholder
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                
                {/* Trust score - Small box with Circular Graph */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    Trust score
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Your reliability signal for lenders on PayNidhi.
                  </p>
                  
                  {loadingSummary ? (
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="h-16 w-16 rounded-full border-[6px] border-slate-100 bg-slate-50" />
                      <div className="h-6 w-16 bg-slate-100 rounded" />
                    </div>
                  ) : summary ? (
                    <div className="flex items-center justify-between">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="26" 
                            stroke="#f1f5f9" // slate-100
                            strokeWidth="6" 
                            fill="transparent" 
                          />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="26" 
                            stroke="#10b981" // emerald-500
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray="163.3" 
                            strokeDashoffset={163.3 - ((animatedScore ?? 0) / 900) * 163.3} 
                            className="transition-all duration-1000 ease-out" 
                            strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-slate-800 leading-none">
                            {animatedScore}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <p className="text-[11px] font-medium text-slate-400 mb-1.5">
                          out of 900
                        </p>
                        <div className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Stable
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <button className="mt-4 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors">
                    View how this is calculated
                  </button>
                </div>

                {/* Next steps */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    Next steps
                  </h4>
                  <ul className="mt-2 space-y-2 text-xs text-slate-500">
                    <li>• Complete KYC {!isKycComplete && "(Required)"}</li>
                    <li>• Add your first set of buyers</li>
                    <li>• Upload invoices to generate offers</li>
                  </ul>
                </div>

                {/* Pie chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    Invoice status mix
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Split of your invoices by financing stage.
                  </p>
                  {loadingSummary ? (
                    <div className="h-32 flex items-center justify-center text-[11px] text-slate-400">
                      Loading chart…
                    </div>
                  ) : statusData.length === 0 ? (
                    <p className="text-[11px] text-slate-400">
                      No invoices yet. Upload one to see distribution.
                    </p>
                  ) : (
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                          >
                            {statusData.map((entry, index) => (
                              <Cell
                                key={`cell-${entry.name}`}
                                fill={
                                  PIE_COLORS[index % PIE_COLORS.length]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [
                              `${value} invoices`,
                              name,
                            ]}
                            contentStyle={{ fontSize: "11px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>

        <SellerFooter />
      </div>
    </div>
  );
};

// Stat Card
const StatCard = ({ label, value, helper, theme = "default" }) => {
  const themeStyles = {
    emerald: "bg-emerald-50/60 border-emerald-200",
    indigo: "bg-indigo-50/60 border-indigo-200",
    amber: "bg-amber-50/60 border-amber-200",
    rose: "bg-rose-50/60 border-rose-200",
    default: "bg-white border-slate-200"
  };
  
  const helperColor = {
    emerald: "text-emerald-600",
    indigo: "text-indigo-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    default: "text-slate-400"
  };

  const valueColor = {
    emerald: "text-emerald-900",
    indigo: "text-indigo-900",
    amber: "text-amber-900",
    rose: "text-rose-900",
    default: "text-slate-900"
  }

  const currentTheme = themeStyles[theme];
  const currentHelperColor = helperColor[theme];
  const currentValueColor = valueColor[theme];

  return (
    <div className={`rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border ${currentTheme} relative overflow-hidden`}>
      <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-2xl transition-opacity duration-500 ${helperColor[theme].replace('text-', 'bg-')}`}></div>
      <div className="relative z-10">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em] mb-1">
          {label}
        </p>
        <p className={`text-lg sm:text-xl font-bold ${currentValueColor}`}>
          {value}
        </p>
        <p className={`mt-1 text-[11px] font-medium ${currentHelperColor}`}>{helper}</p>
      </div>
    </div>
  );
};

const StatCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse">
    <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
    <div className="h-5 w-20 bg-slate-100 rounded mb-3" />
    <div className="h-4 w-28 bg-slate-100 rounded" />
  </div>
);

const formatCurrency = (amount) => {
  if (amount == null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default SellerDashboard;