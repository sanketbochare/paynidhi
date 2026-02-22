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
  Plus,
  Layers
} from "lucide-react";

import SellerNav from "../../components/seller/SellerNav";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerFooter from "../../components/seller/SellerFooter";

const API_BASE_URL = "http://localhost:5001";

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
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Status: 'idle' | 'scanning' | 'success' | 'error'
  const [status, setStatus] = useState("idle");
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [extractedData, setExtractedData] = useState(null);

  // --- MODAL & MOBILE MENU STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isKycComplete = Boolean(user?.isOnboarded && user?.kycStatus === "verified");

  const handleLogout = () => logout();

  const navigateToKyc = useCallback(() => {
    navigate("/seller/kyc");
  }, [navigate]);

  // --- MODAL CONTROLS ---
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
    // Delay state reset to allow closing animation to finish smoothly
    setTimeout(() => {
      setFile(null);
      setStatus("idle");
      setErrorMessage("");
      setExtractedData(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 300);
  };

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      await new Promise((resolve) => setTimeout(resolve, 4500));

      if (!res.ok) throw new Error(data.error || "Failed to process invoice.");

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
  // RENDER: IDLE (Drag & Drop inside Modal)
  // -------------------------------------------------------------
  const renderIdleState = () => (
    <div className="animate-in fade-in duration-500 w-full max-w-md mx-auto text-center relative z-10">
      {!file ? (
        <div 
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          className={`group w-full border-2 border-dashed rounded-[1.5rem] p-10 flex flex-col items-center transition-all duration-300 ease-out ${
            isDragging 
              ? 'border-[#47C4B7] bg-[#D9FAF2]/60 scale-[1.02] shadow-[0_0_20px_rgba(71,196,183,0.2)]' 
              : 'border-slate-200/80 bg-slate-50/50 hover:bg-[#F3FBF9] hover:border-[#7FE0CC]/80'
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

  // -------------------------------------------------------------
  // RENDER: SCANNING (Inside Modal)
  // -------------------------------------------------------------
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
        <div
          className="h-full bg-gradient-to-r from-[#0f8f79] to-[#47C4B7] transition-all duration-700 ease-out"
          style={{ width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
        />
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
              <p className={`text-[11px] ${isCurrent ? "font-semibold text-[#0f8f79]" : isPast ? "font-medium text-slate-500" : "font-medium text-slate-400"}`}>
                {stepText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // RENDER: SUCCESS & ERROR (Inside Modal)
  // -------------------------------------------------------------
  const renderSuccessState = () => (
    <div className="animate-in zoom-in-95 duration-500 text-center py-4 max-w-sm mx-auto relative z-20">
      <div className="h-16 w-16 bg-[#D9FAF2] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#7FE0CC]/50 relative">
        <div className="absolute inset-0 bg-[#47C4B7] rounded-2xl animate-ping opacity-20" />
        <CheckCircle2 size={32} className="text-[#0f8f79]" strokeWidth={2.5} />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">Verified Successfully!</h3>
      <p className="text-[11px] font-medium text-slate-500 mb-8 px-4">
        Your invoice passed all compliance checks and is now active.
      </p>

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
      <p className="text-[11px] font-medium text-amber-700 mb-8 bg-amber-50/50 py-3 px-4 rounded-xl border border-amber-100/60">
        {errorMessage}
      </p>
      <div className="flex justify-center gap-3">
        <button onClick={() => setStatus("idle")} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
          Try Again
        </button>
        <button onClick={closeModal} className="px-6 py-2.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-xl hover:bg-slate-200 transition-all">
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F8FAFC] overflow-hidden">
      {/* MOBILE-FRIENDLY NAV WIRING */}
      <SellerNav 
        activeKey="invoices" 
        onChange={() => {}} 
        isKycComplete={isKycComplete} 
        navigateToKyc={navigateToKyc}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-64 h-[100dvh]">
        <div className="flex-none">
          {/* HEADER TOGGLER LINKED TO isMobileOpen */}
          <SellerHeader onLogout={handleLogout} onToggleSidebar={() => setIsMobileOpen((prev) => !prev)} />
        </div>

        {/* --- MAIN PAGE CONTENT --- */}
        {/* Added pb-24 for mobile to avoid overlap with bottom mobile navigation */}
        <main className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6 transition-all duration-1000 ${status === 'scanning' ? 'blur-2xl scale-[0.98] opacity-20' : ''}`}>
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoices</h1>
              <p className="text-[12px] font-medium text-slate-500 mt-1">Manage your documents and view financing statuses.</p>
            </div>

            {/* --- ACTION BAR (Themed like SellerNav Identity Block) --- */}
            <div className="w-full bg-white rounded-[1.5rem] border border-slate-200/60 shadow-[0_2px_12px_-4px_rgba(15,143,121,0.05)] p-5 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all duration-300 hover:border-[#7FE0CC]/60 hover:shadow-[0_4px_20px_-4px_rgba(15,143,121,0.12)] group">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="hidden sm:flex h-12 w-12 bg-[#F3FBF9] text-[#0f8f79] rounded-2xl items-center justify-center border border-[#7FE0CC]/30 group-hover:bg-[#C9EFE6] transition-colors duration-300">
                   <FileText size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 group-hover:text-[#0f8f79] transition-colors duration-300">Upload New Invoice</h2>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Instantly scan and verify documents with AI to access financing.
                  </p>
                </div>
              </div>
              <button 
                onClick={openModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0f8f79] to-[#0d7a68] text-white rounded-xl font-medium text-[12px] hover:shadow-[0_4px_12px_rgba(15,143,121,0.3)] hover:-translate-y-[1px] active:translate-y-[1px] transition-all duration-300"
              >
                <Plus size={14} /> Upload Invoice
              </button>
            </div>

            {/* --- FUTURE TABLE PLACEHOLDER --- */}
            <div className="w-full bg-white rounded-[1.5rem] border border-slate-200/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] min-h-[500px] flex flex-col overflow-hidden transition-all duration-300 hover:border-slate-300/60">
               {/* Table Header Area */}
               <div className="border-b border-slate-100 p-4 sm:px-6 flex items-center justify-between bg-slate-50/30">
                  <h3 className="text-[13px] font-semibold text-slate-800">Invoice History</h3>
                  <div className="flex gap-2">
                     <div className="h-7 w-7 bg-white border border-slate-200 rounded-lg shadow-sm" />
                     <div className="h-7 w-20 bg-white border border-slate-200 rounded-lg shadow-sm" />
                  </div>
               </div>
               
               {/* Empty State Body */}
               <div className="flex-1 flex flex-col items-center justify-center p-10 bg-slate-50/20">
                  <div className="text-center opacity-40 select-none">
                     <Layers size={40} className="mx-auto mb-3 text-slate-400" strokeWidth={1.5} />
                     <h4 className="text-[13px] font-semibold text-slate-600">Table Data Space</h4>
                     <p className="text-[11px] font-medium text-slate-400 mt-1">Reserved area for your future data grid.</p>
                  </div>
               </div>
            </div>

          </div>
        </main>

        <div className="flex-none hidden lg:block">
          <SellerFooter />
        </div>
      </div>

      {/* --- THE UPLOAD MODAL/POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Dark Backdrop with blur */}
          <div 
            className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ease-out ${status === 'scanning' ? 'opacity-90 bg-slate-900/40' : 'opacity-100'}`} 
            onClick={status === 'idle' ? closeModal : undefined}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300 ease-out">
            
            {/* Scanning Light Shards (Only inside Modal) */}
            {status === "scanning" && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[80%] h-[80%] bg-gradient-to-br from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-tl" />
                <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-bl from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-tr" />
                <div className="absolute bottom-0 left-0 w-[80%] h-[80%] bg-gradient-to-tr from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-bl" />
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-gradient-to-tl from-[#0f8f79]/15 to-transparent blur-[60px] animate-corner-br" />
              </div>
            )}

            {/* Close Button */}
            {status !== "scanning" && (
              <button 
                onClick={closeModal} 
                className="absolute top-5 right-5 z-50 w-8 h-8 bg-slate-50 text-slate-400 hover:bg-[#F3FBF9] hover:text-[#0f8f79] rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}

            {/* Modal Body - Wrapping your exact original design */}
            <div className="p-6 sm:p-10 relative overflow-hidden z-10 min-h-[380px] flex items-center justify-center">
              {status === "idle" && renderIdleState()}
              {status === "scanning" && renderScanningState()}
              {status === "success" && renderSuccessState()}
              {status === "error" && renderErrorState()}
            </div>

            {/* Footer blocks (idle only) */}
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

export default UploadInvoice;