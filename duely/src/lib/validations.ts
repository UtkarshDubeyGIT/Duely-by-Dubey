import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  qty: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
  amount: z.coerce.number().min(0),
});

export const createInvoiceSchema = z.object({
  client_id: z.string().min(1, "Select a client"),
  invoice_number: z.string().min(1),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().default("INR"),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  issued_date: z.string().min(1),
  due_date: z.string().min(1),
  description: z.string().optional(),
  notes: z.string().optional(),
  line_items: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

export const createClientSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const sendReminderSchema = z.object({
  invoice_id: z.string().min(1),
  tone: z.enum(["friendly", "firm", "final_notice"]),
  custom_message: z.string().optional(),
});

export const signupSchema = z.object({
  business_name: z.string().min(1, "Business name required"),
  full_name: z.string().min(1, "Your name required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});
