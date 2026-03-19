# Architecture — omm-plants

## Overview
A PWA plant care tracker built with Angular 21, using IndexedDB (via `idb`) for local storage. Users manage plants with photos, care schedules (watering/pruning/fertilizing), and track overdue tasks.

**Root:** `./`
**Build:** `ng build`
**Test:** `ng test` (Vitest runner)
**Dev server:** `ng serve --port 2910`

---

## Key source structure

```
src/
  main.ts                  — bootstraps AppComponent
  app/
    app.config.ts          — providers: router (hash), HttpClient, ServiceWorker, ngx-translate
    app.routes.ts          — routes: /plants, /plants/new, /plants/:id/edit, /plants/:id, /settings, /share
    app.ts / app.html      — root shell (also intercepts Web Share Target navigation)
    models/
      plant.model.ts       — Plant, CareTask, CareInterval types + daysUntilDue / dueStatus / worstStatus helpers
    services/
      db.service.ts        — IndexedDB CRUD via idb (plants-db v2), includes migratePlant() for schema migration
      theme.service.ts     — theme handling
      share-intent.service.ts — buffers Web Share Target data; static helpers to extract/resolve URLs from shared text
    features/
      plant-list/          — plant list page
      plant-detail/        — plant detail page
      plant-form/          — create/edit form
      settings/            — settings page
      share-receiver/      — Web Share Target plant picker (receives shared URLs, lets user pick a plant)
    components/
      layout/              — LayoutComponent (shell/nav wrapper)
  lib/
    ui/                    — shared UI primitives: badge, button, card, icon, input, label, select, switch, utils
```

---

## Key patterns

- **Routing:** Hash-based (`withHashLocation()`), lazy-loaded feature components
- **Data layer:** Single `DbService` (providedIn root), all methods return Promises wrapping IDB operations; DB version = 2
- **Schema migration:** `migratePlant()` reads old string-based `careSchedule` fields and converts to `CareTask` objects at read time
- **Due status logic:** `daysUntilDue(task)` → `dueStatus(task)` → `worstStatus(plant)` — all in `plant.model.ts`
- **i18n:** ngx-translate with JSON files at `public/i18n/{en,de}.json`; extract with `npm run i18n:extract`
- **PWA:** `@angular/service-worker` registered after stable, ngsw-config.json at root, `public/manifest.webmanifest` with `share_target`
- **Web Share Target:** Manifest declares `GET /share?url=&title=&text=`. Root `App` component intercepts real-path `/share` on init, buffers params in `ShareIntentService`, then redirects to hash route `/#/share`. This bridges the gap between the Share Target API (real paths) and hash-based routing.
- **UI lib:** Shared primitives live in `src/lib/ui/` (badge, button, card, icon, input, label, select, switch)
- **Photos:** Stored as base64 strings in the `Plant.photo` field inside IndexedDB
- **Location grouping:** `Plant.location` is an optional free-text string (e.g. "terasse"). Plant list groups by this field (alphabetical, unlabelled last). `PlantFormComponent` loads all existing location values on init and exposes them via a `<datalist>` for autocomplete. No DB migration needed — field is optional.

---

## i18n / assets

- Translation files: `public/i18n/en.json` and `public/i18n/de.json`
- Extract with: `npm run i18n:extract` (scans `./src`, outputs sorted JSON)
- Loader prefix: `/i18n/`, suffix: `.json`
