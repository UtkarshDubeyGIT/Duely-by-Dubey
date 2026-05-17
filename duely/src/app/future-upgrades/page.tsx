"use client";

import React, { forwardRef, useRef } from "react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import { User, Wallet, Sparkles, MessageSquare, Zap, Globe } from "lucide-react";

// Components for Animated Beam
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-zinc-950",
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

const futureFeatures = [
  {
    title: "Multi-Currency Support",
    description: "Accept payments and send invoices in over 135 currencies worldwide.",
    quarter: "Q3 2026",
    status: "In Progress",
    icon: Globe,
  },
  {
    title: "Instant Payouts",
    description: "Get access to your funds immediately after a client pays, directly to your debit card.",
    quarter: "Q4 2026",
    status: "Planned",
    icon: Zap,
  },
  {
    title: "AI-Powered Smart Tones",
    description: "Let AI determine the perfect tone for your reminder based on past client payment behavior.",
    quarter: "Q1 2027",
    status: "Exploring",
    icon: Sparkles,
  }
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
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground">
      <SiteHeader />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-14 md:px-10 md:pb-28 md:pt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center mb-16">
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 md:text-6xl">
            The future of Duely.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d5157] dark:text-zinc-300 md:text-xl">
            We are constantly building new ways to make getting paid effortless. Here is a sneak peek at our roadmap and upcoming integrations.
          </p>
        </div>

        {/* Animated Beam Section */}
        <div className="mb-24 flex flex-col items-center">
          <h2 className="mb-8 font-display text-2xl font-bold text-[#181c22] dark:text-zinc-50">
            Upcoming Integrations
          </h2>
          <div
            className="relative flex h-[500px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-2xl border border-[#d8d8d8] bg-white p-10 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 md:shadow-xl"
            ref={containerRef}
          >
            <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div1Ref}>
                  <Wallet className="h-6 w-6 text-[#4b39e6]" />
                </Circle>
                <Circle ref={div5Ref}>
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </Circle>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div2Ref}>
                  <User className="h-6 w-6 text-pink-500" />
                </Circle>
                <Circle ref={div4Ref} className="h-20 w-20">
                  <span className="font-display text-2xl font-bold text-[#181c22] dark:text-zinc-50">D</span>
                </Circle>
                <Circle ref={div6Ref}>
                  <Zap className="h-6 w-6 text-yellow-500" />
                </Circle>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div3Ref}>
                  <Sparkles className="h-6 w-6 text-orange-500" />
                </Circle>
                <Circle ref={div7Ref}>
                  <Globe className="h-6 w-6 text-blue-500" />
                </Circle>
              </div>
            </div>

            {/* Animated Beams */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div1Ref}
              toRef={div4Ref}
              curvature={-75}
              endYOffset={-10}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div2Ref}
              toRef={div4Ref}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div3Ref}
              toRef={div4Ref}
              curvature={75}
              endYOffset={10}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div5Ref}
              toRef={div4Ref}
              curvature={-75}
              endYOffset={-10}
              reverse
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div6Ref}
              toRef={div4Ref}
              reverse
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div7Ref}
              toRef={div4Ref}
              curvature={75}
              endYOffset={10}
              reverse
            />
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 font-display text-3xl font-bold text-[#181c22] dark:text-zinc-50 text-center">
            Feature Roadmap
          </h2>
          <div className="space-y-6">
            {futureFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-start gap-6 rounded-2xl border border-[#d8d8d8] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-all hover:shadow-md">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4b39e6]/10 text-[#4b39e6]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#181c22] dark:text-zinc-50">{feature.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-[#f3f3f4] px-2.5 py-0.5 text-xs font-semibold text-[#181c22] dark:bg-zinc-800 dark:text-zinc-200">
                        {feature.quarter}
                      </span>
                    </div>
                    <p className="text-[#4d5157] dark:text-zinc-300 mb-4">{feature.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        feature.status === 'In Progress' ? 'bg-[#4b39e6]' : 
                        feature.status === 'Planned' ? 'bg-orange-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm font-medium text-[#6b6e72] dark:text-zinc-400">{feature.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
