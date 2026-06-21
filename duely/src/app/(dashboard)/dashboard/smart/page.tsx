import { getClients, getInvoices } from "@/lib/data";
import { buildStateModel } from "@/lib/generative/state";
import { createClient } from "@/lib/supabase/server";
import { SmartDashboardClient } from "./SmartDashboardClient";

export default async function SmartDashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, full_name")
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  const invoices = await getInvoices();
  const clients = await getClients();

  const { data: reminders } = await supabase
    .from("reminder_schedule")
    .select("*, invoice:invoices(*, client:clients(*))")
    .eq("status", "pending")
    .order("scheduled_for", { ascending: true })
    .limit(10);

  const stateModel = buildStateModel(
    invoices ?? [],
    clients ?? [],
    reminders ?? []
  );
  if (profile) {
    stateModel.user.name = profile.full_name ?? "Business Owner";
  }

  return (
    <SmartDashboardClient
      initialState={stateModel as unknown as Record<string, unknown>}
    />
  );
}
