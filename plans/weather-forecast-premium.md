# Weather Forecast — Premium Feature Plan

## Goal

Surface weather conditions that may negatively or positively affect the user's plants — e.g. frost warnings, heat waves, drought, or heavy rain — so the user can take protective action in time.

---

## Feature Overview

- **Premium-gated** (like plant identification): only available when `PremiumService.enabled()` is `true`
- **Location-aware**: requires the device location (lat/lon) to fetch a local forecast
- **Actionable**: translate raw weather data into plant-care advice ("Bring frost-sensitive plants inside tonight")
- **Offline-friendly**: cache the last known forecast in IndexedDB so it's readable offline

---

## UX Design

### Where it appears

| Surface | Content |
|---|---|
| **Plant List** — top banner | Single most-urgent weather alert (e.g. "Frost tonight — check sensitive plants") |
| **Plant Detail** — new "Weather" card | 3-day forecast with per-day care recommendations |
| **Settings** | Permission status + manual location override |

### Alert severity levels (map to existing `dueStatus` palette)

| Level | CSS var | Trigger |
|---|---|---|
| `warning` | `--destructive` | Frost < 2 °C, extreme heat > 35 °C, storm |
| `caution` | `--primary` | Rain > 20 mm/day, wind > 60 km/h, UV > 8 |
| `ok` | `--fg-muted` | No notable conditions |

---

## Architecture

### New files

```
src/app/services/
  weather.service.ts          ← fetches forecast, maps to plant alerts
  geolocation.service.ts      ← wraps navigator.geolocation as a Promise/signal

src/app/models/
  weather.model.ts            ← WeatherForecast, DayForecast, WeatherAlert types

src/app/features/
  plant-list/
    weather-banner/           ← standalone component: top-of-list alert strip
  plant-detail/
    weather-card/             ← standalone component: 3-day forecast card

proxy/
  routes/weather.ts           ← new Express route: GET /weather?lat=&lon=&lang=
```

### Proxy route (keeps API key server-side)

The proxy already exists and secures the Pl@ntNet key. The weather API key follows the same pattern.

**Endpoint:** `GET /weather?lat={lat}&lon={lon}&lang={lang}`

The proxy calls the upstream weather API (see "API Choice" below), strips it down to only the fields we need, and returns a normalized payload. The Angular client never sees the raw API key.

**Response shape:**

```ts
interface ProxyWeatherResponse {
  location: string;          // resolved city name
  days: {
    date: string;            // ISO date "2026-03-18"
    tempMin: number;         // °C
    tempMax: number;         // °C
    precipMm: number;        // mm
    windKmh: number;         // max gust
    uvIndex: number;
    condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';
  }[];
}
```

### API Choice: Open-Meteo

