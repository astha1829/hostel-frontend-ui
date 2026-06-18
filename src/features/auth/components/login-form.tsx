"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../hooks/use-auth";
import {
  Building,
  Building2,
  Layers,
  Users,
  ClipboardCheck,
  CreditCard,
  PieChart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  ArrowRight,
  ShieldCheck
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
    <div className="h-screen w-screen p-[20px] bg-[#F8FAFC] font-poppins select-none flex items-center justify-center overflow-hidden">
      {/* Outer Wrapper */}
      <div
        className="w-full flex bg-white overflow-hidden relative shadow-2xl shadow-indigo-900/5"
        style={{
          height: "calc(100vh - 40px)",
          borderRadius: "28px"
        }}
      >

        {/* LEFT SECTION (58% Desktop) */}
        <div className="hidden lg:flex lg:w-[58%] h-full relative overflow-hidden flex-col justify-center p-12 xl:p-[80px] text-white z-10">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('/images/login-bg.png')"
            }}
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(135deg, rgba(10,10,45,0.92), rgba(28,18,85,0.92))"
            }}
          />

          {/* Logo Image */}
          <div className="absolute top-[35px] left-[40px] z-20">
            <Image
              src="/logo.png"
              alt="ATMIA Hostel Logo"
              width={250}
              height={70}
              priority
              className="h-[70px] w-auto object-contain"
            />
          </div>

          {/* Content Vertically Centered */}
          <div className="relative z-20 flex flex-col gap-[32px] w-full max-w-[620px] mt-10">

            <h1
              className="font-[800] tracking-[-1.5px] leading-[1.05] flex flex-col m-0"
              style={{ fontSize: "64px" }}
            >
              <span className="text-white">One Platform.</span>
              <span
                style={{
                  background: "linear-gradient(to right, #A78BFA, #6D4CFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
                className="w-fit"
              >
                Complete Control.
              </span>
            </h1>

            {/* Accent Line */}
            <div
              style={{
                width: "55px",
                height: "4px",
                background: "linear-gradient(to right, #A78BFA, #6D4CFF)",
                borderRadius: "999px"
              }}
            />

            <p
              className="font-[400] leading-[1.7] m-0"
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Streamline hostel operations, manage students, <br />
              rooms, contracts, payments and more — <br />
              all from a single, powerful platform.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-[16px] mt-4">
              {[
                { name: "Hostel\nManagement", icon: Building2 },
                { name: "Floor & Room\nManagement", icon: Layers },
                { name: "Student\nManagement", icon: Users },
                { name: "Contract\nTracking", icon: ClipboardCheck },
                { name: "Payment\nMonitoring", icon: CreditCard },
                { name: "Reports &\nAnalytics", icon: PieChart },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[14px] px-[12px] hover:-translate-y-[2px] transition-transform duration-200 cursor-default"
                  style={{
                    height: "72px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "16px"
                  }}
                >
                  <div className="w-[48px] h-[48px] rounded-[12px] bg-[#6D4CFF] flex items-center justify-center shrink-0">
                    <feature.icon className="w-[22px] h-[22px] text-white" />
                  </div>
                  <span className="text-[15px] font-[500] leading-[1.3] text-white whitespace-pre-line">
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Bar */}
          <div className="absolute bottom-[40px] left-[40px] z-20 flex items-center gap-[12px]">
            <Shield className="w-[20px] h-[20px] text-white/80" />
            <span className="text-[15px] font-[400]" style={{ color: "rgba(255,255,255,0.9)" }}>
              Secure. Reliable. Built for <span style={{ color: "#A78BFA", fontWeight: "600" }}>Campus Living.</span>
            </span>
          </div>
        </div>

        {/* RIGHT SECTION (42% Desktop) */}
        <div className="w-full lg:w-[42%] h-full flex items-center justify-center p-4 relative overflow-hidden bg-[#FFFFFF]">

          {/* Dotted Pattern - Top Right */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none opacity-[0.05] z-0">
            <svg className="w-full h-full text-black" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots-tr" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="3" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots-tr)" />
            </svg>
          </div>

          {/* Dotted Pattern - Bottom Right */}
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] pointer-events-none opacity-[0.05] z-0">
            <svg className="w-full h-full text-black" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
            className="w-full bg-white z-10 mx-auto"
            style={{
              width: "520px",
              maxWidth: "90%",
              borderRadius: "28px",
              padding: "48px",
              boxShadow: "0 25px 80px rgba(15,23,42,0.08)"
            }}
          >
            {/* Top Icon */}
            <div className="mx-auto flex justify-center mb-[24px]">
              <Image
                src="/logo-symbol.jpg"
                alt="ATMIA Symbol"
                width={120}
                height={80}
                priority
                className="h-[80px] w-auto object-contain"
              />
            </div>

            {/* Card Header */}
            <div className="flex flex-col items-center text-center gap-[8px] mb-[32px]">
              <h2 className="text-[48px] font-[700] text-[#0F172A] leading-[1.1] m-0">
                Welcome Back!
              </h2>
              <p className="text-[#64748B] text-[18px] font-[400] m-0">
                Sign in to continue to the<br />Hostel Management System
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">

              {/* Email Field */}
              <div className="flex flex-col gap-[8px]">
                <label
                  htmlFor="email"
                  className="text-[15px] font-[600] text-[#0F172A]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full pl-[46px] pr-4 bg-white text-[15px] font-[500] text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all duration-200 ${errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "focus:border-[#6D4CFF] focus:ring-2 focus:ring-[#6D4CFF]/10"
                      }`}
                    style={{
                      height: "58px",
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0"
                    }}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500 font-medium pl-1">{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-[8px]">
                <label
                  htmlFor="password"
                  className="text-[15px] font-[600] text-[#0F172A]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full pl-[46px] pr-12 bg-white text-[15px] font-[500] text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all duration-200 ${errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "focus:border-[#6D4CFF] focus:ring-2 focus:ring-[#6D4CFF]/10"
                      }`}
                    style={{
                      height: "58px",
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0"
                    }}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors p-1"
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
              <div className="flex items-center justify-between mt-[4px]">
                <label htmlFor="remember" className="flex items-center gap-[10px] cursor-pointer text-[#0F172A] select-none group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className="w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: rememberMe ? "#6D4CFF" : "white",
                        borderColor: rememberMe ? "#6D4CFF" : "#E2E8F0"
                      }}
                    >
                      {rememberMe && (
                        <svg className="w-[10px] h-[10px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[14px] font-[500]" style={{ color: "#64748B" }}>Remember Me</span>
                </label>

                <a className="text-[14px] font-[500] hover:underline cursor-pointer" style={{ color: "#6D4CFF" }}>
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-[700] transition-all duration-200 flex items-center justify-center gap-2 mt-[8px] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  height: "64px",
                  borderRadius: "16px",
                  background: "linear-gradient(to right, #7C4DFF, #5B3DF5)",
                  fontSize: "20px",
                  boxShadow: "0 15px 40px rgba(109,76,255,0.35)"
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-[8px]">
                <div className="flex-grow border-t border-[#E2E8F0]"></div>
                <span className="shrink-0 px-[16px] text-[#94A3B8] text-[14px] font-[400] bg-white">or</span>
                <div className="flex-grow border-t border-[#E2E8F0]"></div>
              </div>

              {/* Secure Access Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-[10px] text-[#0F172A] font-[600] transition-colors duration-200 hover:bg-[#F8FAFC]"
                style={{
                  height: "54px",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  fontSize: "15px"
                }}
              >
                <ShieldCheck className="w-[18px] h-[18px] text-[#6D4CFF]" />
                <span>Secure Admin Access</span>
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

