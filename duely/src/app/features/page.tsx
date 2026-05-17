import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { 
  BellRing, 
  FileText, 
  Users, 
  Activity, 
  CreditCard 
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    Icon: Activity,
    name: "Dashboard Analytics",
    description: "Get a bird's-eye view of your business's financial health, outstanding invoices, and upcoming reminders.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-full w-full opacity-60 transition-all duration-300 group-hover:opacity-100">
        <Image
          src="/assets/Screenshots/dashboard.png"
          alt="Dashboard Screenshot"
          layout="fill"
          objectFit="cover"
          objectPosition="left top"
        />
      </div>
    ),
  },
  {
    Icon: Users,
    name: "Client Management",
    description: "Manage all your clients from a single, organized place. Track who pays on time and who needs a nudge.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-full w-full opacity-60 transition-all duration-300 group-hover:opacity-100">
        <Image
          src="/assets/Screenshots/clients.png"
          alt="Clients Screenshot"
          layout="fill"
          objectFit="cover"
          objectPosition="left top"
        />
      </div>
    ),
  },
  {
    Icon: FileText,
    name: "Invoice Creation",
    description: "Create and send professional invoices in seconds with our beautiful, intuitive dialogue boxes.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-full w-full opacity-60 transition-all duration-300 group-hover:opacity-100">
        <Image
          src="/assets/Screenshots/invoice-dialogue-box.png"
          alt="Invoice Dialogue Box"
          layout="fill"
          objectFit="cover"
          objectPosition="left top"
        />
      </div>
    ),
  },
  {
    Icon: BellRing,
    name: "Smart Reminders",
    description: "Automate your follow-ups. Set reminders that adjust their tone automatically when an invoice becomes overdue.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-full w-full opacity-60 transition-all duration-300 group-hover:opacity-100">
        <Image
          src="/assets/Screenshots/reminder-log.png"
          alt="Reminder Log"
          layout="fill"
          objectFit="cover"
          objectPosition="left top"
        />
      </div>
    ),
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground">
      <SiteHeader />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-14 md:px-10 md:pb-28 md:pt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center mb-16">
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 md:text-6xl">
            Powerful features.
            <span className="block text-[#4b39e6]">Zero complexity.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d5157] dark:text-zinc-300 md:text-xl">
            Everything you need to manage your invoices, track clients, and get paid faster, all in one beautifully designed platform.
          </p>
        </div>

        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>

      <SiteFooter />
    </main>
  );
}
