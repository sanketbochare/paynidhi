import React, { useState, useRef, useCallback } from "react";
import SellerNav from "../../components/seller/SellerNav";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerFooter from "../../components/seller/SellerFooter";
import { 
  Building, 
  Mail, 
  Lock, 
  Camera, 
  ShieldCheck, 
  IndianRupee,
  Save,
  Loader2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5001";

const SellerSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mobile Nav State
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const handleToggleSidebar = () => setIsMobileOpen((prev) => !prev);
  const handleCloseMobile = () => setIsMobileOpen(false);
  const handleLogout = () => logout();

  const isKycComplete = Boolean(user?.isOnboarded && user?.kycStatus === "verified");

  // Format initial avatar
  let initialAvatar = "/avatars/avatar-1.png";
  if (user?.avatarUrl) {
    initialAvatar = user.avatarUrl.startsWith("/uploads") 
      ? `${API_BASE_URL}${user.avatarUrl}` 
      : user.avatarUrl;
  }

  // Form State
  const [form, setForm] = useState({
    companyName: user?.companyName || "Global Solutions Public Limited",
    email: user?.email || "prathameshingle72@gmail.com",
    password: "", 
    annualTurnover: user?.annualTurnover || "",
    gstNumber: user?.gstNumber || "27ABCDE1234F1Z5", // Read-only
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Update Profile Information (Company Name, Email, Turnover, Password)
      const profileResponse = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyName: form.companyName,
          email: form.email,
          annualTurnover: form.annualTurnover,
          password: form.password || undefined // Only send if user typed something
        })
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // 2. Update Avatar (If a new file was selected)
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch(`${API_BASE_URL}/api/auth/update-avatar`, {
          method: "POST", // Adjust to PUT if your route requires PUT
          body: formData,
          credentials: "include",
        });

        if (!avatarResponse.ok) {
          const errorData = await avatarResponse.json();
          throw new Error(errorData.error || "Failed to upload avatar");
        }
      }

      toast.success("Settings updated successfully!");
      setForm(prev => ({ ...prev, password: "" })); // Clear password field
      
      // Optional: If your backend returns the updated user, you might want to call 
      // your context's `login(updatedUser)` or `refreshUser()` here to update the global state.

    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Outer wrapper set to exactly 100dvh with overflow hidden to prevent body scrolling
    <div className="flex bg-[#F8FAFC]" style={{ height: '100dvh', overflow: 'hidden' }}>
      
      {/* Sidebar Navigation */}
      <SellerNav
        activeKey="settings"
        onChange={() => {}}
        isKycComplete={isKycComplete}
        navigateToKyc={() => navigate("/seller/kyc")}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col lg:ml-64 relative min-w-0 h-full">
        
        {/* STATIC HEADER */}
        <header className="flex-none z-30">
          <SellerHeader onLogout={handleLogout} onToggleSidebar={handleToggleSidebar} />
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto w-full p-2 sm:p-6 lg:p-5 pb-[100px] lg:pb-5 custom-scrollbar">
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-1">
            

            {/* Main Form Card (Matches your exact layout image) */}
            <div className="w-full bg-white rounded-[24px] border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 sm:p-10">
              <form onSubmit={handleSubmit}>
                
                {/* Profile Photo Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="relative group">
                    <img 
                      src={avatarPreview} 
                      alt="Business Logo" 
                      className="h-24 w-24 rounded-full object-cover border border-slate-200 shadow-sm" 
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:text-[#0f8f79] hover:border-[#0f8f79] transition-all"
                    >
                      <Camera size={14} strokeWidth={2.5} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">Business Logo</h3>
                    <p className="text-[13px] font-medium text-slate-500 mt-1 mb-3 max-w-sm leading-relaxed">
                      Upload a clear, high-resolution logo to build trust with institutional lenders. (Max 2MB, JPG/PNG)
                    </p>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[13px] font-bold text-[#0f8f79] bg-[#E0F6F2]/60 hover:bg-[#C9EFE6] px-4 py-2 rounded-lg transition-colors"
                    >
                      Change Logo
                    </button>
                  </div>
                </div>

                {/* Grid Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
                  
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f8f79] uppercase tracking-widest">
                      <Building size={14} strokeWidth={2.5} /> Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-900 outline-none focus:border-[#47C4B7] focus:ring-1 focus:ring-[#47C4B7] hover:border-slate-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                      placeholder="Enter business name"
                    />
                  </div>

                  {/* GST Number (DISABLED - EXACT MATCH) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f8f79] uppercase tracking-widest">
                        <ShieldCheck size={14} strokeWidth={2.5} /> GST Number
                      </label>
                      <span className="flex items-center gap-1 text-[9px] text-amber-600 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                        <Lock size={10} strokeWidth={2.5} /> Fixed
                      </span>
                    </div>
                    <input
                      type="text"
                      name="gstNumber"
                      value={form.gstNumber}
                      disabled
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-[14px] font-bold text-slate-500 outline-none cursor-not-allowed uppercase tracking-wider"
                    />
                    <p className="text-[11px] font-medium text-slate-400 mt-1">GSTIN is permanently linked to your KYC verification.</p>
                  </div>

                  {/* Work Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f8f79] uppercase tracking-widest">
                      <Mail size={14} strokeWidth={2.5} /> Work Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-900 outline-none focus:border-[#47C4B7] focus:ring-1 focus:ring-[#47C4B7] hover:border-slate-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                      placeholder="finance@company.com"
                    />
                  </div>

                  {/* Annual Turnover */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f8f79] uppercase tracking-widest">
                      <IndianRupee size={14} strokeWidth={2.5} /> Annual Turnover
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-[14px]">₹</span>
                      <input
                        type="number"
                        name="annualTurnover"
                        value={form.annualTurnover}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 rounded-xl border border-slate-200 bg-white py-3 text-[14px] font-semibold text-slate-900 outline-none focus:border-[#47C4B7] focus:ring-1 focus:ring-[#47C4B7] hover:border-slate-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                        placeholder="Enter turnover amount"
                      />
                    </div>
                  </div>

                  {/* Password Update */}
                  <div className="space-y-2 md:col-span-2 pt-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f8f79] uppercase tracking-widest">
                      <Lock size={14} strokeWidth={2.5} /> Update Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full md:w-[48%] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-bold text-slate-900 outline-none focus:border-[#47C4B7] focus:bg-white focus:ring-1 focus:ring-[#47C4B7] hover:border-slate-300 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  
                </div>

                {/* Save Actions */}
                <div className="mt-10 pt-6 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-[#0f8f79] hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving...</>
                    ) : (
                      <><Save size={16} /> Save Changes</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </main>
        
        {/* STATIC FOOTER */}
        <div className="flex-none hidden lg:block bg-white border-t border-slate-200 z-20">
          <SellerFooter />
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Custom scrollbar to make it look sleek */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}} />
    </div>
  );
};

export default SellerSettings;