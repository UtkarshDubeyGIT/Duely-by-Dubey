# Duely — Implementation Guide (All Code)

## Build Order
Follow this exact sequence. Each step builds on the previous.

1. Project setup & dependencies
2. Supabase config + lib files
3. Middleware (auth guard)
4. Types
5. Auth pages (login, signup)
6. Dashboard layout + sidebar
7. Dashboard page (stats + overview)
8. Invoices page (list, create, detail)
9. Clients page
10. Reminders page
11. API routes
12. Email templates
13. Cron job
14. Deploy

---

## Step 1 — Project Bootstrap

```bash
npx create-next-app@latest duely \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd duely

npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  resend \
  react-email \
  @react-email/components \
  zod \
  @hookform/resolvers \
  react-hook-form \
  date-fns \
  clsx \
  tailwind-merge \
  lucide-react \
  recharts

npx shadcn@latest init
# Style: Default | Base color: Zinc | CSS variables: Yes

npx shadcn@latest add \
  button input label card badge table dialog \
  select textarea toast skeleton dropdown-menu \
  avatar separator sheet tabs popover calendar \
  command
```

---

## Step 2 — Supabase Lib Files

### src/lib/supabase/client.ts
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### src/lib/supabase/server.ts
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

### src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy')
}

export function daysOverdue(dueDate: string): number {
  const days = differenceInDays(new Date(), new Date(dueDate))
  return Math.max(0, days)
}

export function isOverdue(dueDate: string, status: string): boolean {
  return status === 'pending' && isPast(new Date(dueDate))
}

export function generateInvoiceNumber(count: number): string {
  return `INV-${String(count + 1).padStart(4, '0')}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
```

### src/lib/resend.ts
```typescript
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

### src/lib/reminder-scheduler.ts
```typescript
import { ReminderTone } from '@/types'

interface ScheduleEntry {
  days_offset: number  // relative to due_date (negative = before)
  tone: ReminderTone
  label: string
}

export const REMINDER_SCHEDULE: ScheduleEntry[] = [
  { days_offset: -7, tone: 'friendly',      label: 'Heads up (7 days before)' },
  { days_offset: -1, tone: 'friendly',      label: 'Gentle nudge (1 day before)' },
  { days_offset:  0, tone: 'firm',          label: 'Due today' },
  { days_offset:  3, tone: 'firm',          label: 'Overdue (3 days)' },
  { days_offset:  7, tone: 'final_notice',  label: 'Final notice (7 days overdue)' },
]

export function generateSchedule(dueDate: string, orgId: string, invoiceId: string) {
  const due = new Date(dueDate)
  return REMINDER_SCHEDULE.map(entry => {
    const scheduled = new Date(due)
    scheduled.setDate(scheduled.getDate() + entry.days_offset)
    return {
      invoice_id: invoiceId,
      org_id: orgId,
      scheduled_for: scheduled.toISOString().split('T')[0],
      tone: entry.tone,
      status: 'pending' as const,
    }
  })
}

export function getToneLabel(tone: ReminderTone): string {
  const labels: Record<ReminderTone, string> = {
    friendly: 'Friendly',
    firm: 'Firm',
    final_notice: 'Final Notice',
  }
  return labels[tone]
}
```

### src/lib/validations.ts
```typescript
import { z } from 'zod'

export const lineItemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  qty: z.number().min(1),
  price: z.number().min(0),
  amount: z.number().min(0),
})

export const createInvoiceSchema = z.object({
  client_id: z.string().uuid('Select a client'),
  invoice_number: z.string().min(1),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().default('USD'),
  tax_rate: z.number().min(0).max(100).default(0),
  issued_date: z.string(),
  due_date: z.string(),
  description: z.string().optional(),
  notes: z.string().optional(),
  line_items: z.array(lineItemSchema).min(1, 'Add at least one line item'),
})

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export const sendReminderSchema = z.object({
  invoice_id: z.string().uuid(),
  tone: z.enum(['friendly', 'firm', 'final_notice']),
  custom_message: z.string().optional(),
})

