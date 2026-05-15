import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReminderEmailProps } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function PaymentReminderEmail({
  clientName,
  businessName,
  invoiceNumber,
  amount,
  currency,
  dueDate,
  daysOverdue = 0,
  tone,
  customMessage,
}: ReminderEmailProps) {
  const intro =
    tone === "final_notice"
      ? `I'm following up one final time on ${invoiceNumber}, which is now ${daysOverdue} days overdue.`
      : tone === "firm"
        ? `I'm following up because ${invoiceNumber} is still outstanding.`
        : `Just a quick note that ${invoiceNumber} is coming due.`;

  return (
    <Html>
      <Head />
      <Preview>Payment reminder for {invoiceNumber}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "Arial, sans-serif", color: "#18181b" }}>
        <Container style={{ margin: "32px auto", maxWidth: "560px", backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px" }}>
          <Heading style={{ fontSize: "22px", margin: "0 0 20px" }}>Payment reminder</Heading>
          <Text>Hi {clientName},</Text>
          <Text>{customMessage || intro}</Text>
          <Section style={{ backgroundColor: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "16px", margin: "24px 0" }}>
            <Text style={{ margin: "0 0 6px", color: "#71717a" }}>Invoice</Text>
            <Text style={{ margin: "0", fontSize: "18px", fontWeight: 700 }}>{invoiceNumber}</Text>
            <Text style={{ margin: "12px 0 6px", color: "#71717a" }}>Amount due</Text>
            <Text style={{ margin: "0", fontSize: "24px", fontWeight: 700 }}>{formatCurrency(amount, currency)}</Text>
            <Text style={{ margin: "12px 0 0", color: "#52525b" }}>Due {formatDate(dueDate)}</Text>
          </Section>
          <Text>Please let me know once payment is on its way.</Text>
          <Text>Thanks,<br />{businessName}</Text>
          <Hr style={{ borderColor: "#e4e4e7", margin: "28px 0" }} />
          <Text style={{ color: "#71717a", fontSize: "12px" }}>Sent with Duely.</Text>
        </Container>
      </Body>
    </Html>
  );
}
