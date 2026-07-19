# ArmaDesk Isolated Card Lab Report

## Card Lab URL

The temporary development-only Card Lab is available locally at:

`http://127.0.0.1:<port>/#/card-lab`

It returns before `AppShell`, so it does not render the standard app header or bottom navigation and does not add a value to the application `Screen` state.

## Files added

- `src/assets/card-lab/approved-action-grid.png`
- `src/assets/card-lab/approved-stat-row.png`
- `src/components/card-lab/CardLabPrototypes.tsx`
- `src/components/card-lab/InlineGlassFrame.tsx`
- `src/screens/CardLabScreen.tsx`
- `src/screens/card-lab.css`
- `tests/CardLabScreen.test.tsx`

`src/app/App.tsx` was updated only to import `CardLabScreen` and return it for the exact `#/card-lab` hash.

## Rendering architecture

- The stat and Quick Action prototypes use responsive inline SVG frames.
- Every visible SVG frame stroke uses `vectorEffect="non-scaling-stroke"`.
- Each card uses an independent inline SVG icon well.
- Lucide icons, labels, values, trends, and arrows remain live DOM content.
- No CSS masks are used.
- No stretched background card shell images are used.
- Approved static images appear only as labeled visual references beside the working prototypes.

## Card Lab v1.1 visual-match tuning

- The stat frame now uses the required `0 0 128 226` inline SVG viewBox and a taller, narrower presentation. Mobile preview cards use an approximately `0.56` width-to-height ratio.
- The Quick Action frame now uses the required `0 0 260 132` inline SVG viewBox with a taller glass body.
- A subtle inline SVG diagonal/circuit pattern adds internal surface texture without using a CSS mask or background shell image.
- Rim lighting is localized to selected corners and short edge segments. The controlled dark base border remains visible beneath those highlights.
- The independent inline SVG icon well is larger and deeper for both card types.
- Quick Action labels now render as two live lines: `Create` and `Estimate`. The live arrow occupies a dedicated right column with a stable inset.
- Pressed cards are visibly compressed, lowered, darker, and slightly desaturated.
- Focus cards strengthen the existing SVG rim highlights and glow without drawing a separate heavy outline.

### v1.1 files changed

- `src/components/card-lab/InlineGlassFrame.tsx`
- `src/components/card-lab/CardLabPrototypes.tsx`
- `src/screens/CardLabScreen.tsx`
- `src/screens/card-lab.css`
- `tests/CardLabScreen.v11.test.tsx`
- `tests/CardLabScreen.test.tsx` (updated stale v1.0 text assertions for the v1.1 title and accessible two-line action label)

## Scope confirmation

The Home screen, Home CSS, Hero component, Hero CSS, Hero data and animation, navigation component and CSS, `AppState`, business logic, routing state, and persistence were not modified. The prototypes were not integrated into Home. Phase 4 was not started, and no deployment was performed.

## Validation results

- `npm run build`: passed.
- `npm test`: passed — 19 test files and 105 tests.
- Browser check: passed at 390px, 402px, and 430px viewport widths.
- All stat cards, Quick Action cards, state examples, tone variants, approved references, and responsive preview frames rendered.
- The 390px, 402px, and 430px preview-frame contents reported no horizontal overflow.
- The Card Lab page reported no viewport-level horizontal overflow at the three tested widths.
- Reference images loaded successfully.
- Runtime geometry reported `0 0 128 226` for stat SVGs and `0 0 260 132` for Quick Action SVGs.
- Pressed and focus states reported distinct computed transforms, filters, opacity, and rim treatments.
- All Quick Action labels rendered as two live text lines with no arrow collisions.
- Browser console errors: none.
- Standard navigation, Home, and Hero elements were absent from the Card Lab route.
