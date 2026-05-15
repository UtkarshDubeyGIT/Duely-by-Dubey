import type { ClientReliability, InvoiceStatus, ReminderTone } from "@/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  draft: "bg-zinc-100 text-zinc-600",
};

const reliabilityStyles: Record<ClientReliability, string> = {
  reliable: "bg-green-100 text-green-700",
  slow: "bg-amber-100 text-amber-700",
  at_risk: "bg-red-100 text-red-700",
  new: "bg-blue-100 text-blue-700",
};

const toneStyles: Record<ReminderTone, string> = {
  friendly: "bg-blue-100 text-blue-700",
  firm: "bg-amber-100 text-amber-700",
  final_notice: "bg-red-100 text-red-700",
};

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", className)}>{children}</span>;
}

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}

export function ReliabilityBadge({ reliability }: { reliability: ClientReliability }) {
  return <Badge className={reliabilityStyles[reliability]}>{reliability.replace("_", " ")}</Badge>;
}

export function ToneBadge({ tone }: { tone: ReminderTone }) {
  return <Badge className={toneStyles[tone]}>{tone.replace("_", " ")}</Badge>;
}
