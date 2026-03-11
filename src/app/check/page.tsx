"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { FileUpload } from "@/components/ui/FileUpload";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import { processScreenshots, scanForTriggerWords } from "@/lib/ocr";
import type { WizardData } from "@/lib/types";

const TOTAL_STEPS = 9;

const LOGIN_METHODS = ["Email/password", "Google", "Facebook", "Apple"];
const PERMISSIONS_LIST = [
  "Camera",
  "Microphone",
  "Location",
  "Photo Library",
  "Contacts",
];

const defaultWizardData: WizardData = {
  appName: "",
  platform: "iOS",
  isNewApp: true,
  hasCrashes: false,
  hasPlaceholderContent: false,
  requiresAccount: false,
  canDeleteAccount: false,
  loginMethods: [],
  chargesForDigital: false,
  hasSubscriptions: false,
  usesIAP: false,
  usesExternalPayments: false,
  paymentLocation: "",
  allowsUserContent: false,
  hasReporting: false,
  hasBlocking: false,
  hasModeration: false,
  permissions: [],
  hasPrivacyPolicy: false,
  hasAIContent: false,
  involvesFinance: false,
  involvesGambling: false,
  providesHealthAdvice: false,
  descriptionMentionsPricing: false,
  descriptionMentionsExternalSubs: false,
  appDescription: "",
  screenshots: [],
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const revealVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

function ToggleButtons({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
          value
            ? "text-white shadow-md bg-gradient-to-br from-apple-blue to-apple-cyan"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
          !value
            ? "text-white shadow-md bg-gradient-to-br from-apple-blue to-apple-cyan"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        No
      </button>
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "text-white shadow-md bg-gradient-to-br from-apple-blue to-apple-cyan"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
              active
                ? "text-white shadow-md bg-gradient-to-br from-apple-blue to-apple-cyan"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      {children}
    </label>
  );
}

function ConditionalReveal({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="overflow-hidden"
        >
          <div className="pt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CheckPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const screenshotDataUrls = await Promise.all(
        screenshotFiles.map(fileToBase64)
      );

      const ocrDetectedWords = await processScreenshots(screenshotDataUrls);
      const descriptionFlags = scanForTriggerWords(data.appDescription);

      const finalData = { ...data, screenshots: screenshotDataUrls };

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token && {
            Authorization: `Bearer ${session.access_token}`,
          }),
        },
        body: JSON.stringify({
          wizardData: finalData,
          ocrDetectedWords,
          descriptionFlags,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Analysis failed. Please try again.");
      }

      const { reportId } = await res.json();
      router.push(`/report/${reportId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.appName.trim().length > 0;
      case 8:
        return data.appDescription.trim().length > 0;
      default:
        return true;
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <LoadingSpinner size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Analyzing your submission...
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Scanning screenshots and evaluating guidelines
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Step Content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card padding="lg">
                {step === 1 && (
                  <StepAppBasics data={data} update={update} />
                )}
                {step === 2 && (
                  <StepAccountsLogin data={data} update={update} />
                )}
                {step === 3 && (
                  <StepPayments data={data} update={update} />
                )}
                {step === 4 && (
                  <StepUserContent data={data} update={update} />
                )}
                {step === 5 && (
                  <StepPrivacy data={data} update={update} />
                )}
                {step === 6 && (
                  <StepSensitive data={data} update={update} />
                )}
                {step === 7 && (
                  <StepMetadata data={data} update={update} />
                )}
                {step === 8 && (
                  <StepDescription data={data} update={update} />
                )}
                {step === 9 && (
                  <StepScreenshots
                    files={screenshotFiles}
                    onChange={setScreenshotFiles}
                  />
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
            className="gap-1.5"
          >
            <ChevronLeft size={16} />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button onClick={goNext} disabled={!canProceed()} className="gap-1.5">
              Continue
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed()} className="gap-2">
              <Sparkles size={16} />
              Analyze Submission
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step Components ───────────────────────────────────────────── */

interface StepProps {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

function StepAppBasics({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">App Basics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tell us about your application
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>App Name</FieldLabel>
          <input
            type="text"
            value={data.appName}
            onChange={(e) => update("appName", e.target.value)}
            placeholder="My Awesome App"
            className="input-field"
          />
        </div>

        <div>
          <FieldLabel>Platform</FieldLabel>
          <div className="flex gap-3">
            {["iOS", "macOS"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update("platform", p)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  data.platform === p
                    ? "text-white shadow-md bg-gradient-to-br from-apple-blue to-apple-cyan"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Is this a new app or an update?</FieldLabel>
          <div className="flex gap-3">
            {[
              { label: "New App", value: true },
              { label: "Update", value: false },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => update("isNewApp", opt.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  data.isNewApp === opt.value
                    ? "text-white shadow-md bg-gradient-to-br from-apple-blue to-apple-cyan"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Does the app crash or show errors?</FieldLabel>
          <ToggleButtons
            value={data.hasCrashes}
            onChange={(v) => update("hasCrashes", v)}
          />
        </div>

        <div>
          <FieldLabel>Does the app contain placeholder content?</FieldLabel>
          <ToggleButtons
            value={data.hasPlaceholderContent}
            onChange={(v) => update("hasPlaceholderContent", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StepAccountsLogin({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Accounts &amp; Login
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          How do users authenticate in your app?
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>Does your app require account creation?</FieldLabel>
          <ToggleButtons
            value={data.requiresAccount}
            onChange={(v) => update("requiresAccount", v)}
          />
        </div>

        <ConditionalReveal show={data.requiresAccount}>
          <div>
            <FieldLabel>
              Can users delete their account inside the app?
            </FieldLabel>
            <ToggleButtons
              value={data.canDeleteAccount}
              onChange={(v) => update("canDeleteAccount", v)}
            />
          </div>
        </ConditionalReveal>

        <div>
          <FieldLabel>What login methods exist?</FieldLabel>
          <CheckboxGroup
            options={LOGIN_METHODS}
            selected={data.loginMethods}
            onChange={(v) => update("loginMethods", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StepPayments({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
        <p className="text-sm text-gray-500 mt-1">
          How does your app handle transactions?
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>
            Does your app charge users for digital features?
          </FieldLabel>
          <ToggleButtons
            value={data.chargesForDigital}
            onChange={(v) => update("chargesForDigital", v)}
          />
        </div>

        <ConditionalReveal show={data.chargesForDigital}>
          <div className="space-y-5">
            <div>
              <FieldLabel>Does the app include subscriptions?</FieldLabel>
              <ToggleButtons
                value={data.hasSubscriptions}
                onChange={(v) => update("hasSubscriptions", v)}
              />
            </div>

            <ConditionalReveal show={data.hasSubscriptions}>
              <div>
                <FieldLabel>
                  Are subscriptions handled through Apple In-App Purchases?
                </FieldLabel>
                <ToggleButtons
                  value={data.usesIAP}
                  onChange={(v) => update("usesIAP", v)}
                />
              </div>
            </ConditionalReveal>
          </div>
        </ConditionalReveal>

        <div>
          <FieldLabel>
            Are external payment providers used (e.g., Stripe)?
          </FieldLabel>
          <ToggleButtons
            value={data.usesExternalPayments}
            onChange={(v) => update("usesExternalPayments", v)}
          />
        </div>

        <ConditionalReveal show={data.usesExternalPayments}>
          <div>
            <FieldLabel>Does payment occur:</FieldLabel>
            <RadioGroup
              options={[
                { label: "Inside the app", value: "inside" },
                { label: "External website (browser)", value: "external" },
              ]}
              value={data.paymentLocation}
              onChange={(v) => update("paymentLocation", v)}
            />
          </div>
        </ConditionalReveal>
      </div>
    </div>
  );
}

function StepUserContent({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          User Generated Content
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Content moderation and safety
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>Can users upload content?</FieldLabel>
          <ToggleButtons
            value={data.allowsUserContent}
            onChange={(v) => update("allowsUserContent", v)}
          />
        </div>

        <ConditionalReveal show={data.allowsUserContent}>
          <div className="space-y-5">
            <div>
              <FieldLabel>Can users report content?</FieldLabel>
              <ToggleButtons
                value={data.hasReporting}
                onChange={(v) => update("hasReporting", v)}
              />
            </div>

            <div>
              <FieldLabel>Can users block other users?</FieldLabel>
              <ToggleButtons
                value={data.hasBlocking}
                onChange={(v) => update("hasBlocking", v)}
              />
            </div>

            <div>
              <FieldLabel>Is moderation implemented?</FieldLabel>
              <ToggleButtons
                value={data.hasModeration}
                onChange={(v) => update("hasModeration", v)}
              />
            </div>
          </div>
        </ConditionalReveal>
      </div>
    </div>
  );
}

function StepPrivacy({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Privacy &amp; Permissions
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Data access and privacy compliance
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>Does the app request permissions for:</FieldLabel>
          <CheckboxGroup
            options={PERMISSIONS_LIST}
            selected={data.permissions}
            onChange={(v) => update("permissions", v)}
          />
        </div>

        <div>
          <FieldLabel>Is a privacy policy accessible in the app?</FieldLabel>
          <ToggleButtons
            value={data.hasPrivacyPolicy}
            onChange={(v) => update("hasPrivacyPolicy", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StepSensitive({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          AI &amp; Sensitive Categories
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Regulated and sensitive content areas
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>
            Does the app include AI-generated content?
          </FieldLabel>
          <ToggleButtons
            value={data.hasAIContent}
            onChange={(v) => update("hasAIContent", v)}
          />
        </div>

        <div>
          <FieldLabel>
            Does the app involve finance or cryptocurrency?
          </FieldLabel>
          <ToggleButtons
            value={data.involvesFinance}
            onChange={(v) => update("involvesFinance", v)}
          />
        </div>

        <div>
          <FieldLabel>Does the app involve gambling?</FieldLabel>
          <ToggleButtons
            value={data.involvesGambling}
            onChange={(v) => update("involvesGambling", v)}
          />
        </div>

        <div>
          <FieldLabel>Does it provide health advice?</FieldLabel>
          <ToggleButtons
            value={data.providesHealthAdvice}
            onChange={(v) => update("providesHealthAdvice", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StepMetadata({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Metadata</h2>
        <p className="text-sm text-gray-500 mt-1">
          App Store listing details
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>Does the app description mention pricing?</FieldLabel>
          <ToggleButtons
            value={data.descriptionMentionsPricing}
            onChange={(v) => update("descriptionMentionsPricing", v)}
          />
        </div>

        <div>
          <FieldLabel>
            Does it mention external subscriptions?
          </FieldLabel>
          <ToggleButtons
            value={data.descriptionMentionsExternalSubs}
            onChange={(v) => update("descriptionMentionsExternalSubs", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StepDescription({ data, update }: StepProps) {
  const charCount = data.appDescription.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          App Description
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Paste your App Store description for analysis
        </p>
      </div>

      <div>
        <textarea
          value={data.appDescription}
          onChange={(e) => update("appDescription", e.target.value)}
          rows={8}
          placeholder="Paste your full App Store description here..."
          className="input-field resize-none"
        />
        <div className="flex justify-end mt-2">
          <span
            className={`text-xs font-medium ${
              charCount > 4000 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {charCount.toLocaleString()} characters
          </span>
        </div>
      </div>
    </div>
  );
}

function StepScreenshots({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Screenshot Upload
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload your App Store screenshots for visual analysis
        </p>
      </div>

      <FileUpload onChange={onChange} maxFiles={10} />

      {files.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          {files.length} screenshot{files.length !== 1 && "s"} selected
        </p>
      )}
    </div>
  );
}
