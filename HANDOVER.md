# HANDOVER — Erika Zajaková website

Continue this project seamlessly. Read this file first, then `DESIGN.md`, `PLAN.md`, and `docs/pricing-research.md`.

---

## Current state — 2026-09-27

### What was done in the previous session

**Design exploration (artifacts — NOT yet in the repo):**  
Two visual concepts were explored and presented to Erik for comparison. Neither has been implemented in the codebase yet — the repo still runs the navy/gold Fraunces+DM Sans design from commit `1fa4753`.

| Concept | Character | Status |
|---------|-----------|--------|
| H — Clean / Light | Off-white ground, editorial serif, quiet gold accent, strong typographic hierarchy | Built as artifact (prior session) |
| I — Kinetic / Dark | Near-black, yellow accent, spotlight cursor, motion-forward | Built as artifact (prior session) |
| Comparison page | Side-by-side H vs I for Erika to decide | Built as artifact (prior session) |

If the artifacts have expired, Erik can re-run the prior session to regenerate them, or ask a new Claude session to rebuild the chosen direction. The detailed design brief for each concept lives in the prior session's context (session file `57ee3cce-af2b-4188-9ff1-d8ac086eef9a.jsonl` in the project's Claude history).

**The codebase design (commit `1fa4753`) has NEVER been screenshot-reviewed.** That is the first task below.

---

**All 9 blog posts written and fact-checked against 2026 Slovak sources:**

| File | Topic | Key corrections made |
|------|-------|---------------------|
| `co-si-odpisat-z-dani-2026.md` | Tax deductions 2026 | Životné poistenie section REMOVED (no longer deductible); NČZD updated to 5 966,73 €; spouse threshold corrected to 5 455 €; progressive bracket note added |
| `danove-priznanie-szco-pausalne-vydavky.md` | SZČO paušálne výdavky | Tax rate corrected 19 % → 15 % for income ≤ 100 000 €; example recalculated; NČZD 5 967 € |
| `danove-priznanie-zamestnanec-2026.md` | Employee tax return checklist | Životné poistenie bullet removed; title typo (uznanie) fixed |
| `druhy-pilier-2026.md` | II. pilier | Per-contribution 1 % fee removed (abolished 2023); management fee cap corrected to 0,40 %; mandatory enrollment date corrected to 1. máj 2023 |
| `sporenie-pre-deti.md` | Children's savings | Štátna prémia threshold corrected: 700 € → 1 167 € deposit; example recalculated at 97 €/month; fund example normalised to same monthly amount |
| `pzp-povinne-zmluvne-poistenie.md` | PZP | Legal minimums corrected: health 5,24 → 6,45 mil. €; property 1,05 → 1,3 mil. € |
| `refinancovanie-hypoteky.md` | Mortgage refinancing | Cadastral fee corrected 66 € → 150 €; 30 % annual fee-free early repayment added (since Apr 2024); misleading "0 % úrok" sentence fixed |
| `hypoteky-vs-najom-brezno.md` | Buy vs rent in Brezno | Written from scratch, 2026 data |
| `ako-si-najst-financneho-poradcu.md` | Choosing a financial advisor | Written from scratch |

**Other content fixes across the whole site:**
- "daňové uznania" typo (wrong Unicode: u-z-n-a-n-i-e) corrected everywhere to "daňové uznania" (p-r-i-z-n-a-n-i-e) — pages: `index.astro`, `dane.astro`, `dane-a-uctovnictvo.md`, and all blog files
- "Za sprostredkovanie ma odmeňuje banka, nie vy" disclaimer removed from all pages (prior session)
- Accounting services expanded to: jednoduché účtovníctvo, podvojné účtovníctvo, mzdy a personalistika
- Poistenie page expanded with PZP a havarijné and korporátne poistenie sections

---

### What to do in this session — design and content fine-tuning

**Priority 1 — Visual review (mandatory, never done)**
1. `npm install` natively on this machine, then `npm run dev`.
2. Screenshot every page at 1280 px and 390 px (use the `web-design-review-loop` skill if available, or a Playwright script — see "Capability" note in the section below).
3. Judge against `DESIGN.md`: Does it look like Erika's own site, or a generic Astro template? Does Fraunces actually load? Is the nav CTA (phone button) readable (was dark-on-dark — should be fixed, confirm)?
4. Only after seeing the screenshots: push any weak areas further toward the quality bar described in `DESIGN.md` — restrained, editorial, professional-but-warm. Not a circus.

