import { NextResponse } from "next/server";
import { getInvoices } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { recalculateClientReliability } from "@/lib/recalculate-client";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    const invoice = (await getInvoices()).find((item) => item.id === id);
    return invoice
      ? NextResponse.json({ data: invoice, error: null })
      : NextResponse.json({ data: null, error: "Invoice not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      client:clients(*),
      reminder_logs(*),
      reminder_schedule(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  // Sort logs and schedule
  if (data.reminder_logs) {
    data.reminder_logs.sort((a: { sent_at: string }, b: { sent_at: string }) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  }
  if (data.reminder_schedule) {
    data.reminder_schedule.sort((a: { scheduled_for: string }, b: { scheduled_for: string }) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime());
  }

  return NextResponse.json({ data, error: null });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ data: { id, ...body }, error: null });
  }

  // Handle status-specific logic
  const updateData = { ...body };
  if (body.status === "paid") {
    updateData.paid_date = new Date().toISOString();
  } else if (body.status === "pending" || body.status === "draft") {
    updateData.paid_date = null;
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", id)
    .select(`
      *,
      client:clients(*),
      reminder_logs(*),
      reminder_schedule(*)
    `)
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  // If status is NOT pending or overdue, cancel all pending reminders
  if (body.status && body.status !== "pending" && body.status !== "overdue") {
    await supabase
      .from("reminder_schedule")
      .update({ status: "skipped" })
      .eq("invoice_id", id)
      .eq("status", "pending");
  }

  // Recalculate client reliability after any invoice status change
  if (body.status && data.client_id) {
    await recalculateClientReliability(data.client_id);
  }

  return NextResponse.json({ data, error: null });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: { id }, error: null });
  }

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { id }, error: null });
}
