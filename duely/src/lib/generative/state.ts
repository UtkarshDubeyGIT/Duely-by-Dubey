import { buildTieredStateModel, type TieredStateModel } from "@/lib/dashboard-aggregations";
import type { Client, Invoice, ReminderSchedule } from "@/types";

export function buildStateModel(
  invoices: (Invoice & { client?: Client })[],
  clients: Client[] | null,
  upcomingReminders: (ReminderSchedule & { invoice?: Invoice })[]
): TieredStateModel {
  return buildTieredStateModel(invoices, clients, upcomingReminders);
}
