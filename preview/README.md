# Design preview (for choosing a design with Erika)

`npm run build:preview` builds `dist-preview/`: a chooser page plus every design at its own path,
each page with a switcher bar that jumps to the same page in another design. Netlify builds and
publishes this (see `netlify.toml`). Everything is `noindex`, so Google never sees the preview.

| Path | Source |
| --- | --- |
| `/povodny/` | Original design, frozen build of commit 3a0f8dd (stored here in `povodny/`, never rebuilt) |
| `/rozhovor/` | `src/` built with `DESIGN=rozhovor` (theme in `src/themes/rozhovor/`) |
| `/identita/` | `src/` built with `DESIGN=identita` (theme in `src/themes/identita/`) |

Content changes in `src/pages` and `src/content` show up in Rozhovor and Identita. The original
stays as it was on 2026-09-27.

After a design is chosen: delete the other theme folder and this folder, and switch
`netlify.toml` back to `npm run build` / `dist`.
