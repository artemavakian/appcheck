"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DashboardNavProps {
  credits?: number;
  onRedeemSuccess?: () => void;
}

export default function DashboardNav({}: DashboardNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-tight text-white"
        >
          AppCheck
        </Link>

        <div className="hidden sm:flex items-center gap-5">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-sm font-medium text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            Sign Out
            <LogOut size={13} />
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 -mr-2 text-white/60 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-4 space-y-3">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="block text-sm font-medium text-white/50 hover:text-white transition-colors disabled:opacity-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
