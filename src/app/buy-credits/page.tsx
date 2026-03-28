"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ticket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const PRICING = [
  { credits: 1, price: 7, label: "1 App Check", perScan: "$7.00" },
  { credits: 5, price: 25, label: "5 App Checks", perScan: "$5.00" },
  { credits: 15, price: 45, label: "15 App Checks", perScan: "$3.00" },
];

export default function BuyCreditsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const checked = useRef(false);

  const [showRedeem, setShowRedeem] = useState(false);
  const [code, setCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const check = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setLoading(false);
    };
    check();
  }, [router]);

  const handlePurchase = async (credits: number) => {
    setPurchaseLoading(credits);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Could not create checkout session. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setPurchaseLoading(null);
    }
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
      setRedeemSuccess(
        `${data.credits} check${data.credits > 1 ? "s" : ""} added!`
      );
      setCode("");
      setTimeout(() => {
        setShowRedeem(false);
        setRedeemSuccess(null);
        router.push("/dashboard?payment=success");
      }, 1200);
    } catch {
      setRedeemError("Something went wrong.");
    } finally {
      setRedeemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
          <button
            onClick={() => setShowRedeem(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-white/40 hover:text-white/80 transition-colors"
          >
            <Ticket size={14} />
            Use Code
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center max-w-4xl w-full">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
          {PRICING.map((tier) => (
            <div
              key={tier.credits}
              className="rounded-2xl border border-white/[0.06] bg-[#141414] aspect-square flex flex-col items-center justify-center text-center p-6 transition-all duration-300 hover:border-[#5AC8FA]/40"
            >
              <p className="text-lg font-semibold text-white/50 tracking-wide">
                {tier.label}
              </p>
              <p className="text-5xl font-bold text-white mt-3 tabular-nums">
                ${tier.price}
              </p>
              <p className="text-sm text-white/30 mt-1.5">
                {tier.perScan} per check
              </p>

              <button
                onClick={() => handlePurchase(tier.credits)}
                disabled={purchaseLoading !== null}
                className="mt-6 inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-white rounded-xl gradient-bg hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none min-w-[120px]"
              >
                {purchaseLoading === tier.credits ? (
                  <LoadingSpinner size="sm" color="#FFF" />
                ) : (
                  "Purchase"
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          Payments are processed securely by Stripe. Credits are added
          instantly after purchase.
        </p>
      </main>

      {/* Redeem code modal */}
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
    </div>
  );
}
