"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  X,
  Library,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DashboardNav from "@/components/DashboardNav";
import type { User, Report } from "@/lib/types";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchReports();
  }, [fetchUserData, fetchReports]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setShowSuccessBanner(true);
      fetchUserData();
      const timeout = setTimeout(() => setShowSuccessBanner(false), 6000);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, fetchUserData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/reports/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: deleteTarget.id }),
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      }
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const credits = user?.scan_credits ?? 0;

  const handleRunCheck = () => {
    if (credits === 0) {
      router.push("/buy-credits");
    } else {
      router.push("/check");
    }
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
        {/* Hero grid — takes up most of the viewport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 grid-rows-2 gap-3"
          style={{ height: "calc(100vh - 220px)", minHeight: "420px", maxHeight: "600px" }}
        >
          {/* Run App Check — spans 2 cols, 2 rows (biggest) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleRunCheck}
            className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #0A84FF 0%, #5AC8FA 100%)",
            }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
            <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-10">
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tight text-center leading-none">
                Run<br />App<br />Check
              </h2>
              <div className="mt-8 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ArrowRight size={28} className="text-white" />
              </div>
            </div>
          </motion.div>

          {/* Available Checks — top right */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-3xl bg-[#141414] border border-white/[0.06] flex flex-col items-center justify-center text-center p-5 relative overflow-hidden"
          >
            <Link
              href="/buy-credits"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white rounded-full gradient-bg hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Plus size={14} />
              Get More
            </Link>
            <p className="mt-4 font-bold tabular-nums whitespace-nowrap" style={{ fontSize: "clamp(1.25rem, 3.5vw, 2rem)" }}>
              <span className="gradient-text">{credits}</span>
              <span className="text-white">
                {" "}{credits === 1 ? "Check" : "Checks"} Available
              </span>
            </p>
          </motion.div>

          {/* Guideline Library — bottom right */}
          <Link href="/guidelines" className="col-span-1 row-span-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="h-full rounded-3xl bg-[#141414] border border-white/[0.06] flex flex-col items-center justify-center text-center p-5 cursor-pointer hover:border-white/10 transition-all"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] flex items-center justify-center mb-3">
                <Library size={20} className="text-white/50" />
              </div>
              <p className="text-sm font-semibold text-white/80">
                Guideline Library
              </p>
              <p className="text-xs text-white/30 mt-1">
                Browse all rules
              </p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Previous Reports */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8"
        >
          <h2 className="text-sm font-medium text-white/30 tracking-wide uppercase mb-4">
            Previous Reports
          </h2>

          {reportsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[#141414] py-12 text-center">
              <p className="text-white/30 text-sm">
                No reports yet. Run your first app check to get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.2 + i * 0.04 }}
                  className="relative group"
                >
                  <button
                    onClick={() => setDeleteTarget(report)}
                    className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-[#2a2a2a] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400"
                    aria-label="Delete report"
                  >
                    <X size={10} />
                  </button>

                  <Link
                    href={`/report/${report.id}`}
                    className="block w-20 group/link"
                  >
                    <div
                      className="w-20 h-20 bg-[#141414] border border-white/[0.06] hover:border-white/10 transition-all flex items-center justify-center"
                      style={{ borderRadius: "22.5%" }}
                    >
                      <span className="text-[10px] font-medium text-white/60 text-center leading-tight px-1.5 truncate group-hover/link:text-white/90 transition-colors">
                        {report.app_name}
                      </span>
                    </div>
                    <p className="text-[9px] text-white/25 text-center mt-1.5 truncate">
                      {formatDate(report.created_at)}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete{" "}
              <span className="text-red-400">{deleteTarget.app_name}</span>?
            </h3>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
