"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  X,
  Library,
  Plus,
  CircleArrowRight,
  ClipboardList,
  NotebookPen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DashboardNav from "@/components/DashboardNav";
import type { User } from "@/lib/types";

export default function DashboardPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}

function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [iconDriving, setIconDriving] = useState(false);

  const supabase = createClient();

  const fetchUserData = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      router.push("/");
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profile) setUser(profile as User);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setShowSuccessBanner(true);
      fetchUserData();
      const timeout = setTimeout(() => setShowSuccessBanner(false), 6000);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, fetchUserData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const credits = user?.scan_credits ?? 0;

  const handleRunCheck = () => {
    setIconDriving(true);
    const dest = credits === 0 ? "/buy-credits" : "/check";
    setTimeout(() => router.push(dest), 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DashboardNav credits={credits} onRedeemSuccess={fetchUserData} />

      {/* Success banner */}
      <AnimatePresence>
        {showSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-emerald-500/10 border-b border-emerald-500/20"
          >
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle2 size={16} />
                Payment successful! Your credits have been added.
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="text-emerald-400/60 hover:text-emerald-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* 2x2 grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-[2fr_1fr] grid-rows-2 gap-3"
          style={{ height: "calc(100vh - 220px)", minHeight: "380px", maxHeight: "560px" }}
        >
          {/* Run Analysis — top left */}
          <motion.div
            whileHover={{ scale: iconDriving ? 1 : 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleRunCheck}
            className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #0A84FF 0%, #5AC8FA 100%)",
            }}
          >
            <div className="relative h-full flex flex-col justify-end p-7 md:p-8">
              <div className="flex items-center">
                <h2 className="font-semibold text-white tracking-tight leading-[0.9] shrink-0" style={{ fontSize: "clamp(3.78rem, 7.65vw, 4.86rem)" }}>
                  Run<br />Analysis
                </h2>
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    animate={iconDriving ? { x: "calc(50vw)", opacity: 0 } : { x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeIn" }}
                  >
                    <CircleArrowRight className="text-white" style={{ width: "clamp(4.86rem, 8.1vw, 5.94rem)", height: "clamp(4.86rem, 8.1vw, 5.94rem)" }} />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Available Checks — top right */}
          <div className="col-span-1 row-span-1 rounded-3xl bg-[#141414] border border-white/[0.06] hover:border-[#0A84FF]/50 flex flex-col items-center justify-center text-center p-5 relative overflow-hidden transition-all duration-300">
            <p
              className="font-semibold tabular-nums whitespace-nowrap text-white"
              style={{
                fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                textShadow: "0 0 8px rgba(10,132,255,0.35), 0 0 20px rgba(90,200,250,0.15)",
              }}
            >
              {credits} {credits === 1 ? "Check" : "Checks"} Available
            </p>
            <Link
              href="/buy-credits"
              className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white rounded-full gradient-bg hover:brightness-110 hover:scale-105 active:scale-[0.98] transition-all duration-200"
            >
              <Plus size={14} />
              Get More
            </Link>
          </div>

          {/* Bottom left — two stacked buttons */}
          <div className="col-span-1 row-span-1 flex flex-col gap-3">
            {/* Previous Reports */}
            <Link href="/reports" className="flex-1">
              <div className="h-full rounded-3xl bg-[#141414] border border-white/[0.06] hover:border-[#0A84FF]/50 flex items-center justify-between px-7 cursor-pointer transition-all duration-300">
                <div className="flex items-center gap-3">
                  <ClipboardList size={20} className="text-white/40 shrink-0" />
                  <p className="font-semibold text-white/50 tracking-tight" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>
                    Previous Reports
                  </p>
                </div>
              </div>
            </Link>

            {/* Review Notes Generator */}
            <Link href="/review-notes" className="flex-1">
              <div className="h-full rounded-3xl bg-[#141414] border border-white/[0.06] hover:border-[#0A84FF]/50 flex items-center justify-between px-7 cursor-pointer transition-all duration-300">
                <div className="flex items-center gap-3">
                  <NotebookPen size={20} className="text-white/40 shrink-0" />
                  <p className="font-semibold text-white/50 tracking-tight" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>
                    Review Notes Generator
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Guideline Library — bottom right */}
          <Link href="/guidelines" className="col-span-1 row-span-1">
            <div className="h-full rounded-3xl bg-[#141414] border border-white/[0.06] hover:border-[#0A84FF]/50 flex flex-col items-center justify-center text-center p-5 cursor-pointer transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center mb-3">
                <Library size={26} className="text-white/50" />
              </div>
              <p className="font-semibold text-white/80" style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}>
                Guideline Library
              </p>
              <p className="text-sm text-white/30 mt-1">
                Browse all rules
              </p>
            </div>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-white/30">
          <span>&copy; 2026 AppCheck. All rights reserved.</span>
          <div className="flex gap-6">
            <a
              href="mailto:support@appcheck.dev"
              className="hover:text-white/60 transition-colors"
            >
              Contact
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
