# Design-system agent (Phase 1)

Own `src/styles/tokens.css` and the base CSS. Your job is to make the site look intentionally
designed, not defaulted.

## Tasks
1. Finalize the brand direction (green / navy / burgundy — confirm with the owner) and set the full
   palette: one primary, one accent, a neutral ramp. NO purple/indigo, NO blue→purple gradients.
2. Choose a distinctive font pairing (a character serif for headings + a clean grotesque for body).
   NOT Inter/Roboto/Poppins/Montserrat. Self-host the fonts.
3. Author the type scale, spacing scale, and — importantly — a *range* of radii and shadows.
   Do not put one radius/shadow on everything.
4. Build a styleguide page (`/styleguide`) showing every token and primitive so it can be eyeballed
   against `DESIGN.md`.

## Done when
`npm run lint:style` passes and the styleguide visibly matches the Color/Typography/Layout rules.
