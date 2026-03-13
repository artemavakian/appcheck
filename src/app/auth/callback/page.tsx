"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const supabase = createClient();

    async function ensureProfile(userId: string, email?: string | null) {
      try {
        const { data } = await supabase
          .from("users")
          .select("id")
          .eq("id", userId)
          .single();
        if (!data) {
          await supabase
            .from("users")
            .insert({ id: userId, email: email ?? null, scan_credits: 1 });
        }
      } catch {
        // Profile creation is best-effort; the DB trigger may handle it
      }
    }

    async function handleAuth() {
      // 1. Try PKCE flow: exchange code from query params
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.session) {
          await ensureProfile(data.session.user.id, data.session.user.email);
          router.replace("/dashboard");
          return;
        }
      }

      // 2. Try implicit flow: session auto-established from hash fragment
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await ensureProfile(session.user.id, session.user.email);
        router.replace("/dashboard");
        return;
      }

      // 3. Fallback: listen for auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session) {
            await ensureProfile(session.user.id, session.user.email);
            subscription.unsubscribe();
            router.replace("/dashboard");
          }
        }
      );

      // 4. Timeout: if nothing works after 10s, go home
      setTimeout(() => {
        subscription.unsubscribe();
        router.replace("/");
      }, 10000);
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-400 text-sm">Signing you in&hellip;</p>
    </div>
  );
}
