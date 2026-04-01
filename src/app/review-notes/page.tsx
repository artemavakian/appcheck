"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Copy, Check, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Report } from "@/lib/types";

interface FormData {
  appName: string;
  requiresLogin: boolean;
  demoEmail: string;
  demoPassword: string;
  hasDigitalPurchases: boolean;
  usesIAP: boolean;
  hasExternalPayments: boolean;
  hasUGC: boolean;
  requestsPermissions: boolean;
  permissionsExplained: boolean;
  additionalNotes: string;
}

const DEFAULT_FORM: FormData = {
  appName: "",
  requiresLogin: false,
  demoEmail: "",
  demoPassword: "",
  hasDigitalPurchases: false,
  usesIAP: false,
  hasExternalPayments: false,
  hasUGC: false,
  requestsPermissions: false,
  permissionsExplained: false,
  additionalNotes: "",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function generateNotes(form: FormData): string {
  const lines: string[] = ["App Review Notes:"];

  if (form.appName.trim()) {
    lines.push("", `App Name: ${form.appName.trim()}`);
  }

  lines.push("", "— Login —");
  if (form.requiresLogin) {
    lines.push("This app requires user authentication.");
    if (form.demoEmail.trim() || form.demoPassword.trim()) {
      lines.push("Demo account credentials for review:");
      if (form.demoEmail.trim()) lines.push(`  Email: ${form.demoEmail.trim()}`);
      if (form.demoPassword.trim()) lines.push(`  Password: ${form.demoPassword.trim()}`);
    }
  } else {
    lines.push("This app does not require login. All functionality is accessible without an account.");
  }

  lines.push("", "— Payments —");
  if (form.hasDigitalPurchases) {
    if (form.usesIAP) {
      lines.push("This app includes digital purchases, all of which are handled through Apple In-App Purchases.");
    } else {
      lines.push("This app includes digital purchases.");
    }
    if (form.hasExternalPayments) {
      lines.push("The app references or links to external payment methods for purchases outside the app.");
    }
  } else {
    lines.push("This app does not include any paid digital content or in-app purchases.");
  }

  lines.push("", "— User-Generated Content —");
  if (form.hasUGC) {
    lines.push("This app allows user-generated content. Moderation, reporting, and blocking systems are in place to ensure community safety and compliance.");
  } else {
    lines.push("This app does not include user-generated content.");
  }

  lines.push("", "— Permissions —");
  if (form.requestsPermissions) {
    if (form.permissionsExplained) {
      lines.push("This app requests device permissions that are required for core functionality. All permission prompts include clear, user-facing explanations of how the data is used.");
    } else {
      lines.push("This app requests device permissions required for core functionality.");
    }
  } else {
    lines.push("This app does not request any special device permissions.");
  }

  if (form.additionalNotes.trim()) {
    lines.push("", "— Additional Notes —");
    lines.push(form.additionalNotes.trim());
  }

  return lines.join("\n");
}

function mapReportToForm(report: Report): FormData {
  const w = report.results_json?.wizardData;
  if (!w) return { ...DEFAULT_FORM, appName: report.app_name };

  return {
    appName: w.appName || report.app_name,
    requiresLogin: w.requiresAccount ?? false,
    demoEmail: "",
    demoPassword: "",
    hasDigitalPurchases: w.chargesForDigital ?? false,
    usesIAP: w.usesIAP ?? false,
    hasExternalPayments: w.usesExternalPayments ?? false,
    hasUGC: w.allowsUserContent ?? false,
    requestsPermissions: (w.permissions?.length ?? 0) > 0,
    permissionsExplained: w.permissionsExplained ?? false,
    additionalNotes: "",
  };
}

export default function ReviewNotesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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

  const handleUseApp = () => {
    const report = reports.find((r) => r.id === selectedReportId);
    if (!report) return;
    setForm(mapReportToForm(report));
    setShowForm(true);
    setGeneratedNotes(null);
  };

  const handleManual = () => {
    setForm(DEFAULT_FORM);
    setShowForm(true);
    setGeneratedNotes(null);
  };

  const handleGenerate = () => {
    setGeneratedNotes(generateNotes(form));
  };

  const handleCopy = async () => {
    if (!generatedNotes) return;
    await navigator.clipboard.writeText(generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const update = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
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
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Submission Notes Generator
          </h1>
          <p className="mt-2 text-white/40 text-sm">
            Generate professional App Store submission notes for your review.
          </p>

          {/* Report selection or manual entry */}
          {!showForm && (
            <div className="mt-8">
              {reports.length > 0 ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Select an App
                    </label>
                    <div className="relative">
                      <select
                        value={selectedReportId}
                        onChange={(e) => setSelectedReportId(e.target.value)}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-white/10 bg-[#141414] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400"
                      >
                        <option value="">Choose a previous report...</option>
                        {reports.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.app_name} — {formatDate(r.created_at)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUseApp}
                      disabled={!selectedReportId}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:brightness-110 transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Use This App
                    </button>
                    <button
                      onClick={handleManual}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Enter Details Manually
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-8 text-center">
                  <p className="text-white/40 text-sm mb-4">
                    No previous app checks found.
                  </p>
                  <button
                    onClick={handleManual}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:brightness-110 transition-all"
                  >
                    Enter Details Manually
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="mt-8 space-y-8">

              {/* App Info */}
              <Section title="App Info">
                <TextInput label="App Name" value={form.appName} onChange={(v) => update("appName", v)} placeholder="My App" />
              </Section>

              {/* Login */}
              <Section title="Login">
                <Toggle label="Does your app require login?" value={form.requiresLogin} onChange={(v) => update("requiresLogin", v)} />
                {form.requiresLogin && (
                  <div className="mt-4 space-y-3 pl-1">
                    <TextInput label="Demo Email" value={form.demoEmail} onChange={(v) => update("demoEmail", v)} placeholder="demo@example.com" />
                    <TextInput label="Demo Password" value={form.demoPassword} onChange={(v) => update("demoPassword", v)} placeholder="••••••••" />
                  </div>
                )}
              </Section>

              {/* Payments */}
              <Section title="Payments">
                <Toggle label="Does your app include digital purchases?" value={form.hasDigitalPurchases} onChange={(v) => update("hasDigitalPurchases", v)} />
                {form.hasDigitalPurchases && (
                  <div className="mt-4 space-y-3 pl-1">
                    <Toggle label="Are purchases handled using Apple In-App Purchases?" value={form.usesIAP} onChange={(v) => update("usesIAP", v)} />
                    <Toggle label="Does your app include any external payment links?" value={form.hasExternalPayments} onChange={(v) => update("hasExternalPayments", v)} />
                  </div>
                )}
              </Section>

              {/* Content */}
              <Section title="Content">
                <Toggle label="Does your app include user-generated content?" value={form.hasUGC} onChange={(v) => update("hasUGC", v)} />
              </Section>

              {/* Permissions */}
              <Section title="Permissions">
                <Toggle label="Does your app request device permissions?" value={form.requestsPermissions} onChange={(v) => update("requestsPermissions", v)} />
                {form.requestsPermissions && (
                  <div className="mt-4 pl-1">
                    <Toggle label="Are all permission prompts clearly explained?" value={form.permissionsExplained} onChange={(v) => update("permissionsExplained", v)} />
                  </div>
                )}
              </Section>

              {/* Additional Notes */}
              <Section title="Additional Notes">
                <textarea
                  value={form.additionalNotes}
                  onChange={(e) => update("additionalNotes", e.target.value)}
                  rows={4}
                  placeholder="Any extra context for Apple reviewers..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#141414] text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 resize-none"
                />
              </Section>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:brightness-110 active:scale-[0.99] transition-all"
              >
                Generate Review Notes
              </button>

              {/* Output */}
              {generatedNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <pre className="whitespace-pre-wrap text-sm text-white/90 leading-relaxed bg-[#141414] border border-white/[0.06] rounded-2xl p-6 font-sans">
                    {generatedNotes}
                  </pre>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:brightness-110 transition-all"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <RotateCcw size={14} />
                      Regenerate
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-white/50 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#141414] text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400"
      />
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-white/70">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 ${
          value ? "bg-[#0A84FF]" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
