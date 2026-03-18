# omm-plants — Claude Code Guide

## Project overview

Angular 21 PWA for tracking plant care. Single-package repo (no monorepo). All data stored locally in IndexedDB. Offline-capable via Angular Service Worker.

**Dev server:** `ng serve --port 2910`
**Build:** `ng build`
**Test:** `ng test` (Vitest)
**i18n extract:** `npm run i18n:extract`

---

## Persistent brain (session memory)

The project has a `.brain/` directory with four markdown files that persist knowledge across Claude Code sessions:

```
.brain/
  architecture.md      ← app structure, public API, key patterns, gotchas
  decisions.md         ← ADRs: why things are the way they are
  handoff.md           ← last session state (overwritten each /wrap-up)
  execution-plan.md    ← in-progress work and dependency graph
```

**Two slash commands manage the lifecycle:**
- `/resume` — start of session: reads the brain and gives a structured briefing
- `/wrap-up` — end of session: updates all four brain files

**Start every session with `/resume`. End every session with `/wrap-up`.**
