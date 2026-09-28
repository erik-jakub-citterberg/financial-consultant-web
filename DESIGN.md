# Design manual v2 — Erika Zajaková

Every rule below is a specific decision with a reason. If a rule has a value, the value is in
`src/styles/tokens.css` or the active variant's `src/styles/theme.css`. Vague words ("premium",
"modern", "clean", "elevated") are not allowed in this file or in prompts to agents: they make
models reach for their default kit.

---

## 1. Research: why v1 still looked AI-made

Screenshots of the v1 site (2026-09-27) showed the recognisable 2025–26 "premium AI" template:
utility bar → logo + nav + CTA → rounded navy hero card with eyebrow label, serif headline and a
facts panel → stat banner (24 / 2 / 1:1) → 2×2 icon cards → dark rounded "3 steps" panel → footer.
Every section was a rounded box inside the container.

Sources and what they showed:
- [Developers Digest, 16 AI design slop patterns](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it):
  v1 hit #10 badge/eyebrow above H1, #11 coloured left-border callouts, #12 identical icon-top
  cards, #13 numbered 1-2-3 steps, #14 stat banner rows, #16 all-caps labels.
- [Anthropic, Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills):
  its advice (weight extremes, layered gradient + grain backgrounds, staggered page-load reveals,
  editorial serifs) was applied literally in v1. Followed as a recipe it produces its own
  recognisable look: every model that reads it makes the same "designed" moves.
