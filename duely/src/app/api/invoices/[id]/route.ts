import { NextResponse } from "next/server";
import { getInvoices } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = (await getInvoices()).find((item) => item.id === id);
  return invoice
    ? NextResponse.json({ data: invoice, error: null })
    : NextResponse.json({ data: null, error: "Invoice not found" }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createClient();
  
  if (!supabase) {
    return NextResponse.json({ data: null, error: "Database not configured" }, { status: 503 });
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
    .select("*, client:clients(*)")
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
