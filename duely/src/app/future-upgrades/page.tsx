"use client";

import React, { forwardRef, useRef } from "react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { MorphingText } from "@/components/ui/morphing-text";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ShineBorder } from "@/components/ui/shine-border";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import {
  User,
  Wallet,
  Sparkles,
  MessageSquare,
  Zap,
  Globe,
  BrainCircuit,
  Receipt,
  Smartphone,
  GitBranch,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

// Circle component for AnimatedBeam
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => (
  <div className="flex flex-col items-center gap-2">
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#e5e5e5] dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md",
        className
      )}
    >
      {children}
    </div>
    {label && (
      <span className="text-xs text-[#6b6e72] dark:text-zinc-400 font-medium text-center">
        {label}
      </span>
    )}
  </div>
));
Circle.displayName = "Circle";

const futureFeatures = [
  {
    title: "Multi-Currency Support",
    description:
      "Accept payments and send invoices in over 135 currencies worldwide. Automatic FX conversion at the moment of payment.",
    quarter: "Q3 2026",
    status: "In Progress",
    statusColor: "#4b39e6",
    icon: Globe,
    bgColor: "#4b39e620",
    iconColor: "#4b39e6",
  },
  {
    title: "AI Predictive Cash Flow v2",
    description:
      "Expand our Gemini AI engine to predict cash flow constraints, suggest optimal invoicing dates, and generate personalized negotiation scripts for overdue accounts.",
    quarter: "Q3 2026",
    status: "Planned",
    statusColor: "#f59e0b",
    icon: Sparkles,
    bgColor: "#f59e0b20",
    iconColor: "#f59e0b",
  },
  {
    title: "Instant Payouts",
    description:
      "Get access to your funds the same day a client pays. Direct transfer to your debit card or bank account.",
    quarter: "Q4 2026",
    status: "Planned",
    statusColor: "#f59e0b",
    icon: Zap,
    bgColor: "#f59e0b20",
    iconColor: "#f59e0b",
  },
  {
    title: "AI-Powered Smart Tones",
    description:
      "Let AI determine the perfect reminder tone based on past payment behavior, invoice size, and client history.",
    quarter: "Q1 2027",
    status: "Exploring",
    statusColor: "#ec4899",
    icon: BrainCircuit,
    bgColor: "#ec489920",
    iconColor: "#ec4899",
  },
  {
    title: "Mobile App",
    description:
      "Manage invoices, check payment status, and send reminders from anywhere with a native iOS and Android app.",
    quarter: "Q2 2027",
    status: "Planned",
    statusColor: "#f59e0b",
    icon: Smartphone,
    bgColor: "#22c55e20",
    iconColor: "#22c55e",
  },
  {
    title: "Accounting Integrations",
    description:
      "One-click sync with QuickBooks, Xero, Tally, and Zoho Books. Keep your books reconciled automatically.",
    quarter: "Q3 2027",
    status: "Exploring",
    statusColor: "#ec4899",
    icon: BarChart3,
    bgColor: "#38bdf820",
    iconColor: "#38bdf8",
  },
  {
    title: "Recurring Invoices",
    description:
      "Set up subscriptions and recurring billing cycles so repeat clients are billed automatically every month.",
    quarter: "Q4 2027",
    status: "Planned",
    statusColor: "#f59e0b",
    icon: Receipt,
    bgColor: "#a855f720",
    iconColor: "#a855f7",
  },
];

const morphingWords = [
  "Effortless.",
  "Automated.",
  "Intelligent.",
  "Lightning-fast.",
  "Yours.",
];

