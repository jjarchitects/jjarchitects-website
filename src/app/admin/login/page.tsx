"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check credentials.");
      }

      // Success -> navigate to target page
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-taupe-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-copper selection:text-white relative overflow-hidden">
      {/* Subtle Architectural Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(27, 27, 27, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(27, 27, 27, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Studio Logo Header */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block transition-opacity hover:opacity-80"
            title="Return to public site"
          >
            {/* Same Logo Used in Frontend */}
            <div className="h-16 relative flex items-center justify-center px-4">
              <img
                src="/assets/logo/logo.png"
                alt="Jatan Joshi Architects"
                className="max-h-16 w-auto object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-copper" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-copper font-medium">
              CMS PORTAL ACCESS
            </span>
            <span className="w-6 h-px bg-copper" />
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-taupe-300 shadow-xl p-8 relative">
          {/* Architectural decorative corner brackets */}
          <span className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-copper" />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-copper" />
          <span className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-copper" />
          <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-copper" />

          <h2 className="text-2xl font-light text-carbon tracking-tight mb-2 text-center">
            Studio Sign In
          </h2>
          <p className="text-xs text-carbon-400 text-center mb-6 leading-relaxed">
            Enter authorized studio credentials to access portfolio data entry and
            homepage curation.
          </p>

          {/* Error notice */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username / Email */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-carbon-400 font-medium mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-carbon-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@jjarchitects.co.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-colors"
                  />
                </div>
              </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-carbon-400 font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-carbon-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-300 hover:text-carbon transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-copper hover:bg-copper-600 text-white text-xs uppercase tracking-widest font-medium transition-all shadow hover:shadow-lg flex items-center justify-center gap-2 group mt-6 disabled:opacity-60"
            >
              <span>{loading ? "Authenticating..." : "Enter Admin Panel"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Studio Security Notice */}
          <div className="mt-6 pt-5 border-t border-taupe-200 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-carbon-400">
              <ShieldCheck className="w-3.5 h-3.5 text-copper shrink-0" />
              <span>Protected Studio Management System</span>
            </div>
          </div>
        </div>

        {/* Back to website link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-carbon-400 hover:text-copper transition-colors inline-flex items-center gap-1"
          >
            <span>← Back to Jatan Joshi Architects Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
