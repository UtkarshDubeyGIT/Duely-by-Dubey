import type { ReminderTone } from "@/types";

interface ScheduleEntry {
  days_offset: number;
  tone: ReminderTone;
  label: string;
}

export const REMINDER_SCHEDULE: ScheduleEntry[] = [
  { days_offset: -7, tone: "friendly", label: "Heads up" },
  { days_offset: -1, tone: "friendly", label: "Gentle nudge" },
  { days_offset: 0, tone: "firm", label: "Due today" },
  { days_offset: 3, tone: "firm", label: "Overdue" },
  { days_offset: 7, tone: "final_notice", label: "Final notice" },
];

export function generateSchedule(dueDate: string, orgId: string, invoiceId: string) {
  const due = new Date(`${dueDate}T00:00:00`);
  return REMINDER_SCHEDULE.map((entry) => {
    const scheduled = new Date(due);
    scheduled.setDate(scheduled.getDate() + entry.days_offset);
    return {
      invoice_id: invoiceId,
      org_id: orgId,
      scheduled_for: scheduled.toISOString().slice(0, 10),
      tone: entry.tone,
      status: "pending" as const,
    };
  });
}

export function getToneLabel(tone: ReminderTone) {
  return {
    friendly: "Friendly",
    firm: "Firm",
    final_notice: "Final Notice",
  }[tone];
}
