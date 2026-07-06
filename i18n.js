---
name: Abel's Construction Material
description: A calm, organized inventory and sales console for a construction material business, in indigo and violet.
colors:
  void-indigo: "#13132b"
  panel-indigo: "#1c1c3a"
  surface-violet: "#252550"
  surface-violet-raised: "#2e2e60"
  ink: "#f0f0ff"
  ink-muted: "#9999cc"
  ink-faint: "#5555aa"
  border-hairline: "rgba(255,255,255,0.07)"
  border-hairline-strong: "rgba(255,255,255,0.12)"
  violet-primary: "#7c6df0"
  violet-primary-bright: "#9d8ff5"
  violet-primary-deep: "#6254d4"
  violet-wash: "rgba(124,109,240,0.15)"
  signal-green: "#34d399"
  signal-red: "#f87171"
  signal-blue: "#60a5fa"
  signal-amber: "#fbbf24"
  signal-purple: "#a78bfa"
  signal-red-hover: "#f55c5c"
  signal-red-ink: "#1a0808"
  scrim-overlay: "rgba(10,10,30,0.8)"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.5px"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.4px"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.1px"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.6px"
  mono:
    fontFamily: "Courier New, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  numeric:
    fontFamily: "JetBrains Mono, Courier New, monospace"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.5px"
  ethiopic:
    fontFamily: "Noto Sans Ethiopic, Inter, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  pill: "50%"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "28px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.violet-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  button-primary-hover:
    backgroundColor: "{colors.violet-primary-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  button-secondary:
    backgroundColor: "{colors.surface-violet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-violet-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  card:
    backgroundColor: "{colors.panel-indigo}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "22px"
  input:
    backgroundColor: "{colors.surface-violet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 14px"
  nav-link-active:
    backgroundColor: "{colors.violet-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "11px 14px"
  button-danger-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.signal-red}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  button-danger-confirm:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.signal-red-ink}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
---

# Design System: Abel's Construction Material

## 1. Overview

**Creative North Star: "The Site Office"**

Picture the one organized room on a busy construction yard — the site office. Outside is dust, noise, and motion; inside, the ledgers are neat, the numbers add up, and everything has a place. That's the feeling this interface should give: calm and in-control, even though the business it tracks (material, money, people) is anything but calm. The deep indigo background acts like the dim, focused light of that office at the end of a long day — easy on the eyes after hours of screen time, never harsh or clinical.

This system explicitly rejects the generic flat-gray admin-dashboard look, anything that feels like a toy or a weekend hobby project, and cold enterprise-SaaS density. It also rejects treating Amharic as a bolted-on afterthought — Ethiopic text gets the same typographic care, weight, and hierarchy as English, because half the people standing in this "office" read in Ge'ez script, not Latin.

Interaction should be **refined and restrained**: buttons, inputs, and cards are quiet by default and let the data be the loudest thing on screen. The one indulgence is the violet gradient — used sparingly, as a deliberate signal for "this is active" or "this is the primary action," not as decoration.

**Key Characteristics:**
- Deep indigo/violet base, never pure black or pure gray
- One gradient (violet → light violet) reserved for primary actions and active states only
- Numbers and data take visual priority over chrome
- Calm, low-contrast surfaces punctuated by sharp, legible text
- Equal typographic respect for English and Amharic

## 2. Colors

The palette is restrained: one dominant hue family (indigo/violet) carrying both background and brand accent, with four semantic signal colors reserved strictly for status (success, danger, info, warning).

### Primary
- **Violet Primary** (`#7c6df0`): The single brand accent. Used for primary buttons, the active nav link, focus rings, and the signature gradient. Appears on active/primary elements only — never as a background wash across large areas.
- **Violet Primary Bright** (`#9d8ff5`): The lighter stop in the brand gradient (`linear-gradient(135deg, #7c6df0 0%, #a78bfa 100%)`). Never used standalone; only as the gradient's second color.
- **Violet Primary Deep** (`#6254d4`): Hover/pressed state for primary buttons and the gradient's darker variant.
- **Violet Wash** (`rgba(124,109,240,0.15)`): Translucent tint for active-nav backgrounds, dim badges, and focus-state fills — never a solid fill.

