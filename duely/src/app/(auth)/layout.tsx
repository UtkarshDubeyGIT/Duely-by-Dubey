import { BrandLogoLink } from "@/components/shared/BrandLogoLink";
import { ModeToggle } from "@/components/shared/ModeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <section className="hidden flex-1 flex-col justify-between p-10 lg:flex">
        <BrandLogoLink imageClassName="h-18 w-auto brightness-0 invert" />
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium text-indigo-300">By Dubey</p>
          <h1 className="text-5xl font-extrabold leading-tight">
            Get paid on time, without the awkward follow-ups.
          </h1>
          <p className="mt-5 text-lg text-zinc-300">
            Smart invoice tracking, human-sounding reminders, and clean payment
            visibility for small businesses.
          </p>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Built for BinaryAutomates review.
        </p>
      </section>
      <section className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4 text-zinc-950 dark:text-zinc-50 lg:w-[480px]">
        {children}
      </section>
    </main>
  );
}
