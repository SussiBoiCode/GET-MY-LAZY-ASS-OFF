# Breathe Out (GET-MY-LAZY-ASS-OFF)

A calm-down app for the moment everything feels like too much. One soft
opening screen ("Hey. You're okay.") → a deck of cards you tap or swipe
through. No timer, no pressure, no typing. Rebuilt 2026-10-05 from the
"Get Started" study timer, at the same URL so the home-screen install keeps
working.

**Live:** https://get-my-lazy-ass-off.netlify.app. The Netlify project is
`get-my-lazy-ass-off`, site id `7938940a-e332-46d2-acfd-a7fed3d3c9f1`.
Team SSO is on for non-production deploys only, so production is public.

## The cards
Picked at random by weight, no repeats inside a kind until all of it has
been seen (`S.seen`), and no two exercises close together:
- **Quotes** (`QUOTES`): calm ones, mostly scientists, mathematicians,
  philosophers and poets. Uncertain attributions are marked `attr: true`
  ("commonly attributed").
- **Kind words** (`KIND`): short lines in a therapist's voice.
- **Picture cards** (`SCENES` + `sceneSvg`): six inline-SVG scenes (night sky,
  sea, dawn mountains, clouds, rain on a window, fireflies) with a line over them.
  No image files.
- **One tiny thing** (`TINY`): tap-only suggestions with a one-line "why".
- **Breathe with me**: the circle grows for 4 s and shrinks for 6 s, six times.
- **Grounding 5-4-3-2-1**: one tap per step.
- **If it's more than stress**: shows up now and then (never in the first
  6 cards). It's always in the gear sheet and behind the link on the opening
  screen. Numbers (`LINES`) were checked 2026-10-05: 109 suicide prevention,
  1577-0199 mental health crisis, 1388 youth counseling, 119 emergency.

The heart saves quotes, kind words, pictures and tiny things. Saved cards
open again from the gear sheet.

## Install on iPhone
Open the live URL in **Safari**, then Share → **Add to Home Screen**. After
one visit it works offline. Data stays on the device, in localStorage under
`breathe-out.v1`. The old `get-started.v1` data is left untouched.
An icon that's already installed keeps its old name ("Get Started") until it is
removed and added again.

## Files
- `index.html`: the whole app. CSS and JS are inline. It also opens by
  double-click (file://), where the service worker is simply skipped.
- `sw.js`: offline cache. **Bump `VERSION` on every change**, or installed
  copies keep the old files.
- `manifest.webmanifest`, `netlify.toml`: the netlify.toml headers keep `sw.js`
  and `index.html` fresh and give the manifest its proper content type.
- `scripts/make-icons.mjs`: regenerates the PNG icons (a soft apricot circle)
  with `node scripts/make-icons.mjs`. It needs no dependencies.

## Decisions (from the user)
- Gentle, therapist-like tone. No timer, no study pressure, nothing to type
  in the main flow. Adding your own quote is optional and lives in the gear sheet.
- Two calm looks, Night (dark, warm apricot accent) and Dawn (cream, sage).
  The loud "Coach" look was retired. English only.
- Quotes: no East Asian figures unless they're scientists. Accurate
  attributions only.
- Animations are slow, and all of them stop under `prefers-reduced-motion`.

## Deploying
Use the Netlify MCP deploy with the site id above, run from this folder
(no build step). Always deploy to the existing site. After a deploy, open the
app twice: the first launch can still show the cached old version.
