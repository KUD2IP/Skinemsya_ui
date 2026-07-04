# AGENTS.md — Operating Guide for AI Agents

This file is the **mandatory ruleset** for any AI agent generating or modifying code in `skinemsya_ui`. Read it **before every coding task** and follow it strictly. It encodes the project's non-negotiable constraints so that generated code stays consistent, unique-looking, and aligned with the backend.

The user-facing documentation is in Russian under `docs/`. This file is the English source of truth for agent behavior. When in doubt, the docs win; cite them.

---

## 0. TL;DR (read this first)

- This is a **Telegram Mini App** for shared expenses ("Скинемся"). Frontend: **React + Vite + TypeScript**.
- **Only build features that exist in the backend** (`../skinemsya_java`). Source of truth: [docs/API.md](docs/API.md). Today only **auth + profile** exist.
- **Never use Tailwind.** Never use default palettes (slate/zinc/gray) or default icon sets (Lucide/Heroicons). Styling is **vanilla-extract tokens only**.
- **Use design tokens** from `src/shared/theme` for every color/size/timing. No hardcoded values. See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
- **Reuse components** from `src/shared/ui`. Put new reusable components there.
- Every screen needs a **skeleton** loading state; app boot uses the **Rive splash**.
- Respect **Telegram safe-area**, **full responsiveness**, smooth **Motion** animations, and `prefers-reduced-motion`.

---

## 1. Required reading per task

Before writing code, load the relevant docs:

| Task type | Read |
| --- | --- |
| Any UI work | [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) |
| Choosing libraries / setup | [docs/TECH_STACK.md](docs/TECH_STACK.md) |
| Where to put files | [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) |
| Data / endpoints / auth | [docs/API.md](docs/API.md) |
| Telegram platform features | [docs/TELEGRAM_MINIAPP.md](docs/TELEGRAM_MINIAPP.md) |

---

## 2. Hard rules (do NOT violate)

1. **No backend-less features.** If an endpoint is not listed in [docs/API.md](docs/API.md) and not present in `../skinemsya_java` controllers, do **not** build it, do **not** invent it, do **not** add mock APIs to fake it. Stop and report that the backend is missing.
2. **No Tailwind. No utility-class styling.** Styling is done with **vanilla-extract** (`*.css.ts`) consuming theme tokens.
3. **No default AI-looking palettes.** Never introduce `slate/zinc/gray-500`, generic blue accents, or raw hex in components. Use tokens (`vars.color.*`). The brand color is Sber-style green on a dark green-tinted background.
4. **No default icon packs.** Use `@phosphor-icons/react` (duotone) via the `Icon` adapter. No Lucide/Heroicons/Material.
5. **No `@telegram-apps/telegram-ui`.** The UI is bespoke. Use the SDK only for platform integration.
6. **No hardcoded design values.** Colors, spacing, radii, shadows, font sizes, animation timings come from tokens. If a token is missing, add it to `src/shared/theme`, not inline.
7. **Reusable UI lives in `src/shared/ui`.** Do not duplicate component markup across screens.
8. **Do not add heavy dependencies** without checking the existing stack first ([docs/TECH_STACK.md](docs/TECH_STACK.md)). Prefer what's already chosen.
9. **Do not commit secrets**, test tokens, or mock `initData`.

---

## 3. Approved stack (use these, not alternatives)

- Framework: **React 18 + Vite + TypeScript**
- Styling: **vanilla-extract** (`@vanilla-extract/css`, `@vanilla-extract/recipes`)
- Headless primitives: **Ark UI** (`@ark-ui/react`)
- Animation: **Motion** (`motion/react`) with presets from `src/shared/lib/motion.ts`
- Icons: **Phosphor** (`@phosphor-icons/react`, duotone)
- Splash: **Rive** (`@rive-app/react-canvas`), fallback Lottie
- Server state: **TanStack Query**; Client state: **Zustand**; Routing: **TanStack Router**
- HTTP: **ky**; Forms: **react-hook-form + zod**
- Dates: **date-fns**

If a task seems to need something outside this list, justify it against [docs/TECH_STACK.md](docs/TECH_STACK.md) before adding.

---

## 4. Design tokens cheat-sheet

Always reference via `vars` from `@/shared/theme`. Key values (full list in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)):

- Backgrounds: `bg.base #0A0F0D`, `bg.surface #101714`, `bg.elevated #16201C`, `bg.inset #0C120F`
- Brand green: `green.500 #21A038` (primary), hover `#1B8A30`, active `#16762A`, accent `#2FD37A`
- Text: `text.primary #EAF2EE`, `text.secondary #9DB3AA`, `text.muted #6B8078`, `text.inverse #06120C`
- Semantic: success `#21A038`, warning `#E5A33B`, danger `#E5484D`
- Radius: `md 12`, `lg 16`, `xl 20`, `2xl 28`, `full`
- Spacing base 4px (`space.5 = 16`)
- Motion: `duration.fast 150 / base 220 / slow 360`; spring presets `soft / snappy / bouncy`
- Fonts: `Onest` (UI), `Geologica` (display), mono for money

---

## 5. Component conventions

- One folder per reusable component: `Component.tsx`, `Component.css.ts`, `index.ts`.
- Variants via vanilla-extract `recipe` (see Button example in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)).
- Use Ark UI for components with behavior (Dialog/Sheet, Select, Switch, Tabs, Tooltip).
- Interactive elements: press animation (`scale(0.97)`) + haptics where appropriate.
- Min touch target 44px. Accessible labels and `focus-visible` ring.
- No business logic inside `shared/ui` — presentation only.

## 6. Data & state conventions

- All server data via **TanStack Query**; map states to UI: `isLoading → <Skeleton>`, `isError → <ErrorState>`, empty → `<EmptyState>`.
- Auth tokens in a Zustand session store; access token in memory, refresh handled by the `ky` client interceptor (see [docs/API.md](docs/API.md)).
- Forms with react-hook-form + zod; map `ApiErrorResponse.fields[]` to field errors, `message` to a Toast.

## 7. Telegram conventions

- Init SDK in `src/app` before render; bind viewport/theme CSS vars; call `miniApp.ready()`.
- Use `--tg-viewport-stable-height` and `env(safe-area-inset-*)`, never `100vh`.
- Drive native BackButton from routing; optionally use MainButton for the screen's primary action (not both for the same action).
- Wrap haptics/cloudStorage in `shared/lib` helpers that no-op outside Telegram.
- Keep the bespoke dark brand theme regardless of the user's system scheme.

---

## 8. Definition of Done (self-check before finishing)

- [ ] Feature maps to a real backend endpoint (or task explicitly is non-API UI scaffolding).
- [ ] No Tailwind, no default palettes/icons, no hardcoded design values — tokens only.
- [ ] Reused `shared/ui`; new reusable parts added there with `*.css.ts` + `index.ts`.
- [ ] Loading skeleton + error + empty states handled.
- [ ] Animations use Motion presets and respect `prefers-reduced-motion`.
- [ ] Responsive at 320 and 768px; safe-area respected; touch targets ≥ 44px.
- [ ] Types are sound (no `any` leaks); lint passes.
- [ ] No secrets/test tokens committed.

---

## 9. When unsure

- Missing endpoint? → Stop, state the backend gap, don't fake it.
- Missing token/component? → Add it to `shared/theme` / `shared/ui`, then use it.
- Visual ambiguity? → Follow [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md); prefer the more distinctive, less "default" option.
- Conflicting instructions? → Backend reality and these docs override convenience.
