---
name: Kinetic Ledger
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#45474b'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#76777b'
  outline-variant: '#c6c6cb'
  surface-tint: '#5b5e66'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#181c22'
  on-primary-container: '#80848c'
  inverse-primary: '#c3c6cf'
  secondary: '#4b39e6'
  on-secondary: '#ffffff'
  secondary-container: '#6557ff'
  on-secondary-container: '#fbf7ff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#181d17'
  on-tertiary-container: '#80857c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe2eb'
  primary-fixed-dim: '#c3c6cf'
  on-primary-fixed: '#181c22'
  on-primary-fixed-variant: '#43474e'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c4c0ff'
  on-secondary-fixed: '#120068'
  on-secondary-fixed-variant: '#3619d4'
  tertiary-fixed: '#dfe4d9'
  tertiary-fixed-dim: '#c3c8be'
  on-tertiary-fixed: '#181d17'
  on-tertiary-fixed-variant: '#434841'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  success-sage: '#22C55E'
  warning-amber: '#F59E0B'
  error-red: '#EF4444'
  border-subtle: '#E2E8F0'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The visual identity of the design system is anchored in **Bold High-Contrast Modernism**. It is designed to evoke a sense of absolute financial control, precision, and institutional reliability for small businesses. The aesthetic prioritizes clarity and confidence, moving away from "friendly" consumer-grade softness toward a more rigorous, "pro-tool" fintech atmosphere.

The design system employs a mix of heavy editorial weight and functional minimalism. It utilizes aggressive whitespace and stark color transitions to guide the user's focus toward critical financial actions, such as invoice status and payment deadlines. The result is a professional environment that feels both cutting-edge and established.

## Colors

The palette is dominated by **Primary Navy**, used for high-level navigation and primary text, creating a grounded foundation. **Electric Indigo** serves as the functional driver—reserved strictly for primary calls to action, active navigation states, and interactive highlights to ensure zero ambiguity in user flow.

Semantic colors (Success, Warning, Error) are used with restraint, primarily within badges and status indicators. To maintain a crisp "Fintech" feel, the background surfaces remain pure white or a very light off-white, allowing the dark navy typography and indigo accents to pop with maximum accessibility.

## Typography

The typographic hierarchy distinguishes between **Editorial Impact** and **Functional Utility**:

1.  **Headlines (Hanken Grotesk):** Set with tight tracking and heavy weights. Large display sizes are used for dashboard summaries and "hero" invoice totals to project confidence.
2.  **Body (Inter):** The workhorse for all descriptive text. It is chosen for its exceptional legibility at small sizes and its neutral, systematic character.
3.  **Data & Amounts (JetBrains Mono):** All monetary values, invoice numbers, and timestamps must use the Monospace scale. This ensures that numbers align vertically in tables and emphasizes the "ledger" nature of the application.

Use `label-caps` for table headers and section overlines to provide a structural skeleton to the layout.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** for desktop environments to maintain a structured, centered focus that feels intentional and premium. On mobile, the system transitions to a fluid single-column layout.

A strict **8px grid system** governs all padding and margins. Vertical rhythm should be generous—especially within "Card" components—to prevent the interface from feeling cluttered. Use "Large" spacing (32px-48px) to separate distinct functional sections like the "Invoices Table" from the "Financial Summary Cards."

## Elevation & Depth

This system avoids traditional skeuomorphism or heavy drop shadows. Depth is communicated through **Low-Contrast Outlines** and **Tonal Layering**:

-   **Surfaces:** Use a 1px solid border (`#E2E8F0`) for all primary cards rather than shadows. 
-   **Z-Index:** For modals or floating menus, use a very soft, diffused shadow (15% opacity Navy) to lift the element without breaking the minimal aesthetic.
-   **Active State:** Use "Tonal Tiers"—a light gray background (#F8FAFC) should be used for hover states on list rows and table entries to provide immediate feedback without visual noise.

## Shapes

The design system uses a **Pill-Shaped** language for interactive elements and a **Soft-Rounded** language for containers. 

-   **Buttons & Badges:** Always use the maximum radius (`rounded-full` or 32px+) to create distinct, touch-friendly "capsules."
-   **Cards & Inputs:** Use a 12px-16px radius. This balance ensures that while the action items (buttons) feel modern and energetic, the structural items (cards) feel stable and professional.

## Components

### Buttons
Primary buttons are solid Navy (#0D1117) pills with White text. Secondary buttons use the Electric Indigo (#5B4CF5) for high-importance secondary actions. Hover states should involve a subtle scale-down (98%) or a slight opacity shift.

### Status Badges
Badges are fully rounded pills. Use low-saturation background fills with high-saturation text of the same hue (e.g., Soft Sage background with dark Sage text) for a refined, modern look that doesn't distract from the data.

### Input Fields
Inputs should feature a subtle border that thickens and changes to Electric Indigo upon focus. Use JetBrains Mono for the input text to match the "data entry" aesthetic.

### Data Tables
Tables are the core of the system. Rows must have generous vertical padding (16px+). Active sidebar items and active table filters should be highlighted using a solid Indigo pill or a vertical bar to the left of the content.

### Cards
Cards are pure white with a 1px border. They should never look "heavy." Padding within cards should be at least 24px on all sides to allow the data to breathe.