### Neutral
- **Void Indigo** (`#13132b`): The base app background — the "dim site office at dusk."
- **Panel Indigo** (`#1c1c3a`): Sidebar, cards, modals — one step lighter than the void, used for any raised surface.
- **Surface Violet** (`#252550`): Inputs, secondary buttons, table hover states — the most "touchable" surface tone.
- **Surface Violet Raised** (`#2e2e60`): Hover state for surface-violet elements.
- **Ink** (`#f0f0ff`): Primary text. Slightly violet-tinted white, never pure `#fff`.
- **Ink Muted** (`#9999cc`): Secondary text — subtitles, labels, sub-values.
- **Ink Faint** (`#5555aa`): Tertiary text — placeholder copy, disabled states, the faintest captions.
- **Border Hairline** (`rgba(255,255,255,0.07)`): Default card/table borders — barely visible, present for structure not emphasis.
- **Border Hairline Strong** (`rgba(255,255,255,0.12)`): Input borders and anything needing slightly more definition.
- **Scrim Overlay** (`rgba(10,10,30,0.8)`): Modal backdrop — a near-black indigo wash, distinct from the panel/surface tones, used only behind floating modals to separate them from the page beneath.

### Signal colors (status only)
- **Signal Green** (`#34d399`): Profit, success toasts, "active" sale status.
- **Signal Red** (`#f87171`): Refunds, danger actions, low-stock warnings, destructive buttons.
  - **Signal Red Hover** (`#f55c5c`): Hover state for the solid Danger Confirm button only.
  - **Signal Red Ink** (`#1a0808`): Near-black text color used on top of solid Signal Red fills (Danger Confirm button) — keeps contrast high without resorting to pure white-on-red.
- **Signal Blue** (`#60a5fa`): Informational badges (e.g. employee tags), neutral category labels.
- **Signal Amber** (`#fbbf24`): Caution states — low stock alerts, purchase-cost figures.
- **Signal Purple** (`#a78bfa`): Reserved exclusively for Admin-area badges and the locked/unlocked admin indicator — this is what visually marks "you are now in the control room."

### Named Rules
**The One Accent Rule.** Violet Primary is the only color allowed to carry a gradient or a glow. If a second element on the same screen glows, the hierarchy has broken.

**The Signal Reservation Rule.** Green, red, blue, amber, and purple are status-only. Never use them as decorative accents or to fill empty space — each one is a verdict (profit, danger, info, caution, admin), not a style choice.

## 3. Typography

**Body Font:** Inter (with system sans-serif fallback)
**Numeric Display Font:** JetBrains Mono (with Courier New fallback)
**Ethiopic Font:** Noto Sans Ethiopic (with Inter fallback)

**Character:** Inter is a clean, highly legible UI grotesque — confident without being loud, built for dense data and small UI text rather than display headlines. JetBrains Mono is the one deliberate contrast pairing in the system: a monospaced face reserved exclusively for the big numeric callouts (stat-card values, employee performance figures) where tabular alignment and a "ledger" feel matter more than UI uniformity — this is what gives the data its own voice against Inter's quiet chrome, and the named exception to "single font for everything." Noto Sans Ethiopic is paired at matching weights so Amharic text carries identical visual weight and hierarchy to its English counterpart; this is not a fallback font, it's a co-equal typeface.

### Hierarchy
- **Display** (800, 26px, line-height 1, **JetBrains Mono**): Reserved for the very largest numeric callouts (e.g. a hero stat). Used sparingly.
- **Headline** (800, 24px, line-height 1.1, letter-spacing -0.4px, Inter): Page titles ("Dashboard", "Products", "Sales History").
- **Title** (700, 15px, line-height 1.3, Inter): Card titles, modal titles, section headers within a page.
- **Body** (500, 13.5px, line-height 1.5, Inter): Default UI text — table cells, descriptions, buttons.
- **Label** (700, 11px, letter-spacing 0.6px, uppercase, Inter): Form labels, table column headers, stat-card captions. Always uppercase, always the faintest ink color (`ink-faint`).
- **Mono** (400, 11px, line-height 1.6, Courier New): Reserved exclusively for the raw SQL setup blocks shown in Settings and the first-run Supabase connect screen. Courier New is a deliberate, documented exception to the Inter-everywhere rule — code needs a monospace face to stay legible, and SQL is the only code surfaced in this product.

### Named Rules
**The Numbers-Get-Their-Own-Voice Rule.** Every standalone numeric figure presented as a headline metric (stat-card values, employee performance numbers) renders in JetBrains Mono, never Inter. UI chrome (labels, buttons, body copy, even numbers embedded inline in a sentence) stays in Inter. The line is sharp: a number standing alone as the point of a card is Mono; a number sitting inside a sentence or table cell is Inter.

### Named Rules
**The Equal Script Rule.** Whenever `data-lang="am"` is active, every element that would normally render in Inter switches to Noto Sans Ethiopic at the same weight and a proportionally adjusted line-height (Ethiopic needs slightly more vertical breathing room — 1.6 vs 1.5 for body). Amharic is never visually subordinate to English.

