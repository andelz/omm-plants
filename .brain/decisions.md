# Decisions — omm-plants

Architectural decisions and rationale. Each entry: **date · decision · why**.

---

## ADR-001 · IndexedDB via `idb` for local storage
**Date:** pre-setup
**Decision:** Use `idb` wrapper around browser IndexedDB as the sole persistence layer.
**Why:** App is a fully offline-capable PWA; no server backend. IndexedDB can store plant photos (base64) alongside structured data.
**Consequence:** All data operations are async Promises; no RxJS store needed.

---

## ADR-002 · Hash-based routing
**Date:** pre-setup
**Decision:** Angular Router configured with `withHashLocation()`.
**Why:** Enables deployment as a static file (no server-side redirect rules needed for SPA navigation).
**Consequence:** URLs use `#/plants` style; deep links work without server configuration.

---

## ADR-003 · Care schedule migrated at read time (v2 schema)
**Date:** pre-setup
**Decision:** DB version bumped to 2; old string-based `careSchedule` fields are migrated to `CareTask` objects inside `migratePlant()` on each read, not via an IDB upgrade transaction.
**Why:** Simpler than writing a migration in the IDB upgrade callback; data volume is small and per-user.
**Consequence:** `migratePlant()` must remain for the lifetime of any deployment that may have v1 data.

---

## ADR-004 · Shared UI primitives in `src/lib/ui/`
**Date:** pre-setup
**Decision:** Reusable UI components (badge, button, card, icon, etc.) live in `src/lib/ui/`, separate from app feature code.
**Why:** Keeps feature components thin and enables visual consistency without a third-party component library.
**Consequence:** New UI elements should be added to `src/lib/ui/` before being used in features.

<!-- Add new decisions below -->
