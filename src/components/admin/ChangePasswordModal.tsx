"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setSuccessMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-taupe-300 shadow-2xl w-full max-w-md p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Architectural corner accents */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-copper" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-copper" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-copper" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-copper" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-taupe-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-copper/10 text-copper flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-medium text-carbon tracking-tight">
                Change Admin Password
              </h3>
              <p className="text-[11px] text-carbon-400">
                Update credentials for admin@jjarchitects.co.in
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-carbon-400 hover:text-carbon hover:bg-taupe-100 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-carbon-400 font-medium mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-3.5 pr-10 py-2 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-300 hover:text-carbon transition-colors"
              >
                {showCurrent ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-carbon-400 font-medium mb-1">
              New Password (min 6 characters)
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-300 hover:text-carbon transition-colors"
              >
                {showNew ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-carbon-400 font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-taupe-100/50 border border-taupe-300 focus:border-copper focus:bg-white focus:outline-none text-carbon text-sm transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-taupe-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-carbon-400 hover:text-carbon hover:bg-taupe-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-copper hover:bg-copper-600 text-white text-xs uppercase tracking-wider font-medium transition-colors shadow flex items-center gap-1.5 disabled:opacity-60"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{submitting ? "Saving..." : "Save Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
