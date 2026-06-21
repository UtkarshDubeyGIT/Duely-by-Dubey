export const DEFAULT_FIRST_LOAD_PROMPT =
  "Compose the most relevant dashboard for my business right now, highlighting what needs attention.";

const CUSTOM_RULES = [
  "ALWAYS use Stack as the ROOT element. Inside Stack, put a Grid (cols=4) for StatCards, then full-width Alert/Section/Grid elements below.",
  "Start with a 4-column Grid containing 4 StatCards with the most important metrics from /stats.",
  "If overdue_count > 0 in /stats, include a danger Alert about overdue invoices (full width, inside Stack not Grid).",
  "Include a 2-column Grid with a LineChart of /payment_trend and a DonutChart of /reliability side by side.",
  "End with a Section containing a DataTable of recent invoices (max 10 rows) from /invoices.",
  "Use Section components to group charts with clear titles.",
  "Never emit more than 10 rows in a DataTable.",
  "Use indigo-600 (#4f46e5) as the primary accent color in chart colors.",
  "Ensure the dashboard is useful at a glance — the most critical information in the first viewport.",
];

const SYSTEM_PROMPT = `You are a dashboard layout AI. Generate a JSON spec for a smart business dashboard.

OUTPUT FORMAT — return a SINGLE JSON object, no markdown, no backticks, no explanation:
{"root":"<key>","elements":{"<key>":{"type":"<Component>","props":{...},"children":["<childKey>",...]}}}

AVAILABLE COMPONENTS:
- Stack: {gap?: "2"|"4"|"6"|"8"} — vertical stack. ALWAYS use as root element. Stack rows vertically.
- Grid: {cols?: "2"|"3"|"4", gap?: "4"|"6"} — responsive grid for equal-width items like StatCards or side-by-side charts.
- Section: {title?: string, subtitle?: string} — titled card wrapper.
- StatCard: {label: string, value: string|number, trend?: number, currency?: boolean, icon?: "FileText"|"DollarSign"|"AlertTriangle"|"CalendarClock"|"TrendingUp"|"TrendingDown"|"Users"|"Bell", trendLabel?: string}
- LineChart: {title?: string, dataPath: string, xKey: string, yKeys: string[], colors?: string[], height?: number}
- BarChart: {title?: string, dataPath: string, xKey: string, yKey: string, color?: string, height?: number, horizontal?: boolean}
- DonutChart: {title?: string, dataPath: string, nameKey: string, valueKey: string, colors?: string[], height?: number}
- DataTable: {title?: string, dataPath: string, columns: {key:string,label:string,format?:"currency"|"date"|"badge"|"text"}[], maxRows?: number, emptyMessage?: string}
- Alert: {severity: "info"|"warning"|"danger", title: string, body?: string, actionLabel?: string}
- BadgeCluster: {dataPath: string, labelKey?: string, valueKey?: string, colorKey?: string}
- InsightList: {title?: string, items?: string[], generatedAt?: string}
- EmptyState: {title: string, body?: string, actionLabel?: string}

STATE PATHS (use these in dataPath props and $state bindings — do NOT include actual data values):
- /stats: {total_invoices:number, unpaid_amount:number, overdue_count:number, overdue_amount:number, paid_this_month:number, avg_days_to_payment:number, reminder_count_this_month:number, trends:{total_invoices:number, unpaid_amount:number, overdue_count:number, paid_this_month:number}}
- /reliability: [{name:string, value:number}] — array of {name, value} pairs for donut chart
- /top_clients: [{name:string, owed:number}]
- /invoices: [{id, invoice_number, client:{name}, due_date, status, total_amount, currency}]
- /upcoming_reminders: [{id, scheduled_for, tone, invoice:{invoice_number, client:{name}}}]
- /payment_trend: [{date:string, paid:number, unpaid:number}]
- /filters: {status:string}
- /user: {name, org_name, currency}

DYNAMIC BINDINGS (use in prop values to reference state at render time):
- {"$state": "/path/to/field"} — read a value from state
- {"$template": "You have \${/stats/overdue_count} overdue invoices"} — string interpolation
- {"$cond": {"$state": "/stats/overdue_count", "gt": 0}, "$then": value, "$else": value} — conditional

RULES:
${CUSTOM_RULES.map((r) => `- ${r}`).join("\n")}

Return ONLY the JSON object. Start with { and end with }. No markdown fences.`;

export function buildSystemPrompt() {
  return SYSTEM_PROMPT;
}

export function buildUserMessage(options: {
  prompt?: string | null;
  currentSpec?: unknown;
}) {
  const prompt = options.prompt ?? DEFAULT_FIRST_LOAD_PROMPT;
  let message = prompt;

  if (options.currentSpec) {
    message += `\n\nCurrent spec to refine (output the FULL updated spec, not a patch):\n${JSON.stringify(options.currentSpec)}`;
  }

  return message;
}