## 4. Elevation

This system is **layered and glowing**, not flat. Depth comes from two sources working together: a subtle dark drop-shadow for separation from the background, and a soft violet glow on primary/active elements that signals "this is alive and interactive." Background panels use radial gradient washes (faint violet light pooling at the top of the sidebar, or in the corner of stat cards) to suggest ambient light rather than hard-edged depth.

### Shadow Vocabulary
- **Shadow** (`box-shadow: 0 4px 24px rgba(0,0,0,0.35)`): Standard elevation for cards and dropdowns lifting off the base.
- **Shadow Large** (`box-shadow: 0 8px 40px rgba(0,0,0,0.45)`): Modals and the auth card — anything that should feel like it's floating above everything else.
- **Glow** (`box-shadow: 0 0 20px rgba(124,109,240,0.25)`): Reserved for the brand mark and primary active states — the visual signature of "this is the important thing."
- **Button Glow** (`box-shadow: 0 4px 14px rgba(124,109,240,0.35)`, intensifying to `0 4px 20px rgba(124,109,240,0.5)` on hover): Primary buttons only.

### Named Rules
**The Ambient Light Rule.** Glows and radial gradient washes simulate a light source, not a hard edge. They should always feel like they're emanating from the violet brand color, never a generic black drop-shadow used for emphasis.

## 5. Components

### Buttons
- **Shape:** Rounded corners (10px / `--radius`), consistent across all button variants. Small decorative elements (badges, chart bars, brand mark on the logo) use the smaller `--radius-xs` (6px) step — distinct from interactive control radius so badges read as "label," not "button."
- **Primary:** Violet gradient background (`135deg, #7c6df0 → #a78bfa`), white text, font-weight 600, button-glow shadow. This is the only button style allowed to carry a gradient.
- **Secondary (default `.btn`):** Surface Violet background, Ink text, hairline-strong border. Quiet and restrained — the workhorse button for non-primary actions.
- **Danger:** Transparent background, hairline-strong border, Signal Red text; fills with a faint red wash on hover. Never filled solid red by default — the restraint is intentional, danger should feel deliberate when triggered, not alarming at rest.
- **Danger Confirm (exception):** Reserved exclusively for the final confirm button on irreversible, permanent-delete actions (deleting a product, employee, or purchase-cost record) — never for reversible actions like refunds, which use Danger Quiet plus an undo affordance instead. Solid Signal Red fill, near-black Signal Red Ink text (`#1a0808`), bold weight. This is the one deliberate break from "buttons stay quiet" — the visual weight itself is the warning that there is no undo.
- **Hover / Focus:** Secondary buttons lighten one surface step (Surface Violet → Surface Violet Raised). Primary buttons deepen their gradient and intensify their glow. All transitions run on a single shared timing token (`0.18s ease`) — nothing in this system uses a different easing curve.

### Cards / Containers
- **Corner Style:** 16px radius (`--radius-lg`) for cards, 20px (`--radius-xl`) for modals and the auth card.
- **Background:** Panel Indigo, one tone lighter than the page background, so cards always read as "raised" against the void.
- **Shadow Strategy:** Standard `Shadow` token at rest; stat cards add a subtle corner radial-glow and lift 2px on hover.
- **Border:** Hairline border throughout — present for structure, never for emphasis.
- **Internal Padding:** 22px standard card padding; 28-30px for modals.

### Inputs / Fields
- **Style:** Surface Violet background, hairline-strong border, 10px radius, Ink text.
- **Focus:** Border shifts to Violet Primary and gains a soft violet ring (`box-shadow: 0 0 0 3px rgba(124,109,240,0.15)`) — calm, not jarring.
- **Labels:** Always uppercase Label-style text in Ink Faint, positioned above the field, never inline placeholder-only.

### Badges
- **Style:** Small pill/rounded-rect (6px radius), translucent signal-color background (~12-15% opacity) with solid signal-color text. Never solid-filled badges — the wash keeps them quiet against the dark background.
- **Reserved colors:** Purple badges are exclusive to Admin context (the "Admin" sidebar badge, the unlocked-admin indicator) — purple should read as "you're in the control room" everywhere it appears.

