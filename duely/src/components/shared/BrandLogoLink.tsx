import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoLinkProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogoLink({ className, imageClassName, priority = false }: BrandLogoLinkProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label="Go to home page">
      <Image
        src="/duely-logo.png"
        alt="Duely"
        width={170}
        height={54}
        priority={priority}
        className={cn("h-9 w-auto", imageClassName)}
      />
    </Link>
  );
}