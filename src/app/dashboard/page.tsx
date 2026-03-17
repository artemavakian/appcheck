"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ChevronRight,
  FileText,
  Clock,
  Shield,
  CheckCircle2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardNav credits={credits} />

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
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card padding="none" className="overflow-hidden">
            <div className="relative bg-gradient-to-br from-apple-blue to-apple-cyan p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium mb-6">
                  <Shield size={12} />
                  App Store Review Intelligence
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  Run New App Check
                </h1>
                <p className="mt-3 text-white/80 text-lg leading-relaxed max-w-md">
                  Analyze your App Store submission for potential rejection risks
                  before you wait days for review.
                </p>

                <Link href="/check" className="inline-block mt-8">
                  <Button
                    size="lg"
                    className="!bg-white !text-apple-blue hover:!bg-gray-50 shadow-lg"
                  >
                    <Zap size={18} />
                    Analyze Submission
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Previous Reports */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <FileText size={20} className="text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Previous Reports
            </h2>
          </div>

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
                  <Link href={`/report/${report.id}`} className="block">
                    <Card hoverable padding="md" className="group">
                      <div className="flex items-start justify-between">
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
                          </div>

                          <ChevronRight
                            size={16}
                            className="text-gray-300 group-hover:text-gray-500 transition-colors"
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
