# Duely — Design System & UI Guidelines

## Brand Identity

| Token | Value |
|-------|-------|
| Primary name | Duely |
| Submission name | Duely by Dubey |
| Tagline | Get paid on time, without the awkward follow-ups. |
| Vibe | Bold & confident (Stripe), clean (Linear), approachable (Mailchimp) |

---

## Color Palette

### Core Colors
```
Background dark:   #09090B  (zinc-950)  — sidebar, auth bg
Background mid:    #18181B  (zinc-900)  — secondary dark surfaces
Background light:  #FAFAFA  (zinc-50)   — app page background
Card white:        #FFFFFF              — card surfaces
Border:            #E4E4E7  (zinc-200)  — subtle borders

Accent indigo:     #5B4CF5              — primary CTA, active nav
Indigo hover:      #4338CA              — hover state
```

### Status Colors
```
Paid / Success:    bg-green-100  text-green-700   (#DCFCE7 / #15803D)
Pending / Warning: bg-amber-100  text-amber-700   (#FEF3C7 / #B45309)
Overdue / Danger:  bg-red-100    text-red-700     (#FEE2E2 / #B91C1C)
Draft / Neutral:   bg-zinc-100   text-zinc-600    (#F4F4F5 / #52525B)
New / Info:        bg-blue-100   text-blue-700    (#DBEAFE / #1D4ED8)
```

### Reliability Tag Colors
```
Reliable:  green  (same as paid)
Slow:      amber  (same as pending)
At Risk:   red    (same as overdue)
New:       blue   (informational)
```

---

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
font-family: 'JetBrains Mono', 'Fira Code', monospace; /* for invoice numbers, amounts, IDs */
```

Add to next/font in layout.tsx:
```tsx
import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

### Scale
| Use | Size | Weight | Class |
|-----|------|--------|-------|
| Hero headline | 56-72px | 800 | text-5xl md:text-7xl font-extrabold |
| Page title | 24px | 700 | text-2xl font-bold |
| Section title | 18px | 600 | text-lg font-semibold |
| Card label | 13px | 400 | text-sm text-zinc-500 |
| Body | 14px | 400 | text-sm |
| Monospace data | 14-16px | 600 | font-mono font-semibold |
| Badge | 12px | 500 | text-xs font-medium |

---

## Component Specs

### Sidebar (desktop)
```
Width: 240px (w-60)
Background: zinc-950
Logo area: 24px font, bold, white
Nav item inactive: zinc-400 text, zinc-800 hover bg
Nav item active: white text, indigo-600 bg, rounded-lg
Bottom: sign out button, border-top zinc-800
```

### Top Bar
```
Height: 64px
Background: white
Border bottom: zinc-200 1px
Contains: page title left, search center (md+), bell + avatar right
```

### Mobile Navigation (bottom bar)
```
Fixed bottom, full width
Background: white, border-top zinc-200
4 icons: Dashboard, Invoices, Clients, Reminders
Active: indigo-600 icon + label
```

### Cards
```
Background: white
Border: 1px solid zinc-200
Border radius: 12px (rounded-xl)
Padding: 20px (p-5)
```

### Stats Cards (dashboard)
```
Same as card base
Icon: 32px container, accent bg, 16px icon
Value: 24px, font-bold, font-mono, zinc-900
Label: 14px, zinc-500
Trend: 12px, green-600 or red-500
```

### Tables
```
Header row: bg-zinc-50, text-xs uppercase tracking-wide text-zinc-500
Body rows: white bg, zinc-100 on hover
Row height: 52px
Border: zinc-200 between rows
Checkbox column: 40px
Actions column: 3-dot dropdown, right-aligned
```

### Buttons

Primary (solid dark):
```
bg-zinc-900 text-white hover:bg-zinc-800
rounded-lg px-4 py-2 text-sm font-medium
```

Accent (indigo):
```
bg-indigo-600 text-white hover:bg-indigo-700
rounded-lg px-4 py-2 text-sm font-medium
```

Secondary (outline):
```
border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50
rounded-lg px-4 py-2 text-sm font-medium
```

Ghost:
```
text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100
rounded-lg px-4 py-2 text-sm font-medium
```

Destructive:
```
bg-red-600 text-white hover:bg-red-700
rounded-lg px-4 py-2 text-sm font-medium
```

### Form Inputs
```
Height: 36px (h-9)
Border: zinc-200, focus: indigo-500 ring
Border radius: rounded-lg
Font: 14px
Placeholder: zinc-400
```

### Modals / Dialogs
```
Overlay: black/50 backdrop
Card: white, rounded-2xl, max-width varies
Header: title 18px font-semibold + X close button
Footer: flex justify-end gap-2, ghost cancel + primary confirm
Max width:
  - Send reminder: max-w-lg
  - Create invoice: max-w-2xl
  - File upload: max-w-md
```

### Status Badges
```
Rounded-full pill
px-2.5 py-0.5 text-xs font-medium
No border — colored background
```

---

## Page Layouts

### Landing Page
```
Nav: sticky top, white bg, blur backdrop
Hero: full-width, large headline, 2 CTAs, floating invoice + reminder UI cards
Social proof: badge "Trusted by 1,200+ businesses" above headline
Features: 3-column card grid
How it works: numbered steps
CTA section: dark bg, centered, white text
Footer: logo, links, legal
```

### Dashboard App Pages
```
Outer: flex row, full height
Left: Sidebar (240px, dark)
Right: flex col
  Top: TopBar (64px, white)
  Content: scrollable, zinc-50 bg, p-6
```

### Invoice List Page Layout
```
Header row: "Invoices" h1 + "New Invoice" button (right)
Filter row: search input + status select + date range + sort — all on one line
Table: full width, paginated
Empty state: centered illustration + CTA
```

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|---------|
| < 768px (mobile) | Sidebar hidden, bottom nav visible, tables become card stacks |
| 768px–1024px (tablet) | Sidebar visible but condensed (icons only), table columns reduced |
| > 1024px (desktop) | Full sidebar with labels, all table columns visible |

### Mobile-specific patterns
- Invoice table → stacked cards with status badge prominent
- Stats cards → 2x2 grid instead of 1x4
- Dialog modals → full screen sheet from bottom
- Top bar → just logo + hamburger menu + avatar

---

## Iconography
Use Lucide React throughout. Key icons:

```
Dashboard:    LayoutDashboard
Invoices:     FileText
Clients:      Users
Reminders:    Bell
Settings:     Settings
Sign out:     LogOut
Add/New:      Plus
Edit:         Pencil
Delete:       Trash2
Send:         Send
Search:       Search
Filter:       Filter
Download:     Download
Upload:       Upload
More options: MoreHorizontal
Check/Paid:   CheckCircle2
Warning:      AlertCircle
Clock:        Clock
Calendar:     Calendar
Mail:         Mail
```

---

## Animation Guidelines
Keep animations minimal and purposeful:
- Modal open/close: fade + scale (built into shadcn Dialog)
- Toast notifications: slide in from bottom-right
- Table row hover: background transition 150ms
- Button hover: background transition 150ms
- No page transitions (keep it fast and snappy like Linear)
- Loading states: skeleton loaders (not spinners) for tables and cards

---

## Stitch / Design Tool Prompt Summary

Primary colors: zinc-950 dark, white cards, indigo-600 accent
Typography: Inter body, large bold editorial headlines
Status: green=paid, amber=pending, red=overdue, zinc=draft
Tone: Stripe confidence + Linear cleanliness + Mailchimp approachability
References: Spade.com (monospace data, editorial hero), Acctual (invoice preview in hero, pill CTAs)
