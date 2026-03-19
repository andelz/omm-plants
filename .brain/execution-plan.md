# Execution Plan — omm-plants

> This file is **updated** at the end of every session by `/wrap-up`.

## Status legend
- `[ ]` pending
- `[~]` in progress
- `[x]` done
- `[!]` blocked (reason noted inline)

---

## Epic: UI library integration  [branch: master]

### Steps
- [x] Refactor plant-form to use `@ui` components (InputComponent, SelectComponent, TextareaComponent, ButtonComponent)
- [x] Refactor plant-detail to use `@ui` components (ButtonComponent, BadgeComponent)
- [x] Refactor plant-list to use `@ui` components (ButtonComponent, BadgeComponent)
- [x] Refactor settings to use `@ui` components (SelectComponent, ToggleComponent, ButtonComponent)
- [x] Refactor share-receiver to use `@ui` components (ButtonComponent)
- [x] Clean up redundant CSS from SCSS files
- [x] Replace plantingLocation `<app-select>` with icon-based radio group (a11y: radiogroup role, arrow keys, roving tabindex)
- [x] Create shared `PlantingLocationIconComponent` and add icons to badges on list cards + detail page
- [~] Migrate hardcoded SCSS values to `@ui` design tokens (146 occurrences in 6 files)
- [ ] Commit changes

---

## Epic: Plant location grouping  [branch: master]

### Steps
- [x] Add `location?: string` to `Plant` model
- [x] Add `location` form control + text input to plant form
- [x] Add `<datalist>` autocomplete sourced from existing plant locations
- [x] Replace `filteredPlants` with `groupedPlants` computed signal in plant list
- [x] Render grouped sections with headings in plant list HTML
- [x] Add `.location-group` / `.location-heading` SCSS styles
- [x] Add i18n keys (en + de)
- [ ] End-to-end test (`ng serve --port 2910`)
- [ ] Commit changes

---

## Epic: Weather forecast (premium feature)  [branch: master]

> Plan: `plans/weather-forecast-premium.md`

### Phase 1 — Data layer
- [ ] Add `weather.model.ts` (`WeatherForecast`, `DayForecast`, `WeatherAlert` types)
- [ ] Add proxy route `GET /weather` calling Open-Meteo
- [ ] Implement `GeolocationService` (wraps `navigator.geolocation`)
- [ ] Implement `WeatherService.load()` + `WeatherService.getAlerts()`
- [ ] Bump IndexedDB to v3, add `weather` object store
- [ ] Unit test alert-mapping logic

### Phase 2 — Plant List banner
- [ ] Build `WeatherBannerComponent` (standalone)
- [ ] Wire into `PlantListComponent` behind `premium.enabled()` guard
- [ ] Add i18n keys — weather alerts (EN + DE)

### Phase 3 — Plant Detail card
- [ ] Build `WeatherCardComponent` (3-day forecast)
- [ ] Wire into `PlantDetailComponent` behind `premium.enabled()` guard
- [ ] Add i18n keys — forecast card (EN + DE)

### Phase 4 — Settings & permissions
- [ ] Add "Weather" section to Settings (permission status, manual location override, refresh)
- [ ] Add i18n keys — settings section (EN + DE)

### Phase 5 — Polish & offline hardening
- [ ] Graceful handling when no cache + offline
- [ ] Show staleness indicator when cache is old
- [ ] Verify service worker does not block Open-Meteo fetch

---

## Epic: Web Share Target  [branch: master]

### Steps
- [x] Create `public/manifest.webmanifest` with `share_target` declaration
- [x] Add manifest link + theme-color meta to `index.html`
- [x] Create `ShareIntentService` (buffer + URL extraction)
- [x] Intercept share navigation in root `App` component
- [x] Create `ShareReceiverComponent` (plant picker UI)
- [x] Register `/share` route in `app.routes.ts`
- [x] Add i18n keys (EN + DE)
- [x] Fix `app.spec.ts` and verify build + tests pass
- [ ] Generate proper PWA icons (192x192, 512x512 PNG)
- [ ] End-to-end test on deployed/installed PWA

---

## Completed epics

_None yet._
