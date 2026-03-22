"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Shield,
  FileText,
  Calendar,
  Lightbulb,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import type { Report, ReportResults, Issue, HardFail } from "@/lib/types";

const PRICING = [
  { credits: 1, price: 7, label: "1 App Check" },
  { credits: 5, price: 25, label: "5 App Checks" },
  { credits: 15, price: 45, label: "15 App Checks" },
];

function scoreColor(score: number): string {
  if (score >= 80) return "#34C759";
  if (score >= 60) return "#0A84FF";
  if (score >= 40) return "#FF9500";
  return "#FF3B30";
}

function AnimatedScore({ value, color }: { value: number; color: string }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(motionVal, value, {
      duration: 1.4,
      ease: "easeOut",
    });
    return () => {
      unsub();
      controls.stop();
    };
  }, [motionVal, rounded, value]);

  return (
    <span className="tabular-nums" style={{ color }}>
      {display}%
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ReportPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("users")
        .select("scan_credits")
        .eq("id", user.id)
        .single();
      if (data) setCredits(data.scan_credits);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (!res.ok) throw new Error("Failed to load report");
        const data = await res.json();
        setReport(data);
      } catch {
        setError("Could not load this report. It may not exist or you don't have access.");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
    fetchCredits();
  }, [id, fetchCredits]);

  const handleRunAnother = () => {
    if (credits !== null && credits <= 0) {
      setShowBuyModal(true);
    } else {
      router.push("/check");
    }
  };

  const handlePurchase = async (creditCount: number) => {
    setPurchaseLoading(creditCount);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: creditCount }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      /* silent */
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 text-lg">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-gray-600 text-center max-w-md">{error ?? "Report not found."}</p>
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const results: ReportResults = report.results_json;
  const hardFails: HardFail[] = results.hardFails ?? [];
  const hasHardFails = hardFails.length > 0;
  const score = results.approvalProbability;
  const color = scoreColor(score);
  const formattedDate = new Date(report.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {report.app_name}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
        </motion.div>

        {/* Hard Fail Banner */}
        {hasHardFails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10"
          >
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-red-700">
                ❌ Will Likely Be Rejected
              </h2>
              <p className="text-red-600/80 mt-2 text-sm max-w-md mx-auto">
                Critical issues were detected that almost always result in rejection.
                Fix these before submitting.
              </p>
            </div>
          </motion.div>
        )}

        {/* Hard Fail Issues */}
        {hasHardFails && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-red-700">Critical Issues</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 tabular-nums">
                {hardFails.length}
              </span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {hardFails.map((fail, i) => (
                <motion.div key={i} variants={fadeUp} transition={{ duration: 0.35 }}>
                  <Card padding="md" className="border-red-200 bg-red-50/30">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{fail.title}</h3>
                        <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">
                          {fail.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                          Relevant Guideline
                        </span>
                        <div className="bg-blue-50 rounded-lg p-3 mt-1.5">
                          <p className="text-sm text-blue-900 leading-relaxed">
                            {fail.guideline}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                          Suggested Fix
                        </span>
                        <div className="bg-green-50 rounded-lg p-3 mt-1.5">
                          <p className="text-sm text-green-900 leading-relaxed">
                            {fail.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Approval Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: hasHardFails ? 0.35 : 0.15 }}
          className="mt-10"
        >
          <Card padding="lg" className={`text-center ${hasHardFails ? "opacity-60" : ""}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Approval Probability
              </span>
            </div>

            <div className="text-5xl font-bold mt-4 mb-3">
              <AnimatedScore value={score} color={color} />
            </div>

            <span
              className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-6"
              style={{
                color,
                backgroundColor: `${color}15`,
              }}
            >
              {results.approvalCategory}
            </span>

            <div className="max-w-md mx-auto">
              <ProgressBar value={score} showLabel={false} />
            </div>
          </Card>
        </motion.div>

        {/* Detected Issues */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: hasHardFails ? 0.45 : 0.3 }}
          className="mt-14"
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Detected Issues</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 tabular-nums">
              {results.issues.length}
            </span>
          </div>

          {results.issues.length === 0 ? (
            <Card padding="lg" className="text-center">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-gray-600">
                  No additional issues detected.
                </p>
              </div>
            </Card>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {results.issues.map((issue: Issue, i: number) => (
                <motion.div key={i} variants={fadeUp} transition={{ duration: 0.35 }}>
                  <Card padding="md">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 whitespace-nowrap shrink-0">
                            +{issue.riskPoints} risk
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">
                          {issue.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Relevant Guideline
                      </span>
                      <div className="bg-blue-50 rounded-lg p-3 mt-1.5">
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {issue.guideline}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Suggested Fixes */}
        {results.suggestedFixes.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-14"
          >
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Suggested Fixes</h2>
            </div>

            <div className="space-y-3">
              {results.suggestedFixes.map((fix: string, i: number) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.07 }}
                >
                  <Card padding="md">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-sm font-semibold text-green-600">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 text-sm leading-relaxed pt-1">{fix}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* OCR Results */}
        {results.ocrDetectedWords.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mt-14"
          >
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Screenshot Analysis</h2>
            </div>

            <Card padding="md">
              <p className="text-sm text-gray-500 mb-4">
                The following trigger words were detected in your screenshots and may raise flags
                during App Store review.
              </p>
              <div className="flex flex-wrap gap-2">
                {results.ocrDetectedWords.map((word: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-100"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </Card>
          </motion.section>
        )}

        {/* Description Flags */}
        {results.descriptionFlags.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="mt-14"
          >
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Description Analysis</h2>
            </div>

            <Card padding="md">
              <p className="text-sm text-gray-500 mb-4">
                These words in your app description may trigger additional scrutiny from reviewers.
              </p>
              <div className="flex flex-wrap gap-2">
                {results.descriptionFlags.map((flag: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </Card>
          </motion.section>
        )}

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="mt-16 mb-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button onClick={handleRunAnother}>
            Run Another Check
          </Button>
        </motion.div>
      </div>

      {/* Buy Credits Modal */}
      {showBuyModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4"
          onClick={() => setShowBuyModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              You&rsquo;re out of scans. Add more.
            </h3>

            <div className="grid grid-cols-3 gap-5 mt-8">
              {PRICING.map((tier) => (
                <div
                  key={tier.credits}
                  className="bg-white rounded-2xl border-2 border-blue-400 shadow-card p-6 flex flex-col items-center justify-center text-center aspect-square"
                >
                  <p className="text-3xl font-bold text-gray-900">{tier.label}</p>
                  <p className="text-lg text-gray-400 mt-2">${tier.price}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    ${(tier.price / tier.credits).toFixed(2)} per check
                  </p>
                  <button
                    onClick={() => handlePurchase(tier.credits)}
                    disabled={purchaseLoading !== null}
                    className="mt-5 inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white rounded-xl gradient-bg border-2 border-blue-400 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 min-w-[120px]"
                  >
                    {purchaseLoading === tier.credits ? (
                      <LoadingSpinner size="sm" color="#FFFFFF" />
                    ) : (
                      "Purchase"
                    )}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBuyModal(false)}
              className="block mx-auto mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
