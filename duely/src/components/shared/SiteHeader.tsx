"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogoLink } from "@/components/shared/BrandLogoLink";
import { ButtonLink } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/ModeToggle";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/how-to-use", label: "How To Use" },
  { href: "/future-upgrades", label: "Future Upgrades" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d8d8]/80 dark:border-[#d8d8d8]/20 bg-white dark:bg-zinc-950/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
        <BrandLogoLink priority imageClassName="h-16 w-auto md:h-18" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#181c22] dark:text-zinc-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#4b39e6]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Link
            href="/login"
            className="hidden text-sm font-medium text-[#181c22] dark:text-zinc-200 transition-colors hover:text-[#4b39e6] sm:inline-flex"
          >
            Log in
          </Link>
          <ButtonLink
            href="/signup"
            className="hidden sm:inline-flex rounded-full bg-[#181c22] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4b39e6]"
          >
            Sign up
          </ButtonLink>
          {/* Mobile hamburger */}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#181c22] dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="border-t border-[#d8d8d8]/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 md:hidden">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-[#181c22] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#e5e5e5] dark:border-zinc-800 pt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-[#181c22] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Log in
              </Link>
              <ButtonLink
                href="/signup"
                className="rounded-full bg-[#181c22] px-5 py-2.5 text-sm font-medium text-white text-center hover:bg-[#4b39e6]"
              >
                Sign up for free
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
