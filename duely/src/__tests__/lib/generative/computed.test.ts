import { describe, it, expect } from "vitest";

// Test pure versions of computed functions (same logic as in GenerativeDashboard)
const filterInvoices = (args: Record<string, unknown>) => {
  const items = (args.items as Record<string, unknown>[]) ?? [];
  const status = args.status as string;
  if (!status || status === "all") return items;
  return items.filter(
    (item) => String(item.status ?? "").toLowerCase() === status.toLowerCase()
  );
};

const sumByField = (args: Record<string, unknown>) => {
  const items = (args.items as Record<string, unknown>[]) ?? [];
  const field = args.field as string;
  return items.reduce((sum, item) => {
    const val = Number(item[field] ?? 0);
    return sum + (Number.isNaN(val) ? 0 : val);
  }, 0);
};

const countBy = (args: Record<string, unknown>) => {
  const items = (args.items as Record<string, unknown>[]) ?? [];
  const field = args.field as string;
  const value = args.value as string;
  if (!field || value == null) return items.length;
  return items.filter(
    (item) => String(item[field] ?? "").toLowerCase() === value.toLowerCase()
  ).length;
};

describe("computed functions", () => {
  describe("filterInvoices", () => {
    const items = [
      { id: "1", status: "paid", amount: 100 },
      { id: "2", status: "pending", amount: 200 },
      { id: "3", status: "overdue", amount: 300 },
      { id: "4", status: "pending", amount: 400 },
    ];

    it("returns all items when status is 'all'", () => {
      const result = filterInvoices({ items, status: "all" });
      expect(result).toHaveLength(4);
    });

    it("returns all items when status is empty", () => {
      const result = filterInvoices({ items, status: "" });
      expect(result).toHaveLength(4);
    });

    it("filters by status", () => {
      const result = filterInvoices({ items, status: "pending" });
      expect(result).toHaveLength(2);
      expect((result as Record<string, unknown>[]).every((r) => r.status === "pending")).toBe(true);
    });

    it("case-insensitive filtering", () => {
      const result = filterInvoices({ items, status: "OVERDUE" });
      expect(result).toHaveLength(1);
    });

    it("handles empty items array", () => {
      const result = filterInvoices({ items: [], status: "paid" });
      expect(result).toHaveLength(0);
    });

    it("handles undefined items", () => {
      const result = filterInvoices({ status: "paid" });
      expect(result).toHaveLength(0);
    });
  });

  describe("sumByField", () => {
    const items = [
      { name: "a", value: 10 },
      { name: "b", value: 20 },
      { name: "c", value: -5 },
    ];

    it("sums a field across items", () => {
      const result = sumByField({ items, field: "value" });
      expect(result).toBe(25);
    });

    it("returns 0 for empty items", () => {
      const result = sumByField({ items: [], field: "value" });
      expect(result).toBe(0);
    });

    it("handles missing fields as 0", () => {
      const result = sumByField({ items, field: "nonexistent" });
      expect(result).toBe(0);
    });
  });

  describe("countBy", () => {
    const items = [
      { type: "a", val: 1 },
      { type: "a", val: 2 },
      { type: "b", val: 3 },
    ];

    it("counts items matching a field value", () => {
      const result = countBy({ items, field: "type", value: "a" });
      expect(result).toBe(2);
    });

    it("returns total length when field is empty", () => {
      const result = countBy({ items, field: "", value: "a" });
      expect(result).toBe(3);
    });

    it("case-insensitive matching", () => {
      const result = countBy({ items, field: "type", value: "B" });
      expect(result).toBe(1);
    });
  });
});
