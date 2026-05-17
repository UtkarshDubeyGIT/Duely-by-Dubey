import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  // 6. Add null guard: if GROK_API_KEY is not set, return { insight: null, reason: "no_key" }
  const apiKey = process.env.GROK_API_KEY?.trim();
  if (!apiKey || apiKey === "" || apiKey === "your_actual_grok_key_here") {
    return NextResponse.json({ insight: null, insights: null, reason: "no_key" });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ insight: null, insights: null, reason: "no_data" });
  }

  try {
    // 1. Fetch the following data from Supabase for the user's org
    // (use the server supabase client, respect existing RLS — no service role key needed)
    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*, client:clients(*)");

    if (invoicesError || !invoices || invoices.length === 0) {
      return NextResponse.json({ insight: null, insights: null, reason: "no_data" });
    }

    // Fetch clients to compute the reliability breakdown and top owed clients
    const { data: clients } = await supabase
      .from("clients")
      .select("*");

    // Fetch reminder logs sent this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: reminderLogs } = await supabase
      .from("reminder_logs")
      .select("*")
      .gte("sent_at", startOfMonth);

    // Compute stats
    const totalInvoicesCount = invoices.length;

    // Unpaid amount (sum of pending + overdue invoices)
    const unpaidAmount = invoices
      .filter((inv) => inv.status === "pending" || inv.status === "overdue")
      .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

    // Overdue count and their amounts
    const overdueInvoices = invoices.filter((inv) => inv.status === "overdue");
    const overdueCount = overdueInvoices.length;
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

    // Paid this month total
    const currentMonthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const paidThisMonthTotal = invoices
      .filter((inv) => inv.status === "paid" && inv.paid_date && inv.paid_date.slice(0, 7) === currentMonthStr)
      .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

    // Top 3 clients by amount owed
    const clientOwedMap: { [clientId: string]: { name: string; owed: number } } = {};
    if (clients) {
      clients.forEach((c) => {
        clientOwedMap[c.id] = { name: c.name, owed: 0 };
      });
    }

    invoices.forEach((inv) => {
      if (inv.status === "pending" || inv.status === "overdue") {
        const clientId = inv.client_id;
        if (!clientOwedMap[clientId]) {
          clientOwedMap[clientId] = {
            name: inv.client?.name || `Client ${clientId.slice(0, 8)}`,
            owed: 0,
          };
        }
        clientOwedMap[clientId].owed += Number(inv.total_amount || 0);
      }
    });

    const top3Clients = Object.values(clientOwedMap)
      .filter((c) => c.owed > 0)
      .sort((a, b) => b.owed - a.owed)
      .slice(0, 3);

    // Client reliability breakdown (how many reliable/slow/at_risk)
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

    // Reminder count sent this month
    const reminderCountThisMonth = reminderLogs ? reminderLogs.length : 0;

    // Average days to payment across paid invoices
    const paidInvoices = invoices.filter((inv) => inv.status === "paid" && inv.paid_date);
    const avgDaysToPayment = paidInvoices.length > 0
      ? paidInvoices.reduce((sum, inv) => {
          const issued = new Date(inv.issued_date);
          const paid = new Date(inv.paid_date!);
          const diffTime = paid.getTime() - issued.getTime();
          const diffDays = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
          return sum + diffDays;
        }, 0) / paidInvoices.length
      : 0;

    const businessData = {
      total_invoices_count: totalInvoicesCount,
      unpaid_amount: unpaidAmount,
      overdue_count: overdueCount,
      overdue_amount: overdueAmount,
      paid_this_month_total: paidThisMonthTotal,
      top_3_clients_by_amount_owed: top3Clients.map((c) => ({ name: c.name, owed: c.owed })),
      client_reliability_breakdown: {
        reliable: reliabilityBreakdown.reliable,
        slow: reliabilityBreakdown.slow,
        at_risk: reliabilityBreakdown.at_risk,
      },
      reminder_count_sent_this_month: reminderCountThisMonth,
      average_days_to_payment: Math.round(avgDaysToPayment * 10) / 10,
    };

    // 3. Build a system prompt
    const systemPrompt =
      "You are a sharp, concise financial advisor for small businesses. " +
      "Analyze the following invoice and payment data and give 3 specific, " +
      "actionable insights. Be direct, no fluff. Each insight should be " +
      "1-2 sentences max. Format as a JSON array of exactly 3 strings.";

    // 4. Call Grok API
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(businessData) },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ insight: null, insights: null, reason: "no_key" });
      }
      throw new Error(`Grok API returned status ${response.status}`);
    }

    const resultData = await response.json();
    const content = resultData.choices?.[0]?.message?.content || "";

    let insights: string[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        insights = parsed;
      } else if (parsed && typeof parsed === "object") {
        const possibleArray = parsed.insights || parsed.data || Object.values(parsed)[0];
        if (Array.isArray(possibleArray)) {
          insights = possibleArray;
        } else {
          insights = Object.values(parsed).filter((val) => typeof val === "string") as string[];
        }
      }
    } catch {
      // Split raw text into chunks if parsing fails
      insights = content
        .split("\n")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }

    // Safe fallbacks to ensure exactly 3 strings
    if (!Array.isArray(insights) || insights.length === 0) {
      insights = content
        .split(/[.!?]\s+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }

    insights = insights
      .map((s: string) => s.replace(/^[-*•\d.\s]+/, "").replace(/^["']|["']$/g, "").trim())
      .filter((s: string) => s.length > 0);

    const fallbacks = [
      "Send friendly reminders to clients with outstanding balances to improve your monthly cash flow.",
      "Consider setting up automated invoice schedules to ensure prompt billing cycles.",
      "Keep an eye on overdue payments and review the credit terms offered to late payers.",
    ];

    while (insights.length < 3) {
      insights.push(fallbacks[insights.length] || fallbacks[0]);
    }
    insights = insights.slice(0, 3);

    // 5. Return: { insights: string[], generatedAt: string }
    return NextResponse.json({
      insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { insights: null, error: error instanceof Error ? error.message : "Failed to load insights" },
      { status: 500 }
    );
  }
}
