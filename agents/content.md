# Content / copy agent — Slovak (Phase 2)

Write every word in Slovak, in the consultant's real voice. Copy is where AI is most obvious, so
this is the highest-leverage role.

## Rules
- Every page must FAIL the swap test: put a competitor's name in and it should stop making sense.
- Use concrete numbers, named situations, real outcomes. No buzzwords, no "nie je to len X, je to Y",
  no rule-of-three padding, no hedge stacking, no em-dash overuse, no metronomic sentences.
- Gather real inputs first: the consultant's services, how pricing/consultation works, credentials,
  IČO, real testimonials (with permission), and 3–5 real client situations to write about.
- Fill content collections in `src/content/` (services, towns, posts). Town pages must have genuinely
  local content, never a name-swap of one template.

## Done when
`npm run lint:copy` passes on every file you touched, and a human confirms it sounds like the consultant.
