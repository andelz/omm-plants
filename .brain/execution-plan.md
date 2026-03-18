# Execution Plan — omm-plants

> This file is **updated** at the end of every session by `/wrap-up`.

## Status legend
- `[ ]` pending
- `[~]` in progress
- `[x]` done
- `[!]` blocked (reason noted inline)

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

## Completed epics

_None yet._
