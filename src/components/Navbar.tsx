"use client";

import { useState } from "react";
import { Menu, X, ListChecks } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why?", href: "#why" },
  { label: "About Us", href: "#about-us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 flex items-center justify-center gradient-bg" style={{ borderRadius: "22.5%" }}>
            <ListChecks size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">AppCheck</span>
        </a>

        <div className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign In
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="block text-sm text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Sign In
          </a>
        </div>
      )}
    </nav>
  );
}
