import Link from "next/link";
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  Clock3,
  Gauge,
  MailCheck,
  Sparkles,
} from "lucide-react";
import { BrandLogoLink } from "@/components/shared/BrandLogoLink";
import { ButtonLink } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { WavyBackground } from "@/components/ui/wavy-background";

const features = [
  {
    icon: Sparkles,
    title: "Smart reminders",
    body: "Automated follow-ups adjust tone as due dates pass, then pause when clients reply.",
  },
  {
    icon: BellRing,
    title: "Overdue detection",
    body: "Flag invoices at risk before cash flow gets tight and surface the right follow-up at the right time.",
  },
  {
    icon: Gauge,
    title: "Client reliability",
    body: "See who pays on time, who needs nudges, and where payment history is trending.",
  },
];

const reminderFlow = [
  {
    icon: CheckCircle2,
    title: "Invoice sent",
    detail: "Oct 12, 10:00 AM",
    tone: "success",
  },
  {
    icon: MailCheck,
    title: "Gentle nudge",
    detail: "Due date - 3 days",
    tone: "brand",
  },
  {
    icon: Clock3,
    title: "Firm reminder",
    detail: "If overdue",
    tone: "muted",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(75,57,230,0.12),transparent_58%),radial-gradient(circle_at_85%_78%,rgba(34,197,94,0.08),transparent_28%)]" />
        <header className="sticky top-0 z-50 border-b border-[#d8d8d8]/80 dark:border-[#d8d8d8]/20 bg-white dark:bg-zinc-950/75 dark:bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
            <BrandLogoLink
              priority
              imageClassName="h-16 w-auto md:h-18"
            />
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
                className="rounded-full bg-[#181c22] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4b39e6]"
              >
                Sign up for free
              </ButtonLink>
            </div>
          </div>
        </header>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 md:px-10 md:pb-28 md:pt-20">
          <WavyBackground
            backgroundFill="transparent"
            waveOpacity={0.3}
            colors={["#4b39e6", "#22c55e", "#38bdf8", "#818cf8", "#c084fc"]}
            containerClassName="absolute inset-0 h-full w-full z-0 pointer-events-none"
            className="hidden"
          />
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 md:text-7xl">
              Get paid on time.
              <span className="block text-[#4b39e6]">Every time.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d5157] dark:text-zinc-300 md:text-xl">
              The platform sends smart reminders, pauses when clients respond,
              and shows you exactly when to follow up. Stop chasing payments and
              focus on the work itself.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink
                href="/signup"
                className="rounded-full bg-[#181c22] px-8 py-4 text-base font-medium text-white shadow-[0_18px_35px_-18px_rgba(24,28,34,0.5)] hover:bg-[#4b39e6]"
              >
                Start for free
              </ButtonLink>
              <ButtonLink
                href="/login?demo=true"
                variant="secondary"
                className="rounded-full border border-[#d6d7db] bg-white dark:bg-zinc-950 px-8 py-4 text-base font-medium text-[#181c22] dark:text-zinc-50 hover:bg-[#f3f3f4] dark:bg-zinc-900"
              >
                See how it works
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto mt-16 h-140 max-w-6xl">
            <div className="absolute left-1/2 top-1/2 z-20 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-[#d8d8d8] bg-white dark:bg-zinc-950 p-8 shadow-[0_24px_50px_-22px_rgba(0,0,0,0.2)] md:p-10">
              <div className="flex flex-col gap-6 border-b border-[#e5e5e5] pb-8 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b6e72] dark:text-zinc-400">
                    Invoice No.
                  </div>
                  <div className="mt-2 font-mono-ui text-2xl font-bold tracking-[-0.02em] text-[#181c22] dark:text-zinc-50 md:text-3xl">
                    INV-2024-089
                  </div>
                </div>
                <div className="rounded-full bg-[#f59e0b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
                  Overdue: 3 Days
                </div>
              </div>

              <div className="grid gap-8 py-8 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b6e72] dark:text-zinc-400">
                    From
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b39e6] text-sm font-bold text-white">
                      M
                    </div>
                    <div>
                      <div className="font-medium text-[#181c22] dark:text-zinc-50">
                        Marble Studio
                      </div>
                      <div className="text-sm text-[#6b6e72] dark:text-zinc-400">
                        hello@marblestudio.com
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b6e72] dark:text-zinc-400">
                    To
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e] text-sm font-bold text-white">
                      C
                    </div>
                    <div>
                      <div className="font-medium text-[#181c22] dark:text-zinc-50">
                        Charm AI
                      </div>
                      <div className="text-sm text-[#6b6e72] dark:text-zinc-400">
                        billing@charm.ai
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-[#e5e5e5] pt-8">
                <div className="text-base font-medium text-[#181c22] dark:text-zinc-50 md:text-lg">
                  Total Amount Due
                </div>
                <div className="font-display text-3xl font-bold tracking-[-0.02em] text-[#181c22] dark:text-zinc-50 md:text-4xl">
                  ₹12,500.00
                </div>
              </div>
            </div>

            <div className="absolute left-0 top-1/4 hidden w-72 -translate-y-1/4 -rotate-3 rounded-[20px] border border-[#d8d8d8] bg-white dark:bg-zinc-950 p-6 shadow-[0_20px_35px_-24px_rgba(0,0,0,0.3)] md:block">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#181c22] dark:text-zinc-50">
                <BellRing className="h-4 w-4 text-[#4b39e6]" />
                Smart Reminder Flow
              </h2>
              <div className="relative mt-5 space-y-5 before:absolute before:inset-y-0 before:left-2.75 before:w-px before:bg-[#e5e5e5]">
                {reminderFlow.map((item) => {
                  const Icon = item.icon;
                  const toneStyles =
                    item.tone === "success"
                      ? "bg-[#22c55e] text-white ring-[#f9f9f7]"
                      : item.tone === "brand"
                        ? "bg-[#4b39e6] text-white ring-[#f9f9f7]"
                        : "border border-[#d8d8d8] bg-[#f3f3f4] dark:bg-zinc-900 text-[#6b6e72] dark:text-zinc-400 ring-[#f9f9f7]";

                  return (
                    <div key={item.title} className="relative flex gap-4">
                      <div
                        className={`z-10 flex h-6 w-6 items-center justify-center rounded-full ring-4 ${toneStyles}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#181c22] dark:text-zinc-50">
                          {item.title}
                        </div>
                        <div className="text-xs text-[#6b6e72] dark:text-zinc-400">
                          {item.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute bottom-1/4 right-0 hidden w-64 translate-y-1/4 rotate-2 rounded-[20px] border border-[#d8d8d8] bg-white dark:bg-zinc-950 p-5 shadow-[0_20px_35px_-24px_rgba(0,0,0,0.3)] md:block">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-full bg-[#ffdad6] p-2 text-[#ba1a1a]">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold text-[#181c22] dark:text-zinc-50">
                  Client Response Needed
                </div>
              </div>
              <p className="mb-4 text-sm leading-6 text-[#4d5157] dark:text-zinc-300">
                Charm AI viewed the invoice but has not paid yet. Send a
                follow-up while the thread is still warm.
              </p>
              <ButtonLink
                href="/login?demo=true"
                className="w-full rounded-lg bg-[#4b39e6] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3d2ecc]"
              >
                Send Follow-up Now
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-4 pb-20 md:px-10 md:pb-28"
      >
        <h2 className="font-display text-center text-3xl font-bold tracking-[-0.02em] text-[#181c22] dark:text-zinc-50 md:text-4xl">
          Intelligence built into every invoice
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-3xl border border-[#dfdfdf] bg-white dark:bg-zinc-950 p-8 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-1"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3dfff] text-[#4b39e6]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-[#181c22] dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#4d5157] dark:text-zinc-300">
                  {feature.body}
                </p>
              </article>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#6b6e72] dark:text-zinc-400">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e1e1] bg-white dark:bg-zinc-950 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
            Invoice tracking
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e1e1] bg-white dark:bg-zinc-950 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
            Smart reminders
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e1e1] bg-white dark:bg-zinc-950 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
            Client reliability
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d8d8d8] bg-[#181c22] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-3">
            <BrandLogoLink imageClassName="h-16 w-auto brightness-0 invert" />
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-white/65">
            <a href="#features" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Terms of Service
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Contact
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Security
            </a>
          </div>
          <div className="text-sm text-white/55">
            © 2026. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
