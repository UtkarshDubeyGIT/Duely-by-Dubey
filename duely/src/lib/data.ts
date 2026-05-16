import { cache } from "react";
import type { Client, DashboardData, Invoice, ReminderLog } from "@/types";
import { demoClients, demoInvoices, demoReminderLogs, getDemoDashboardData } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";

async function getOrgId() {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase.from("profiles").select("org_id").eq("id", user.id).maybeSingle();
  return data?.org_id ?? null;
}

function withClient(invoice: Invoice, clients: Client[]) {
  return {
    ...invoice,
    client: clients.find((client) => client.id === invoice.client_id),
  };
}

export const getClients = cache(async (): Promise<Client[]> => {
  const supabase = await createClient();
  if (!supabase) {
    return demoClients;
  }

  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*, invoices(count)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((client) => ({
      ...client,
      total_invoices: (client.invoices as unknown as { count: number }[])?.[0]?.count ?? 0,
    })) as Client[];
  } catch {
    return demoClients;
  }
});

export const getInvoices = cache(async (): Promise<Invoice[]> => {
  const supabase = await createClient();
  if (!supabase) {
    return demoInvoices;
  }

  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, client:clients(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Invoice[];
  } catch {
    return demoInvoices;
  }
});

export const getReminderLogs = cache(async (): Promise<ReminderLog[]> => {
  const supabase = await createClient();
  if (!supabase) {
    return demoReminderLogs;
  }

  try {
    const { data, error } = await supabase
      .from("reminder_logs")
      .select("*, invoice:invoices(*), client:clients(*)")
      .order("sent_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ReminderLog[];
  } catch {
    return demoReminderLogs;
  }
});

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const supabase = await createClient();
  if (!supabase) {
    return getDemoDashboardData();
  }

  try {
    const invoices = await getInvoices();
    const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue");
    const pendingInvoices = invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue");
    const paidThisMonth = invoices
      .filter((invoice) => invoice.status === "paid" && invoice.paid_date?.slice(0, 7) === new Date().toISOString().slice(0, 7))
      .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);

    const { data: reminders } = await supabase
      .from("reminder_schedule")
      .select("*, invoice:invoices(*, client:clients(*))")
      .eq("status", "pending")
      .order("scheduled_for", { ascending: true })
      .limit(5);

    return {
      stats: {
        total_invoices: invoices.length,
        unpaid_amount: pendingInvoices.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0),
        overdue_count: overdueInvoices.length,
        paid_this_month: paidThisMonth,
        total_invoices_trend: 12,
        unpaid_amount_trend: -4,
        overdue_count_trend: 2,
        paid_this_month_trend: 18,
      },
      recent_invoices: invoices.slice(0, 5),
      upcoming_reminders: reminders ?? [],
      overdue_invoices: overdueInvoices,
    };
  } catch {
    return getDemoDashboardData();
  }
});

export async function createInvoiceForCurrentOrg(payload: {
  client_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  tax_rate: number;
  issued_date: string;
  due_date: string;
  description?: string;
  notes?: string;
  line_items: { description: string; qty: number; price: number; amount: number }[];
}) {
  const supabase = await createClient();
  const orgId = await getOrgId();
  if (!supabase || !orgId) {
    return withClient(
      {
        id: crypto.randomUUID(),
        org_id: "demo",
        client_id: payload.client_id,
        invoice_number: payload.invoice_number,
        amount: payload.amount,
        currency: payload.currency,
        tax_rate: payload.tax_rate,
        tax_amount: payload.amount * (payload.tax_rate / 100),
        total_amount: payload.amount + payload.amount * (payload.tax_rate / 100),
        status: "pending",
        issued_date: payload.issued_date,
        due_date: payload.due_date,
        paid_date: null,
        description: payload.description ?? null,
        notes: payload.notes ?? null,
        line_items: payload.line_items.map((item) => ({ ...item, id: crypto.randomUUID() })),
        attachment_url: null,
        attachment_name: null,
        reminder_count: 0,
        last_reminded_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      demoClients,
    );
  }

  const taxAmount = payload.amount * (payload.tax_rate / 100);
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      ...payload,
      org_id: orgId,
      tax_amount: taxAmount,
      total_amount: payload.amount + taxAmount,
      status: "pending",
      line_items: payload.line_items.map((item) => ({ ...item, id: crypto.randomUUID() })),
    })
    .select("*, client:clients(*)")
    .single();

  if (error) {
    throw error;
  }

  const schedule = (await import("@/lib/reminder-scheduler")).generateSchedule(payload.due_date, orgId, data.id);
  await supabase.from("reminder_schedule").insert(schedule);

  return data as Invoice;
}
