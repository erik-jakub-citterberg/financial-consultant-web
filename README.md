# Financial Consultant Website (central Slovakia)

SEO-first, Slovak-language website for a freelance financial / insurance / OVB consultant.
Built with Astro (static output) and a hand-written CSS design system. The whole repo is
set up so that the generic "AI-cocreated" look cannot ship: guardrails run on commit and in CI.

See `DESIGN.md` for the design manual (the rules) and `PLAN.md` for the phased plan and the
subagent briefs in `/agents/`.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # static build into dist/
npm run quality    # copy + style + image guardrails (source)
npm run quality:built   # schema validation (run after build)
```

## Quality gates (anti-AI-tell)

The principle: a builder is blind to its own tells, so the checks are independent of whatever
produced the page.

- `quality/copy-lint.mjs` — banned phrases/buzzwords (SK+EN), em-dash density, generic openers.
- `quality/style-lint.mjs` — purple/indigo colors, banned fonts (Inter/Roboto), radius sameness.
- `quality/image-check.mjs` — stock/placeholder filenames, missing alt text.
- `quality/schema-validate.mjs` — LocalBusiness / FAQPage / Service JSON-LD present and valid.
- `lefthook.yml` runs the source linters on every commit; `.github/workflows/quality.yml` re-runs
  everything on every pull request.
- The **review subagent** (`agents/review.md`) is a required, separate reviewer from the build
  agent. A builder never approves its own output.

The blocklists live in `quality/banned-copy.json` and `quality/forbidden-styles.json` — add a line
whenever a new tell is spotted, and every future page is checked against it.

## Before launch

- Set the real domain in `astro.config.mjs` (`site`).
- Replace all placeholder content and images with the consultant's real details and photos.
- Fill `LocalBusiness` / `Person` structured data with real name, address, IČO, credentials.