export default function FutureUpgradesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* Hero with MorphingText */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(75,57,230,0.1),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-10 text-center">
          <BlurFade delay={0.1} inView>
            <span className="inline-flex items-center rounded-full border border-[#4b39e6]/30 bg-[#4b39e6]/10 px-4 py-1.5 text-sm font-medium text-[#4b39e6]">
              🗺️ Our 2026–2027 Roadmap
            </span>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <h1 className="mx-auto mt-6 max-w-5xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 md:text-7xl">
              The future of payments is{" "}
              <AnimatedGradientText colorFrom="#4b39e6" colorTo="#22c55e" speed={2}>
                getting closer.
              </AnimatedGradientText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div className="mt-4 flex justify-center">
              <MorphingText
                texts={morphingWords}
                className="font-display text-3xl font-bold text-[#4b39e6] md:text-4xl"
              />
            </div>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#4d5157] dark:text-zinc-300 md:text-xl">
              We're constantly building new ways to make getting paid effortless.
              Here's a sneak peek at what's coming to Duely.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* Orbiting Circles — "Integrations" Visual */}
      <section className="bg-[#181c22] py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <BlurFade delay={0.1} inView>
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                Built to connect with everything
              </h2>
              <p className="mt-4 text-lg text-white/60">
                Duely is expanding to integrate with the tools you already love.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden">
              {/* Center */}
              <div className="z-20 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#4b39e6] bg-white dark:bg-zinc-900 shadow-[0_0_40px_rgba(75,57,230,0.4)]">
                <span className="font-display text-3xl font-bold text-[#4b39e6]">D</span>
              </div>

              {/* Inner orbit */}
              <OrbitingCircles radius={110} duration={20} iconSize={40}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                  <Wallet className="h-5 w-5 text-[#4b39e6]" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
              </OrbitingCircles>

              {/* Outer orbit (reverse) */}
              <OrbitingCircles radius={200} duration={30} reverse iconSize={50}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                  <BrainCircuit className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                  <BarChart3 className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                  <Smartphone className="h-6 w-6 text-pink-500" />
                </div>
              </OrbitingCircles>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Animated Beam — Upcoming Integrations */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-10 md:py-28">
        <BlurFade delay={0.1} inView>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-[#181c22] dark:text-zinc-50 md:text-4xl">
              Upcoming Integrations
            </h2>
            <p className="mt-4 text-[#4d5157] dark:text-zinc-400">
              Duely will connect seamlessly to your existing workflow.
            </p>
          </div>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <div
            className="relative mx-auto flex h-[440px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-2xl border border-[#d8d8d8] dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 shadow-lg"
            ref={containerRef}
          >
            <BorderBeam size={250} duration={10} colorFrom="#4b39e6" colorTo="#22c55e" />
            <div className="flex h-full w-full flex-col items-stretch justify-between gap-8">
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div1Ref} label="Payments">
                  <Wallet className="h-6 w-6 text-[#4b39e6]" />
                </Circle>
                <Circle ref={div5Ref} label="WhatsApp">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </Circle>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div2Ref} label="Clients">
                  <User className="h-6 w-6 text-pink-500" />
                </Circle>
                <Circle ref={div4Ref} className="h-20 w-20 border-[#4b39e6] shadow-[0_0_25px_rgba(75,57,230,0.3)]" label="Duely">
                  <span className="font-display text-2xl font-bold text-[#4b39e6]">D</span>
                </Circle>
                <Circle ref={div6Ref} label="Automation">
                  <Zap className="h-6 w-6 text-yellow-500" />
                </Circle>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div3Ref} label="AI Engine">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                </Circle>
                <Circle ref={div7Ref} label="Global">
                  <Globe className="h-6 w-6 text-blue-500" />
                </Circle>
              </div>
            </div>

            <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={-60} gradientStartColor="#4b39e6" gradientStopColor="#818cf8" />
            <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} gradientStartColor="#ec4899" gradientStopColor="#f472b6" />
            <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={60} gradientStartColor="#f59e0b" gradientStopColor="#fbbf24" />
            <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div4Ref} curvature={-60} reverse gradientStartColor="#22c55e" gradientStopColor="#4ade80" />
            <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse gradientStartColor="#eab308" gradientStopColor="#facc15" />
            <AnimatedBeam containerRef={containerRef} fromRef={div7Ref} toRef={div4Ref} curvature={60} reverse gradientStartColor="#38bdf8" gradientStopColor="#7dd3fc" />
          </div>
        </BlurFade>
      </section>

      {/* Roadmap Grid */}
      <section className="border-t border-[#e5e5e5] dark:border-zinc-800 bg-white dark:bg-zinc-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <BlurFade delay={0.1} inView>
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-[#181c22] dark:text-zinc-50 md:text-4xl">
              Feature Roadmap
            </h2>
          </BlurFade>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {futureFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <BlurFade key={idx} delay={0.07 * idx} inView>
                  <MagicCard
                    className="h-full rounded-2xl border border-[#e5e5e5] dark:border-zinc-800 bg-[#f9f9f7] dark:bg-zinc-950 p-6 cursor-default"
                    gradientColor={feature.iconColor + "15"}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: feature.bgColor, color: feature.iconColor }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="rounded-full bg-[#f3f3f4] dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-[#181c22] dark:text-zinc-200">
                          {feature.quarter}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: feature.statusColor }}>
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: feature.statusColor }}
                          />
                          {feature.status}
                        </span>
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[#181c22] dark:text-zinc-50">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-6 text-[#4d5157] dark:text-zinc-400">
                      {feature.description}
                    </p>
                  </MagicCard>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <BlurFade delay={0.1} inView>
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-[#181c22] dark:text-zinc-50 md:text-4xl">
              Don't wait for the future.
            </h2>
            <p className="mt-4 text-lg text-[#4d5157] dark:text-zinc-300">
              The core features are live today. Start getting paid on time, every time.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link href="/signup">
                <ShimmerButton
                  background="rgba(75,57,230,1)"
                  shimmerColor="#818cf8"
                  className="px-8 py-3 text-sm font-semibold"
                >
                  Start for free →
                </ShimmerButton>
              </Link>
              <Link
                href="/how-to-use"
                className="inline-flex items-center rounded-full border border-[#d6d7db] bg-white dark:bg-zinc-900 px-8 py-3 text-sm font-medium text-[#181c22] dark:text-zinc-50 hover:bg-[#f3f3f4] dark:hover:bg-zinc-800 transition-colors"
              >
                See how it works
              </Link>
            </div>
          </div>
        </BlurFade>
      </section>

      <SiteFooter />
    </main>
  );
}
