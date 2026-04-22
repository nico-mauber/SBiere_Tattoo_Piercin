# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Server

No build step. Open `index.html` directly or serve with any static server:

```bash
python -m http.server 8080
# or
npx http-server . -p 8080
```

No package.json, no npm install required.

## Architecture

Zero-dependency React SPA for a tattoo & piercing studio (Uruguay). React 18 and Babel are loaded via CDN UMD bundles; JSX is transpiled in-browser at runtime — no bundler, no build pipeline.

All application code lives in two files:
- `index.html` — HTML shell, all CSS (inline `<style>`), CDN script tags
- `app.jsx` — entire React app (~700 lines); loaded as `type="text/babel"`

### app.jsx structure

Top of file: static data arrays (`WORKS`, `FILTERS`, `CAROUSEL`, `TILE_LAYOUT`).

Components (all defined in single file, rendered via `ReactDOM.createRoot`):
- `Nav` — fixed nav, mobile menu, scroll-triggered styling
- `Hero` — landing section, animated stats
- `Marquee` — horizontal scrolling ticker
- `Carousel` — auto-rotating featured works, keyboard + touch support
- `Collage` — masonry gallery with category filtering
- `Services`, `Process` — static info sections
- `Contact` — form with client-side validation, Netlify Forms POST
- `Lightbox` — modal image/video viewer with prev/next nav
- `Footer`

Custom hook: `useReveal()` — IntersectionObserver for scroll-triggered CSS animations.

### Styling

All CSS in `index.html` `<style>` block. Dark theme via CSS variables:
- `--ink`, `--panel`, `--surface`, `--line`, `--bone`, `--ash`, `--accent`

Typography via Google Fonts: Fraunces (headings), Inter (body), JetBrains Mono.
Mobile breakpoints: 900px, 760px, 540px.

### Forms

Contact form posts to Netlify Forms. Requires a hidden `<form name="contacto" netlify>` in `index.html` for Netlify to detect at deploy time. Validation is client-side only (no backend).

### Assets

`assets/img/` — portfolio images (work-01.jpg … work-08.jpg)  
`assets/video/` — studio reel clips (7 × .mp4)

`WORKS` array in `app.jsx` references these paths directly. Adding new portfolio items requires updating both the file on disk and the `WORKS` array.

## Deployment

Push `index.html`, `app.jsx`, and `assets/` to Netlify. No build command needed (`netlify.toml` not present; build command field should be left blank).
