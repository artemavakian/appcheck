"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ChevronDown, ChevronRight } from "lucide-react";
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

const mostCommon = MOST_COMMON_IDS.map((id) =>
  allGuidelines.find((g) => g.id === id)
).filter(Boolean) as Guideline[];

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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [openGuideline, setOpenGuideline] = useState<string | null>(null);
  const guidelineRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    const check = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setLoading(false);
    };
    check();
  }, [router]);

  const toggleCategory = useCallback((catId: string) => {
    setExpanded((prev) => ({ ...prev, [catId]: !prev[catId] }));
  }, []);

  const scrollToGuideline = useCallback(
    (guidelineId: string) => {
      const cat = GUIDELINE_CATEGORIES.find((c) =>
        c.guidelines.some((g) => g.id === guidelineId)
      );
      if (cat && !expanded[cat.id]) {
        setExpanded((prev) => ({ ...prev, [cat.id]: true }));
      }
      setOpenGuideline(guidelineId);

      setTimeout(() => {
        const el = guidelineRefs.current[guidelineId];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    },
    [expanded]
  );

  const filteredCategories: GuidelineCategory[] = search.trim()
    ? GUIDELINE_CATEGORIES.map((cat) => ({
        ...cat,
        guidelines: cat.guidelines.filter((g) => matchesSearch(g, search)),
      })).filter((cat) => cat.guidelines.length > 0)
    : GUIDELINE_CATEGORIES;

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
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
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

        {/* Search */}
        <div className="relative mb-10">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guidelines…"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 shadow-card focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
          />
        </div>

        {/* Most Common Rejections */}
        {!search.trim() && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-5">
              Most Common Rejections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mostCommon.map((g) => (
                <button
                  key={g.id}
                  onClick={() => scrollToGuideline(g.id)}
                  className="text-left bg-white rounded-xl border border-gray-200 shadow-card p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {g.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {g.whatItMeans}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All Guidelines */}
        <section>
          {!search.trim() && (
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-5">
              All Guidelines
            </h2>
          )}

          <div className="space-y-3">
            {filteredCategories.map((cat) => {
              const isExpanded = search.trim() ? true : expanded[cat.id];

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden"
                >
                  <button
                    onClick={() => !search.trim() && toggleCategory(cat.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="text-base font-semibold text-gray-900">
                      {cat.id}. {cat.name}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-400">
                      {cat.guidelines.length} guidelines
                      {!search.trim() && (
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 px-6 py-2">
                          {cat.guidelines.map((g) => (
                            <GuidelineEntry
                              key={g.id}
                              guideline={g}
                              isOpen={openGuideline === g.id || !!search.trim()}
                              onToggle={() =>
                                setOpenGuideline(
                                  openGuideline === g.id ? null : g.id
                                )
                              }
                              ref={(el) => {
                                guidelineRefs.current[g.id] = el;
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && search.trim() && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No guidelines matching &ldquo;{search}&rdquo;
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import { forwardRef } from "react";

const GuidelineEntry = forwardRef<
  HTMLDivElement,
  {
    guideline: Guideline;
    isOpen: boolean;
    onToggle: () => void;
  }
>(({ guideline, isOpen, onToggle }, ref) => {
  return (
    <div ref={ref} className="py-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-3 text-left group"
      >
        <ChevronRight
          size={14}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {guideline.title}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-8 pb-4 space-y-4">
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
                <ul className="space-y-1">
                  {guideline.commonRejections.map((r, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-gray-300 mt-1.5 shrink-0">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  How to fix
                </h4>
                <ul className="space-y-1">
                  {guideline.howToFix.map((f, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-blue-400 mt-1.5 shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

GuidelineEntry.displayName = "GuidelineEntry";
