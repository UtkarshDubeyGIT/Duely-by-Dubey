# Duely — TypeScript Types
## File: src/types/index.ts

```typescript
// ─────────────────────────────────────────
// ENUMS & UNION TYPES
// ─────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue'

export type ReminderType = 'manual' | 'auto'

export type ReminderTone = 'friendly' | 'firm' | 'final_notice'

export type ReminderChannel = 'email' | 'sms'

export type ReminderStatus = 'sent' | 'failed' | 'paused'

export type ScheduledReminderStatus = 'pending' | 'sent' | 'skipped' | 'paused'

export type ClientReliability = 'reliable' | 'slow' | 'at_risk' | 'new'

export type UserRole = 'owner' | 'admin' | 'member'


// ─────────────────────────────────────────
// DATABASE ENTITIES
// ─────────────────────────────────────────

export interface Organization {
  id: string
  name: string
  owner_id: string
  logo_url: string | null
  created_at: string
}

export interface Profile {
  id: string
  org_id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface Client {
  id: string
  org_id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  notes: string | null
  total_invoices: number
  avg_days_late: number
  reliability_tag: ClientReliability
  created_at: string
  updated_at: string
}

export interface LineItem {
  id: string
  description: string
  qty: number
  price: number
  amount: number
}

export interface Invoice {
  id: string
  org_id: string
  client_id: string
  invoice_number: string
  amount: number
  currency: string
  tax_rate: number
  tax_amount: number
  total_amount: number
  status: InvoiceStatus
  issued_date: string
  due_date: string
  paid_date: string | null
  description: string | null
  notes: string | null
  line_items: LineItem[]
  attachment_url: string | null
  attachment_name: string | null
  reminder_count: number
  last_reminded_at: string | null
  created_at: string
  updated_at: string
  // Joined
  client?: Client
}

export interface ReminderLog {
  id: string
  invoice_id: string
  org_id: string
  client_id: string
  type: ReminderType
  tone: ReminderTone
  channel: ReminderChannel
  status: ReminderStatus
  message_id: string | null
  error_message: string | null
  sent_at: string
  // Joined
  invoice?: Invoice
  client?: Client
}

export interface ReminderSchedule {
  id: string
  invoice_id: string
  org_id: string
  scheduled_for: string
  tone: ReminderTone
  status: ScheduledReminderStatus
  paused_reason: string | null
  created_at: string
  // Joined (used in dashboard)
  invoice?: Invoice & { client?: Client }
}


// ─────────────────────────────────────────
// API PAYLOADS
// ─────────────────────────────────────────

export interface CreateInvoicePayload {
  client_id: string
  invoice_number: string
  amount: number
  currency?: string
  tax_rate?: number
  issued_date: string
  due_date: string
  description?: string
  notes?: string
  line_items: Omit<LineItem, 'id'>[]
  attachment_url?: string
  attachment_name?: string
}

export interface UpdateInvoicePayload {
  status?: InvoiceStatus
  paid_date?: string
  notes?: string
  attachment_url?: string
}

export interface CreateClientPayload {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
}

export interface UpdateClientPayload {
  name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
}

export interface SendReminderPayload {
  invoice_id: string
  tone: ReminderTone
  custom_message?: string
}


// ─────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────

export interface DashboardStats {
  total_invoices: number
  unpaid_amount: number
  overdue_count: number
  paid_this_month: number
  // trends (vs last month)
  total_invoices_trend: number
  unpaid_amount_trend: number
  overdue_count_trend: number
  paid_this_month_trend: number
}

export interface DashboardData {
  stats: DashboardStats
  recent_invoices: Invoice[]
  upcoming_reminders: ReminderSchedule[]
  overdue_invoices: Invoice[]
}


// ─────────────────────────────────────────
// UI STATE TYPES
// ─────────────────────────────────────────

export interface InvoiceFilters {
  search: string
  status: InvoiceStatus | 'all'
  date_from: string | null
  date_to: string | null
  sort_by: 'due_date' | 'amount' | 'created_at'
  sort_order: 'asc' | 'desc'
}

export interface ClientFilters {
  search: string
  reliability: ClientReliability | 'all'
}

export interface PaginationState {
  page: number
  per_page: number
  total: number
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// For email templates
export interface ReminderEmailProps {
  clientName: string
  businessName: string
  invoiceNumber: string
  amount: number
  currency: string
  dueDate: string
  daysOverdue?: number
  tone: ReminderTone
  paymentLink?: string
  customMessage?: string
}
```

---

## Notes on Current Implementation

- `ReminderSchedule` now includes an optional `invoice` join used by the dashboard's upcoming-reminders widget.
- `UpdateClientPayload` was added to support the `EditClientDialog` component.
- Currency defaults to `'INR'` in the UI (updated from original `'USD'` to reflect the rupee symbol change), but the type still accepts any ISO 4217 currency string.
- The `line_items` field on `Invoice` is stored as JSONB in Postgres and typed as `LineItem[]` in TypeScript.
- All data fetchers in `src/lib/data.ts` are wrapped with React's `cache()` for deduplication within a single render pass.
