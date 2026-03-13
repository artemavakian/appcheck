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

    const handleCallback = async () => {
      try {
        const supabase = createClient();
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          router.replace("/");
          return;
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.user) {
          console.error("Auth callback error:", error?.message);
          router.replace("/");
          return;
        }

        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (!existingUser) {
          await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email,
            scan_credits: 1,
          });
        }

        router.replace("/dashboard");
      } catch (err) {
        console.error("Auth callback failed:", err);
        router.replace("/");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-400 text-sm">Signing you in&hellip;</p>
    </div>
  );
}
