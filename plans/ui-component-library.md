# UI Component Library + Playground — Implementation Plan

## Overview

Add a native-HTML-first component library to the omm-plants Angular 21 PWA, plus an interactive playground route at `/#/ui` for developing and testing components in isolation.

---

## Folder / File Structure

```
src/
├── ui-tokens.scss                    ← full design token file (light + dark)
├── styles.scss                       ← modified: imports tokens, declares @layer order
│
└── app/
    ├── ui/                           ← component library root
    │   ├── index.ts                  ← barrel export (@ui path alias)
    │   ├── _mixins.scss              ← shared SCSS mixins
    │   ├── button/
    │   │   ├── button.component.ts
    │   │   └── button.component.scss
    │   ├── input/
    │   ├── textarea/
    │   ├── select/
    │   ├── checkbox/
    │   ├── radio-group/
    │   ├── toggle/
    │   ├── dialog/
    │   ├── badge/
    │   ├── card/
    │   ├── spinner/
    │   └── tooltip/
    │
    └── features/
        └── ui-playground/            ← playground route at /#/ui
            ├── ui-playground.component.ts
            ├── ui-playground.component.html
            ├── ui-playground.component.scss
            └── sections/
                ├── button-section.component.ts
                ├── input-section.component.ts
                ├── textarea-section.component.ts
                ├── select-section.component.ts
                ├── checkbox-section.component.ts
                ├── radio-section.component.ts
                ├── toggle-section.component.ts
                ├── dialog-section.component.ts
                ├── badge-section.component.ts
                ├── card-section.component.ts
                ├── spinner-section.component.ts
                └── tooltip-section.component.ts
```

---

## Design System (`src/ui-tokens.scss`)

Extends the existing `--bg`, `--fg`, `--border` vars. All tokens inside `:root` and `[data-theme="dark"]`, integrated with the existing ThemeService pattern.

| Category | Examples |
|---|---|
| Color palette | `--color-primary-500`, `--color-neutral-*`, semantic: `--color-success/warning/error/info` |
| Typography | `--text-xs` → `--text-3xl`, `--font-normal` → `--font-bold`, `--leading-*` |
| Spacing | `--space-1` (4px) → `--space-10` (40px) |
| Border radius | `--radius-sm/md/lg/xl/full` |
| Shadows | `--shadow-sm/md/lg` |
| Transitions | `--transition-fast/base/slow` |
| Focus ring | `--focus-ring-color/width/offset` (accessibility) |

CSS cascade layers declared in `styles.scss`:
```scss
@layer tokens, reset, ui, app;
```

---

## Component Architecture Patterns

### Signal inputs + host attribute selectors
```ts
host: { '[attr.data-variant]': 'variant()', '[attr.data-size]': 'size()' }
```
CSS driven by `:host([data-variant="primary"])` — no class binding arrays.

### ControlValueAccessor for form components
Input, Textarea, Select, Checkbox, RadioGroup, Toggle implement CVA for `formControlName` / `[formControl]` compatibility.

### Native HTML elements used directly
- `<button>` — ButtonComponent
- `<input>` — InputComponent, CheckboxComponent
- `<select>` — SelectComponent
- `<textarea>` — TextareaComponent
- `<dialog>` — DialogComponent (with `showModal()`, `::backdrop`)
- `<details>`/`<summary>` — playground code blocks (no JS needed)

### `booleanAttribute` transform
```ts
disabled = input(false, { transform: booleanAttribute });
```
Allows `<app-button disabled>` (attribute without value).

### TypeScript path alias
```json
// tsconfig.json
"paths": { "@ui": ["src/app/ui/index.ts"], "@ui/*": ["src/app/ui/*"] }
```

---

## Components

| Component | Key features |
|---|---|
| `SpinnerComponent` | Pure CSS animation, `size` input (sm/md/lg) |
| `BadgeComponent` | Variants: default, success, warning, error, info |
| `ButtonComponent` | Variants: primary/secondary/outline/ghost/destructive; sizes sm/md/lg; `loading` state shows Spinner |
| `CardComponent` | Content projection: `[slot=header]`, `[slot=body]`, `[slot=footer]` |
| `TooltipComponent` | Popover API with CSS-only positioning fallback |
| `CheckboxComponent` | CVA, CSS `:has()` for custom styling |
| `ToggleComponent` | CVA, CSS-only switch animation |
| `SelectComponent` | CVA, wraps native `<select>` |
| `TextareaComponent` | CVA, auto-resize option |
| `InputComponent` | CVA, prefix/suffix `ng-content` slots, clearable, error state |
| `RadioGroupComponent` | CVA, compound with RadioComponent via scoped RadioGroupService |
| `DialogComponent` | Native `<dialog>`, `open()`/`close()` public methods, `@starting-style` animation |

---

## Playground (`/#/ui`)

- **Top-level route** (outside `LayoutComponent`) with its own layout
- Sticky sidebar with component name links (`scrollIntoView()` — not `href="#"` to avoid hash router conflicts)
- One `*-section.component` per component family
- Interactive controls (signals for variant/size/state) using library components (dogfooding)
- `<details><summary>Show code</summary><pre>...</pre></details>` for code snippets

---

## Implementation Phases

### Phase 1 — Tokens
1. Create `src/ui-tokens.scss` with full token set
2. Update `src/styles.scss` to import tokens + declare `@layer` order
3. Add `@ui` path alias to `tsconfig.json` (paths in `tsconfig.app.json` or `tsconfig.json`)
4. Verify: `ng build` — zero regressions

### Phase 2 — Presentational Components
Build in dependency order:
1. SpinnerComponent
2. BadgeComponent
3. ButtonComponent (uses Spinner)
4. CardComponent
5. TooltipComponent

### Phase 3 — Form Control Components
1. CheckboxComponent
2. ToggleComponent
3. SelectComponent
4. TextareaComponent
5. InputComponent
6. RadioGroupComponent + RadioComponent

### Phase 4 — Dialog
1. DialogComponent with native `<dialog>`
2. Entry/exit animation via `@starting-style`

### Phase 5 — Playground
1. Add `/ui` route to `app.routes.ts`
2. Create `UiPlaygroundComponent` shell
3. Create 12 section components

### Phase 6 — Migration (future)
Replace duplicated `.btn-primary`, `.input`, `.toggle-btn` etc. in feature components with library components.

---

## Gotchas

1. **`<dialog>` + OnPush**: `showModal()` via `@ViewChild` needs zone awareness or `markForCheck()`
2. **`@starting-style`**: Animate `opacity`/`transform`, not `display` — `none` doesn't transition
3. **Hash router + anchors**: `<a href="#button">` strips `/ui` from URL. Use `scrollIntoView()` instead
4. **`@layer` + encapsulation**: Emulated encapsulation adds `_ngcontent-*` inside the layer — this is correct behavior
5. **8 kB component style budget**: Keep component SCSS structural only; all token usage via `var()` is zero-weight
6. **`input()` signals**: Use `model()` for two-way binding in CVA components where applicable
