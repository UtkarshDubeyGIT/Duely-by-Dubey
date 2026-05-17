import { createClient } from "@/lib/supabase/server";
import { computeReliabilityTag, computeAvgDaysLate } from "@/lib/reliability";
import type { Invoice } from "@/types";

/**
 * Recalculates a client's reliability_tag and avg_days_late based on all
 * their invoices, then persists the result to the clients table.
 *
 * Call this after any invoice status change (paid, overdue, etc.).
 */
export async function recalculateClientReliability(clientId: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return; // Demo mode — nothing to persist

  // Fetch all invoices for this client
  const { data: invoices, error: fetchError } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", clientId);

  if (fetchError || !invoices) return;

  const tag = computeReliabilityTag(invoices as Invoice[]);
  const avgDaysLate = computeAvgDaysLate(invoices as Invoice[]);

  await supabase
    .from("clients")
    .update({ reliability_tag: tag, avg_days_late: avgDaysLate })
    .eq("id", clientId);
}
