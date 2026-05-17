# Duely — Design System & UI Guidelines

## Brand Identity

| Token | Value |
|-------|-------|
| Primary name | Duely |
| Submission name | Duely by Dubey |
| Tagline | Get paid on time, without the awkward follow-ups. |
| Vibe | Bold & confident (Stripe), clean (Linear), approachable (Mailchimp) |
| shadcn style | `base-nova` |
| Base color | `neutral` (CSS variables) |

---

## Color Palette

### Core Colors (CSS Variables via Tailwind 4)
Duely uses Tailwind 4 CSS variables defined in `globals.css`. The actual values shift between light and dark modes via `next-themes`.

```
Background dark:   #09090B  (zinc-950)  — sidebar, auth bg
Background mid:    #18181B  (zinc-900)  — secondary dark surfaces
Background light:  #FAFAFA  (zinc-50)   — app page background
Card white:        #FFFFFF              — card surfaces (light mode)
Border:            #E4E4E7  (zinc-200)  — subtle borders (light mode)

Accent indigo:     #4B39E6              — primary CTA, active nav, brand highlight
Accent green:      #22C55E              — success, paid status, reminder flow icon
```

### Landing Page Specific Colors
```
Hero bg:           #F9F9F7              — off-white warm background
Hero text:         #181C22              — near-black
Subtitle text:     #4D5157             — muted body text
Label text:        #6B6E72             — very muted labels / metadata
Border subtle:     #D8D8D8             — card borders on landing
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
/* Root layout — next/font/google */
font-family: 'Geist', sans-serif;   /* --font-sans (variable font) */
```

The `Geist` variable font is loaded in `src/app/layout.tsx` via `next/font/google` and applied
via the `--font-sans` CSS variable across the entire app.

### Scale
| Use | Size | Weight | Class |
|-----|------|--------|-------|
| Hero headline | 56-72px | 800 | `text-5xl md:text-7xl font-bold tracking-[-0.03em]` |
| Page title | 24px | 700 | `text-2xl font-bold` |
| Section title | 18px | 600 | `text-lg font-semibold` |
| Card label | 13px | 400 | `text-sm text-zinc-500` |
| Body | 14px | 400 | `text-sm` |
| Monospace data | 14-16px | 600 | `font-mono font-semibold` (invoice numbers, amounts) |
| Badge | 12px | 500 | `text-xs font-medium` |

---

## Component Specs

### Sidebar (dashboard, desktop)
```
Implemented: src/components/shared/Sidebar.tsx (uses shadcn Sidebar primitive)
Width: ~240px (w-60)
Background: zinc-950 / dark sidebar
Logo area: BrandLogoLink component
Nav item inactive: muted text, hover bg
Nav item active: accent bg (indigo), white text, rounded-lg
```

### Top Bar (dashboard)
```
Implemented: src/components/shared/TopBar.tsx
Height: ~64px
Contains: SidebarTrigger (hamburger), page title, MasterSearch, ModeToggle, UserNav
```

### Mobile Navigation (bottom bar)
```
Implemented: src/components/shared/MobileNav.tsx
Fixed bottom, full width
Background: matches theme (white / dark)
Icons: Dashboard, Invoices, Clients, Reminders
Active: accent color icon + label
```

### Site Header (landing page)
```
Implemented: src/components/shared/SiteHeader.tsx
Contains: BrandLogoLink, nav links (Features, How To Use, Future Upgrades), ModeToggle, Get started button
Sticky top with backdrop blur
```

### Site Footer (landing page)
```
Implemented: src/components/shared/SiteFooter.tsx
Copyright + links
```

### Cards
```
Background: white (light) / zinc-950 (dark)
Border: 1px solid border-[#d8d8d8] or border (Tailwind variable)
Border radius: 12–28px (rounded-xl to rounded-[28px] on landing)
Padding: 20–32px
Shadow: subtle drop shadow
```

### Stats Cards (dashboard)
```
Implemented: src/components/dashboard/StatsCard.tsx
Icon: colored pill container with lucide icon
Value: large, font-bold, monospace-style
Label: small, muted
Trend: green (up) or red (down) with arrow icon
```

### Tables
```
Implemented via shadcn Table primitive (src/components/ui/table.tsx)
Header row: muted background, text-xs uppercase tracking-wide
Body rows: hover bg transition
Actions column: shadcn DropdownMenu (3-dot) — Edit, Delete, View
```

### Buttons

Primary (solid dark):
```tsx
<Button>  // default variant
bg-zinc-900 text-white hover:bg-zinc-800
rounded-lg px-4 py-2 text-sm font-medium
```

