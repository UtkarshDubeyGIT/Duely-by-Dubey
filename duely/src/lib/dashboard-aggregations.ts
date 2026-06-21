import type { Client, Invoice, ReminderLog, ReminderSchedule } from "@/types";

export interface BusinessData {
  total_invoices_count: number;
  unpaid_amount: number;
  overdue_count: number;
  overdue_amount: number;
  paid_this_month_total: number;
  top_3_clients_by_amount_owed: { name: string; owed: number }[];
  client_reliability_breakdown: {
    reliable: number;
    slow: number;
    at_risk: number;
    new: number;
  };
  reminder_count_sent_this_month: number;
  average_days_to_payment: number;
}

export interface TieredStateModel {
  stats: {
    total_invoices: number;
    unpaid_amount: number;
    overdue_count: number;
    overdue_amount: number;
    paid_this_month: number;
    avg_days_to_payment: number;
    reminder_count_this_month: number;
    trends: {
      total_invoices: number;
      unpaid_amount: number;
      overdue_count: number;
      paid_this_month: number;
    };
  };
  reliability: { name: string; value: number }[];
  top_clients: { name: string; owed: number }[];
  invoices: (Invoice & { client?: Client })[];
  upcoming_reminders: (ReminderSchedule & { invoice?: Invoice })[];
  payment_trend: { date: string; paid: number; unpaid: number }[];
  filters: { status: string };
  user: { name: string; org_name: string; currency: string };
}

export function computeBusinessData(
  invoices: Invoice[],
  clients: Client[] | null,
  reminderLogs: ReminderLog[] | null
): BusinessData {
  const totalInvoicesCount = invoices.length;

  const unpaidAmount = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue");
  const overdueCount = overdueInvoices.length;
  const overdueAmount = overdueInvoices.reduce(
    (sum, inv) => sum + Number(inv.total_amount || 0),
    0
  );

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const paidThisMonthTotal = invoices
    .filter(
      (inv) =>
        inv.status === "paid" &&
        inv.paid_date &&
        inv.paid_date.slice(0, 7) === currentMonthStr
    )
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  const clientOwedMap: Record<string, { name: string; owed: number }> = {};
  if (clients) {
    clients.forEach((c) => {
      clientOwedMap[c.id] = { name: c.name, owed: 0 };
    });
  }
  invoices.forEach((inv) => {
    if (inv.status === "pending" || inv.status === "overdue") {
      const clientId = inv.client_id;
      if (clientId) {
        if (!clientOwedMap[clientId]) {
          clientOwedMap[clientId] = {
            name: inv.client?.name || `Client ${clientId.slice(0, 8)}`,
            owed: 0,
          };
        }
        clientOwedMap[clientId].owed += Number(inv.total_amount || 0);
      }
    }
  });

  const top3Clients = Object.values(clientOwedMap)
    .filter((c) => c.owed > 0)
    .sort((a, b) => b.owed - a.owed)
    .slice(0, 3);

  const reliabilityBreakdown = {
    reliable: 0,
    slow: 0,
    at_risk: 0,
    new: 0,
  };
  if (clients) {
    clients.forEach((c) => {
      const tag = c.reliability_tag || "new";
      if (tag in reliabilityBreakdown) {
        reliabilityBreakdown[tag as keyof typeof reliabilityBreakdown]++;
      }
    });
  }

  const reminderCountThisMonth = reminderLogs ? reminderLogs.length : 0;

  const paidInvoices = invoices.filter(
    (inv) => inv.status === "paid" && inv.paid_date && inv.issued_date
  );
  const avgDaysToPayment =
    paidInvoices.length > 0
      ? paidInvoices.reduce((sum, inv) => {
          const issued = new Date(inv.issued_date);
          const paid = new Date(inv.paid_date!);
          if (isNaN(issued.getTime()) || isNaN(paid.getTime())) return sum;
          const diffTime = paid.getTime() - issued.getTime();
          const diffDays = Math.max(
            0,
            Math.round(diffTime / (1000 * 60 * 60 * 24))
          );
          return sum + diffDays;
        }, 0) / paidInvoices.length
      : 0;

  return {
    total_invoices_count: totalInvoicesCount,
    unpaid_amount: unpaidAmount,
    overdue_count: overdueCount,
    overdue_amount: overdueAmount,
    paid_this_month_total: paidThisMonthTotal,
    top_3_clients_by_amount_owed: top3Clients.map((c) => ({
      name: c.name,
      owed: c.owed,
    })),
    client_reliability_breakdown: {
      reliable: reliabilityBreakdown.reliable,
      slow: reliabilityBreakdown.slow,
      at_risk: reliabilityBreakdown.at_risk,
      new: 0,
    },
    reminder_count_sent_this_month: reminderCountThisMonth,
    average_days_to_payment: Math.round(avgDaysToPayment * 10) / 10,
  };
}

export function buildTieredStateModel(
  invoices: (Invoice & { client?: Client })[],
  clients: Client[] | null,
  upcomingReminders: (ReminderSchedule & { invoice?: Invoice })[]
): TieredStateModel {
  const bd = computeBusinessData(invoices, clients, null);

  const clientOwedMap: Record<string, { name: string; owed: number }> = {};
  if (clients) {
    clients.forEach((c) => {
      clientOwedMap[c.id] = { name: c.name, owed: 0 };
    });
  }
  invoices.forEach((inv) => {
    if (inv.status === "pending" || inv.status === "overdue") {
      const clientId = inv.client_id;
      if (clientId) {
        if (!clientOwedMap[clientId]) {
          clientOwedMap[clientId] = {
            name: inv.client?.name || `Client ${clientId.slice(0, 8)}`,
            owed: 0,
          };
        }
        clientOwedMap[clientId].owed += Number(inv.total_amount || 0);
      }
    }
  });

  const top10Clients = Object.values(clientOwedMap)
    .filter((c) => c.owed > 0)
    .sort((a, b) => b.owed - a.owed)
    .slice(0, 10);

  const paymentTrend: { date: string; paid: number; unpaid: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 7);
    const paid = invoices
      .filter(
        (inv) =>
          inv.status === "paid" &&
          inv.paid_date &&
          inv.paid_date.slice(0, 7) === dateStr
      )
      .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
    const unpaid = invoices
      .filter(
        (inv) =>
          (inv.status === "pending" || inv.status === "overdue") &&
          inv.issued_date.slice(0, 7) <= dateStr
      )
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    paymentTrend.push({ date: dateStr, paid, unpaid });
  }

  return {
    stats: {
      total_invoices: bd.total_invoices_count,
      unpaid_amount: bd.unpaid_amount,
      overdue_count: bd.overdue_count,
      overdue_amount: bd.overdue_amount,
      paid_this_month: bd.paid_this_month_total,
      avg_days_to_payment: bd.average_days_to_payment,
      reminder_count_this_month: bd.reminder_count_sent_this_month,
      trends: {
        total_invoices: 12,
        unpaid_amount: -4,
        overdue_count: 2,
        paid_this_month: 18,
      },
    },
    reliability: [
      { name: "Reliable", value: bd.client_reliability_breakdown.reliable },
      { name: "Slow", value: bd.client_reliability_breakdown.slow },
      { name: "At Risk", value: bd.client_reliability_breakdown.at_risk },
      { name: "New", value: bd.client_reliability_breakdown.new },
    ],
    top_clients: top10Clients,
    invoices: invoices.slice(0, 20),
    upcoming_reminders: upcomingReminders.slice(0, 10),
    payment_trend: paymentTrend,
    filters: { status: "all" },
    user: { name: "Business Owner", org_name: "My Business", currency: "USD" },
  };
}
