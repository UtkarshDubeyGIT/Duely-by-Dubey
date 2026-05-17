"use client";

import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ShineBorder } from "@/components/ui/shine-border";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  BellRing,
  Clock,
  MoreHorizontal,
  Brain,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Create your first invoice",
    description:
      "Use our intuitive dialogue box to quickly generate a professional invoice. Add line items, specify rates, choose your client, and set the due date — all in just a few clicks.",
    image: "/assets/Screenshots/invoice-dialogue-box.png",
    tips: ["Auto-fills client details", "Supports multiple line items", "Sets due date & payment terms"],
    color: "#4b39e6",
  },
  {
    number: "02",
    icon: BellRing,
    title: "Set up smart reminders",
    description:
      "Configure automated follow-ups. Duely generates a 5-step reminder schedule when you create an invoice. The tone escalates from gentle to firm as the due date approaches.",
    image: "/assets/Screenshots/reminder-dialogue-box.png",
    tips: ["7 days before — gentle heads up", "1 day before — friendly nudge", "Day of due — firm reminder"],
    color: "#22c55e",
  },
  {
    number: "03",
    icon: Clock,
    title: "Track upcoming reminders",
    description:
      "Always know what's coming next. Our upcoming reminders view gives you a clear look at which clients are about to be nudged, so nothing ever slips through the cracks.",
    image: "/assets/Screenshots/upcoming-reminders.png",
    tips: ["Chronological timeline", "Shows client & invoice details", "Pause or cancel any reminder"],
    color: "#f59e0b",
  },
  {
    number: "04",
    icon: MoreHorizontal,
    title: "Manage invoice actions",
    description:
      "Easily mark invoices as paid, send immediate reminders, or delete them directly from the actions menu. Every action is logged so you always have a complete paper trail.",
    image: "/assets/Screenshots/actions-invoice.png",
    tips: ["One-click mark as paid", "Instant manual reminder", "Full reminder activity log"],
    color: "#ec4899",
  },
  {
    number: "05",
    icon: Brain,
    title: "Review Gemini AI financial insights",
    description:
      "Get clear, actionable recommendations directly on your dashboard. Duely securely passes organization analytics to Google Gemini to calculate cash flow velocity, flag at-risk clients, and suggest collection workflows automatically.",
    image: "/assets/Screenshots/dashboard.png",
    tips: [
      "No setup required besides GEMINI_API_KEY",
      "Identifies paying trends and outstanding debts",
      "Includes precise, actionable advice with no fluff",
    ],
    color: "#6366f1",
  },
];

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <DotPattern
          className={cn(
            "absolute inset-0 opacity-30 dark:opacity-20",
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-10 text-center">
          <BlurFade delay={0.1} inView>
            <span className="inline-flex items-center rounded-full border border-[#4b39e6]/30 bg-[#4b39e6]/10 px-4 py-1.5 text-sm font-medium text-[#4b39e6]">
              ⚡ Up and running in minutes
            </span>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl">
              How to use{" "}
              <AnimatedGradientText colorFrom="#4b39e6" colorTo="#22c55e" speed={2}>
                Duely.
              </AnimatedGradientText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#4d5157] dark:text-zinc-300 sm:text-lg md:text-xl">
              A step-by-step guide to setting up your first invoice and putting your
              entire payment collection on autopilot.
            </p>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <div className="mt-8 flex justify-center">
              <Link href="/signup">
                <ShimmerButton
                  background="rgba(75,57,230,1)"
                  shimmerColor="#818cf8"
                  className="px-8 py-3 text-sm font-semibold"
                >
                  Get started for free →
                </ShimmerButton>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-10 md:py-24">
        <div className="space-y-20 md:space-y-32">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <BlurFade key={idx} delay={0.15} inView direction={idx % 2 === 0 ? "left" : "right"}>
                <div
                  className={`flex flex-col items-center gap-10 md:gap-16 ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* Text Column */}
                  <div className="flex-1 w-full min-w-0 space-y-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white text-sm font-bold shadow-lg"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.number}
                      </div>
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: step.color + "20", color: step.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <TextAnimate
                      as="h2"
                      animation="blurInUp"
                      by="word"
                      className="font-display text-2xl font-bold text-[#181c22] dark:text-zinc-50 sm:text-3xl md:text-4xl"
                    >
                      {step.title}
                    </TextAnimate>

                    <p className="text-base leading-7 text-[#4d5157] dark:text-zinc-300 sm:text-lg">
                      {step.description}
                    </p>

                    <ul className="space-y-2.5">
                      {step.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex items-center gap-3 text-sm text-[#4d5157] dark:text-zinc-400">
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-xs"
                            style={{ backgroundColor: step.color }}
                          >
                            ✓
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Screenshot Column — ShineBorder as overlay inside a relative wrapper */}
                  <div className="flex-1 w-full min-w-0">
                    <div
                      className="relative rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-zinc-950"
                      style={{ border: `2px solid transparent` }}
                    >
                      {/* ShineBorder used correctly as an absolute overlay */}
                      <ShineBorder
                        shineColor={[step.color, "#818cf8"]}
                        borderWidth={2}
                        duration={10}
                      />
                      {/* Actual image with explicit dimensions */}
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-left-top transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="border-t border-[#e5e5e5] dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 md:py-24">
        <BlurFade delay={0.1} inView>
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="font-display text-2xl font-bold text-[#181c22] dark:text-zinc-50 sm:text-3xl md:text-4xl">
              Ready to stop chasing payments?
            </h2>
            <p className="mt-4 text-base text-[#4d5157] dark:text-zinc-300 sm:text-lg">
              Join Duely and put your entire follow-up workflow on autopilot.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link href="/signup">
                <ShimmerButton
                  background="rgba(75,57,230,1)"
                  shimmerColor="#818cf8"
                  className="px-8 py-3 text-sm font-semibold"
                >
                  Start for free
                </ShimmerButton>
              </Link>
              <Link
                href="/login?demo=true"
                className="inline-flex items-center rounded-full border border-[#d6d7db] bg-transparent px-8 py-3 text-sm font-medium text-[#181c22] dark:text-zinc-50 hover:bg-[#f3f3f4] dark:hover:bg-zinc-900 transition-colors"
              >
                Try the demo first
              </Link>
            </div>
          </div>
        </BlurFade>
      </section>

      <SiteFooter />
    </main>
  );
}
