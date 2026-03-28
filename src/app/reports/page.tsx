"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Clock, Trash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Report } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);
  const checked = useRef(false);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      fetchReports();
    };
    check();
  }, [router, fetchReports]);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight mb-6">
            Previous Reports
          </h1>

          {reports.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[#141414] py-16 text-center">
              <p className="text-white/30 text-sm">
                No reports yet. Run your first analysis to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
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
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-white/30">
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

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
