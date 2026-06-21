import { defineCatalog } from "@json-render/core";
import { z } from "zod";
import { schema } from "./schema";

export const catalog = defineCatalog(schema, {
  components: {
    Stack: {
      props: z.object({
        gap: z.enum(["2", "4", "6", "8"]).optional(),
      }),
      slots: ["default"],
      description:
        "Vertical stack container. Use as the ROOT element to stack rows vertically. Put a Grid inside it for rows of StatCards. Put Sections/Alerts directly inside Stack for full-width content.",
    },
    Grid: {
      props: z.object({
        cols: z.enum(["2", "3", "4"]).optional(),
        gap: z.enum(["4", "6"]).optional(),
      }),
      slots: ["default"],
      description:
        "Responsive grid container. Use for laying out StatCards, charts, or any child components in columns. Default: 4 columns on desktop, 2 on mobile.",
    },
    Section: {
      props: z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
      }),
      slots: ["default"],
      description:
        "A titled section with an optional subtitle. Wraps content in a Card. Use to group related components.",
    },
    StatCard: {
      props: z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
        trend: z.number().optional(),
        currency: z.boolean().optional(),
        icon: z
          .enum([
            "FileText",
            "DollarSign",
            "AlertTriangle",
            "CalendarClock",
            "TrendingUp",
            "TrendingDown",
            "Users",
            "Bell",
          ])
          .optional(),
        trendLabel: z.string().optional(),
      }),
      description:
        "A single KPI stat card showing a label, value, optional trend delta, and optional icon. Use in a Grid for a top-level metrics row. Value supports $state bindings to /stats/* fields.",
    },
    LineChart: {
      props: z.object({
        title: z.string().optional(),
        dataPath: z.string(),
        xKey: z.string(),
        yKeys: z.array(z.string()),
        colors: z.array(z.string()).optional(),
        height: z.number().optional(),
      }),
      description:
        "Line chart for time-series data. dataPath must be a $state path (e.g. '/payment_trend') to a flat array of objects. yKeys is the field names for each line. Use for payment trends over time.",
    },
    BarChart: {
      props: z.object({
        title: z.string().optional(),
        dataPath: z.string(),
        xKey: z.string(),
        yKey: z.string(),
        color: z.string().optional(),
        height: z.number().optional(),
        horizontal: z.boolean().optional(),
      }),
      description:
        "Bar chart for categorical comparisons. dataPath must be a $state path (e.g. '/top_clients') to an array. Use for top clients by amount owed.",
    },
    DonutChart: {
      props: z.object({
        title: z.string().optional(),
        dataPath: z.string(),
        nameKey: z.string(),
        valueKey: z.string(),
        colors: z.array(z.string()).optional(),
        height: z.number().optional(),
      }),
      description:
        "Donut/pie chart for proportional breakdowns. dataPath must be a $state path. Use for reliability distribution.",
    },
    DataTable: {
      props: z.object({
        title: z.string().optional(),
        dataPath: z.string(),
        columns: z.array(
          z.object({
            key: z.string(),
            label: z.string(),
            format: z.enum(["currency", "date", "badge", "text"]).optional(),
          })
        ),
        maxRows: z.number().optional(),
        emptyMessage: z.string().optional(),
      }),
      description:
        "A data table for structured records. dataPath must be a $state path (e.g. '/invoices') to an array. columns define which fields to show and how to format them. Max 10 rows recommended.",
    },
    Alert: {
      props: z.object({
        severity: z.enum(["info", "warning", "danger"]),
        title: z.string(),
        body: z.string().optional(),
        actionLabel: z.string().optional(),
      }),
      description:
        "A high-visibility alert banner. Use severity=danger for overdue warnings, severity=warning for upcoming deadlines, severity=info for general notices.",
    },
    BadgeCluster: {
      props: z.object({
        dataPath: z.string(),
        labelKey: z.string().optional(),
        valueKey: z.string().optional(),
        colorKey: z.string().optional(),
      }),
      description:
        "A row of labeled badges/pills. dataPath must be a $state path to an array. Use for client reliability tags or status breakdowns.",
    },
    InsightList: {
      props: z.object({
        title: z.string().optional(),
        items: z.array(z.string()).optional(),
        generatedAt: z.string().optional(),
      }),
      description:
        "A bulleted list of AI-generated insights. Each item is a short actionable insight string. Shows a subtle footer.",
    },
    EmptyState: {
      props: z.object({
        title: z.string(),
        body: z.string().optional(),
        actionLabel: z.string().optional(),
      }),
      description:
        "An empty/zero state placeholder. Use when there is no data to display.",
    },
  },
  actions: {
    openInvoice: {
      params: z.object({
        invoiceId: z.string(),
      }),
      description:
        "Open the invoice detail dialog for a specific invoice. Use when a user clicks on an invoice row.",
    },
    navigate: {
      params: z.object({
        route: z.string(),
      }),
      description:
        "Navigate to another page in the app. Use for 'See all invoices', 'View all clients', or 'Open classic dashboard' links.",
    },
  },
});

export type Catalog = typeof catalog;
