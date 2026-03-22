"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  GUIDELINE_CATEGORIES,
  MOST_COMMON_IDS,
  type Guideline,
  type GuidelineCategory,
} from "@/lib/guidelines-data";

const allGuidelines = GUIDELINE_CATEGORIES.flatMap((c) => c.guidelines);

const mostCommonGuidelines = MOST_COMMON_IDS.map((id) =>
  allGuidelines.find((g) => g.id === id)
).filter(Boolean) as Guideline[];

const MOST_COMMON_SECTION: GuidelineCategory = {
  id: "common",
  name: "Most Common Rejections",
  guidelines: mostCommonGuidelines,
};

function matchesSearch(g: Guideline, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    g.title.toLowerCase().includes(lower) ||
    g.whatItMeans.toLowerCase().includes(lower) ||
    g.commonRejections.some((r) => r.toLowerCase().includes(lower)) ||
    g.howToFix.some((f) => f.toLowerCase().includes(lower))
  );
}

export default function GuidelinesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<GuidelineCategory | null>(null);
  const checked = useRef(false);

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
      setLoading(false);
    };
    check();
  }, [router]);

  const searchResults = search.trim()
    ? allGuidelines.filter((g) => matchesSearch(g, search))
    : [];

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
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          {activeSection ? (
            <button
              onClick={() => setActiveSection(null)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeSection ? (
            <SectionView
              key={activeSection.id}
              section={activeSection}
            />
          ) : (
            <HomeView
              key="home"
              search={search}
              setSearch={setSearch}
              searchResults={searchResults}
              onSelectSection={setActiveSection}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function HomeView({
  search,
  setSearch,
  searchResults,
  onSelectSection,
}: {
  search: string;
  setSearch: (s: string) => void;
  searchResults: Guideline[];
  onSelectSection: (s: GuidelineCategory) => void;
}) {
  const [searchOpen, setSearchOpen] = useState<Guideline | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          App Store Guideline Library
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          A developer-friendly breakdown of App Store review guidelines and
          common rejection reasons.
        </p>
      </div>

      {/* Search + Most Common side by side */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guidelines…"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm"
          />

          {search.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl z-40 max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  No guidelines matching &ldquo;{search}&rdquo;
                </div>
              ) : (
                searchResults.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSearchOpen(searchOpen?.id === g.id ? null : g);
                    }}
                    className="w-full text-left px-5 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {g.title}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => onSelectSection(MOST_COMMON_SECTION)}
          className="shrink-0 gradient-bg rounded-xl shadow-card px-4 py-3 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
        >
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            Most Common Rejections
          </span>
          <ArrowUpRight size={16} className="text-white/80" />
        </button>
      </div>

      {/* All Guidelines label */}
      <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-3">
        All Guidelines
      </h2>

      {/* Category tiles */}
      <div className="space-y-3">
        {GUIDELINE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectSection(cat)}
            className="w-full text-left bg-white rounded-2xl border border-gray-200 shadow-card p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-between"
          >
            <span className="text-base font-semibold text-gray-900">
              {cat.id}. {cat.name} Guidelines
            </span>
            <span className="text-xs text-gray-400">
              {cat.guidelines.length} guidelines
            </span>
          </button>
        ))}
      </div>

      {/* Search result detail modal */}
      <AnimatePresence>
        {searchOpen && (
          <GuidelineDetailModal
            guideline={searchOpen}
            onClose={() => setSearchOpen(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionView({
  section,
}: {
  section: GuidelineCategory;
}) {
  const isCommon = section.id === "common";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isCommon
            ? "Most Common Rejections"
            : `${section.id}. ${section.name} Guidelines`}
        </h1>
      </div>

      <div className="space-y-2">
        {section.guidelines.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden"
          >
            <button
              onClick={() => toggle(g.id)}
              className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900">{g.title}</p>
              <ChevronDown
                size={16}
                className={`text-gray-400 shrink-0 ml-3 transition-transform duration-200 ${
                  expandedId === g.id ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {expandedId === g.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        What it means
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {g.whatItMeans}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        Common rejection reasons
                      </h4>
                      <ul className="space-y-1.5">
                        {g.commonRejections.map((r, j) => (
                          <li
                            key={j}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-gray-300 mt-1 shrink-0">•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        How to fix
                      </h4>
                      <ul className="space-y-1.5">
                        {g.howToFix.map((f, j) => (
                          <li
                            key={j}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-blue-400 mt-1 shrink-0">•</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function GuidelineDetailModal({
  guideline,
  onClose,
}: {
  guideline: Guideline;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-base font-semibold text-gray-900 pr-4">
            {guideline.title}
          </h3>
          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              What it means
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {guideline.whatItMeans}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Common rejection reasons
            </h4>
            <ul className="space-y-1.5">
              {guideline.commonRejections.map((r, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-600 flex items-start gap-2"
                >
                  <span className="text-gray-300 mt-1 shrink-0">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              How to fix
            </h4>
            <ul className="space-y-1.5">
              {guideline.howToFix.map((f, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-600 flex items-start gap-2"
                >
                  <span className="text-blue-400 mt-1 shrink-0">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