### Navigation
- **Sidebar (desktop):** Panel Indigo background with a top radial violet glow. User avatar (gradient violet circle with initial) anchors the top, beneath the logo. Nav links are quiet by default (Ink Muted text, no background); the active link is the one place gradient + glow appear outside of buttons, filled solid with the brand gradient and a matching shadow. A gradient promo card sits at the bottom of the nav stack, mirroring the "Create Teams"-style call-to-action pattern: rounded card, gradient fill, short title + supporting line.
- **Bottom nav (mobile, ≤768px):** Fixed bar, Panel Indigo background, icon + micro-label per item. Active item's icon and label shift to Violet Primary Bright with a small icon drop-shadow glow — no background fill, since space is tight.
- **Admin badge:** Always purple, always paired with the word "Admin" — the one nav element allowed a non-brand-violet accent color, by design (it's the signal, not the brand).

## 7. Accessibility Implementation

The following requirements follow directly from PRODUCT.md's accessibility clause and were verified and fixed in the `/impeccable audit` pass.

### Live regions
- `#toast` has `role="status" aria-live="polite" aria-atomic="true"` — all toast notifications (sale recorded, product added, refund applied, etc.) are announced to screen readers automatically.
- `#sync-badge` has `aria-live="polite" aria-atomic="true"` — syncing/live status changes are announced without interrupting.
- Low-stock warning banner has `role="alert"` — a critical operational status the owner/admin must hear.

### Modal accessibility
- `#modal-overlay` has `role="dialog" aria-modal="true"` — screen readers know they're inside a modal and navigation is constrained.
- All modal close buttons have `aria-label="Close"` — the ✕ character is not announced meaningfully without it.

### Keyboard navigation
- All buttons and nav links have `:focus-visible` outlines (3px violet glow ring — matches the brand accent rather than the browser default).
- A skip-navigation link (`Skip to main content`) is the first focusable element in the document, visually hidden until focused, then appears as a violet bar at the top-left of the viewport.
- `<main id="main-content" tabindex="-1">` is the skip-link target, accepting programmatic focus.
- `<nav id="sidebar" aria-label="Main navigation">` and `<nav id="bottom-nav" aria-label="Mobile navigation">` are distinct landmarks.

### Touch targets
- WCAG 2.5.5: On screens ≤768px, all `.btn` and `.btn-sm` elements have `min-height: 44px`, and all inputs/selects/textareas have `min-height: 44px`. Desktop keeps compact sizing since it's pointer-operated.

### Reduced motion
- `@media (prefers-reduced-motion: reduce)`: All animations and transitions collapse to 0.01ms. Modal-in, page-enter, toast-in, and the `fade-in` animation are effectively disabled. The loading spinner is retained but slowed (1.5s vs 0.7s) to preserve functional feedback without vestibular risk.

### Decorative SVGs
- All SVG icons rendered via `ico()` helper and all inline decorative SVGs carry `aria-hidden="true" focusable="false"` — they are purely visual and should not clutter the accessibility tree.

### Language
- `document.documentElement.lang` updates to `"am"` or `"en"` when `setLang()` is called — screen readers announce the language change so they can switch pronunciation correctly for Amharic content.

### Named Rules
**The Equal Script Rule (extended).** Amharic is not just a font swap — it's a declared `lang="am"` attribute on the root element, which triggers browser and screen reader pronunciation switching, not just a visual typeface change.

### Do:
- Do use the violet gradient (`#7c6df0 → #a78bfa`) only on primary buttons, the active nav link, user avatars, and the sidebar promo card — it should always mean "primary" or "you."
- Do treat Ethiopic and Latin text as typographically equal — same weights, same hierarchy, proportionally adjusted line-height only.
- Do keep status colors (green/red/blue/amber/purple) strictly reserved for their semantic role — profit, danger, info, caution, admin.
- Do use translucent (12-15% opacity) washes for badges and dim backgrounds rather than solid fills, to keep the surface calm.
- Do keep border-radius consistent within a tier: 10px for interactive controls (buttons, inputs), 16px for cards, 20px for modals/auth.
- Do use the shared `0.18s ease` transition timing for all hover/focus states — one rhythm across the whole app.

### Don't:
- Don't introduce a second gradient or a second glowing color — "The One Accent Rule" from Colors applies everywhere, including any new feature screens.
- Don't use flat gray cards or default Bootstrap-blue — this is the generic admin-dashboard look the project explicitly rejects.
- Don't make any screen feel like a toy or hobby project — this handles real money and real inventory; treat every number with the seriousness of "The Site Office" metaphor.
- Don't design Amharic as an afterthought or font-swap-only treatment — re-check spacing and hierarchy whenever `data-lang="am"` is active.
- Don't use solid-filled status badges — always the translucent wash + solid text pairing.
- Don't add bounce, elastic, or playful easing curves to any transition — motion stays restrained and confident, matching the "refined, gets out of the way" interaction character.
- Don't let purple appear outside Admin context — if it shows up elsewhere, it dilutes its meaning as the "control room" signal.
