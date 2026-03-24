"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  X,
  Trash,
  BookOpen,
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
            <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
              <div>
                <p className="text-white/60 text-sm font-medium tracking-wide uppercase">
                  Start Analysis
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 tracking-tight">
                  Run App<br />Check
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={24} className="text-white" />
                </div>
                <span className="text-white/50 text-sm">
                  {credits > 0
                    ? `${credits} ${credits === 1 ? "check" : "checks"} available`
                    : "Purchase checks to begin"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Available Checks — top right */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-3xl bg-[#141414] border border-white/[0.06] flex flex-col items-center justify-center text-center p-5 relative overflow-hidden"
          >
            <p className="text-white/40 text-xs font-medium tracking-wide uppercase">
              Available
            </p>
            <p className="text-5xl font-bold text-white mt-1 tabular-nums">
              {credits}
            </p>
            <p className="text-white/30 text-xs mt-1">
              {credits === 1 ? "Check" : "Checks"}
            </p>
            <Link
              href="/buy-credits"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white/70 rounded-full border border-white/10 hover:bg-white/5 hover:text-white transition-all"
            >
              <Plus size={12} />
              Get More
            </Link>
          </motion.div>

          {/* Guideline Library — bottom right */}
          <Link href="/guidelines" className="col-span-1 row-span-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="h-full rounded-3xl bg-[#141414] border border-white/[0.06] flex flex-col items-center justify-center text-center p-5 cursor-pointer hover:border-white/10 transition-all"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] flex items-center justify-center mb-3">
                <BookOpen size={20} className="text-white/50" />
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
            <div className="space-y-2">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.2 + i * 0.04 }}
                  className="flex items-center gap-3"
                >
                  <button
                    onClick={() => setDeleteTarget(report)}
                    className="shrink-0 text-white/20 hover:text-red-400 transition-colors"
                    aria-label="Delete report"
                  >
                    <Trash size={14} />
                  </button>

                  <Link
                    href={`/report/${report.id}`}
                    className="flex-1 min-w-0 group rounded-xl border border-white/[0.06] bg-[#141414] hover:bg-[#1a1a1a] hover:border-white/10 transition-all px-5 py-3.5 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-medium text-white/80 text-sm truncate group-hover:text-white transition-colors">
                        {report.app_name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={10} className="text-white/20" />
                        <span className="text-xs text-white/20">
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-white/15 group-hover:text-white/40 transition-colors shrink-0 ml-4"
                    />
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
