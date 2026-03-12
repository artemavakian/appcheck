"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setEmailLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setEmailSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch {
        // Not logged in — stay on login page
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="text-2xl font-bold tracking-tight text-gray-900">
            AppCheck
          </a>
          <p className="mt-3 text-gray-500 text-sm">
            Sign in to check your app before Apple does.
          </p>
        </div>

        {/* Apple Sign In */}
        <button
          onClick={handleAppleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-black text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <LoadingSpinner size="sm" color="#FFFFFF" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          )}
          Continue with Apple
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <button
              onClick={() => setShowEmailLogin(!showEmailLogin)}
              className="bg-white px-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              or sign in with email
            </button>
          </div>
        </div>

        {/* Email Login (dev fallback) */}
        {showEmailLogin && (
          <div className="space-y-4">
            {emailSent ? (
              <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-200">
                <p className="text-green-700 font-medium text-sm">
                  Check your email
                </p>
                <p className="text-green-600 text-xs mt-1">
                  We sent a magic link to <strong>{email}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  loading={emailLoading}
                  className="w-full"
                >
                  Send Magic Link
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            &larr; Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
