"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { 
  Building, 
  Building2,
  ClipboardList, 
  Layers, 
  CreditCard, 
  User, 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2 
} from "lucide-react";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F8FAFC] font-poppins select-none">
      
      {/* LEFT SECTION (58% Desktop, 58% Tablet, Hidden on Mobile) */}
      <div className="hidden md:flex md:w-[58%] h-full relative overflow-hidden flex-col justify-between p-12 lg:p-[80px] text-white z-10">
        
        {/* Background Image: public/images/login-bg.png */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[10s] hover:scale-105"
          style={{ 
            backgroundImage: "url('/images/login-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Overlay: linear-gradient(180deg, rgba(20,12,60,0.82), rgba(30,15,80,0.88)) */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(180deg, rgba(20, 12, 60, 0.82), rgba(30, 15, 80, 0.88))"
          }}
        />

        {/* Top Branding Logo */}
        <div className="relative z-20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-12 h-12 rounded-[12px] bg-white/12 border border-white/10 flex items-center justify-center backdrop-blur-md">
            <Building className="w-6 h-6 text-white" />
          </div>
          <span className="text-[20px] font-[700] uppercase tracking-[1px] text-white">
            ATMIA HOSTEL
          </span>
        </div>

        {/* Content Vertically Centered & Left Aligned */}
        <div className="relative z-20 my-auto flex flex-col gap-6 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
          <h1 className="text-[44px] lg:text-[56px] xl:text-[72px] font-[800] text-white tracking-[-2px] leading-[0.95] flex flex-col">
            <span>Manage Student Living</span>
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#6D4CFF] bg-clip-text text-transparent w-fit">From One</span>
            <span>Platform</span>
          </h1>
          
          <p className="text-[rgba(255,255,255,0.85)] text-[18px] font-[400] leading-[1.8] max-w-[520px] whitespace-pre-line">
            A complete hostel management system{"\n"}for managing students, rooms, contracts,{"\n"}allotments, and payments across{"\n"}Atmia Hostel Georgia.
          </p>

          {/* Purple Accent Line */}
          <div className="w-[60px] h-[4px] bg-gradient-to-r from-[#A78BFA] to-[#6D4CFF] rounded-full mt-2" />

          {/* Feature Chips Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6 max-w-[520px]">
            {/* Hostels */}
            <div className="h-[60px] bg-white/8 rounded-[16px] border border-white/12 flex items-center gap-4 px-4 backdrop-blur-[16px] text-white hover:-translate-y-[2px] transition-all duration-200 cursor-default">
              <Building2 className="w-5 h-5 text-white/80" />
              <span className="text-[20px] font-[500]">Hostels</span>
            </div>
            {/* Contracts */}
            <div className="h-[60px] bg-white/8 rounded-[16px] border border-white/12 flex items-center gap-4 px-4 backdrop-blur-[16px] text-white hover:-translate-y-[2px] transition-all duration-200 cursor-default">
              <ClipboardList className="w-5 h-5 text-white/80" />
              <span className="text-[20px] font-[500]">Contracts</span>
            </div>
            {/* Floors */}
            <div className="h-[60px] bg-white/8 rounded-[16px] border border-white/12 flex items-center gap-4 px-4 backdrop-blur-[16px] text-white hover:-translate-y-[2px] transition-all duration-200 cursor-default">
              <Layers className="w-5 h-5 text-white/80" />
              <span className="text-[20px] font-[500]">Floors</span>
            </div>
            {/* Payments */}
            <div className="h-[60px] bg-white/8 rounded-[16px] border border-white/12 flex items-center gap-4 px-4 backdrop-blur-[16px] text-white hover:-translate-y-[2px] transition-all duration-200 cursor-default">
              <CreditCard className="w-5 h-5 text-white/80" />
              <span className="text-[20px] font-[500]">Payments</span>
            </div>
            {/* Students */}
            <div className="h-[60px] bg-white/8 rounded-[16px] border border-white/12 flex items-center gap-4 px-4 backdrop-blur-[16px] text-white hover:-translate-y-[2px] transition-all duration-200 cursor-default">
              <User className="w-5 h-5 text-white/80" />
              <span className="text-[20px] font-[500]">Students</span>
            </div>
            {/* Allotments */}
            <div className="h-[60px] bg-white/8 rounded-[16px] border border-white/12 flex items-center gap-4 px-4 backdrop-blur-[16px] text-white hover:-translate-y-[2px] transition-all duration-200 cursor-default">
              <KeyRound className="w-5 h-5 text-white/80" />
              <span className="text-[20px] font-[500]">Allotments</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-20 flex items-center gap-2 text-white/75 text-[15px] font-[400] border-t border-white/10 pt-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <span>© 2026 Atmia Hostel Georgia</span>
          <span className="px-2 opacity-50">|</span>
          <span>v1.0</span>
        </div>
      </div>

      {/* RIGHT SECTION (42% Desktop, 42% Tablet, 100% Mobile) */}
      <div className="w-full md:w-[42%] h-full flex items-center justify-center p-6 md:p-8 lg:p-10 bg-[#FFFFFF] relative overflow-hidden">
        
        {/* Dotted Pattern - Top Right */}
        <div className="absolute -top-10 -right-10 w-[240px] h-[240px] pointer-events-none opacity-[0.05] z-0">
          <svg className="w-full h-full text-slate-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots-tr" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="3" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-tr)" />
          </svg>
        </div>
        
        {/* Dotted Pattern - Bottom Right */}
        <div className="absolute -bottom-10 -right-10 w-[240px] h-[240px] pointer-events-none opacity-[0.05] z-0">
          <svg className="w-full h-full text-slate-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots-br" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="3" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-br)" />
          </svg>
        </div>

        {/* Login Card */}
        <div 
          className="max-w-[520px] w-full bg-white rounded-[32px] p-8 md:p-[48px] transition-all duration-300 z-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)]"
        >
          {/* Top Icon */}
          <div className="w-[120px] h-[120px] rounded-full bg-[#F4F0FF] flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Building className="w-[48px] h-[48px] text-[#6D4CFF]" />
          </div>

          {/* Card Header */}
          <div className="flex flex-col items-center text-center gap-3 mb-8">
            <h2 className="text-[36px] md:text-[56px] font-[700] text-[#0F172A] tracking-tight leading-none">
              Welcome Back
            </h2>
            <p className="text-[#64748B] text-[20px] font-[400] leading-snug whitespace-pre-line">
              Sign in to continue to the{"\n"}Hostel Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email Field */}
            <div className="flex flex-col gap-2.5">
              <label 
                htmlFor="email" 
                className="text-[16px] font-[600] text-[#0F172A]"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full h-[68px] pl-14 pr-5 bg-white border rounded-[16px] text-[16px] font-[500] text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all duration-200 ${
                    errors.email 
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                      : "border-[#E2E8F0] focus:border-[#6D4CFF] focus:ring-4 focus:ring-[#6D4CFF]/10"
                  }`}
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 font-medium pl-1">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2.5">
              <label 
                htmlFor="password" 
                className="text-[16px] font-[600] text-[#0F172A]"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full h-[68px] pl-14 pr-12 bg-white border rounded-[16px] text-[16px] font-[500] text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all duration-200 ${
                    errors.password 
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                      : "border-[#E2E8F0] focus:border-[#6D4CFF] focus:ring-4 focus:ring-[#6D4CFF]/10"
                  }`}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors p-1"
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 font-medium pl-1">{errors.password}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-1 mb-2">
              <label htmlFor="remember" className="flex items-center gap-3 cursor-pointer text-[15px] font-[500] text-[#64748B] select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-[6px] border transition-all flex items-center justify-center ${
                    rememberMe 
                      ? "bg-[#6D4CFF] border-[#6D4CFF] text-white" 
                      : "bg-white border-[#E2E8F0] hover:border-slate-300"
                  }`}>
                    {rememberMe && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span>Remember Me</span>
              </label>

              <a className="text-[15px] font-[600] text-[#6D4CFF] hover:underline cursor-pointer">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[72px] bg-gradient-to-r from-[#7C4DFF] to-[#5B3DF5] hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(109,76,255,0.45)] active:scale-[0.98] text-white text-[24px] font-[700] rounded-[18px] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_10px_30px_rgba(109,76,255,0.35)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
