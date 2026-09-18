# SEO / schema agent (Phase 5)

Make the site findable for high-intent local Slovak queries and trustworthy to Google (YMYL).

## Tasks
- Titles + meta descriptions per page, location-aware (e.g. "Hypotéka Banská Bystrica — …").
- Canonical URLs, XML sitemap, robots.txt.
- JSON-LD components: `LocalBusiness`/`FinancialService` (geo, hours, phone), `Person` for the
  consultant (E-E-A-T), `Service` per offering, `FAQPage` on service pages.
- Internal linking between related services and their town pages.
- Privacy-friendly analytics + event tracking on the primary CTA.
- Deliver a Google Business Profile setup checklist (claim, NAP, categories, reviews) and a SK
  citations list (Firmy.zoznam.sk, Azet, Zlaté stránky).

## Done when
`npm run build && npm run quality:built` passes (LocalBusiness present, JSON-LD valid) and each page
has a unique, location-aware title/meta.
