"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DashboardNavProps {
  credits?: number;
  onRedeemSuccess?: () => void;
}

export default function DashboardNav({ onRedeemSuccess }: DashboardNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [code, setCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setRedeemLoading(true);
    setRedeemError(null);
    setRedeemSuccess(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRedeemError(data.error || "Invalid code.");
        return;
      }
      setRedeemSuccess(`${data.credits} check${data.credits > 1 ? "s" : ""} added!`);
      setCode("");
      onRedeemSuccess?.();
      setTimeout(() => {
        setShowRedeem(false);
        setRedeemSuccess(null);
      }, 1500);
    } catch {
      setRedeemError("Something went wrong.");
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-white"
          >
            AppCheck
          </Link>

          <div className="hidden sm:flex items-center gap-5">
            <button
              onClick={() => setShowRedeem(true)}
              className="text-sm font-medium text-white/40 hover:text-white/80 transition-colors"
            >
              Use Code
            </button>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="text-sm font-medium text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              Sign Out
              <LogOut size={13} />
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 -mr-2 text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="sm:hidden border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-4 space-y-3">
            <button
              onClick={() => {
                setShowRedeem(true);
                setMobileOpen(false);
              }}
              className="block text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              Use Code
            </button>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="block text-sm font-medium text-white/50 hover:text-white transition-colors disabled:opacity-50"
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {showRedeem && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4"
          onClick={() => {
            setShowRedeem(false);
            setRedeemError(null);
            setRedeemSuccess(null);
          }}
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-1">
              Enter Code
            </h3>
            <p className="text-sm text-white/40 mb-4">
              Redeem a promo code for app checks.
            </p>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400"
              onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
            />

            {redeemError && (
              <p className="mt-2 text-sm text-red-400">{redeemError}</p>
            )}
            {redeemSuccess && (
              <p className="mt-2 text-sm text-emerald-400">{redeemSuccess}</p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRedeem(false);
                  setRedeemError(null);
                  setRedeemSuccess(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeemLoading || !code.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white gradient-bg hover:brightness-110 transition-all disabled:opacity-50"
              >
                {redeemLoading ? "Redeeming..." : "Redeem"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