[Open-Meteo](https://open-meteo.com) is the preferred choice:

- **Free, no API key required** for non-commercial use → no proxy secret needed initially
- GDPR-compliant (EU servers, no tracking)
- Returns 7-day hourly/daily forecast
- Aligns with the project's privacy-first, local-first philosophy

If a key is later needed (commercial use), the proxy wrapper is already in place.

**Upstream call example:**
```
https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &daily=temperature_2m_min,temperature_2m_max,precipitation_sum,windspeed_10m_max,uv_index_max,weathercode
  &timezone=auto
  &forecast_days=3
```

### WeatherService

```ts
@Injectable({ providedIn: 'root' })
export class WeatherService {
  private cache = signal<WeatherForecast | null>(null);

  /** Fetches forecast and writes to signal + IndexedDB cache */
  async load(lat: number, lon: number, lang: string): Promise<void> { ... }

  /** Maps raw forecast days to actionable PlantAlerts */
  getAlerts(forecast: WeatherForecast): WeatherAlert[] { ... }

  /** Returns true if any alert severity === 'warning' */
  hasUrgentAlert(alerts: WeatherAlert[]): boolean { ... }
}
```

### Alert mapping logic (`getAlerts`)

```
frost         → tempMin < 2 °C  → "Frost tonight. Move frost-sensitive plants indoors."
heat          → tempMax > 35 °C → "Extreme heat. Water in the morning, provide shade."
heavy_rain    → precipMm > 20   → "Heavy rain. Check drainage for potted plants."
drought       → precipMm < 1 for 3+ days → "Dry spell. Increase watering frequency."
storm         → windKmh > 60    → "Storm warning. Secure or shelter outdoor plants."
high_uv       → uvIndex > 8     → "High UV. Protect sun-sensitive plants."
```

### Caching strategy

- After a successful fetch, serialize the `WeatherForecast` to IndexedDB under key `weather-cache` (new object store `settings-cache` or a dedicated `weather` store in DB v3).
- On app start, read the cache immediately (synchronous-feeling UI); then refresh in background if the cache is older than 1 hour.
- Offline: serve cached data with a "Last updated X hours ago" note.

### DB migration

DB is currently v2. Add a `weather` object store in the `upgrade` callback → bump to **v3**. The runtime-migration pattern already in use makes this safe.

---

## Implementation Phases

### Phase 1 — Data layer (no UI)

1. Add `WeatherForecast`, `DayForecast`, `WeatherAlert` models (`weather.model.ts`)
2. Add proxy route `GET /weather` calling Open-Meteo
3. Implement `GeolocationService` (wraps `navigator.geolocation.getCurrentPosition`)
4. Implement `WeatherService.load()` + `WeatherService.getAlerts()`
5. Bump IndexedDB to v3, add `weather` store
6. Unit test alert-mapping logic

### Phase 2 — Plant List banner

7. Build `WeatherBannerComponent` (standalone, shows most severe alert or nothing)
8. Wire into `PlantListComponent` behind `premium.enabled()` guard
9. Add i18n keys for all alert messages (EN + DE)
10. Manual smoke test: enable premium → grant location → verify banner

### Phase 3 — Plant Detail card

11. Build `WeatherCardComponent` (3-day forecast, per-day icons + advice)
12. Wire into `PlantDetailComponent` behind `premium.enabled()` guard
13. Add i18n keys for forecast card labels (EN + DE)

### Phase 4 — Settings & permissions

14. Add "Weather" section to Settings:
    - Geolocation permission status (not requested / granted / denied)
    - "Request location access" button
    - Manual location name override (for users who deny geolocation)
    - "Last updated" timestamp + manual refresh button
15. Add i18n keys for settings section (EN + DE)

### Phase 5 — Polish & offline hardening

16. Ensure `WeatherBannerComponent` handles no-cache + offline gracefully (hide or show stale note)
17. Add `last_updated` field to cache; show staleness indicator in detail card
18. PWA: pre-cache the Open-Meteo API is not needed (dynamic data), but ensure the service worker does not block the fetch

---

## i18n Keys (new, to be added)

```json
"weather": {
  "banner_title": "Weather Alert",
  "forecast_title": "3-Day Forecast",
  "last_updated": "Updated {{time}}",
  "offline_note": "Using cached forecast",
  "permission_label": "Location access",
  "permission_description": "Required to show local weather for your plants.",
  "permission_request": "Allow location",
  "permission_denied": "Location access denied. Enter your city manually.",
  "location_override_label": "Manual location",
  "location_override_placeholder": "Enter city or ZIP code",
  "refresh": "Refresh forecast",
  "alert_frost": "Frost tonight. Move frost-sensitive plants indoors.",
  "alert_heat": "Extreme heat forecast. Water in the morning and provide shade.",
  "alert_heavy_rain": "Heavy rain expected. Check drainage on potted plants.",
  "alert_drought": "Dry spell ahead. Increase watering frequency.",
  "alert_storm": "Storm warning. Secure or shelter outdoor plants.",
  "alert_high_uv": "High UV index. Protect sun-sensitive plants from direct midday sun.",
  "premium_hint": "Enable Premium to see weather alerts for your plants."
}
```

---

## Dependencies

| Dependency | Purpose | Notes |
|---|---|---|
| Open-Meteo API | Weather data | Free, no key, GDPR-safe |
| `navigator.geolocation` | Device location | User must grant permission |
| Existing proxy (Express) | Optional key wrapper / CORS relay | Extend with `/weather` route |
| Existing `PremiumService` | Feature gate | No changes needed |
| Existing `DbService` | Cache storage | Bump to v3 |

No new npm packages required.

---

## Out of Scope (for this plan)

- Push notifications for frost alerts (needs a service worker push subscription)
- Per-plant frost tolerance data (requires enriching the plant model)
- Historical weather comparison
- Paid weather APIs (Open-Meteo is sufficient for MVP)
