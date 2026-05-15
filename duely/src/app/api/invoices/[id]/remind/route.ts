import { NextResponse } from "next/server";
import { getInvoices } from "@/lib/data";
import { sendPaymentReminder } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { sendReminderSchema } from "@/lib/validations";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = sendReminderSchema.safeParse({ ...body, invoice_id: id });
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: "Invalid reminder payload" }, { status: 400 });
    }

    const invoice = (await getInvoices()).find((item) => item.id === id);
    if (!invoice) {
      return NextResponse.json({ data: null, error: "Invoice not found" }, { status: 404 });
    }

    const result = await sendPaymentReminder(invoice, parsed.data.tone, parsed.data.custom_message);
    const supabase = await createClient();

    if (supabase) {
      await supabase.from("reminder_logs").insert({
        invoice_id: invoice.id,
        org_id: invoice.org_id,
        client_id: invoice.client_id,
        type: "manual",
        tone: parsed.data.tone,
        channel: "email",
        status: "sent",
        message_id: result.id,
      });
      await supabase
        .from("invoices")
        .update({ reminder_count: invoice.reminder_count + 1, last_reminded_at: new Date().toISOString() })
        .eq("id", invoice.id);
    }

    return NextResponse.json({ data: { message_id: result.id }, error: null, skipped: result.skipped });
  } catch (error) {
    return NextResponse.json({ data: null, error: error instanceof Error ? error.message : "Reminder could not be sent" }, { status: 500 });
  }
}
