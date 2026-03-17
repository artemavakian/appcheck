"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const PRICING = [
  { credits: 1, price: 7, label: "1 Scan" },
  { credits: 5, price: 25, label: "5 Scans" },
  { credits: 15, price: 45, label: "15 Scans" },
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
    <div className="min-h-screen bg-gray-50/50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
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

      <main className="max-w-xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Buy Scan Credits
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            Each credit lets you run one full App Store submission analysis.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {PRICING.map((tier) => (
            <div
              key={tier.credits}
              className="bg-white rounded-2xl border-2 border-blue-400 shadow-card p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {tier.label}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  ${(tier.price / tier.credits).toFixed(2)} per scan
                </p>
              </div>

              <button
                onClick={() => handlePurchase(tier.credits)}
                disabled={purchaseLoading !== null}
                className="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white rounded-xl gradient-bg border-2 border-blue-400 shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none min-w-[120px]"
              >
                {purchaseLoading === tier.credits ? (
                  <LoadingSpinner size="sm" color="#FFFFFF" />
                ) : (
                  <>${tier.price}</>
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
