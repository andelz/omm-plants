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

## ADR-005 · Web Share Target bridged via App component init
**Date:** 2026-03-19
**Decision:** The Web Share Target API navigates to a real path (`/share?url=...`), but the app uses hash routing. Instead of adding server-side redirects or modifying index.html, the root `App.ngOnInit()` checks `window.location.pathname === '/share'`, buffers the params in `ShareIntentService`, replaces the URL via `history.replaceState`, and navigates to the hash route `/#/share`.
**Why:** Keeps all logic in Angular-land (testable, no index.html hacks), works with the existing Angular service worker (which serves index.html for all navigation requests), and requires no server configuration.
**Consequence:** The `App` component has a dependency on `Router` and `ShareIntentService`; the share interception runs on every app boot but short-circuits immediately when pathname is not `/share`.

---

## ADR-006 · UI library moved to `projects/ui/` as Angular library
**Date:** 2026-03-19
**Decision:** Shared UI components extracted from `src/lib/ui/` into a proper Angular library at `projects/ui/`, built via ng-packagr to `dist/ui/`, imported via `@ui` path alias. A separate `projects/ui-playground/` app showcases all components.
**Why:** Enables independent build/test of UI components, proper tree-shaking, and a dedicated playground for design iteration. Clean separation between app code and design system.
**Consequence:** Must run `ng build ui` before the main app if UI library source changes. Feature components import from `@ui` and use CVA-based form controls with `formControlName` or `ngModel`.

---

## ADR-007 · Selective adoption of @ui components
**Date:** 2026-03-19
**Decision:** Not all native elements were replaced with `@ui` components. Kept native for: `<input type="date">` and `<input type="file">` (unsupported types), search inputs outside reactive forms (simpler as native), and location badges with domain-specific sun/shade color schemes.
**Why:** The `InputComponent` CVA only supports `text|email|number|search|password|tel|url`. Non-form-bound inputs would need `ngModel` overhead for no benefit. Location badges have custom semantic colors that don't map to `BadgeComponent` variants.
**Consequence:** Some native `.input`/`.badge` CSS remains in component SCSS files alongside `@ui` component usage.

---

## ADR-008 · Icon-based radio group for plantingLocation instead of dropdown
**Date:** 2026-03-19
**Decision:** Replaced `<app-select>` for `plantingLocation` with a custom icon-button radio group using inline SVG icons (sun, partial-sun/half-sun, moon/shade). Created a shared `PlantingLocationIconComponent` reused in the form, list badges, and detail badges.
**Why:** Three fixed options with strong visual identity are better served by icon buttons than a dropdown. Improves discoverability and touch targets. Same icons in badges provide visual consistency.
**Consequence:** The form field is a custom implementation (not using `@ui RadioGroupComponent`) because the icon-button layout differs from the standard dot-radio pattern. `PlantingLocationIconComponent` is a shared dependency across 3 feature components.

---

<!-- Add new decisions below -->