- [DEV: The purple gradient problem](https://dev.to/james_anderson_h/the-purple-gradient-problem-why-ai-ui-all-looks-alike-and-how-to-fix-it-3j65):
  "it just doesn't come from anywhere". Fix: separate creative direction from implementation,
  generate divergent directions, keep a banned list.
- [DEV: breaking the AI UI curse](https://dev.to/a_shokn/how-to-break-the-ai-generated-ui-curse-your-guide-to-authentic-professional-design-2en):
  custom rather than stock icons, a radius hierarchy, semantic colour.
- Reddit threads could not be fetched from this environment (site blocked for the research tool).

Conclusion: the fix is not more ornament. It is fewer, specific decisions that come from this
client, this trade and this place.

## 2. Font decisions (tested, not assumed)

Test: the Slovak pangram *Kŕdeľ šťastných ďatľov · Ľubica · Ďumbier · Cenník služieb ·
účtovníctvo · ŤAHANOVCE* rendered in each candidate. Slovak readers notice bad carons,
especially the apostrophe-style carons on ď ť ľ Ľ.

| Font | Verdict | Reason |
| --- | --- | --- |
| Cormorant Garamond (v1) | Rejected | Thin, detached carons; reads as a wedding invitation, not an accountant |
| Fraunces (v0) | Rejected | Our own first pick and the one Erik flagged as an instant tell |
| Vollkorn | Rejected | Visible gap after ť and ď ("šť astných") |
| Libre Caslon Text | Rejected | Ľ caron nearly reads as Ł |
| Hanken Grotesk | Rejected | Detached ď apostrophe |
| Literata | Accepted | Sturdy, excellent ď ť ľ; by TypeTogether (co-founded by Czech designer Veronika Burian) |
| Source Serif 4, PT Serif, Spectral | Accepted | Clean Central European carons |
| Schibsted Grotesk, Red Hat Text, Work Sans, Epilogue, Albert Sans, Familjen Grotesk, DM Sans | Accepted | Pass the pangram **and** the in-context check below at 400/700/800 |
| Libre Franklin (Variant B, v1) | Rejected 2026-09-28 | At 700/800 the caron of ľ ď disappears before b h k l: "veľký" renders "velký", "koľko" renders "kolko" |
| Red Hat Display, Archivo, Public Sans, Mona Sans, Hubot Sans, Rethink Sans, Onest | Rejected 2026-09-28 | Same failure at heading weights (caron shrunk, merged into the next ascender, or dropped) |

**Lesson (2026-09-28):** the pangram is not enough. Several fonts draw ľ ď perfectly on their own
and in "ďatľov", but swap in a caron-less or squashed glyph when an ascender follows (ľk ľb ľh ľl ďk ďb),
which covers everyday words: *veľký, koľko, ďakujem, poľnohospodár*. I missed it by eye in the
specimen; it showed up on the built page. `quality/caron-render.mjs` (in `npm run quality:built`)
now renders every font and weight the built site actually uses and measures how much ink each
accent adds next to the following letter versus on its own. Under 80 % fails the build check.

Banned in `quality/forbidden-styles.json`: Inter, Roboto, Open Sans, Lato, Poppins, Montserrat,
Space Grotesk, Instrument Serif, Geist, Fraunces, Cormorant, Vollkorn, Libre Caslon, Libre Franklin,
Red Hat Display, Archivo, Public Sans, Mona Sans, Hubot Sans, Rethink Sans, Onest.

## 3. Slovak typography (automated by `quality/sk-typo.mjs` after every build)

- No one-letter word at the end of a line: non-breaking space after a i k o s u v z.
- Numbers never separate from their unit: `40 €`, `24 rokov`, `19 %`.
- The pomlčka is a spaced en dash ( – ), never an English em dash ( — ).
- Ranges use an unspaced en dash: `40–70 €`.
- Quotes are „takto“, not "takto" (content rule; not automated yet).
- Prices and tables use tabular lining figures (set in `base.css`).

These are details a Slovak typesetter applies without thinking and generic AI output never does.

## 4. Banned patterns (enforced by `quality/pattern-lint.mjs` + `style-lint.mjs`)

Eyebrow labels above headings · tracked all-caps micro-labels · stat banners and count-up
numbers · stock Feather/Lucide icons · icon-on-top cards · decorative rings, glyph watermarks,
diamond dividers · grain/noise textures and radial glows · any gradient · coloured left-border
callouts · hover lift (`translateY`) on cards and buttons · rounded "card" boxes around whole
sections · 16px radius on everything · purple/indigo · centred everything.

## 5. Constants (all variants)

- Palette anchor: navy `#1e3a5f` / `#16293f` + gold used sparingly. Chosen over purple (AI cliché)
  and burgundy (reads as alarm/officialdom in Slovakia). Erika's own identity, not OVB branding.
- One typographic voice per variant (one family, or one clearly subordinate pairing).
- Phone number visible in the first screen on every page.
- Honest proof only: 2002, 2006, Ing., IČO. No invented numbers, testimonials, photos or prices.
- Copy passes the swap test: put a competitor's name in and it stops making sense.
- No calculators (insurers do not permit them; confirmed 2026-09-19).

## 6. Variant matrix (one branch each)

| Axis | A · Účtovná kniha | B · Modernist | C · Horehronie |
| --- | --- | --- | --- |
| Idea | A meticulous ledger: trust through precision | Central European modernist print: trust through clarity | Rooted in the place under Nízke Tatry: trust through proximity |
| Type | Literata only (display + text, optical sizes) | Libre Franklin only (800 vs 400) | Spectral headings + Red Hat Text body |
| Surface | Paper `#f6f3ec`, ink navy, warm hairline rules | White + full-bleed navy bands | Warm off-white `#faf7f2`, sand `#efe6d8` |
| Layout primitive | Ledger row: italic marginal label + content + right-aligned value | Strict 12-col grid, full-bleed bands, asymmetric type | Photo-led split; prose instead of components |
| Hero | H1 on paper + a ruled "výpis" table of facts | Navy band, very large H1, facts with gold square markers | H1 beside a portrait frame reserved for Erika's photo |
| Services | Ledger rows with "od" prices | 2×2 with hairlines, no boxes | Short list with generous spacing |
| Process | Ruled table: vy / ja | A thin line with three points | Two sentences of first-person prose |
| Signature | Double rule under header; tabular figures | Gold square markers; oversized headline | Original single-line ridge of Nízke Tatry |
| Radius | 0–2px | 0 | 6–10px on image frames only |
| Motion | None beyond link underlines | One page-load stagger in the hero | One portrait reveal |

## 7. Process rules

1. Direction first, in words (this file), then implementation. Never both in one prompt.
2. Every visual change is judged from screenshots at 1280 px and 390 px (`web-design-review-loop`),
   never from reading the code.
3. The reviewer is not the builder.
4. New tell spotted → add it to `quality/*.json` or `pattern-lint.mjs` the same day.
5. Once Erik picks a variant, sections 2, 5 and that variant's column become the whole manual.

## 8. Trust and YMYL (unchanged from v1)

Real name in the header; IČO and address in the footer and structured data; Ing. and "od 2002"
on O mne with a real photo (no stock, no AI avatar); real prices or a free-consultation booking;
blog posts carry Erika's byline, date and a disclaimer; service pages carry a regulated-advice
disclaimer; NBS registration number once Erika provides it.

## 9. Update 2026-09-28: Claude house style and Erik's constraints

**Finding (Erik):** variants A and C looked like claude.ai itself: warm cream/paper background,
editorial serif, muted ochre accent, hairline rules, italic asides. It is the default look of
every "build a website in a day with Claude" tutorial. When Claude steers away from generic SaaS,
it drifts to its maker's aesthetic, and Claude's own review cannot see it.
Guardrail: `style-lint` now fails warm cream/paper grounds (`paperBackground` in
`quality/forbidden-styles.json`). Treat serif-on-cream as banned.

**Taste now comes from outside Claude.** Erik chose from a board of real sites (2026-09-28):
- Liked: #7 Bench (friendly, conversational, real face in a chat bubble, product-style view,
  clear checklist) and #8 Lang Steuerberater (a family tax firm with a real identity system and monogram).
- Rejected: Pictet (type-only minimalism) and DEVISIA (photographic metaphor).
- Wanted: **colour**, not monochrome black and white.

**Constraints:**
- Photos: at most two profile photos of Erika; optionally one tasteful stock photo for the home page.
  The design must work without a photo-heavy layout.
- OVB first: insurance and investments are Erika's main business; taxes are secondary.
- Recruitment: Erika wants to bring people into OVB through her (`/kariera`), and to be presentable
  enough to be featured on OVB's own site. Harmonise with OVB navy; never copy OVB branding.
- Motion and logos: only what we draw ourselves (CSS/SVG) or open-source assets. No paid animation.

## 10. Decision 2026-09-28: Identita

Erika chose **Identita** from the preview (Pôvodný, Rozhovor, Identita). From now on the manual is
sections 2–5, 7–9 and this section. The Rozhovor theme, the frozen original and the design switcher
were removed from master; they remain on the `design/*` branches and in git history.

Identita in one sentence: a small firm with a real identity, the EZ mark, solid service colours and
square corners.
- Mark: E and Z share their top and bottom bars. The E is navy (white on dark), the Z bars are a
  lighter blue with a small gap, and the amber diagonal sits under the bars with its edges passing
  exactly through the bars' inner corners. Files: `src/themes/identita/` (theme.css `--mark`,
  Home.astro, favicon.svg). Change all three together.
- Colours: navy `#16335c` anchor; poistenie teal `#0b7a65`, investície amber `#e3a21a`,
  hypotéky coral `#e5664b`, dane blue `#1f6fae`, each with a tint. Inner pages take their
  service colour via `body[data-section]`.
- Type: Epilogue 800 headings (tracking −0.035em) + Albert Sans text. Both pass `caron-render`.
- Corners: square everywhere. Motion: only the mark assembling and the four tiles appearing on the
  home page, once.
- Meeting place: the office in Brezno (street address still to come), not Michalová.
