import { ModeToggle } from "@/components/shared/ModeToggle";
import { AuthLeftPanel } from "@/components/shared/AuthLeftPanel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <div className="absolute top-4 right-4 z-50 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-700 dark:text-zinc-100">
        <ModeToggle />
      </div>

      {/* Animated left panel */}
      <AuthLeftPanel />

      {/* Right – form panel */}
      <section className="flex min-h-screen w-full flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4 text-zinc-950 dark:text-zinc-50 lg:w-[480px] lg:flex-none">
        {children}
      </section>
    </main>
  );
}
