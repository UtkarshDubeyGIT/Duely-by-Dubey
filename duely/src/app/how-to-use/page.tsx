"use client";

import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
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
];

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
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
            <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 md:text-7xl">
              How to use{" "}
              <AnimatedGradientText colorFrom="#4b39e6" colorTo="#22c55e" speed={2}>
                Duely.
              </AnimatedGradientText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#4d5157] dark:text-zinc-300 md:text-xl">
              A step-by-step guide to setting up your first invoice and putting your
              entire payment collection on autopilot.
            </p>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <div className="mt-10 flex justify-center">
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
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-10 md:pb-28">
        <div className="space-y-24 md:space-y-36">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <BlurFade key={idx} delay={0.15} inView direction={idx % 2 === 0 ? "left" : "right"}>
                <div
                  className={`flex flex-col items-center gap-12 md:gap-16 ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* Text */}
                  <div className="flex-1 w-full space-y-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white text-sm font-bold shadow-lg"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.number}
                      </div>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: step.color + "20", color: step.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <TextAnimate
                      as="h2"
                      animation="blurInUp"
                      by="word"
                      className="font-display text-3xl font-bold text-[#181c22] dark:text-zinc-50 md:text-4xl"
                    >
                      {step.title}
                    </TextAnimate>

                    <p className="text-lg leading-8 text-[#4d5157] dark:text-zinc-300">
                      {step.description}
                    </p>

                    <ul className="space-y-2">
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

                  {/* Screenshot with MagicCard + ShineBorder */}
                  <div className="flex-1 w-full">
                    <ShineBorder
                      className="rounded-2xl overflow-hidden shadow-xl dark:bg-zinc-950 bg-white"
                      shineColor={[step.color, "#818cf8"]}
                      borderWidth={2}
                      duration={10}
                    >
                      <MagicCard
                        className="rounded-2xl overflow-hidden"
                        gradientColor={step.color + "15"}
                      >
                        <div className="relative aspect-video w-full overflow-hidden">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover object-left-top transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      </MagicCard>
                    </ShineBorder>
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="border-t border-[#e5e5e5] dark:border-zinc-800 bg-white dark:bg-zinc-950 py-20">
        <BlurFade delay={0.1} inView>
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-[#181c22] dark:text-zinc-50 md:text-4xl">
              Ready to stop chasing payments?
            </h2>
            <p className="mt-4 text-lg text-[#4d5157] dark:text-zinc-300">
              Join Duely and put your entire follow-up workflow on autopilot.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
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
