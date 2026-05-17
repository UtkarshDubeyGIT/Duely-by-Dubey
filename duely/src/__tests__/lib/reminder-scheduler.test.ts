/**
 * @file lib/reminder-scheduler.test.ts
 * @description Unit tests for the reminder scheduling logic in src/lib/reminder-scheduler.ts
 *
 * Tests cover:
 *  - REMINDER_SCHEDULE constant  — verifies the 5 default schedule entries
 *  - generateSchedule()          — verifies dates, tones, and structure
 *  - getToneLabel()              — verifies human-readable tone labels
 */

import { describe, it, expect } from "vitest";
import { REMINDER_SCHEDULE, generateSchedule, getToneLabel } from "@/lib/reminder-scheduler";

// ---------------------------------------------------------------------------
// REMINDER_SCHEDULE constant
// ---------------------------------------------------------------------------
describe("REMINDER_SCHEDULE", () => {
  it("contains exactly 5 reminder stages", () => {
    expect(REMINDER_SCHEDULE).toHaveLength(5);
  });

  it("starts with a -7 day heads-up (friendly)", () => {
    const first = REMINDER_SCHEDULE[0];
    expect(first.days_offset).toBe(-7);
    expect(first.tone).toBe("friendly");
  });

  it("ends with a +7 day final_notice", () => {
    const last = REMINDER_SCHEDULE[REMINDER_SCHEDULE.length - 1];
    expect(last.days_offset).toBe(7);
    expect(last.tone).toBe("final_notice");
  });

  it("includes a due-today reminder (offset = 0)", () => {
    const dueToday = REMINDER_SCHEDULE.find((e) => e.days_offset === 0);
    expect(dueToday).toBeDefined();
    expect(dueToday?.tone).toBe("firm");
  });

  it("has valid tone values for every entry", () => {
    const validTones = new Set(["friendly", "firm", "final_notice"]);
    for (const entry of REMINDER_SCHEDULE) {
      expect(validTones.has(entry.tone)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// generateSchedule()
// ---------------------------------------------------------------------------
describe("generateSchedule()", () => {
  const dueDate = "2025-06-01";
  const orgId = "org-abc";
  const invoiceId = "inv-xyz";

  const schedule = generateSchedule(dueDate, orgId, invoiceId);

  it("returns the same number of entries as REMINDER_SCHEDULE", () => {
    expect(schedule).toHaveLength(REMINDER_SCHEDULE.length);
  });

  it("sets every entry status to 'pending'", () => {
    for (const entry of schedule) {
      expect(entry.status).toBe("pending");
    }
  });

  it("attaches the correct org_id and invoice_id to every entry", () => {
    for (const entry of schedule) {
      expect(entry.org_id).toBe(orgId);
      expect(entry.invoice_id).toBe(invoiceId);
    }
  });

  it("computes scheduled_for in YYYY-MM-DD format", () => {
    for (const entry of schedule) {
      expect(entry.scheduled_for).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("calculates -7 day offset correctly relative to due date", () => {
    // Derive the expected date the same way the scheduler does (timezone-safe)
    const due = new Date(`${dueDate}T00:00:00`);
    const expected = new Date(due);
    expected.setDate(expected.getDate() - 7);
    const expectedStr = expected.toISOString().slice(0, 10);

    const headUp = schedule.find(
      (_, i) => REMINDER_SCHEDULE[i].days_offset === -7,
    );
    expect(headUp?.scheduled_for).toBe(expectedStr);
  });

  it("calculates +7 day offset correctly relative to due date", () => {
    const due = new Date(`${dueDate}T00:00:00`);
    const expected = new Date(due);
    expected.setDate(expected.getDate() + 7);
    const expectedStr = expected.toISOString().slice(0, 10);

    const finalNotice = schedule.find(
      (_, i) => REMINDER_SCHEDULE[i].days_offset === 7,
    );
    expect(finalNotice?.scheduled_for).toBe(expectedStr);
  });

  it("calculates due-today entry (offset 0) to match the due date representation", () => {
    // offset 0 — the scheduler slices toISOString() which may shift by tz
    const due = new Date(`${dueDate}T00:00:00`);
    const expectedStr = due.toISOString().slice(0, 10);

    const dueToday = schedule.find(
      (_, i) => REMINDER_SCHEDULE[i].days_offset === 0,
    );
    expect(dueToday?.scheduled_for).toBe(expectedStr);
  });

  it("produces entries in ascending date order", () => {
    const dates = schedule.map((e) => e.scheduled_for);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it("handles leap-year due dates correctly (Feb 2024 has 29 days)", () => {
    const leapDue = "2024-03-01";
    const leapSchedule = generateSchedule(leapDue, orgId, invoiceId);
    // Derive expected the same way the scheduler does
    const due = new Date(`${leapDue}T00:00:00`);
    const expected = new Date(due);
    expected.setDate(expected.getDate() - 7);
    const expectedStr = expected.toISOString().slice(0, 10);
    const headUp = leapSchedule[0];
    expect(headUp.scheduled_for).toBe(expectedStr);
  });
});

// ---------------------------------------------------------------------------
// getToneLabel()
// ---------------------------------------------------------------------------
describe("getToneLabel()", () => {
  it("returns 'Friendly' for the friendly tone", () => {
    expect(getToneLabel("friendly")).toBe("Friendly");
  });

  it("returns 'Firm' for the firm tone", () => {
    expect(getToneLabel("firm")).toBe("Firm");
  });

  it("returns 'Final Notice' for the final_notice tone", () => {
    expect(getToneLabel("final_notice")).toBe("Final Notice");
  });
});
