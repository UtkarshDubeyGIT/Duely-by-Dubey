"use client";

import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Safari } from "@/components/ui/safari";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import {
  BellRing,
  FileText,
  Users,
  Activity,
  CheckCircle2,
  Gauge,
  Sparkles,
  Shield,
  Mail,
  Brain,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    Icon: Activity,
    name: "Dashboard Analytics",
    description:
      "Get a bird's-eye view of your business's financial health, outstanding invoices, and upcoming reminders.",
    href: "/login?demo=true",
    cta: "Try demo",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-full w-full overflow-hidden opacity-50 transition-all duration-500 group-hover:opacity-80 group-hover:scale-[1.02]">
        <Image
          src="/assets/Screenshots/dashboard.png"
          alt="Dashboard Screenshot"
          fill
          className="object-cover object-left-top"
        />
      </div>
    ),
  },
  {
    Icon: Users,
    name: "Client Management",
    description:
      "Manage all your clients from a single, organized place. Track who pays on time and who needs a nudge.",
    href: "/login?demo=true",
    cta: "Try demo",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-full w-full overflow-hidden opacity-50 transition-all duration-500 group-hover:opacity-80 group-hover:scale-[1.02]">
        <Image
          src="/assets/Screenshots/clients.png"
          alt="Clients Screenshot"
          fill
          className="object-cover object-left-top"
        />
      </div>
    ),
  },
  {
    Icon: FileText,
    name: "Invoice Creation",
    description:
      "Create and send professional invoices in seconds with our beautiful, intuitive dialogue boxes.",
    href: "/login?demo=true",
    cta: "Try demo",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-full w-full overflow-hidden opacity-50 transition-all duration-500 group-hover:opacity-80 group-hover:scale-[1.02]">
        <Image
          src="/assets/Screenshots/invoice-dialogue-box.png"
          alt="Invoice Dialogue Box"
          fill
          className="object-cover object-left-top"
        />
      </div>
    ),
  },
  {
    Icon: BellRing,
    name: "Smart Reminders",
    description:
      "Automate your follow-ups. Set reminders that adjust their tone automatically when an invoice becomes overdue.",
    href: "/login?demo=true",
    cta: "Try demo",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-full w-full overflow-hidden opacity-50 transition-all duration-500 group-hover:opacity-80 group-hover:scale-[1.02]">
        <Image
          src="/assets/Screenshots/reminder-log.png"
          alt="Reminder Log"
          fill
          className="object-cover object-left-top"
        />
      </div>
    ),
  },
  {
    Icon: Brain,
    name: "Gemini-Powered AI Insights",
    description:
      "Unlock deep, actionable financial advice tailored to your business. Duely aggregates payment cycles, invoice timelines, and client behavior, passing them securely to Google Gemini for real-time analysis directly on your dashboard.",
    href: "/login?demo=true",
    cta: "Try demo",
    className: "col-span-3 lg:col-span-3",
    background: (
      <div className="absolute right-6 bottom-0 top-12 left-6 lg:left-1/3 lg:-bottom-6 lg:top-4 overflow-hidden rounded-t-2xl border border-zinc-200/50 bg-[#fafafa] dark:bg-zinc-900/50 p-6 opacity-40 transition-all duration-500 group-hover:opacity-90 group-hover:scale-[1.02] shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-200/50 pb-4 mb-4">
          <Brain className="h-5 w-5 text-indigo-600 animate-pulse" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">AI Financial Insights</span>
        </div>
        <div className="space-y-3 font-mono-ui text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
            <p>Your average payment collection cycle improved by 3.2 days this month. Keep utilizing automated reminders.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
            <p>Client 'Charm AI' owes ₹12,500.00 and is currently flagged as 'Slow Pay'. Send a firm follow-up.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
            <p>Cash flow projection looks healthy with ₹45,200.00 expected from 4 highly reliable clients next week.</p>
          </div>
        </div>
      </div>
    ),
  },
];

const capabilities = [
  {
    icon: CheckCircle2,
    title: "Invoice Tracking",
    desc: "Real-time status updates on every invoice.",
  },
  {
    icon: Gauge,
    title: "Overdue Detection",
    desc: "Auto-flag risky invoices before they're late.",
  },
  {
    icon: Sparkles,
    title: "Smart Reminders",
    desc: "Tone-aware reminders that pause when clients reply.",
  },
  {
    icon: Shield,
    title: "Client Reliability",
    desc: "Know who pays on time vs who needs chasing.",
  },
  {
    icon: Brain,
    title: "Gemini AI Insights",
    desc: "Aggregates real-time organization metrics for automated financial analysis.",
  },
  {
    icon: Mail,
    title: "Real Email Flow",
    desc: "Resend-powered emails with React Email templates.",
  },
];

const stats = [
  { value: 5, suffix: "+", label: "Reminder stages per invoice" },
  { value: 100, suffix: "%", label: "Automated follow-up workflow" },
  { value: 3, suffix: "s", label: "To create & send an invoice" },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <DotPattern
          className={cn(
            "absolute inset-0 opacity-30 dark:opacity-20",
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-10">
          <BlurFade delay={0.1} inView>
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center rounded-full border border-[#4b39e6]/30 bg-[#4b39e6]/10 px-4 py-1.5 text-sm font-medium text-[#4b39e6]">
                🚀 Built for freelancers & agencies
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <h1 className="mx-auto max-w-4xl text-center font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 md:text-7xl">
              Powerful features.{" "}
              <AnimatedGradientText
                colorFrom="#4b39e6"
                colorTo="#22c55e"
                speed={2}
              >
                Zero complexity.
              </AnimatedGradientText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-[#4d5157] dark:text-zinc-300 md:text-xl">
              Everything you need to manage invoices, track clients, and get
              paid faster — all in one beautifully designed platform.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative border-y border-[#e5e5e5] dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12 overflow-hidden">
        <BorderBeam size={300} duration={12} colorFrom="#4b39e6" colorTo="#22c55e" />
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="flex flex-col items-center text-center">
                  <div className="font-display text-5xl font-bold text-[#4b39e6]">
                    <NumberTicker value={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="mt-2 text-sm font-medium text-[#6b6e72] dark:text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-10 md:py-28">
        <BlurFade delay={0.1} inView>
          <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-[#181c22] dark:text-zinc-50 md:text-4xl">
            Intelligence built into every invoice
          </h2>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <BentoGrid>
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </BlurFade>
      </section>

      {/* Safari Mockup Section */}
      <section className="bg-[#181c22] py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <BlurFade delay={0.1} inView>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                See the full picture
              </h2>
              <p className="mt-4 text-lg text-white/60">
                From reminders to logs — everything visible at a glance.
              </p>
            </div>
          </BlurFade>
          <BlurFade delay={0.2} inView>
            <Safari
              url="duely.app/dashboard"
              className="w-full shadow-2xl"
              imageSrc="/assets/Screenshots/dashboard.png"
            />
          </BlurFade>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-10 md:py-28">
        <BlurFade delay={0.1} inView>
          <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-[#181c22] dark:text-zinc-50 md:text-4xl">
            Everything you need, nothing you don't
          </h2>
        </BlurFade>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <BlurFade key={idx} delay={0.05 * idx} inView>
                <MagicCard
                  className="h-full cursor-pointer rounded-2xl border border-[#e5e5e5] dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
                  gradientColor="#4b39e620"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4b39e6]/10 text-[#4b39e6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#181c22] dark:text-zinc-50">
                    {cap.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#4d5157] dark:text-zinc-400">
                    {cap.desc}
                  </p>
                </MagicCard>
              </BlurFade>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
