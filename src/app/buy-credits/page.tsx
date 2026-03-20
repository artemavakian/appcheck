"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const PRICING = [
  { credits: 1, price: 7, label: "1 Scan", perScan: "$7.00" },
  { credits: 5, price: 25, label: "5 Scans", perScan: "$5.00" },
  { credits: 15, price: 45, label: "15 Scans", perScan: "$3.00" },
];

export default function BuyCreditsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const checked = useRef(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center max-w-4xl w-full">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl">
          {PRICING.map((tier, i) => (
            <div
              key={tier.credits}
              className={`rounded-3xl aspect-square flex flex-col items-center justify-center text-center p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                i === 1
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-gray-50 border border-gray-200 shadow-card"
              }`}
            >
              <p className={`text-5xl font-bold ${i === 1 ? "text-white" : "text-gray-900"}`}>
                {tier.label}
              </p>
              <div className="mt-4">
                <span className={`text-3xl font-bold ${i === 1 ? "text-white" : "text-gray-900"}`}>
                  ${tier.price}
                </span>
              </div>
              <p className={`text-sm mt-1 ${i === 1 ? "text-gray-400" : "text-gray-400"}`}>
                {tier.perScan} per scan
              </p>

              <button
                onClick={() => handlePurchase(tier.credits)}
                disabled={purchaseLoading !== null}
                className={`mt-8 inline-flex items-center justify-center px-10 py-4 text-lg font-medium rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none min-w-[160px] ${
                  i === 1
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "text-white gradient-bg hover:brightness-110"
                }`}
              >
                {purchaseLoading === tier.credits ? (
                  <LoadingSpinner size="sm" color={i === 1 ? "#111" : "#FFF"} />
                ) : (
                  "Purchase"
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Payments are processed securely by Stripe. Credits are added
          instantly after purchase.
        </p>
      </main>
    </div>
  );
}
