import { describe, it, expect } from "vitest";
import { computeBusinessData, buildTieredStateModel } from "@/lib/dashboard-aggregations";
import type { Invoice, Client } from "@/types";

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: "inv-1",
    org_id: "org-1",
    client_id: "client-1",
    invoice_number: "INV-001",
    amount: 1000,
    currency: "USD",
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 1000,
    status: "pending",
    issued_date: "2026-06-01",
    due_date: "2026-06-15",
    paid_date: null,
    description: null,
    notes: null,
    line_items: [],
    attachment_url: null,
    attachment_name: null,
    reminder_count: 0,
    last_reminded_at: null,
    created_at: "2026-06-01",
    updated_at: "2026-06-01",
    client: { id: "client-1", name: "Test Client", email: "test@test.com" } as Client,
    ...overrides,
  } as Invoice;
}

function makeClient(overrides: Partial<Client> = {}): Client {
  return {
    id: "client-1",
    org_id: "org-1",
    name: "Test Client",
    email: "test@test.com",
    phone: null,
    company: null,
    address: null,
    notes: null,
    total_invoices: 0,
    avg_days_late: 0,
    reliability_tag: "new",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    ...overrides,
  };
}

describe("computeBusinessData", () => {
  it("computes basic stats from invoices", () => {
    const invoices = [
      makeInvoice({ id: "inv-1", status: "paid", total_amount: 1000, paid_date: "2026-06-10" }),
      makeInvoice({ id: "inv-2", status: "pending", total_amount: 500 }),
      makeInvoice({ id: "inv-3", status: "overdue", total_amount: 200, client_id: "client-2" }),
    ];
    const clients = [
      makeClient({ id: "client-1" }),
      makeClient({ id: "client-2", name: "Client Two" }),
    ];

    const result = computeBusinessData(invoices, clients, null);

    expect(result.total_invoices_count).toBe(3);
    expect(result.unpaid_amount).toBe(700); // 500 + 200
    expect(result.overdue_count).toBe(1);
    expect(result.overdue_amount).toBe(200);
  });

  it("computes paid this month", () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const invoices = [
      makeInvoice({
        id: "inv-1",
        status: "paid",
        total_amount: 500,
        paid_date: `${currentMonth}-10`,
      }),
    ];

    const result = computeBusinessData(invoices, [], null);
    expect(result.paid_this_month_total).toBe(500);
  });

  it("handles empty invoices", () => {
    const result = computeBusinessData([], [], null);
    expect(result.total_invoices_count).toBe(0);
    expect(result.unpaid_amount).toBe(0);
    expect(result.overdue_count).toBe(0);
    expect(result.top_3_clients_by_amount_owed).toHaveLength(0);
  });

  it("computes top 3 clients by amount owed", () => {
    const invoices = [
      makeInvoice({ id: "inv-1", client_id: "c1", status: "pending", total_amount: 100 }),
      makeInvoice({ id: "inv-2", client_id: "c1", status: "overdue", total_amount: 200 }),
      makeInvoice({ id: "inv-3", client_id: "c2", status: "pending", total_amount: 50 }),
      makeInvoice({ id: "inv-4", client_id: "c3", status: "pending", total_amount: 300 }),
    ];
    const clients = [
      makeClient({ id: "c1", name: "A" }),
      makeClient({ id: "c2", name: "B" }),
      makeClient({ id: "c3", name: "C" }),
    ];

    const result = computeBusinessData(invoices, clients, null);
    expect(result.top_3_clients_by_amount_owed).toHaveLength(3);
    expect(result.top_3_clients_by_amount_owed[0].name).toBe("A"); // 300 (100+200)
    expect(result.top_3_clients_by_amount_owed[1].name).toBe("C"); // 300
    expect(result.top_3_clients_by_amount_owed[2].name).toBe("B"); // 50
  });

  it("computes reliability breakdown", () => {
    const clients = [
      makeClient({ id: "c1", reliability_tag: "reliable" }),
      makeClient({ id: "c2", reliability_tag: "reliable" }),
      makeClient({ id: "c3", reliability_tag: "slow" }),
      makeClient({ id: "c4", reliability_tag: "at_risk" }),
      makeClient({ id: "c5", reliability_tag: "new" }),
    ];

    const result = computeBusinessData([], clients, null);
    expect(result.client_reliability_breakdown).toEqual({
      reliable: 2,
      slow: 1,
      at_risk: 1,
      new: 0, // default for "new" tag is reset in business data
    });
  });
});

describe("buildTieredStateModel", () => {
  it("builds tiered state with caps", () => {
    const invoices = Array.from({ length: 25 }, (_, i) =>
      makeInvoice({ id: `inv-${i}`, status: "pending", total_amount: 100 })
    );

    const result = buildTieredStateModel(invoices, [], []);

    // caps: 20 invoices
    expect(result.invoices).toHaveLength(20);
    expect(result.stats.total_invoices).toBe(25);
    expect(result.stats.unpaid_amount).toBe(2500);

    // payment_trend has 30 entries
    expect(result.payment_trend).toHaveLength(30);

    // filters initialized
    expect(result.filters.status).toBe("all");

    // user defaults
    expect(result.user.name).toBe("Business Owner");
  });

  it("caps top_clients to 10", () => {
    const clients = Array.from({ length: 15 }, (_, i) =>
      makeClient({ id: `c${i}`, name: `Client ${i}` })
    );
    const invoices = clients.map((c, i) =>
      makeInvoice({
        id: `inv-${i}`,
        client_id: c.id,
        status: "pending",
        total_amount: 100 + i,
      })
    );

    const result = buildTieredStateModel(invoices, clients, []);
    expect(result.top_clients.length).toBeLessThanOrEqual(10);
  });
});
