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

const toneConfig = {
  friendly: {
    heading: "Payment Reminder",
    label: "Upcoming",
    color: "#22C55E",
    intro: (invoiceNumber: string) =>
      `Just a quick note that ${invoiceNumber} is coming due soon. If you've already taken care of this, please ignore this message — and thank you!`,
  },
  firm: {
    heading: "Payment Overdue",
    label: "Overdue",
    color: "#F59E0B",
    intro: (invoiceNumber: string, daysOverdue: number) =>
      `I'm following up because ${invoiceNumber} is still outstanding — it's now ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} overdue. Please arrange payment at your earliest convenience.`,
  },
  final_notice: {
    heading: "Final Notice: Payment Overdue",
    label: "Final Notice",
    color: "#EF4444",
    intro: (invoiceNumber: string, daysOverdue: number) =>
      `I'm reaching out one final time regarding ${invoiceNumber}, which is now ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} overdue. Please contact us immediately or arrange payment today to resolve this.`,
  },
};

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
  const config = toneConfig[tone];
  const firstName = clientName.split(" ")[0];
  const bodyText = customMessage || config.intro(invoiceNumber, daysOverdue);

  return (
    <Html>
      <Head />
      <Preview>
        {config.heading} for {invoiceNumber} from {businessName}
      </Preview>
      <Body
        style={{
          backgroundColor: "#f4f4f5",
          fontFamily: "Arial, sans-serif",
          color: "#18181b",
        }}
      >
        <Container
          style={{
            margin: "32px auto",
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Tone color bar — green / amber / red */}
          <div style={{ height: "4px", backgroundColor: config.color }} />

          <div style={{ padding: "32px" }}>
            {/* Header row: business name + urgency badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#09090b",
                }}
              >
                {businessName}
              </Text>
              <span
                style={{
                  backgroundColor: config.color + "22",
                  color: config.color,
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "99px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {config.label}
              </span>
            </div>

            <Heading style={{ fontSize: "22px", margin: "0 0 12px" }}>
              {config.heading}
            </Heading>

            <Text style={{ margin: "0 0 6px" }}>Hi {firstName},</Text>
            <Text style={{ margin: "0 0 24px", lineHeight: "1.7" }}>
              {bodyText}
            </Text>

            {/* Invoice details card */}
            <Section
              style={{
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "10px",
                padding: "16px",
                margin: "0 0 24px",
              }}
            >
              <Text
                style={{
                  margin: "0 0 4px",
                  color: "#71717a",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Invoice
              </Text>
              <Text
                style={{
                  margin: "0 0 12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {invoiceNumber}
              </Text>
              <Text
                style={{
                  margin: "0 0 4px",
                  color: "#71717a",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Amount Due
              </Text>
              <Text
                style={{
                  margin: "0 0 12px",
                  fontSize: "26px",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {formatCurrency(amount, currency)}
              </Text>
              <Text style={{ margin: "0", color: "#52525b", fontSize: "13px" }}>
                Due {formatDate(dueDate)}
              </Text>
            </Section>

            <Text style={{ margin: "0 0 4px" }}>
              Please let me know once payment is on its way.
            </Text>
            <Text style={{ margin: "0 0 24px" }}>
              Thanks,
              <br />
              {businessName}
            </Text>

            <Hr style={{ borderColor: "#e4e4e7", margin: "0 0 20px" }} />

            <Text style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>
              Sent with Duely · Reply to this email if you have questions.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}