export const signupSchema = z.object({
  business_name: z.string().min(1, 'Business name required'),
  full_name: z.string().min(1, 'Your name required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
})
```

---

## Step 3 — Middleware

### middleware.ts (root level)
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup')
  const isPublicPage = request.nextUrl.pathname === '/'

  if (!user && !isAuthPage && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/cron).*)'],
}
```

---

## Step 4 — Auth Pages

### src/app/(auth)/layout.tsx
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
```

### src/app/(auth)/login/page.tsx
```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Duely</h1>
        <p className="text-zinc-400 mt-2 text-sm">Sign in to your account</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')}
              placeholder="you@business.com" className="mt-1" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')}
              placeholder="••••••••" className="mt-1" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
            disabled={loading}>
            {loading ? 'Signing in...' : 'Continue'}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-zinc-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
```

### src/app/(auth)/signup/page.tsx
```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { signupSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: SignupForm) {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          business_name: data.business_name,
        },
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Duely</h1>
        <p className="text-zinc-400 mt-2 text-sm">Create your business account</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="business_name">Business name</Label>
            <Input id="business_name" {...register('business_name')}
              placeholder="Acme Studio" className="mt-1" />
            {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="full_name">Your name</Label>
            <Input id="full_name" {...register('full_name')}
              placeholder="Aryan Dubey" className="mt-1" />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')}
              placeholder="you@business.com" className="mt-1" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')}
              placeholder="Min. 8 characters" className="mt-1" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
            disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-4">
          By signing up you agree to our Terms & Privacy Policy
        </p>
        <p className="text-center text-sm text-zinc-500 mt-3">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-900 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## Step 5 — Dashboard Layout

### src/app/(dashboard)/layout.tsx
```tsx
import Sidebar from '@/components/shared/Sidebar'
import TopBar from '@/components/shared/TopBar'
import MobileNav from '@/components/shared/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
```

### src/components/shared/Sidebar.tsx
```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Users, Bell, Settings, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices',   label: 'Invoices',  icon: FileText },
  { href: '/clients',    label: 'Clients',   icon: Users },
  { href: '/reminders',  label: 'Reminders', icon: Bell },
  { href: '/settings',   label: 'Settings',  icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex w-60 bg-zinc-950 flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight">Duely</h1>
        <p className="text-zinc-500 text-xs mt-0.5">by Dubey</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href) &&
            (item.href !== '/dashboard' || pathname === '/dashboard')
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}>
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800">
        <button onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 w-full transition-colors">
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
```

---

## Step 6 — API Routes

### src/app/api/invoices/route.ts
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createInvoiceSchema } from '@/lib/validations'
import { generateSchedule } from '@/lib/reminder-scheduler'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('org_id').eq('id', user.id).single()

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const per_page = parseInt(searchParams.get('per_page') || '20')

  let query = supabase
    .from('invoices')
    .select('*, client:clients(name, email, company)', { count: 'exact' })
    .eq('org_id', profile!.org_id)
    .order('created_at', { ascending: false })
    .range((page - 1) * per_page, page * per_page - 1)

  if (status && status !== 'all') query = query.eq('status', status)
  if (search) query = query.or(`invoice_number.ilike.%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('org_id').eq('id', user.id).single()

  const body = await request.json()
  const parsed = createInvoiceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const payload = parsed.data
  const tax_amount = (payload.amount * (payload.tax_rate || 0)) / 100
  const total_amount = payload.amount + tax_amount

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({ ...payload, org_id: profile!.org_id, tax_amount, total_amount })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-generate reminder schedule
  const schedule = generateSchedule(payload.due_date, profile!.org_id, invoice.id)
  await supabase.from('reminder_schedule').insert(schedule)

  return NextResponse.json({ data: invoice }, { status: 201 })
}
```

### src/app/api/invoices/[id]/remind/route.ts
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { sendReminderSchema } from '@/lib/validations'
import { render } from '@react-email/render'
import PaymentReminderEmail from '@/emails/PaymentReminder'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, organizations(name)')
    .eq('id', user.id).single()

  const body = await request.json()
  const parsed = sendReminderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .eq('id', params.id)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const { tone, custom_message } = parsed.data
  const org = profile!.organizations as any

  // Render email template
  const emailHtml = render(PaymentReminderEmail({
    clientName: invoice.client.name,
    businessName: org.name,
    invoiceNumber: invoice.invoice_number,
    amount: invoice.total_amount,
    currency: invoice.currency,
    dueDate: invoice.due_date,
    tone,
    customMessage: custom_message,
  }))

  const subjects: Record<string, string> = {
    friendly: `Payment reminder: ${invoice.invoice_number}`,
    firm: `Invoice ${invoice.invoice_number} — payment overdue`,
    final_notice: `Final notice: Invoice ${invoice.invoice_number}`,
  }

  // Send email via Resend
  const { data: emailData, error: emailError } = await resend.emails.send({
    from: `${org.name} <reminders@duely.co>`,
    to: invoice.client.email,
    subject: subjects[tone],
    html: await emailHtml,
  })

  // Log the reminder
  await supabase.from('reminder_logs').insert({
    invoice_id: invoice.id,
    org_id: profile!.org_id,
    client_id: invoice.client_id,
    type: 'manual',
    tone,
    channel: 'email',
    status: emailError ? 'failed' : 'sent',
    message_id: emailData?.id || null,
    error_message: emailError?.message || null,
  })

  // Update invoice reminder count
  await supabase
    .from('invoices')
    .update({
      reminder_count: invoice.reminder_count + 1,
      last_reminded_at: new Date().toISOString()
    })
    .eq('id', invoice.id)

  if (emailError) return NextResponse.json({ error: emailError.message }, { status: 500 })
  return NextResponse.json({ data: { message_id: emailData?.id } })
}
```

### src/app/api/dashboard/route.ts
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('org_id').eq('id', user.id).single()

  const orgId = profile!.org_id

  const [invoicesRes, overdueRes, recentRes, remindersRes] = await Promise.all([
    supabase.rpc('get_dashboard_stats', { p_org_id: orgId }),
    supabase
      .from('invoices')
      .select('*, client:clients(name, email)')
      .eq('org_id', orgId)
      .eq('status', 'overdue')
      .order('due_date', { ascending: true })
      .limit(5),
    supabase
      .from('invoices')
      .select('*, client:clients(name)')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('reminder_schedule')
      .select('*, invoice:invoices(invoice_number, total_amount, client:clients(name))')
      .eq('org_id', orgId)
      .eq('status', 'pending')
      .gte('scheduled_for', new Date().toISOString().split('T')[0])
      .order('scheduled_for', { ascending: true })
      .limit(5),
  ])

  return NextResponse.json({
    stats: invoicesRes.data,
    overdue_invoices: overdueRes.data,
    recent_invoices: recentRes.data,
    upcoming_reminders: remindersRes.data,
  })
}
```

### src/app/api/cron/check-overdue/route.ts
```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

// Secured by CRON_SECRET header — set in vercel.json
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service role to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Mark overdue invoices
  const { data: nowOverdue } = await supabase
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('status', 'pending')
    .lt('due_date', new Date().toISOString().split('T')[0])
    .select('id, client_id, org_id')

  // 2. Find scheduled reminders due today
  const today = new Date().toISOString().split('T')[0]
  const { data: dueReminders } = await supabase
    .from('reminder_schedule')
    .select('*, invoice:invoices(*, client:clients(*), organizations(name))')
    .eq('status', 'pending')
    .lte('scheduled_for', today)

  // 3. Send each scheduled reminder
  let sent = 0
  for (const reminder of (dueReminders || [])) {
    // Skip if invoice is paid
    if (reminder.invoice.status === 'paid') {
      await supabase.from('reminder_schedule')
        .update({ status: 'skipped' }).eq('id', reminder.id)
      continue
    }
    // Email send logic here (same as manual remind route)
    // ... (abbreviated for brevity)
    await supabase.from('reminder_schedule')
      .update({ status: 'sent' }).eq('id', reminder.id)
    sent++
  }

  return NextResponse.json({
    marked_overdue: nowOverdue?.length || 0,
    reminders_sent: sent,
  })
}
```

---

## Step 7 — Email Templates

### src/emails/PaymentReminder.tsx
```tsx
import {
  Html, Head, Body, Container, Text, Heading,
  Hr, Section, Button
} from '@react-email/components'
import { ReminderEmailProps, ReminderTone } from '@/types'

const toneContent: Record<ReminderTone, {
  greeting: string
  body: string
  cta: string
}> = {
  friendly: {
    greeting: 'Just a quick heads up',
    body: `We wanted to send a friendly reminder that the invoice below is coming up soon. If you've already taken care of this, please ignore this message — and thank you!`,
    cta: 'View Invoice',
  },
  firm: {
    greeting: 'Payment reminder',
    body: `This is a reminder that the invoice below is now overdue. Please arrange payment at your earliest convenience to avoid any disruption.`,
    cta: 'Pay Now',
  },
  final_notice: {
    greeting: 'Final notice',
    body: `This is our final notice regarding the outstanding invoice below. Please contact us immediately if you have any questions or if there's an issue we can resolve.`,
    cta: 'Resolve Now',
  },
}

