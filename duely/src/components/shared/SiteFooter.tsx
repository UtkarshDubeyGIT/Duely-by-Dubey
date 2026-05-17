import { BrandLogoLink } from "@/components/shared/BrandLogoLink";

export function SiteFooter() {
  return (
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
  );
}
