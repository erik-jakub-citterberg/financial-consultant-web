# HANDOVER — Erika Zajaková website

Continue this project seamlessly. Read this file first, then `DESIGN.md`, `PLAN.md`, and `docs/pricing-research.md`.

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
