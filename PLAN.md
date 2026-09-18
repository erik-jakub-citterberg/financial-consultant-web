# Plan of action

Phases → subagent-sized tasks → each task has a definition-of-done tied to `DESIGN.md` and the
guardrails in `quality/`. Recursive rule: any task too big to do cleanly is split into smaller tasks
with the same done-criteria before execution. Nothing is "done" until it passes the quality gate.

## Orchestration model

```
Orchestrator
 ├─ Design-system agent  (agents/design-system.md)
 ├─ Content/copy agent   (agents/content.md)   [Slovak]
 ├─ Build agent          (agents/build.md)     [Astro]
 ├─ SEO/schema agent     (agents/seo.md)
 └─ Review agent (GATE)  (agents/review.md)  <- separate from build; holds the veto
```

The review agent is deliberately separate from the build agent. A builder cannot approve its own output.

## Phases

- [ ] **Phase 0 — Foundations**: research · design manual · guardrail config · repo scaffold. (orchestrator)
- [ ] **Phase 1 — Design system** (DS agent): pick non-purple palette + font pairing; author tokens
      (color, type scale, spacing, radius, shadow, motion); base CSS; a styleguide page to eyeball.
- [ ] **Phase 2 — Content model + real content** (Content agent): collect real details (name,
      credentials, IČO, photos, services, pricing approach, testimonials); define content collections;
      draft Slovak copy per page, each passing the swap test and the copy linter.
- [ ] **Phase 3 — Core pages** (Build agent): home, about (E-E-A-T), one page per service
      (dane, hypotéka, životné poistenie, general), contact — from components, checked vs. the tells.
- [ ] **Phase 4 — Local landing pages** (Build + Content): service × town pages from the collection,
      each with genuinely local content (not a name-swap template).
- [ ] **Phase 5 — SEO & schema** (SEO agent): titles/meta, canonical, sitemap, JSON-LD components
      (LocalBusiness/FinancialService, Person, Service, FAQPage), analytics, GBP checklist.
- [ ] **Phase 6 — Quality gates** (Review agent): wire pre-commit + CI; run all linters; design-review
      pass on every page; fix until green.
- [ ] **Phase 7 — Launch** (orchestrator): deploy to Cloudflare Pages/Netlify, connect domain,
      publish GBP, submit sitemap to Search Console.
- [ ] **Phase 8 — Grow (later)**: evaluate a Facebook group for the local audience; seasonal blog cadence.

## Acceptance bar (every leaf task)

1. Passes all guardrails in `quality/`.
2. Matches the rules in `DESIGN.md`.
3. Serves a local-SEO goal (a target query or a trust/E-E-A-T signal).

The orchestrator hands this same bar to every subagent, at every level of the split.
