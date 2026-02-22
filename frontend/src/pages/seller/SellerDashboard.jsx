import React, { useState, useEffect, useRef, useCallback } from "react";
import SellerNav from "../../components/seller/SellerNav";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerFooter from "../../components/seller/SellerFooter";
import { 
  ArrowRight, 
  ShieldCheck, 
  UploadCloud, 
  Receipt, 
  FileText, 
  X, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Search, 
  Loader2, 
  Zap,
  Plus
} from "lucide-react";
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

const SCAN_STEPS = [
  "Initializing AI Vision Engine...",
  "Extracting document structure & text...",
  "Validating GSTIN and PO numbers...",
  "Running compliance & fraud checks...",
  "Finalizing financial risk assessment...",
];

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

  // -------------------------------------------------------------
  // UPLOAD & MODAL STATES
  // -------------------------------------------------------------
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); 
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const res = await fetch(`${API_BASE_URL}/api/seller/dashboard-summary`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const data = await res.json();
        if (isMounted) setSummary(data);
      } catch (err) {
        if (isMounted) setSummaryError(err.message || "Failed to load dashboard data");
      } finally {
        if (isMounted) setLoadingSummary(false);
      }
    };
    fetchSummary();
    return () => { isMounted = false; };
  }, []);

  // Trigger trust score animation
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
        const res = await fetch(`${API_BASE_URL}/api/invoice/my`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load invoices");
        const data = await res.json();
        if (isMounted) setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setInvoiceError(err.message || "Failed to load invoices");
      } finally {
        if (isMounted) setLoadingInvoices(false);
      }
    };
    fetchInvoices();
    return () => { isMounted = false; };
  }, []);

  // -------------------------------------------------------------
  // DIRECT UPLOAD LOGIC
  // -------------------------------------------------------------
  const openModal = () => {
    if (!isKycComplete) {
      toast.error("Please complete KYC to upload invoices.");
      return navigateToKyc();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (status === "scanning") return; 
    setIsModalOpen(false);
    setTimeout(() => {
      setFile(null);
      setStatus("idle");
      setErrorMessage("");
      setExtractedData(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 300);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!isKycComplete) {
      toast.error("Please complete KYC to upload invoices.");
      return navigateToKyc();
    }
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      return toast.error("Only PDF files are allowed.");
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      return toast.error("File size must be under 5MB.");
    }
    setFile(selectedFile);
    setStatus("idle");
    setErrorMessage("");
    setIsModalOpen(true); // Open modal immediately when file is dropped/selected
  };

  const removeFile = () => {
    setFile(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    let interval;
    if (status === "scanning") {
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");

    setStatus("scanning");
    setScanStepIndex(0);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/invoice/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      await new Promise(resolve => setTimeout(resolve, 5500)); 

      if (!res.ok) throw new Error(data.error || "Verification failed");

      setExtractedData(data.data);
      setStatus("success");
      toast.success("Invoice successfully verified!");
      
      // Optionally refresh invoices list here
      // fetchInvoices(); 
      
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 4000));
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  // -------------------------------------------------------------
  // RENDER: MODAL COMPONENTS
  // -------------------------------------------------------------
  const renderIdleState = () => (
    <div className="animate-in fade-in duration-500 w-full max-w-md mx-auto text-center relative z-10">
      {!file ? (
        <div 
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          className={`group w-full border-2 border-dashed rounded-[1.5rem] p-10 flex flex-col items-center transition-all duration-300 ease-out ${
            isDragging ? 'border-[#47C4B7] bg-[#D9FAF2]/60 scale-[1.02] shadow-[0_0_20px_rgba(71,196,183,0.2)]' : 'border-slate-200/80 bg-slate-50/50 hover:bg-[#F3FBF9] hover:border-[#7FE0CC]/80'
          }`}
        >
          <div className="w-16 h-16 bg-white text-[#0f8f79] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100 group-hover:-translate-y-1 group-hover:shadow-[0_4px_12px_rgba(15,143,121,0.15)] transition-all duration-300">
            <UploadCloud size={30} strokeWidth={2} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1.5 group-hover:text-[#0f8f79] transition-colors">Drop Document</h2>
          <p className="text-[11px] text-slate-500 font-medium mb-6 leading-relaxed max-w-[220px] mx-auto">
            Drag & drop your PDF or click below to browse. Max size: 5MB.
          </p>
          <label className="cursor-pointer inline-flex items-center justify-center px-6 py-2.5 bg-[#C9EFE6] text-[#0f8f79] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#47C4B7] hover:text-white transition-all duration-300 active:scale-95 shadow-sm">
            Browse Files
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="animate-in zoom-in-95 duration-400">
          <div className="w-20 h-20 bg-[#D9FAF2] rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 shadow-sm text-[#0f8f79] relative border border-[#7FE0CC]/30">
            <FileText size={32} strokeWidth={1.5} />
            <button onClick={removeFile} className="absolute -top-2 -right-2 bg-white border border-slate-200 p-1.5 rounded-full text-slate-400 hover:text-rose-500 shadow-sm hover:bg-rose-50 transition-all duration-200 hover:scale-110">
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1 truncate px-4">{file.name}</h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/60 mb-8">
             <ShieldCheck size={12} className="text-emerald-500" />
             <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Integrity Verified</span>
          </div>
          <button 
            onClick={handleUpload} 
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#47C4B7] to-[#0f8f79] text-white rounded-xl font-semibold text-[13px] shadow-[0_4px_16px_rgba(15,143,121,0.25)] hover:shadow-[0_6px_20px_rgba(15,143,121,0.35)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-300 group"
          >
            <Sparkles size={16} className="group-hover:animate-pulse" /> Start AI Scan
          </button>
        </div>
      )}
    </div>
  );

  const renderScanningState = () => (
    <div className="py-6 flex flex-col animate-in fade-in duration-500 max-w-md mx-auto relative z-20">
      <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#0f8f79] rounded-full blur-2xl animate-pulse opacity-20" />
        <div className="absolute inset-2 bg-gradient-to-tr from-[#0f8f79] via-[#47C4B7] to-[#C9EFE6] rounded-full animate-spin" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
          <Sparkles className="text-[#0f8f79] animate-pulse" size={24} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 text-center mb-1">Analyzing Document</h3>
      <p className="text-[11px] text-slate-500 text-center mb-6">Cross-referencing entities and risk patterns.</p>
      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-6">
        <div className="h-full bg-gradient-to-r from-[#0f8f79] to-[#47C4B7] transition-all duration-700 ease-out" style={{ width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%` }} />
      </div>
      <div className="space-y-2">
        {SCAN_STEPS.map((stepText, idx) => {
          const isPast = idx < scanStepIndex;
          const isCurrent = idx === scanStepIndex;
          return (
            <div key={idx} className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300 ${isCurrent ? "bg-[#F3FBF9] border border-[#7FE0CC]/40" : "bg-transparent border border-transparent"}`}>
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isPast ? <CheckCircle2 className="text-[#0f8f79]" size={16} /> : isCurrent ? <Loader2 className="text-[#47C4B7] animate-spin" size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
              </div>
              <p className={`text-[11px] ${isCurrent ? "font-semibold text-[#0f8f79]" : isPast ? "font-medium text-slate-500" : "font-medium text-slate-400"}`}>{stepText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="animate-in zoom-in-95 duration-500 text-center py-4 max-w-sm mx-auto relative z-20">
      <div className="h-16 w-16 bg-[#D9FAF2] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#7FE0CC]/50 relative">
        <div className="absolute inset-0 bg-[#47C4B7] rounded-2xl animate-ping opacity-20" />
        <CheckCircle2 size={32} className="text-[#0f8f79]" strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Verified Successfully!</h3>
      <p className="text-[11px] font-medium text-slate-500 mb-8 px-4">Your invoice passed all compliance checks and is now active.</p>
      {extractedData && (
        <div className="bg-slate-50 border border-slate-100 rounded-[1rem] p-4 grid grid-cols-2 gap-4 text-left mx-auto mb-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
          <div><p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Invoice No</p><p className="text-xs font-semibold text-slate-800">{extractedData.invoiceNumber}</p></div>
          <div><p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Amount</p><p className="text-sm font-bold text-[#0f8f79]">₹ {extractedData.totalAmount?.toLocaleString("en-IN")}</p></div>
          <div><p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Buyer GSTIN</p><p className="text-[11px] font-medium text-slate-600 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-100 inline-block">{extractedData.buyerGst}</p></div>
          <div><p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Due Date</p><p className="text-[11px] font-medium text-slate-600">{new Date(extractedData.dueDate).toLocaleDateString()}</p></div>
        </div>
      )}
      <button onClick={closeModal} className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-[12px] font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm">
        Finish <ArrowRight size={14} />
      </button>
    </div>
  );

  const renderErrorState = () => (
    <div className="animate-in fade-in duration-500 text-center py-6 max-w-sm mx-auto relative z-20">
      <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-sm">
        <AlertCircle size={32} className="text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Verification Failed</h3>
      <p className="text-[11px] font-medium text-amber-700 mb-8 bg-amber-50/50 py-3 px-4 rounded-xl border border-amber-100/60">{errorMessage}</p>
      <div className="flex justify-center gap-3">
        <button onClick={() => setStatus("idle")} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm">Try Again</button>
        <button onClick={closeModal} className="px-6 py-2.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
      </div>
    </div>
  );

  const statusData = summary?.invoiceStatusCounts
    ? Object.entries(summary.invoiceStatusCounts).map(([status, value]) => ({ name: status, value }))
    : [];

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <SellerNav
        activeKey={activeKey}
        onChange={handleNavClick}
        isKycComplete={isKycComplete}
        navigateToKyc={navigateToKyc}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      <div className="lg:ml-64 flex flex-col max-h-screen h-[100dvh]">
        <div className="flex-none">
          <SellerHeader onLogout={handleLogout} onToggleSidebar={handleToggleSidebar} />
        </div>

        <main className={`flex-1 overflow-y-auto transition-all duration-1000 ${isModalOpen ? 'blur-xl scale-[0.98] opacity-30' : ''}`}>
          <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24 lg:pb-6">
            
            {summaryError && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {summaryError}
              </div>
            )}

            {/* KYC Banner */}
            {!isKycComplete && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">KYC Required</h3>
                    <p className="text-xs text-slate-600">Complete your financial and bank details to access invoices, payments & financing.</p>
                  </div>
                  <button onClick={navigateToKyc} className="px-4 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                    Complete KYC
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingSummary ? (
                <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
              ) : summary ? (
                <>
                  <StatCard label="Total disbursed" value={formatCurrency(summary.totalFinanced)} helper="+14.2% this month" theme="emerald" />
                  <StatCard label="Active credit limit" value="₹2.50 Cr" helper="(static for now)" theme="indigo" />
                  <StatCard label="Invoices under review" value={summary.invoicesUnderReview} helper={summary.pipelineAmount ? `${formatCurrency(summary.pipelineAmount)} in pipeline` : "No pipeline yet"} theme="amber" />
                  <StatCard label="Upcoming settlement" value={formatCurrency(summary.upcomingSettlementAmount)} helper={summary.upcomingSettlementAmount > 0 ? "Due soon" : "No dues today"} theme="rose" />
                </>
              ) : null}
            </section>

            {/* Main Content Grid */}
            <section className="grid lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: Direct Upload + Recent Invoices */}
              <div className="lg:col-span-2 space-y-6">
                
                

                <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Recent invoices</h3>
                    <button
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isKycComplete}
                      onClick={!isKycComplete ? navigateToKyc : () => navigate("/seller/invoices")}
                    >
                      View all
                    </button>
                  </div>

                  {invoiceError && (
                    <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                      {invoiceError}
                    </div>
                  )}

                  {loadingInvoices ? (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center animate-pulse">
                      <p className="h-3 w-24 bg-slate-100 rounded mx-auto mb-2" />
                      <p className="h-3 w-40 bg-slate-100 rounded mx-auto" />
                    </div>
                  ) : invoices.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/40">
                      <p className="text-xs font-semibold text-slate-500 mb-1">No invoices yet.</p>
                      <p className="text-[11px] text-slate-400 mb-4">Upload your first invoice to unlock offers from lenders.</p>
                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#0f8f79] hover:text-[#0f8f79] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        disabled={!isKycComplete}
                        onClick={openModal}
                      >
                        <UploadCloud size={14} /> Upload invoice
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invoices.map((inv) => (
                        <div key={inv._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                              <Receipt size={16} className="text-slate-400" />
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold text-slate-800">{inv.invoiceNumber}</p>
                              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{inv.buyerName || "Direct Buyer"}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <p className="text-[13px] font-bold text-slate-900">₹{inv.totalAmount?.toLocaleString()}</p>
                            <span className={`mt-0.5 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase ${inv.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                
                {/* Trust score */}
                <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Trust score</h4>
                  <p className="text-[11px] text-slate-500 mb-5">Your reliability signal for lenders.</p>
                  
                  {loadingSummary ? (
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="h-16 w-16 rounded-full border-[6px] border-slate-100 bg-slate-50" />
                      <div className="h-6 w-16 bg-slate-100 rounded" />
                    </div>
                  ) : summary ? (
                    <div className="flex items-center justify-between">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                          <circle 
                            cx="32" cy="32" r="26" stroke="#10b981" strokeWidth="6" fill="transparent" 
                            strokeDasharray="163.3" strokeDashoffset={163.3 - ((animatedScore ?? 0) / 900) * 163.3} 
                            className="transition-all duration-1000 ease-out" strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-slate-800 leading-none">{animatedScore}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-medium text-slate-400 mb-1.5">out of 900</p>
                        <div className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600">Stable</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <button className="mt-5 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors">
                    View calculation
                  </button>
                </div>

                
              </div>
            </section>
          </div>
        </main>
        <SellerFooter/>
      </div>

      {/* --- FLOATING UPLOAD MODAL/POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ease-out ${status === 'scanning' ? 'opacity-90 bg-slate-900/40' : 'opacity-100'}`} 
            onClick={status === 'idle' ? closeModal : undefined}
          />
          
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300 ease-out">
            
            {status === "scanning" && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[80%] h-[80%] bg-gradient-to-br from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-tl" />
                <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-bl from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-tr" />
                <div className="absolute bottom-0 left-0 w-[80%] h-[80%] bg-gradient-to-tr from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-bl" />
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-gradient-to-tl from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-br" />
              </div>
            )}

            {status !== "scanning" && (
              <button 
                onClick={closeModal} 
                className="absolute top-5 right-5 z-50 w-8 h-8 bg-slate-50 text-slate-400 hover:bg-[#F3FBF9] hover:text-[#0f8f79] rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}

            <div className="p-6 sm:p-10 relative overflow-hidden z-10 min-h-[380px] flex items-center justify-center">
              {status === "idle" && renderIdleState()}
              {status === "scanning" && renderScanningState()}
              {status === "success" && renderSuccessState()}
              {status === "error" && renderErrorState()}
            </div>

            {status === "idle" && (
              <div className="bg-slate-50/80 border-t border-slate-100 p-5 z-10 relative">
                <div className="flex flex-col sm:flex-row gap-4 justify-around">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white p-2 rounded-xl text-[#0f8f79] shadow-sm border border-slate-100"><ShieldCheck size={16} /></div>
                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">Encrypted</h4>
                      <p className="text-[9px] font-medium text-slate-500">Secure TLS 1.3 transit</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px bg-slate-200/60 h-8 self-center" />
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white p-2 rounded-xl text-[#47C4B7] shadow-sm border border-slate-100"><Search size={16} /></div>
                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">Verified</h4>
                      <p className="text-[9px] font-medium text-slate-500">Govt GSTIN handshake</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- GLOBAL CSS FOR SCANNER ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes corner-tl { 0%, 100% { transform: translate(-30%, -30%) scale(1); opacity: 0; } 50% { transform: translate(10%, 10%) scale(1.2); opacity: 0.8; } }
        @keyframes corner-tr { 0%, 100% { transform: translate(30%, -30%) scale(1); opacity: 0; } 50% { transform: translate(-10%, 10%) scale(1.2); opacity: 0.8; } }
        @keyframes corner-bl { 0%, 100% { transform: translate(-30%, 30%) scale(1); opacity: 0; } 50% { transform: translate(10%, -10%) scale(1.2); opacity: 0.8; } }
        @keyframes corner-br { 0%, 100% { transform: translate(30%, 30%) scale(1); opacity: 0; } 50% { transform: translate(-10%, -10%) scale(1.2); opacity: 0.8; } }
        
        .animate-corner-tl { animation: corner-tl 4s ease-in-out infinite; }
        .animate-corner-tr { animation: corner-tr 4s ease-in-out infinite; animation-delay: 1s; }
        .animate-corner-bl { animation: corner-bl 4s ease-in-out infinite; animation-delay: 0.5s; }
        .animate-corner-br { animation: corner-br 4s ease-in-out infinite; animation-delay: 1.5s; }
      `}} />
    </div>
  );
};

// Stat Card
const StatCard = ({ label, value, helper, theme = "default" }) => {
  const themeStyles = {
    emerald: "bg-emerald-50/60 border-emerald-200/60",
    indigo: "bg-indigo-50/60 border-indigo-200/60",
    amber: "bg-amber-50/60 border-amber-200/60",
    rose: "bg-rose-50/60 border-rose-200/60",
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
    <div className={`rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border ${currentTheme} relative overflow-hidden group`}>
      <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40 ${helperColor[theme].replace('text-', 'bg-')}`}></div>
      <div className="relative z-10">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <p className={`text-lg sm:text-xl font-bold tracking-tight ${currentValueColor}`}>
          {value}
        </p>
        <p className={`mt-0.5 text-[11px] font-medium ${currentHelperColor}`}>{helper}</p>
      </div>
    </div>
  );
};

const StatCardSkeleton = () => (
  <div className="bg-white border border-slate-200/60 rounded-2xl p-4 animate-pulse">
    <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
    <div className="h-6 w-20 bg-slate-100 rounded mb-2" />
    <div className="h-3 w-16 bg-slate-100 rounded" />
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