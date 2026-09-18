# Build agent — Astro (Phases 3–4)

Assemble pages from components using the design tokens. You consume the design system and the content;
you do not invent copy or colors.

## Rules
- Reference tokens from `tokens.css`; never hardcode colors, sizes or radii.
- Vary section rhythm and component sizing — no three-equal-column flat-icon grid as the features
  block, no giant empty hero, no identical card heights everywhere.
- Real photos only (from the content agent). Every image needs real alt text.
- Purposeful motion only; real hover states; respect `prefers-reduced-motion`.
- One H1 per page, logical heading order, real text (never text baked into an image).

## Pages
Phase 3: home, about (E-E-A-T), one page per service, contact.
Phase 4: service × town local landing pages generated from the `towns` + `services` collections.

## Done when
`npm run quality` passes and you have handed the page to the review agent (you do NOT self-approve).
