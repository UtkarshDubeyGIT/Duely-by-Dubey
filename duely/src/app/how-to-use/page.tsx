import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Create your first invoice",
    description: "Use our intuitive dialogue box to quickly generate a professional invoice. Add items, specify rates, and set the due date in just a few clicks.",
    image: "/assets/Screenshots/invoice-dialogue-box.png",
  },
  {
    number: "02",
    title: "Set up smart reminders",
    description: "Configure automated follow-ups. Choose the reminder tone, schedule when it should be sent, and let Duely handle the rest.",
    image: "/assets/Screenshots/reminder-dialogue-box.png",
  },
  {
    number: "03",
    title: "Track upcoming reminders",
    description: "Always know what's coming next. Our upcoming reminders view gives you a clear look at which clients are about to be nudged.",
    image: "/assets/Screenshots/upcoming-reminders.png",
  },
  {
    number: "04",
    title: "Manage invoice actions",
    description: "Easily mark invoices as paid, send immediate reminders, or delete them directly from the actions menu.",
    image: "/assets/Screenshots/actions-invoice.png",
  }
];

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] dark:bg-background text-[#1a1c1c] dark:text-foreground">
      <SiteHeader />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-14 md:px-10 md:pb-28 md:pt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center mb-20">
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-[#181c22] dark:text-zinc-50 md:text-6xl">
            How to use Duely.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d5157] dark:text-zinc-300 md:text-xl">
            A quick step-by-step guide to setting up your first invoice and putting your payment collection on autopilot.
          </p>
        </div>

        <div className="space-y-20 md:space-y-32">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col gap-10 md:gap-16 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              <div className="flex-1 w-full space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4b39e6] text-xl font-bold text-white">
                    {step.number}
                  </div>
                  <h2 className="font-display text-3xl font-bold text-[#181c22] dark:text-zinc-50">
                    {step.title}
                  </h2>
                </div>
                <p className="text-lg leading-8 text-[#4d5157] dark:text-zinc-300">
                  {step.description}
                </p>
              </div>

              <div className="flex-1 w-full">
                <Card className="overflow-hidden border-[#d8d8d8] shadow-lg dark:border-zinc-800">
                  <CardContent className="p-0">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={step.image}
                        alt={step.title}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="left top"
                        className="transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
