# Design manual

Binding rules for the build, phrased as constraints — constraints are what beat AI defaults.
Any rule with a numeric value becomes a token in `src/styles/tokens.css`, applied once and everywhere.

## Color
- DO: one dominant brand color that reads as trustworthy for finance in Slovakia — deep green,
  navy, or warm burgundy/ochre. One primary, one accent, a neutral ramp.
- DON'T: purple/indigo, blue→purple gradients, gradient text, a timid rainbow of equal weights.

## Typography
- DO: a distinctive, readable pairing (e.g. humanist serif headings + clean grotesque body).
  16px+ body; hierarchy from real size/weight contrast.
- DON'T: Inter/Roboto for everything, uniform sizes, thin low-contrast grey text.

## Layout & components
- DO: vary rhythm section to section; size a card by importance; deliberate (not uniform) whitespace.
- DON'T: 16px radius on everything, one identical shadow everywhere, the three-equal-column
  flat-icon "features" grid, a giant empty hero.

## Imagery
- DO: real photos of the consultant, office, recognizable central-Slovakia places.
- DON'T: stock handshakes, diverse-team-at-a-laptop, abstract 3D blobs, AI illustrations.

## Copy voice (Slovak)
- DO: write the way the consultant speaks; concrete numbers, named situations, real outcomes.
  Every page must FAIL the swap test — put a competitor's name in and it should stop making sense.
- DON'T: buzzwords, "nie je to len X, je to Y" contrasts, rule-of-three padding, hedge stacking,
  em-dash overuse, same-length sentences, vague "stovky spokojných klientov".

## Motion
- DO: a few purposeful micro-interactions, real hover states, eased transitions (150–250ms),
  `prefers-reduced-motion` support.
- DON'T: the same fade-in on everything, dead hovers, snapping buttons.

## Trust (finance / YMYL)
- DO: real name, photo, credentials, registration/IČO; plain-language disclaimers; transparent
  "how it works"; testimonials with real names/context; phone in the header on every page.
- DON'T: anonymous authorship, invented reviews, hidden pricing, "contact for pricing" alone.
