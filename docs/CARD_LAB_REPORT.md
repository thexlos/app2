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

## Scope confirmation

The Home screen, Home CSS, Hero component, Hero CSS, Hero data and animation, navigation component and CSS, `AppState`, business logic, routing state, and persistence were not modified. The prototypes were not integrated into Home. Phase 4 was not started, and no deployment was performed.

## Validation results

- `npm run build`: passed.
- `npm test`: passed — 18 test files and 102 tests.
- Browser check: passed at 390px, 402px, and 430px viewport widths.
- All stat cards, Quick Action cards, state examples, tone variants, approved references, and responsive preview frames rendered.
- The 390px, 402px, and 430px preview-frame contents reported no horizontal overflow.
- The Card Lab page reported no viewport-level horizontal overflow at the three tested widths.
- Reference images loaded successfully.
- Browser console errors: none.
- Standard navigation, Home, and Hero elements were absent from the Card Lab route.
