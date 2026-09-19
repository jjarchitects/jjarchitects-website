"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderPlus,
  ExternalLink,
  Database,
  Cloud,
  Layers,
  Menu,
  X,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StatusState {
  mongo: {
    configured: boolean;
    connected: boolean;
    error: string | null;
  };
  s3: {
    configured: boolean;
    region: string;
    bucket: string;
  };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [status, setStatus] = useState<StatusState | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const fetchStatus = async () => {
    try {
      setCheckingStatus(true);
      const res = await fetch("/api/admin/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Failed to check status:", e);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (!isLoginPage) {
      fetchStatus();
    }
  }, [isLoginPage]);

  // If on login page, render clean layout without admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      name: "Projects & Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "Add New Project",
      href: "/admin/projects/new",
      icon: FolderPlus,
      active: pathname === "/admin/projects/new",
    },
  ];

  return (
    <div className="min-h-screen bg-taupe-100 text-carbon flex flex-col selection:bg-copper selection:text-white">
      {/* Top Studio Brand Header */}
      <header className="bg-carbon text-white sticky top-0 z-40 border-b border-carbon-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Studio Brand with Frontend Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-3 group transition-opacity hover:opacity-90"
            >
              <img
                src="/assets/logo/logo.png"
                alt="Jatan Joshi Architects"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="hidden sm:inline-block text-[10px] tracking-[0.25em] uppercase text-copper font-medium border-l border-carbon-600 pl-3">
                CMS
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
                    item.active
                      ? "bg-copper text-white shadow-sm"
                      : "text-taupe-300 hover:text-white hover:bg-carbon-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Status Badges & Live Site Link */}
          <div className="flex items-center gap-3">
            {/* MongoDB Status Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border ${
                status?.mongo?.connected
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : status?.mongo?.configured
                  ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                  : "bg-carbon-700 border-carbon-600 text-carbon-300"
              }`}
              title={
                status?.mongo?.connected
                  ? "MongoDB: Connected & Ready"
                  : status?.mongo?.configured
                  ? "MongoDB: Configured, connecting..."
                  : "MongoDB: Not configured in .env"
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span>
                {status?.mongo?.connected
                  ? "Mongo Online"
                  : status?.mongo?.configured
                  ? "Mongo Offline"
                  : "No DB URI"}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status?.mongo?.connected
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-amber-400"
                }`}
              />
            </div>

            {/* S3 Storage Status Badge */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border ${
                status?.s3?.configured
                  ? "bg-sky-950/60 border-sky-500/40 text-sky-300"
                  : "bg-carbon-700 border-carbon-600 text-carbon-300"
              }`}
              title={
                status?.s3?.configured
                  ? `AWS S3: Connected (Bucket: ${status.s3.bucket}, Region: ${status.s3.region})`
                  : "AWS S3: Not configured in .env"
              }
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{status?.s3?.configured ? "S3 Storage" : "No S3"}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status?.s3?.configured ? "bg-sky-400" : "bg-zinc-500"
                }`}
              />
            </div>

            {/* Refresh status */}
            <button
              onClick={fetchStatus}
              disabled={checkingStatus}
              title="Refresh connection status"
              className="p-1.5 text-taupe-400 hover:text-white hover:bg-carbon-700 rounded transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${checkingStatus ? "animate-spin" : ""}`}
              />
            </button>

            {/* View Live Site Button */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-taupe-200 hover:text-copper transition-colors px-2.5 py-1.5 border border-carbon-600 hover:border-copper bg-carbon-800"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Sign out of Studio CMS"
              className="flex items-center gap-1.5 text-xs text-taupe-300 hover:text-rose-400 hover:border-rose-500/50 transition-colors px-2.5 py-1.5 border border-carbon-600 bg-carbon-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 text-taupe-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileNavOpen && (
          <div className="md:hidden bg-carbon-700 border-t border-carbon-600 px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm uppercase tracking-wider font-medium ${
                    item.active
                      ? "bg-copper text-white"
                      : "text-taupe-200 hover:bg-carbon-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-carbon-600 flex flex-col gap-1.5 text-xs text-taupe-300">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                <span>
                  MongoDB:{" "}
                  {status?.mongo?.connected
                    ? "Online"
                    : status?.mongo?.configured
                    ? "Offline"
                    : "Not Configured"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5" />
                <span>
                  AWS S3: {status?.s3?.configured ? "Ready" : "Not Configured"}
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-taupe-300 bg-white/60 py-4 text-center text-xs text-carbon-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>JJ Architects • Studio Content Management</span>
          <span className="text-[11px] text-carbon-400">
            Featured projects are synchronized live with the homepage hero carousel.
          </span>
        </div>
      </footer>
    </div>
  );
}
