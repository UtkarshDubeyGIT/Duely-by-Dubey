import { render } from "@react-email/components";
import { PaymentReminderEmail } from "@/emails/PaymentReminder";
import { resend, resendFromEmail } from "@/lib/resend";
import type { Invoice, ReminderTone } from "@/types";
import { daysOverdue } from "@/lib/utils";

export async function sendPaymentReminder(invoice: Invoice, tone: ReminderTone, customMessage?: string) {
  const client = invoice.client;
  if (!client) {
    throw new Error("Invoice client is required to send a reminder.");
  }

  const email = (
    <PaymentReminderEmail
      clientName={client.name}
      businessName="Dubey Studio"
      invoiceNumber={invoice.invoice_number}
      amount={Number(invoice.total_amount)}
      currency={invoice.currency}
      dueDate={invoice.due_date}
      daysOverdue={daysOverdue(invoice.due_date)}
      tone={tone}
      customMessage={customMessage}
    />
  );

  if (!resend) {
    return { id: `demo-${Date.now()}`, skipped: true };
  }

  const html = await render(email);
  const text = await render(email, { plainText: true });

  const { data, error } = await resend.emails.send({
    from: resendFromEmail,
    to: client.email,
    subject:
      tone === "final_notice"
        ? `Final notice: Invoice ${invoice.invoice_number}`
        : tone === "firm"
          ? `Invoice ${invoice.invoice_number} - payment overdue`
          : `Payment reminder: ${invoice.invoice_number}`,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { id: data?.id ?? null, skipped: false };
}
