"use client";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Particles } from "@/components/ui/particles";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BrandLogoLink } from "@/components/shared/BrandLogoLink";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";

/* ─── tiny data ─────────────────────────────────────────── */
const stats = [
  { label: "Invoices sent", value: 2400, suffix: "+" },
  { label: "Avg. payment time", value: 3, suffix: " days" },
  { label: "Collection rate", value: 98, suffix: "%" },
];

const features = [
  { icon: Zap, text: "Instant invoice generation" },
  { icon: Clock, text: "Automated payment reminders" },
  { icon: TrendingUp, text: "Revenue analytics at a glance" },
];

/* ─── mock invoice cards ────────────────────────────────── */
const mockInvoices = [
  { client: "Aryan Designs", amount: "₹18,500", status: "Paid", daysAgo: 2 },
  { client: "Mehta & Co.", amount: "₹42,000", status: "Pending", daysAgo: 5 },
  { client: "Pixel Labs", amount: "₹9,750", status: "Paid", daysAgo: 7 },
];

export function AuthLeftPanel() {
  return (
    <section className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-zinc-950 p-10 lg:flex">
      {/* ── animated grid background ─────────────────────── */}
      <AnimatedGridPattern
        numSquares={28}
        maxOpacity={0.06}
        duration={3}
        className={cn(
          "inset-x-0 inset-y-[-30%] h-[160%] skew-y-12",
          "[mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]",
          "stroke-indigo-400/20 fill-indigo-400/10"
        )}
      />

      {/* ── indigo radial glow ───────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_70%,rgba(99,102,241,0.18)_0%,transparent_70%)]" />

      {/* ── interactive particles ────────────────────────── */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={60}
        staticity={40}
        ease={60}
        size={0.5}
        color="#818cf8"
      />

      {/* ─────────── CONTENT (above particles) ──────────── */}
      <div className="relative z-10 flex flex-col justify-between h-full">

        {/* Logo */}
        <BrandLogoLink
          className="-ml-3"
          imageClassName="h-18 w-auto brightness-0 invert"
        />

        {/* Hero text */}
        <div className="max-w-xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            By Dubey
          </p>
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Get paid on time,{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              without the awkward follow-ups.
            </span>
          </h1>
          <p className="text-lg text-zinc-400">
            Smart invoice tracking, human-sounding reminders, and clean payment
            visibility for small businesses.
          </p>

          {/* Feature pills */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm"
              >
                <Icon className="size-3.5 shrink-0" />
                {text}
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {stats.map(({ label, value, suffix }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <p className="text-2xl font-extrabold text-white tabular-nums">
                  <NumberTicker value={value} delay={0.2} />
                  <span className="text-indigo-400">{suffix}</span>
                </p>
                <p className="mt-1 text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Mock invoice cards */}
          <div className="mt-8 space-y-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Recent activity
            </p>
            {mockInvoices.map(({ client, amount, status, daysAgo }) => (
              <div
                key={client}
                className="flex items-center justify-between rounded-lg border border-white/8 bg-white/5 px-4 py-2.5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={cn(
                      "size-4 shrink-0",
                      status === "Paid"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    )}
                  />
                  <span className="text-sm font-medium text-zinc-200">
                    {client}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500">
                    {daysAgo}d ago
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      status === "Paid"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    )}
                  >
                    {status}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-600">Built for BinaryAutomates review.</p>
      </div>
    </section>
  );
}