Accent (indigo — used for landing CTAs):
```tsx
rounded-full bg-[#181c22] px-8 py-4 hover:bg-[#4b39e6]
```

Secondary (outline):
```tsx
<Button variant="secondary">
border border-input bg-white text-zinc-700 hover:bg-zinc-50
```

Ghost:
```tsx
<Button variant="ghost">
text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100
```

Destructive:
```tsx
<Button variant="destructive">
bg-red-600 text-white hover:bg-red-700
```

### Form Inputs
```
Implemented: src/components/ui/input.tsx (shadcn)
Height: h-9 (36px)
Border: zinc-200/border, focus: ring-2 ring-ring
Border radius: rounded-lg
Font: 14px
Placeholder: muted text
```

### Modals / Dialogs
```
Implemented: src/components/ui/dialog.tsx (shadcn)
Overlay: black/50 backdrop-blur
Card: white/dark, rounded-2xl, shadow-xl
Header: title font-semibold + X close button
Footer: flex justify-end gap-2, ghost cancel + primary confirm
Max width:
  - Send reminder: max-w-lg
  - Create invoice: max-w-2xl
  - Create/Edit client: max-w-md
  - Delete confirm: max-w-sm
```

### Status Badges
```
Implemented: src/components/ui/badge.tsx (shadcn)
Rounded-full pill, px-2.5 py-0.5 text-xs font-medium
Color driven by shadcn variant prop or custom className
```

---

## Page Layouts

### Landing Page
```
Nav: SiteHeader (sticky, blur backdrop)
Hero: WavyBackground + DiaTextReveal headline, 2 CTAs, floating invoice card + reminder flow card
Features section: 3-column card grid (id="features")
Footer: SiteFooter
Additional pages: /features, /how-to-use, /future-upgrades (linked from SiteHeader nav)
```

### Dashboard App Pages
```
Outer: SidebarProvider (shadcn) → flex row, full height
Left: Sidebar (240px, dark bg, shadcn Sidebar primitive)
Right: flex col
  Top: TopBar (SidebarTrigger + search + theme toggle + user nav)
  Content: scrollable, zinc-50/bg background, p-6
Mobile: SidebarTrigger shows Sheet drawer; MobileNav shows bottom tab bar
```

### Invoice List Page Layout
```
Header row: "Invoices" h1 + "New Invoice" button (right)
Filter row: search input + status select — all on one line
Table: InvoiceTable (shadcn Table) with actions dropdown per row
Empty state: centered message + CTA
InvoiceDetailDialog: full detail view in a Sheet/Dialog
```

### Client List Page Layout
```
Header row: "Clients" h1 + "New Client" button (right)
Filter row: search input
Table: ClientTable (shadcn Table) with 3-dot actions menu
Actions: View, Edit (EditClientDialog), Delete (DeleteClientDialog)
```

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|---------|
| < 768px (mobile) | Sidebar hidden, bottom nav visible (MobileNav), sidebar opens as Sheet on trigger |
| 768px–1024px (tablet) | Sidebar visible, all table columns |
| > 1024px (desktop) | Full sidebar with labels, all table columns visible |

---

## Iconography
Use **Lucide React** throughout. Key icons used:

```
Dashboard:    LayoutDashboard
Invoices:     FileText
Clients:      Users
Reminders:    Bell / BellRing
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
More options: MoreHorizontal / Ellipsis
Check/Paid:   CheckCircle2
Warning:      AlertCircle
Clock:        Clock3
Calendar:     Calendar
Mail:         Mail / MailCheck
Sparkles:     Sparkles
Gauge:        Gauge
Moon/Sun:     Moon / Sun (ModeToggle)
ChevronUp:    ChevronUp (UserNav)
```

---

## Animation Guidelines
Keep animations minimal and purposeful:
- **Landing hero:** WavyBackground (simplex-noise canvas) + DiaTextReveal (text mask animation)
- **Modal open/close:** fade + scale (built into shadcn Dialog)
- **Feature cards hover:** `hover:-translate-y-1` transition
- **Table row hover:** background transition 150ms
- **Button hover:** background transition 150ms
- **No page transitions** — keep it fast and snappy like Linear
- **Loading states:** AppLoader / LoadingStates skeleton components (not spinners) for tables and cards

---

## Theme (Dark Mode)
Duely supports full dark/light/system theming via `next-themes`:
- Root layout wraps all children in `<ThemeProvider>`
- `ModeToggle` component in the TopBar and SiteHeader lets users switch modes
- All Tailwind classes use `dark:` variants
- Landing page uses explicit hex colors with `dark:` class fallbacks for consistent cross-mode appearance
