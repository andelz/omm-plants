# Handoff — omm-plants

> Overwritten at session end by /wrap-up.

## Session date
2026-03-19

## What was done this session
- Attempted to replace JS-based hero parallax effect with CSS scroll-driven animation (`animation-timeline: scroll()`)
- Removed the JS scroll listener from `website/index.html` that manually set `transform` on `.hero-bg`
- Added `@keyframes parallax-bg` with `animation-timeline: scroll()` to `website/style.css`
- Wrapped in `@media (prefers-reduced-motion: no-preference)`
- **Parallax is NOT working yet** — the CSS scroll-driven animation approach isn't producing a visible effect; needs further debugging

## Current state
- Branch: master
- In-progress PR / ticket: none
- Files actively being changed:
  - `website/index.html` — JS parallax removed, waitlist form added (from prior session), nav scroll class commented out
  - `website/style.css` — CSS parallax-bg keyframes + animation-timeline added, waitlist styles, early-access section styles
  - Previous session's location-grouping & weather plan changes still unstaged in `src/` and `plans/`
  - New untracked website backend: `website/netlify/`, `website/server/`, `website/netlify.toml`, `website/package.json`

## Open questions / blockers
- **CSS scroll-driven parallax not working** — `animation-timeline: scroll()` with `background-position` animation on `.hero-bg` produces no visible effect. Possible causes:
  - Browser support (check if testing browser supports `animation-timeline`)
  - The `.hero-wrapper` having `overflow: hidden` may interfere
  - May need to use `view()` timeline instead of `scroll()` since `.hero-bg` is inside a non-scrolling container
- Location feature changes from prior sessions still uncommitted
- Weather feature is planning-only — no code written yet

## What to do next
1. **Debug the CSS parallax** — verify browser supports `animation-timeline: scroll()` (Chrome 115+), try removing `overflow: hidden` from `.hero-wrapper`, or fall back to JS `ScrollTimeline` API
2. Commit the location feature changes
3. Commit website waitlist + Netlify backend changes
4. Begin Phase 1 of weather plan