**Priority 2 — If Erika has not yet chosen Concept H vs I**  
Check with Erik. If she needs to see the comparison again, rebuild the concepts from the descriptions above (ask Claude for help with "Concept H: clean editorial light design" and "Concept I: kinetic dark with spotlight cursor"). Once she chooses, implement that direction from scratch using the existing token/base CSS system.

**Priority 3 — Blog disclaimer**  
Each blog post template (`src/pages/blog/[slug].astro`) needs a small regulatory disclaimer at the top of the `.prose` block (above `<Content />`): *something like* "Informačný článok. Toto nie je individuálne finančné poradenstvo. Konzultujte konkrétnu situáciu s odborníkom." — confirm exact wording with Erik. This is a legal/regulatory requirement for regulated financial advice content.

**Priority 4 — Town pages**  
The town pages (`src/pages/[town].astro`, with data in `src/content/towns/`) link to Erika's services, but verify each town page correctly links to the matching service page and that the JSON-LD LocalBusiness schema is complete (address, phone, areaServed with the right town name).

**Priority 5 — Content tasks still blocked on Erika**  
- Real photo of Erika: `<!-- FOTO -->` placeholder in `o-mne.astro`. No stock, no AI avatars.
- Confirmed prices: placeholders in `cennik.astro` and `dane.astro` are market-derived "od" figures. See `docs/pricing-research.md`.
- Testimonials: Erik is collecting — add only when real names/text are confirmed.

---

## What this is
An SEO-first, Slovak-only marketing site for **Erika Zajaková**, a freelance finance/insurance/tax consultant near Brezno (central Slovakia). Built by her son Erik. Goal: rank locally so people searching for taxes, mortgages or insurance in the region find her. It must **not** read as AI-generated — that is the prime directive of the whole project.

Repo: `~/hobby/financial-consultant-web` (git, ~10 commits). Stack: **Astro** (static output) + hand-written CSS design system, self-hosted fonts. No CMS.

## Client facts (real — use verbatim, do not invent more)
- Erika Zajaková, Ing. (ekonómia a financie, Bankovní institut vysoká škola Praha, 2015)
- Finančná poradkyňa **OVB Allfinanz** since **2002**; daňové priznania + jednoduché účtovníctvo (SZČO) since **2006**
- IČO **40485242**; slobodné povolanie (nie živnosť)
- Phone **0907 824 728** · email **erika.zajakova@gmail.com** · Michalová, okres Brezno (PSČ 976 57)
- Brand: deep navy `#1e3a5f` (+`#16293f`) with warm gold accent `#c2892f`. Chosen over purple (AI cliché) and burgundy (reads as alarm/officialdom in SK). Navy is OVB-adjacent trust family but must stay Erika's OWN identity — do NOT copy OVB branding.
- Fonts: Fraunces (headings) + Source Sans 3 (body), self-hosted via @fontsource.

## Behavioural requirements (keep these)
Erik's working preferences:
- Be concise. No filler, no preamble, no vacuous chatter.
- Drafts/emails/texts: deliver only the requested text, plain, copy-paste ready, no markdown bullets/dashes, no meta questions, no unrequested extras or padding.
- Never cite TripAdvisor.
- **Never delete files without asking first.**

