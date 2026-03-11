"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Zap, LogOut, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface DashboardNavProps {
  credits: number;
}

export default function DashboardNav({ credits }: DashboardNavProps) {
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          AppCheck
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            <Zap size={14} className="text-apple-blue" />
            {credits} Credit{credits !== 1 ? "s" : ""}
          </div>

          <Link href="/dashboard?buy=true">
            <Button variant="secondary" size="sm">
              <CreditCard size={14} />
              Buy Credits
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            loading={signingOut}
          >
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl px-6 py-4 space-y-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <Zap size={14} className="text-apple-blue" />
            {credits} Credit{credits !== 1 ? "s" : ""}
          </div>

          <Link
            href="/dashboard?buy=true"
            className="block"
            onClick={() => setMobileOpen(false)}
          >
            <Button variant="secondary" size="sm" className="w-full">
              <CreditCard size={14} />
              Buy Credits
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleSignOut}
            loading={signingOut}
          >
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>
      )}
    </nav>
  );
}
