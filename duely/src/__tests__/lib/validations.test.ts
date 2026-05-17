/**
 * @file lib/validations.test.ts
 * @description Unit tests for all Zod validation schemas in src/lib/validations.ts
 *
 * Tests cover both happy-path (valid input) and sad-path (invalid input)
 * for every schema: lineItemSchema, createInvoiceSchema, createClientSchema,
 * sendReminderSchema, signupSchema, and loginSchema.
 */

import { describe, it, expect } from "vitest";
import {
  lineItemSchema,
  createInvoiceSchema,
  createClientSchema,
  sendReminderSchema,
  signupSchema,
  loginSchema,
} from "@/lib/validations";

// ---------------------------------------------------------------------------
// lineItemSchema
// ---------------------------------------------------------------------------
describe("lineItemSchema", () => {
  const valid = { description: "Web design", qty: 2, price: 5000, amount: 10000 };

  it("accepts a valid line item", () => {
    expect(lineItemSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty description", () => {
    const result = lineItemSchema.safeParse({ ...valid, description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects qty below 1", () => {
    const result = lineItemSchema.safeParse({ ...valid, qty: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = lineItemSchema.safeParse({ ...valid, price: -1 });
    expect(result.success).toBe(false);
  });

  it("coerces string numbers for qty and price", () => {
    const result = lineItemSchema.safeParse({ ...valid, qty: "3", price: "200", amount: "600" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.qty).toBe(3);
      expect(result.data.price).toBe(200);
    }
  });
});

// ---------------------------------------------------------------------------
// createInvoiceSchema
// ---------------------------------------------------------------------------
describe("createInvoiceSchema", () => {
  const validLineItem = { description: "Dev work", qty: 1, price: 10000, amount: 10000 };
  const valid = {
    client_id: "client-uuid-123",
    invoice_number: "INV-0001",
    amount: 10000,
    currency: "INR",
    tax_rate: 18,
    issued_date: "2025-05-01",
    due_date: "2025-05-31",
    line_items: [validLineItem],
  };

  it("accepts a fully valid invoice payload", () => {
    expect(createInvoiceSchema.safeParse(valid).success).toBe(true);
  });

  it("requires client_id", () => {
    const result = createInvoiceSchema.safeParse({ ...valid, client_id: "" });
    expect(result.success).toBe(false);
  });

  it("requires amount > 0", () => {
    const result = createInvoiceSchema.safeParse({ ...valid, amount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects tax_rate above 100", () => {
    const result = createInvoiceSchema.safeParse({ ...valid, tax_rate: 101 });
    expect(result.success).toBe(false);
  });

  it("requires at least one line item", () => {
    const result = createInvoiceSchema.safeParse({ ...valid, line_items: [] });
    expect(result.success).toBe(false);
  });

  it("defaults currency to INR when omitted", () => {
    const { currency: _c, ...withoutCurrency } = valid;
    const result = createInvoiceSchema.safeParse(withoutCurrency);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.currency).toBe("INR");
  });

  it("defaults tax_rate to 0 when omitted", () => {
    const { tax_rate: _t, ...withoutTax } = valid;
    const result = createInvoiceSchema.safeParse(withoutTax);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tax_rate).toBe(0);
  });

  it("accepts optional description and notes", () => {
    const result = createInvoiceSchema.safeParse({
      ...valid,
      description: "Q1 project",
      notes: "Net 30",
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// createClientSchema
// ---------------------------------------------------------------------------
describe("createClientSchema", () => {
  const valid = { name: "Acme Corp", email: "acme@example.com" };

  it("accepts a valid client with required fields only", () => {
    expect(createClientSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a client with all optional fields", () => {
    const result = createClientSchema.safeParse({
      ...valid,
      phone: "+91 9876543210",
      company: "Acme Inc",
      address: "123 Main St",
      notes: "VIP client",
    });
    expect(result.success).toBe(true);
  });

  it("requires a non-empty name", () => {
    const result = createClientSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("requires a valid email format", () => {
    const result = createClientSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects missing email entirely", () => {
    const result = createClientSchema.safeParse({ name: "No Email" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// sendReminderSchema
// ---------------------------------------------------------------------------
describe("sendReminderSchema", () => {
  it("accepts all valid tones", () => {
    for (const tone of ["friendly", "firm", "final_notice"] as const) {
      expect(sendReminderSchema.safeParse({ invoice_id: "inv-1", tone }).success).toBe(true);
    }
  });

  it("rejects an unknown tone", () => {
    const result = sendReminderSchema.safeParse({ invoice_id: "inv-1", tone: "aggressive" });
    expect(result.success).toBe(false);
  });

  it("requires a non-empty invoice_id", () => {
    const result = sendReminderSchema.safeParse({ invoice_id: "", tone: "friendly" });
    expect(result.success).toBe(false);
  });

  it("allows optional custom_message", () => {
    const result = sendReminderSchema.safeParse({
      invoice_id: "inv-1",
      tone: "firm",
      custom_message: "Please pay ASAP.",
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// signupSchema
// ---------------------------------------------------------------------------
describe("signupSchema", () => {
  const valid = {
    business_name: "My Studio",
    full_name: "Jane Doe",
    email: "jane@studio.com",
    password: "secret123",
  };

  it("accepts a valid signup payload", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty business_name", () => {
    expect(signupSchema.safeParse({ ...valid, business_name: "" }).success).toBe(false);
  });

  it("rejects empty full_name", () => {
    expect(signupSchema.safeParse({ ...valid, full_name: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(signupSchema.safeParse({ ...valid, email: "bad" }).success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    expect(signupSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  });

  it("accepts a password of exactly 8 characters", () => {
    expect(signupSchema.safeParse({ ...valid, password: "exactly8" }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------
describe("loginSchema", () => {
  const valid = { email: "user@example.com", password: "anypassword" };

  it("accepts valid credentials", () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(loginSchema.safeParse({ ...valid, email: "notanemail" }).success).toBe(false);
  });

  it("rejects empty password", () => {
    expect(loginSchema.safeParse({ ...valid, password: "" }).success).toBe(false);
  });
});