Project rules:
- **Slovak only.** Write in Erika's plain, direct voice.
- **Do not fabricate**: no invented testimonials, client counts, prices, or photos. Prices currently on the site are market-derived placeholders (see below) that Erika will confirm before launch.
- Anti-AI-tell is non-negotiable. Every page must fail the **swap test** (put a competitor's name in and it stops making sense).
- **A builder is blind to its own tells** — visual review must be done from real screenshots (see the review loop), never by judging the code you just wrote. The review step is independent of the build step.
- Guardrails must stay green: `quality/copy-lint.mjs`, `style-lint.mjs`, `image-check.mjs`, `schema-validate.mjs` (run after build). Blocklists in `quality/*.json`; add a line when a new tell is spotted.

## Where things are
```
src/pages/       index, dane, hypoteky, poistenie, financne-poradenstvo (overview),
                 cennik, o-mne, kontakt, 404, styleguide, [town].astro, sitemap.xml.ts
src/content/     services/, towns/ (brezno, michalova, podbrezova, banska-bystrica); config.ts
src/layouts/     BaseLayout.astro  (topbar, sticky header, nav, JSON-LD, OG meta, footer)
src/components/  Faq.astro (emits FAQPage JSON-LD), ServiceCard.astro
src/styles/      tokens.css (single source of colour/type/space/radius/motion), base.css
public/          enhance.js (reveal-on-scroll, sticky shadow, stat count-up), favicon.svg, robots.txt
quality/         the anti-AI-tell linters + blocklists + lighthouse budget
agents/          subagent briefs (orchestrator, design-system, content, build, seo, review)
```
Commands: `npm install`, `npm run dev` (localhost:4321), `npm run build`, `npm run quality`, `npm run quality:built`.

## First thing to do in this session
1. `npm install` **natively on this machine**, then `npm run dev`.
2. Run the **web-design-review-loop** skill: screenshot every page at 1280px and 390px, LOOK at the images, and judge against the rubric. The last design pass is committed but has **never been visually verified**.

## Design + capability requirements NOT yet verified/finished
- **Visual quality bar (open):** Erik's standing feedback is that the earlier design read as "generic Astro / AI-coded", calling out **fonts and header** specifically. Latest commit added an editorial two-column hero with a facts panel, a utility topbar, a two-line brand, a sticky condensing header, reveal-on-scroll, card hover lift + arrow nudge, and an animated stat. **This must be screenshot-reviewed and pushed further** toward a high-class, Dribbble/Awwwards feel: tasteful, professional, "dynamic and fun to interact with, not a circus." Restraint is the rule (purposeful motion only, sober palette, proof near decisions).
- **Fonts/header still suspect** — verify Fraunces actually loads (not falling back to serif) and that the header no longer reads as a template. Iterate if it does.
- **Contrast fix to confirm:** the nav phone button was dark-on-dark because `.nav a` out-specified `.btn`. Fixed via `.nav a.btn`. Confirm in a screenshot that the nav CTA is readable.
- **Capability:** the review loop needs Playwright installed natively: `npm i -D playwright && npx playwright install chromium`. Screenshot script pattern is in the skill.

## Pending real data (with Erika — blocks launch, not design)
- Real photo of Erika (she has none on LinkedIn; Erik will get one). No stock, ever. `<!-- FOTO -->` placeholder is in o-mne.astro.
- Confirmed cenník numbers. Current values in `cennik.astro`/`dane.astro` are market-derived "od" placeholders (see `docs/pricing-research.md`), marked with a code comment. She reviews before publish.
- Testimonial/company names willing to appear (Erik collecting).

## Launch checklist (later)
- Set real domain in `astro.config.mjs` (`site`), `public/robots.txt`, and it flows into `sitemap.xml.ts` + canonicals.
- Wire the contact form: `src/pages/kontakt.astro` `action` is a Formspree `TODO` placeholder.
- Choose host (Cloudflare Pages / Netlify — free, EU edge).
- Google Business Profile + SK citations (Firmy.zoznam.sk, Azet, Zlaté stránky) — see `agents/seo.md`.

## Gotchas already hit (don't rediscover)
- **node_modules is platform-specific.** Do not let two machines share it. This project moved to native Claude Code precisely because a Linux sandbox and macOS kept clobbering each other's rollup/lefthook binaries. If you see `Cannot find module @rollup/rollup-*` or `lefthook-*`: `rm -rf node_modules package-lock.json && npm install` on THIS machine.
- `slug` is a **reserved** field in Astro content-collection schemas — never declare it.
- `@astrojs/sitemap` crashed on this Astro 4 line; replaced by `src/pages/sitemap.xml.ts` (no dependency). Don't re-add the integration without checking versions.
- style-lint matches banned fonts **whole-word** (so "Inter" doesn't hit "pointer"). Keep it that way.