export default function PaymentReminderEmail({
  clientName,
  businessName,
  invoiceNumber,
  amount,
  currency,
  dueDate,
  tone,
  customMessage,
}: ReminderEmailProps) {
  const content = toneContent[tone]
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency', currency
  }).format(amount)

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', background: '#f4f4f5' }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', background: '#fff', borderRadius: 12, padding: 40 }}>
          <Heading style={{ fontSize: 22, fontWeight: 700, color: '#09090b', margin: '0 0 8px' }}>
            Duely
          </Heading>
          <Text style={{ color: '#71717a', fontSize: 13, margin: '0 0 32px' }}>
            Payment reminder from {businessName}
          </Text>

          <Text style={{ fontSize: 18, fontWeight: 600, color: '#09090b' }}>
            Hey {clientName.split(' ')[0]}, {content.greeting}.
          </Text>

          <Text style={{ color: '#52525b', lineHeight: 1.6 }}>
            {customMessage || content.body}
          </Text>

          <Section style={{ background: '#f4f4f5', borderRadius: 8, padding: '20px 24px', margin: '24px 0' }}>
            <Text style={{ margin: 0, color: '#71717a', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              Invoice
            </Text>
            <Text style={{ margin: '4px 0 0', fontFamily: 'monospace', fontSize: 16, fontWeight: 600, color: '#09090b' }}>
              {invoiceNumber}
            </Text>
            <Text style={{ margin: '12px 0 0', color: '#71717a', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              Amount due
            </Text>
            <Text style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700, color: '#09090b' }}>
              {formattedAmount}
            </Text>
            <Text style={{ margin: '12px 0 0', color: '#71717a', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              Due date
            </Text>
            <Text style={{ margin: '4px 0 0', color: '#09090b' }}>
              {new Date(dueDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text style={{ color: '#71717a', fontSize: 12 }}>
            This reminder was sent by {businessName} via Duely.
            If you have questions, reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

---

## Step 8 — Vercel Config

### vercel.json
```json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue",
      "schedule": "0 9 * * *"
    }
  ]
}
```

The cron runs daily at 9am UTC. Secured by `CRON_SECRET` env var.

---

## Step 9 — Key Component Snippets

### Invoice Status Badge (src/components/invoices/InvoiceStatusBadge.tsx)
```tsx
import { Badge } from '@/components/ui/badge'
import { InvoiceStatus } from '@/types'
import { cn } from '@/lib/utils'

const config: Record<InvoiceStatus, { label: string; className: string }> = {
  draft:   { label: 'Draft',   className: 'bg-zinc-100 text-zinc-600' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  paid:    { label: 'Paid',    className: 'bg-green-100 text-green-700' },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700' },
}

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, className } = config[status]
  return (
    <Badge className={cn('font-medium text-xs rounded-full', className)}>
      {label}
    </Badge>
  )
}
```

### Client Reliability Badge (src/components/clients/ReliabilityBadge.tsx)
```tsx
import { Badge } from '@/components/ui/badge'
import { ClientReliability } from '@/types'
import { cn } from '@/lib/utils'

const config: Record<ClientReliability, { label: string; className: string }> = {
  new:      { label: 'New',      className: 'bg-blue-100 text-blue-700' },
  reliable: { label: 'Reliable', className: 'bg-green-100 text-green-700' },
  slow:     { label: 'Slow',     className: 'bg-amber-100 text-amber-700' },
  at_risk:  { label: 'At Risk',  className: 'bg-red-100 text-red-700' },
}

export default function ReliabilityBadge({ tag }: { tag: ClientReliability }) {
  const { label, className } = config[tag]
  return (
    <Badge className={cn('font-medium text-xs rounded-full', className)}>
      {label}
    </Badge>
  )
}
```

### Stats Card (src/components/dashboard/StatsCard.tsx)
```tsx
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string
  icon: LucideIcon
  trend?: number
  accent?: 'default' | 'danger' | 'success'
}

export default function StatsCard({ label, value, icon: Icon, trend, accent = 'default' }: StatsCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-zinc-500">{label}</p>
        <div className={cn(
          'p-2 rounded-lg',
          accent === 'danger' ? 'bg-red-50' :
          accent === 'success' ? 'bg-green-50' : 'bg-zinc-50'
        )}>
          <Icon size={16} className={cn(
            accent === 'danger' ? 'text-red-500' :
            accent === 'success' ? 'text-green-500' : 'text-zinc-500'
          )} />
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900 font-mono">{value}</p>
      {trend !== undefined && (
        <p className={cn('text-xs mt-1', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
          {trend >= 0 ? '+' : ''}{trend}% vs last month
        </p>
      )}
    </div>
  )
}
```
