/**
 * @file lib/utils.test.ts
 * @description Unit tests for the shared utility functions in src/lib/utils.ts
 *
 * Tests cover:
 *  - cn()                  — className merger
 *  - formatCurrency()      — INR currency formatting
 *  - formatDate()          — human-readable date strings
 *  - daysOverdue()         — days past due date
 *  - isOverdue()           — overdue predicate
 *  - generateInvoiceNumber()— zero-padded invoice IDs
 *  - getInitials()         — avatar initials extraction
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  formatCurrency,
  formatDate,
  daysOverdue,
  isOverdue,
  generateInvoiceNumber,
  getInitials,
} from "@/lib/utils";

// ---------------------------------------------------------------------------
// cn() — Tailwind class merger
// ---------------------------------------------------------------------------
describe("cn()", () => {
  it("merges simple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes (falsy values are excluded)", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge resolves conflicts: p-4 overrides p-2
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("returns empty string when no valid classes are passed", () => {
    expect(cn(false, undefined, null as unknown as string)).toBe("");
  });
});

// ---------------------------------------------------------------------------
// formatCurrency() — INR currency formatting
// ---------------------------------------------------------------------------
describe("formatCurrency()", () => {
  it("formats whole number amounts in INR", () => {
    const result = formatCurrency(1000);
    // The formatted string must include the amount digits and no decimals
    expect(result).toContain("1,000");
    expect(result).not.toContain(".");
  });

  it("formats zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("formats large numbers with Indian grouping (lakhs)", () => {
    const result = formatCurrency(100000);
    // 1,00,000 in Indian system
    expect(result).toContain("1,00,000");
  });

  it("uses custom currency when provided", () => {
    const result = formatCurrency(500, "USD");
    expect(result).toContain("500");
    // Should contain $ or USD
    expect(result.match(/\$|USD/)).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// formatDate() — human-readable date strings
// ---------------------------------------------------------------------------
describe("formatDate()", () => {
  it('returns "N/A" for null', () => {
    expect(formatDate(null)).toBe("N/A");
  });

  it('returns "N/A" for undefined', () => {
    expect(formatDate(undefined)).toBe("N/A");
  });

  it('returns "Invalid Date" for a garbage string', () => {
    expect(formatDate("not-a-date")).toBe("Invalid Date");
  });

  it("formats a plain date string (YYYY-MM-DD) correctly", () => {
    expect(formatDate("2025-01-15")).toBe("Jan 15, 2025");
  });

  it("formats a full ISO 8601 datetime string correctly", () => {
    expect(formatDate("2025-06-20T10:00:00")).toBe("Jun 20, 2025");
  });
});

// ---------------------------------------------------------------------------
// daysOverdue() — days past due date
// ---------------------------------------------------------------------------
describe("daysOverdue()", () => {
  beforeEach(() => {
    // Pin "today" to 2025-05-20 for deterministic results
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-20T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 when due date is today", () => {
    expect(daysOverdue("2025-05-20")).toBe(0);
  });

  it("returns 0 when due date is in the future", () => {
    expect(daysOverdue("2025-06-01")).toBe(0);
  });

  it("returns positive days when past due", () => {
    expect(daysOverdue("2025-05-10")).toBe(10);
  });

  it("returns 1 for yesterday", () => {
    expect(daysOverdue("2025-05-19")).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// isOverdue() — overdue predicate
// ---------------------------------------------------------------------------
describe("isOverdue()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-20T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for a pending invoice past its due date", () => {
    expect(isOverdue("2025-05-10", "pending")).toBe(true);
  });

  it("returns false for a paid invoice even if past due", () => {
    expect(isOverdue("2025-05-10", "paid")).toBe(false);
  });

  it("returns false for a pending invoice due in the future", () => {
    expect(isOverdue("2025-06-01", "pending")).toBe(false);
  });

  it("returns false for a draft invoice that is past due", () => {
    expect(isOverdue("2025-05-10", "draft")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// generateInvoiceNumber()
// ---------------------------------------------------------------------------
describe("generateInvoiceNumber()", () => {
  it("generates INV-0001 when count is 0", () => {
    expect(generateInvoiceNumber(0)).toBe("INV-0001");
  });

  it("zero-pads to four digits", () => {
    expect(generateInvoiceNumber(9)).toBe("INV-0010");
  });

  it("handles numbers beyond four digits", () => {
    expect(generateInvoiceNumber(9999)).toBe("INV-10000");
  });

  it("always prefixes with INV-", () => {
    expect(generateInvoiceNumber(42)).toMatch(/^INV-/);
  });
});

// ---------------------------------------------------------------------------
// getInitials()
// ---------------------------------------------------------------------------
describe("getInitials()", () => {
  it("extracts initials from a two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns only first two initials for longer names", () => {
    expect(getInitials("Anna Marie Claire")).toBe("AM");
  });

  it("returns single uppercase letter for a one-word name", () => {
    expect(getInitials("Prince")).toBe("P");
  });

  it("uppercases lowercase input", () => {
    expect(getInitials("alice bob")).toBe("AB");
  });
});
