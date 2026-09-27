# Design manual — Zajaková financial consultant

Binding constraints for the build. Every rule here has a specific reason.
Any rule with a numeric value becomes a token in `src/styles/tokens.css`.
See the full annotated reference at the published artifact (ask Erik for the link).

## Why constraints, not guidelines

Claude Code and similar AI tools have documented "distributional convergence": the model
samples safe universal defaults and produces median aesthetics — Inter fonts, three-equal-column
grids, purple-to-blue gradient heroes, 16px radius on everything.

Aspirational guidelines ("make it beautiful") cannot beat this. **Named specific bans** and
**explicit token values** can. This file is a constraint set, not a style guide.

---

## Named bans — never use these (style-lint enforces)

### Forbidden fonts
- `Inter` — the default "safe" technical face; used on ~30% of AI-generated sites
- `Roboto`, `Open Sans`, `Lato`, `Source Sans` — pleasant, anonymous, zero identity
- `Poppins`, `Montserrat` — the rounded-geometric "startup" axis
- `Space Grotesk` — technically interesting, overused in AI UIs post-2023
- `system-ui` alone — no font choice is a choice to look like an OS dialog

### Forbidden colors
- Purple / indigo hues (hue 270°–310°) — AI aesthetic tell #1
- Blue-to-purple gradients on white backgrounds — AI aesthetic tell #2
- Pure neutral greys (HSL 0° 0%) — reads as unconsidered, not restrained
- Teal/cyan as a primary — the SaaS "innovation" color

### Forbidden layout patterns
- Three equal-column flat-icon "features" grid — most recognizable AI pattern
- 100vh hero — sizes to content, not viewport
- One border-radius on every element — the "rounded-lg everywhere" tell (watch value: 16px)
- One box-shadow on every element — flattens visual hierarchy
- Everything centered — centering is the default; left-aligned editorial reads as deliberate
- Gradient text on headings
- Emoji as section markers (🎯, ✅, 🚀)
- Numbered 01/02/03 markers unless content is genuinely sequential

### Forbidden copy (quality/banned-copy.json)
- "individuálny prístup" — fails swap test
- "transparentnosť" as a standalone benefit
- "komplexné riešenia" / "komplexný prístup"
- "na najvyššej úrovni"
- "stovky spokojných klientov" (without a real number from Erika)
- "finančná sloboda"
- Rule-of-three padding ("jasne, transparentne, efektívne")
- Em-dash density above 1 per 200 words of body text

---

## Color

**Palette logic:** one dominant cool anchor (navy, hue ~247°) + one warm accent (gold, hue ~62°).
The warm/cool tension is deliberate. Navy = institutional trust. Gold = warmth and specificity.
Neither is "AI blue" (~hue 220° bright) and neither enters the forbidden purple range.

```
--color-brand:        #1e3a5f   oklch(28% 0.067 247)   primary — hero bg, dark panels
--color-brand-strong: #16293f   oklch(18% 0.05 248)    deepest navy — headings, topbar
--color-accent:       #c2892f   oklch(62% 0.127 62)    gold — CTAs, hovers, ornaments
--color-accent-dark:  #a9741f   oklch(52% 0.11 62)     gold hover state only
--color-ink:          #1a1d22                           body text — navy-biased near-black
--color-muted:        #55606c                           secondary text — hue-biased grey
--color-bg:           #ffffff                           page ground
--color-bg-soft:      #f5f4f0                           warm off-white — cards, table rows
--color-bg-gold:      #fdf8f0                           lightest gold tint — stats strip only
--color-line:         #d7dae0                           borders — cool-biased light grey
```

Shadows use `rgba(26,41,63,…)` — the navy ink, not black. Brand-tinted shadows are
a key intentionality signal. Four levels: xs / sm / md / lg. Never one shadow everywhere.

---

## Typography

**Pairing:** Cormorant Garamond (humanist display serif) + DM Sans Variable (contemporary
grotesque). Not Inter. Not Roboto. The pairing is intentional: historical authority (ledger,
certificate) + readable contemporary body.

**The weight extremes rule:** AI defaults to 400/500/600 (safe at any size). Use extremes:
- h1/h2: Cormorant Garamond **weight 700** — not 600
- h3: DM Sans **weight 700**, uppercase, tracking 0.12em — utility label register
- Lede/intro: DM Sans **weight 300** — lightness reads as considered, not timid
- Body: DM Sans weight 400
- Eyebrows/nav: DM Sans **weight 600**, uppercase, tracking 0.18em
- Stats (numbers): DM Sans **weight 700**, tabular-nums, letter-spacing -0.03em

