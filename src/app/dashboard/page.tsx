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
  Trash2,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import DashboardNav from "@/components/DashboardNav";
import type { User, Report } from "@/lib/types";

export default function DashboardPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-400 text-sm">Loading dashboard…</p>
          </div>
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

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 50) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

function categoryColor(cat: string) {
  const lower = cat.toLowerCase();
  if (lower.includes("low")) return "text-green-600";
  if (lower.includes("moderate")) return "text-amber-600";
  return "text-red-600";
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 text-sm">Loading dashboard…</p>
        </div>
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
    <div className="min-h-screen bg-gray-50/50">
      <DashboardNav credits={credits} onRedeemSuccess={fetchUserData} />

      {/* Success banner */}
      <AnimatePresence>
        {showSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-green-50 border-b border-green-200"
          >
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                <CheckCircle2 size={16} />
                Payment successful! Your credits have been added.
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Two action squares */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            onClick={handleRunCheck}
            className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center text-center"
          >
            <span className="text-lg font-semibold text-gray-900">
              Run App Check
            </span>
            <ArrowRight
              size={24}
              className="text-gray-400 mt-3"
              strokeWidth={1.5}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-gray-400">
              Available Checks
            </p>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {credits}
            </p>
            <Link
              href="/buy-credits"
              className="inline-flex items-center justify-center mt-4 px-5 py-2.5 text-sm font-medium text-white rounded-xl gradient-bg hover:brightness-110 active:scale-[0.98] transition-all duration-200"
            >
              Get More
            </Link>
          </div>
        </motion.div>

        {/* Previous Reports */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-6">
            Previous Reports
          </h2>

          {reportsLoading ? (
            <Card padding="lg">
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            </Card>
          ) : reports.length === 0 ? (
            <Card padding="lg">
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <p className="mt-4 text-gray-500 font-medium">
                  No reports yet
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Run your first app check to get started.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card padding="md" className="group">
                    <div className="flex items-start">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(report);
                        }}
                        className="shrink-0 mr-3 mt-0.5 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete report"
                      >
                        <Trash2 size={16} />
                      </button>

                      <Link
                        href={`/report/${report.id}`}
                        className="flex-1 min-w-0 flex items-start justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {report.app_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatDate(report.created_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-right">
                            {report.results_json?.hardFails?.length > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold text-red-600 bg-red-50">
                                Likely Rejected
                              </span>
                            ) : (
                              <>
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold ${scoreColor(
                                    report.approval_score
                                  )}`}
                                >
                                  {report.approval_score}%
                                </span>
                                <p
                                  className={`text-xs mt-1 font-medium ${categoryColor(
                                    report.approval_category
                                  )}`}
                                >
                                  {report.approval_category}
                                </p>
                              </>
                            )}
                          </div>

                          <ChevronRight
                            size={16}
                            className="text-gray-300 group-hover:text-gray-500 transition-colors"
                          />
                        </div>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to delete the{" "}
              <span className="text-red-600">{deleteTarget.app_name}</span>{" "}
              report?
            </h3>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
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
