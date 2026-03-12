import { CheckCircle2, ClipboardList, ImageIcon, FileBarChart } from "lucide-react";
import Navbar from "@/components/Navbar";

const steps = [
  {
    num: 1,
    icon: ClipboardList,
    title: "Answer Questions",
    desc: "Tell us about your app\u2019s features, payments, and permissions.",
  },
  {
    num: 2,
    icon: ImageIcon,
    title: "Upload Screenshots",
    desc: "Add your App Store screenshots and description for analysis.",
  },
  {
    num: 3,
    icon: FileBarChart,
    title: "Get Your Report",
    desc: "Receive an instant risk report with actionable fixes.",
  },
];

const checks = [
  "Payment and subscription compliance",
  "Screenshot guideline violations",
  "Metadata issues",
  "Login and account requirements",
  "Privacy and permission disclosures",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── Hero ── */}
      <section className="py-24 md:py-32 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 max-w-3xl mx-auto leading-[1.08]">
          Check Your App{" "}
          <span className="gradient-text">Before Apple Does</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          AppCheck analyzes your App Store submission and flags potential
          rejection risks before you wait days for review.
        </p>
        <div className="mt-10">
          <a href="/login" className="btn-primary gap-2.5 text-base">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Continue with Apple
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          Join developers who ship with confidence
        </p>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-center text-gray-500 text-lg max-w-xl mx-auto">
            Three simple steps to a safer submission
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-white rounded-2xl shadow-card border border-gray-200/60 p-8 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full gradient-bg text-white flex items-center justify-center text-lg font-semibold mx-auto">
                  {s.num}
                </div>
                <s.icon
                  className="mx-auto mt-5 text-gray-400"
                  size={28}
                  strokeWidth={1.5}
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-gray-500 text-[15px] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avoid Weeks ── */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto bg-gray-100 rounded-3xl p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Avoid Weeks of Trial&nbsp;and&nbsp;Error
              </h2>
              <p className="mt-5 text-gray-500 text-lg leading-relaxed">
                Many developers wait days or weeks for App Store review only to
                have their app rejected for a simple issue. AppCheck analyzes
                your submission instantly and highlights potential guideline
                violations before you submit.
              </p>
              <a
                href="/login"
                className="btn-primary mt-8 gap-2 text-sm"
              >
                Get started free
              </a>
            </div>

            {/* Illustrative graphic placeholder */}
            <div className="relative aspect-square max-w-xs mx-auto md:ml-auto md:mr-0 w-full">
              <div className="absolute inset-0 rounded-3xl gradient-bg opacity-10" />
              <div className="absolute inset-4 rounded-2xl bg-white shadow-card flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={28} />
                </div>
                <div className="space-y-2 w-3/4">
                  <div className="h-2.5 rounded-full bg-green-200 w-full" />
                  <div className="h-2.5 rounded-full bg-green-200 w-4/5" />
                  <div className="h-2.5 rounded-full bg-amber-200 w-3/5" />
                </div>
                <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">
                  Risk Report
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What It Checks ── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 tracking-tight">
            What AppCheck Analyzes
          </h2>
          <p className="mt-4 text-center text-gray-500 text-lg">
            Comprehensive coverage of the most common rejection reasons
          </p>

          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checks.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-200/60 shadow-soft p-5"
              >
                <CheckCircle2
                  className="text-apple-blue mt-0.5 shrink-0"
                  size={20}
                  strokeWidth={2}
                />
                <span className="text-gray-800 font-medium text-[15px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            About AppCheck
          </h2>
          <p className="mt-6 text-gray-500 text-lg leading-relaxed">
            AppCheck helps developers identify App Store guideline risks before
            submitting their apps for review. Our analysis engine checks your
            submission against Apple&rsquo;s latest guidelines and flags
            potential issues, saving you time and frustration.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200/60 bg-gray-100/60">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; 2024 AppCheck. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
