import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Search,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import SellerNav from "../../components/seller/SellerNav";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerFooter from "../../components/seller/SellerFooter";

const API_BASE_URL = "http://localhost:5001";

// AI "Thinking" phrases for the Perplexity-style animation
const SCAN_STEPS = [
  "Initializing AI Vision Engine...",
  "Extracting document structure & text...",
  "Validating GSTIN and PO numbers...",
  "Running compliance & fraud checks...",
  "Finalizing financial risk assessment...",
];

const UploadInvoice = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Status: 'idle' | 'scanning' | 'success' | 'error'
  const [status, setStatus] = useState("idle");
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [extractedData, setExtractedData] = useState(null);

  const isKycComplete = Boolean(
    user?.isOnboarded && user?.kycStatus === "verified"
  );

  const handleLogout = () => {
    logout();
  };

  // Navigation function for KYC
  const navigateToKyc = useCallback(() => {
    navigate("/seller/kyc");
  }, [navigate]);

  // Cycle through AI scanning checklist like Perplexity
  useEffect(() => {
    let interval;
    if (status === "scanning") {
      interval = setInterval(() => {
        setScanStepIndex((prev) => {
          if (prev < SCAN_STEPS.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [status]);

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
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
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
  };

  const removeFile = () => {
    setFile(null);
    setStatus("idle");
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");
    if (!isKycComplete)
      return toast.error("Please complete KYC to upload invoices.");

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

      await new Promise((resolve) => setTimeout(resolve, 4500));

      if (!res.ok) {
        throw new Error(data.error || "Failed to process invoice.");
      }

      setExtractedData(data.data);
      setStatus("success");
      toast.success("Invoice successfully verified!");
    } catch (error) {
      console.error("Upload failed:", error);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setErrorMessage(error.message);
      setStatus("error");
      toast.error(error.message);
    }
  };

  // -------------------------------------------------------------
  // RENDER: IDLE (Drag & Drop)
  // -------------------------------------------------------------
  const renderIdleState = () => (
    <div className="animate-in fade-in duration-500">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging
            ? "border-[#0f8f79] bg-[#E0F6F2]/60 shadow-[0_0_0_1px_rgba(16,185,129,0.1)]"
            : file
            ? "border-emerald-300 bg-emerald-50/60"
            : "border-slate-200 hover:border-[#0f8f79] hover:bg-slate-50"
        }`}
      >
        {!file ? (
          <>
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-[#E0F6F2] rounded-full flex items-center justify-center mb-4 text-[#0f8f79] shadow-sm ring-4 ring-emerald-100/60">
              <UploadCloud size={28} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 text-center">
              Upload Commercial Invoice
            </h3>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 text-center max-w-sm mb-5">
              Drag and drop your PDF here, or click to browse. Max file size:
              5MB.
            </p>
            <label className="cursor-pointer inline-flex items-center justify-center px-5 sm:px-6 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm hover:-translate-y-0.5">
              Browse Files
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600 shadow-md relative">
              <FileText size={26} />
              <button
                onClick={removeFile}
                className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow border border-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-900 truncate max-w-xs text-center">
              {file.name}
            </p>
            <p className="text-[11px] font-medium text-slate-400 mt-1 mb-5">
              {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
            </p>

            <button
              onClick={handleUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#0f8f79] via-emerald-500 to-emerald-400 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group"
            >
              <Sparkles
                size={16}
                className="text-emerald-100 group-hover:animate-pulse"
              />
              Scan &amp; Verify with AI
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // RENDER: SCANNING (Perplexity Style AI Effect)
  // -------------------------------------------------------------
  const renderScanningState = () => (
    <div className="py-8 sm:py-10 flex flex-col animate-in fade-in duration-500 max-w-md mx-auto">
      {/* Glowing AI Orb */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-7 sm:mb-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#0f8f79] rounded-full blur-2xl animate-pulse opacity-30" />
        <div
          className="absolute inset-3 bg-gradient-to-tr from-[#0f8f79] via-emerald-300 to-cyan-300 rounded-full animate-spin"
          style={{ animationDuration: "4s" }}
        />
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
          <Sparkles className="text-[#0f8f79] animate-pulse" size={22} />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-2 tracking-tight">
        Analyzing your document
      </h3>
      <p className="text-[11px] sm:text-xs text-slate-500 text-center mb-6">
        Our AI is scanning fields, validating entities, and checking risk
        patterns.
      </p>

      {/* Progress bar */}
      <div className="w-full h-1.5 sm:h-2 rounded-full bg-slate-100 overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-[#0f8f79] via-emerald-400 to-cyan-400 transition-all duration-700"
          style={{
            width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%`,
          }}
        />
      </div>

      {/* Perplexity-style step checklist */}
      <div className="space-y-3 sm:space-y-4">
        {SCAN_STEPS.map((stepText, idx) => {
          const isPast = idx < scanStepIndex;
          const isCurrent = idx === scanStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 sm:gap-4 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-400 ${
                isCurrent ? "bg-emerald-50/80" : "bg-transparent"
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {isPast ? (
                  <CheckCircle2 className="text-emerald-500" size={18} />
                ) : isCurrent ? (
                  <Loader2 className="text-[#0f8f79] animate-spin" size={18} />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </div>
              <p
                className={`text-[11px] sm:text-[13px] ${
                  isCurrent
                    ? "font-semibold text-[#0f8f79]"
                    : isPast
                    ? "font-medium text-slate-600"
                    : "font-medium text-slate-400"
                }`}
              >
                {stepText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // RENDER: SUCCESS
  // -------------------------------------------------------------
  const renderSuccessState = () => (
    <div className="animate-in zoom-in-95 duration-500 text-center py-6 sm:py-8 max-w-md mx-auto">
      <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner relative">
        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
        <CheckCircle2 size={32} className="text-emerald-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Verified Successfully!
      </h3>
      <p className="text-xs sm:text-sm font-medium text-slate-500 mb-8 max-w-sm mx-auto">
        Your invoice passed all compliance checks and is now live in the
        marketplace for financing.
      </p>

      {extractedData && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 grid grid-cols-2 gap-4 text-left max-w-sm mx-auto mb-8">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Invoice No
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {extractedData.invoiceNumber}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Amount
            </p>
            <p className="text-sm font-bold text-emerald-600">
              ₹ {extractedData.totalAmount?.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Buyer GSTIN
            </p>
            <p className="text-xs font-medium text-slate-700 font-mono">
              {extractedData.buyerGst}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Due Date
            </p>
            <p className="text-xs font-medium text-slate-700">
              {new Date(extractedData.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/seller/dashboard")}
        className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-2.5 sm:py-3 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all"
      >
        Go to Dashboard <ArrowRight size={16} />
      </button>
    </div>
  );

  // -------------------------------------------------------------
  // RENDER: ERROR
  // -------------------------------------------------------------
  const renderErrorState = () => (
    <div className="animate-in fade-in duration-500 text-center py-8 max-w-md mx-auto">
      <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
        <AlertCircle size={32} className="text-rose-500" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        Verification Failed
      </h3>
      <p className="text-xs sm:text-sm font-medium text-rose-600 mb-8 max-w-sm mx-auto bg-rose-50 py-3 rounded-lg border border-rose-100 px-4">
        {errorMessage}
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate("/seller/dashboard")}
          className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all"
        >
          Dashboard
        </button>
      </div>
    </div>
  );

  return (
    // ✅ FIXED LAYOUT WRAPPER: Ensures footer is locked to the bottom
    <div className="min-h-screen bg-slate-50">
      <SellerNav
        activeKey="invoices"
        onChange={() => {}}
        isKycComplete={isKycComplete}
        navigateToKyc={navigateToKyc}
      />

      {/* ✅ FLEX-COL + h-[100dvh] ensures proper scrolling and footer placement */}
      <div className="lg:ml-64 flex flex-col h-[100dvh]">
        
        {/* Header - Fixed to top of content */}
        <div className="flex-none">
          <SellerHeader onLogout={handleLogout} onToggleSidebar={() => {}} />
        </div>

        {/* Main Content - Flex-1 makes it take remaining space, overflow-y-auto makes it scrollable */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="w-full max-w-2xl mx-auto pb-6">
            
            <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  Upload Invoice
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Let our AI scan and verify your invoice for instant financing.
                </p>
              </div>
              <button
                onClick={() => navigate("/seller/dashboard")}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
              {/* Very subtle glow effect behind the box */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#0f8f79]/8 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-400/5 rounded-full blur-[80px] pointer-events-none" />

              {status === "idle" && renderIdleState()}
              {status === "scanning" && renderScanningState()}
              {status === "success" && renderSuccessState()}
              {status === "error" && renderErrorState()}
            </div>

            {/* Informational block below upload */}
            {status === "idle" && (
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-start">
                  <ShieldCheck
                    size={20}
                    className="text-[#0f8f79] shrink-0"
                  />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Secure Processing
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                      Documents are encrypted in transit and at rest. We never
                      share raw data with unauthorized parties.
                    </p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-start">
                  <Search size={20} className="text-indigo-500 shrink-0" />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      AI Verification
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                      Our AI cross-references GSTINs, PO numbers, and amounts
                      with registries to ensure instant approvals.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer - Stays firmly at the bottom of the container */}
        <div className="flex-none">
          <SellerFooter />
        </div>
        
      </div>
    </div>
  );
};

export default UploadInvoice;