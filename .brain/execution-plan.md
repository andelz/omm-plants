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

## Completed epics

_None yet._
