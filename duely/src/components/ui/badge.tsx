import * as React from "react"
import type { ClientReliability, InvoiceStatus, ReminderTone } from "@/types"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/10 text-destructive",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const reliabilityStyles: Record<ClientReliability, string> = {
  reliable: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  slow: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  at_risk: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const toneStyles: Record<ReminderTone, string> = {
  friendly: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  firm: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  final_notice: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}

export function ReliabilityBadge({ reliability }: { reliability: ClientReliability }) {
  return <Badge className={reliabilityStyles[reliability]}>{reliability.replace("_", " ")}</Badge>;
}

export function ToneBadge({ tone }: { tone: ReminderTone }) {
  return <Badge className={toneStyles[tone]}>{tone.replace("_", " ")}</Badge>;
}