**Type scale** (fluid clamp() — roughly 1.4–1.5× per step, not 1.2× increments):
```
--step--1: clamp(0.8rem,  0.76rem + 0.18vw, 0.875rem)   captions, eyebrows, meta
--step-0:  clamp(1rem,    0.97rem + 0.14vw, 1.0625rem)   body
--step-1:  clamp(1.2rem,  1.12rem + 0.38vw, 1.4rem)      lede / intro paragraphs
--step-2:  clamp(1.6rem,  1.42rem + 0.9vw,  2.1rem)      h3 / card headings / FAQ
--step-3:  clamp(2.1rem,  1.78rem + 1.6vw,  3rem)        h2 / section headings
--step-4:  clamp(2.8rem,  2.2rem + 2.8vw,   4.2rem)      h1 / hero / stat numbers
--step-5:  clamp(3.6rem,  2.7rem + 4.2vw,   6rem)        big stat numbers only
```

Other rules:
- Body line-height: 1.62 (slightly more open than 1.5 default)
- Heading line-height: 1.06 (Cormorant is designed for tight setting)
- Max body paragraph width: 62ch; max lede: 42ch
- h1/h2/h3: `text-wrap: balance`; body paragraphs: `text-wrap: pretty`
- Heading color: `--color-brand-strong` (#16293f), never ink-black

---

## Layout & sections

**Centered = default. Left-aligned editorial = deliberate.** Every section uses an asymmetric
or anchored composition. No two consecutive sections use the same background or grid.

**Container:** `min(70rem, 100% - 2 * var(--space-4))` — never full viewport width.
Side gutter minimum: `var(--space-4)` (1.75rem) at all widths.

**Grid rules:**
- Service cards: `repeat(auto-fit, minmax(15rem, 1fr))` — organic, not hardcoded 3
- Hero: `1.4fr 1fr` — asymmetric; text side is dominant
- Steps: `repeat(3, 1fr)` — equal is OK here because it IS a sequence
- Stats / blog preview: equal columns but different background treatments

**Radius — varied by component role:**
```
--radius-xs: 2px    badges, code, table highlights
--radius-sm: 4px    buttons, cards, notes — primary card radius
--radius-md: 8px    hero panel, blog preview panel, step section panel
--radius-lg: 12px   reserved for modal/overlay
```
**Never 16px radius. Never the same radius on every element.**

**Spacing scale:**
```
--space-1: 0.25rem   tight inline gaps (icon + label)
--space-2: 0.5rem    badge padding, tight stacks
--space-3: 1rem      card inner padding small, between paragraphs
--space-4: 1.75rem   card inner padding, grid gap — the workhorse
--space-5: 3rem      between sections within a panel
--space-6: 5rem      full section block padding
```

---

## Background treatments

**Never default to a solid color.** Layer CSS gradients, use geometric patterns, add domain-
appropriate texture. The texture vocabulary for a financial consultant: ledger lines, crosshatch,
grain — not circuits, not bokeh, not abstract blobs.

Section-by-section:
- **Hero panel:** navy base + two radial gradient glows (gold at 5% 95%, white at 95% 5%)
  + repeating horizontal ledger-lines at 30px (opacity 0.025) + SVG fractal noise grain (opacity 0.035).
  **Four layers.**
- **Steps/process panel:** navy base + diagonal crosshatch at -45°, 18px repeat (opacity 0.018).
  Graph paper texture — appropriate for a numbers business.
- **Stats strip:** `--color-bg-gold` (#fdf8f0) with gold-tinted borders (rgba gold 0.18).
- **Cards:** `--color-bg-soft` fill. Gold-tinted top border at rest; gold full on hover.
- **Blog preview section:** `--color-bg-soft` with border-radius — contained panel. Items inside have no fill.
- **Page ground:** pure white. No texture. Textured sections stand out because the ground is clean.

The layering principle: every textured section uses 2–4 overlapping background layers.
A single radial gradient is a template; a gradient + grain + ledger-lines is a decision.

---

## Motion

**One orchestrated moment beats scattered micro-interactions everywhere.** The hero entrance
is the orchestrated moment. Scroll-reveal is secondary. Hover states are the persistent layer.

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — spring-feel deceleration. Never `ease`, `ease-in-out`,
or `linear` for interactive transitions.

**Timing:**
```
--dur:      180ms   fast interactions (color changes, underline snap)
--dur-med:  320ms   hover transitions (button lift, card shadow)
--dur-long: 500ms   reveal animations, hero entrance
```

**Asymmetric hover — the key craft detail:**
- AI-generated hover: same duration enter and leave
- Handmade hover: **fast snap in, slow release** — reads as physical and responsive
- Nav underline: 120ms enter / 380ms leave
- Card hover: 100ms enter / 400ms leave

**Hero entrance stagger:**
- hero-text child 1: 40ms; child 2: 120ms; child 3: 200ms; child 4: 280ms
- hero .facts: 160ms
Plays once on load, not on scroll.

**Scroll reveal:** elements always visible by default; `js-ready` class enables hidden state.
Stagger for `data-stagger` children: 0 / 90 / 180 / 270ms.

**`prefers-reduced-motion`:** all `--dur` tokens → 0ms. All reveals visible. All animations removed.

---

## Cards & components

Not everything is a card. Spend border/fill/radius/shadow by role, not uniformly.

**Card anatomy:**
- Fill: `--color-bg-soft` (not white — would disappear against white page ground)
- Top border: 2px gold at 0.18 opacity at rest → gold full on hover
- Left border: 3px transparent at rest → gold on hover (directional signal)
- Radius: `--radius-sm` (4px)
- Shadow at rest: `--shadow-sm`; on hover: `--shadow-lg` (jump two levels, not one)
- Hover lift: `translateY(-5px)`

**Domain-specific ornamental details — do not remove:**
- `[data-glyph]` watermark: first letter of service at clamp(8rem, 18vw, 13rem), Cormorant 700,
  navy, opacity 0.045 — unique per service page
- `.divider--diamond`: hairline rule with gold ◆ center — typographic ornament from print tradition
- `.badge-seal`: circular gold-stroke badge for academic title — precise, small (0.65rem)
- Ledger-line hero texture: horizontal lines, 30px spacing, 1px, white opacity 0.025
- Crosshatch step section: diagonal grid, -45°, 18px repeat

**Eyebrow label:** DM Sans 600, uppercase, tracking 0.18em, step--1, gold color.
Use only when it adds information the heading alone doesn't carry.

---

## Copy voice

**The swap test:** replace "Erika Zajaková" with "Finančné centrum Brezno". If the copy still
makes sense, it fails. Every sentence should contain something only Erika can truthfully say.

Section rules:
- **Hero headline:** must name a specific problem (odvody, daňové priznanie, hypotéka) OR
  a specific person type (SZČO, živnostník), or both. Never abstract.
- **Stats:** only numbers Erika confirms. "od 2002" is real. Client count only when she provides it.
- **Testimonials:** real name + context ("Brezno, SZČO 2019") or omit.
- **Service descriptions:** must name the specific product, law, or situation.
- **Blog posts:** must contain a number, a date, or a named regulation — or all three.
- **Cenník:** real prices or "konzultácia zadarmo" with booking. Not "cena dohodou" alone.

---

## Trust & YMYL

Required on every page:
- Phone number in topbar
- Real name in header brand
- IČO / NBS registration in footer
- Real postal address in footer and structured data

Required on specific pages:
- **O mne:** Ing. title prominent; real photo; "od 2002" anchored; NBS registration number
- **Cenník:** real prices or free consultation + booking
- **Blog posts:** Erika's byline + real publish date + disclaimer
- **Service pages:** regulated-advice disclaimer

Never:
- Anonymous authorship
- Invented reviews
- Hidden pricing ("contact for pricing" alone)
- Stock photography of businesspeople
- AI-generated illustration or avatar for Erika
- Calculator — insurance companies do not permit it (confirmed 2026-09-19)

---

## Quality gates

Run on every commit (Lefthook) and every PR (GitHub Actions).

| Check | File | Catches |
|---|---|---|
| Copy lint | `quality/copy-lint.mjs` | Banned phrases (SK+EN), em-dash density, generic openers |
| Style lint | `quality/style-lint.mjs` | Purple/indigo, banned fonts, radius sameness (16px watch value) |
| Image check | `quality/image-check.mjs` | Stock filenames, missing alt text |
| Schema validate | `quality/schema-validate.mjs` | LocalBusiness / FAQPage / Service JSON-LD, IČO populated |

Blocklists:
- `quality/banned-copy.json` — add whenever a new copy tell is spotted
- `quality/forbidden-styles.json` — add whenever a new visual pattern should be blocked

**The review principle:** the build agent and the review agent are separate (`agents/review.md`).
A builder never approves its own output.
