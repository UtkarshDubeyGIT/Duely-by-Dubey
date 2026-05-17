import Link from "next/link";
import { BrandLogoLink } from "@/components/shared/BrandLogoLink";
import { ButtonLink } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/ModeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d8d8]/80 dark:border-[#d8d8d8]/20 bg-white dark:bg-zinc-950/75 dark:bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
        <BrandLogoLink priority imageClassName="h-16 w-auto md:h-18" />
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#181c22] dark:text-zinc-200">
          <Link href="/features" className="transition-colors hover:text-[#4b39e6]">
            Features
          </Link>
          <Link href="/how-to-use" className="transition-colors hover:text-[#4b39e6]">
            How To Use
          </Link>
          <Link href="/future-upgrades" className="transition-colors hover:text-[#4b39e6]">
            Future Upgrades
          </Link>
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
            className="rounded-full bg-[#181c22] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4b39e6]"
          >
            Sign up for free
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
