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

## Card Lab v1.2 visual-match tuning

- The stat frame now uses the supplied `0 0 132 220` inline SVG geometry, and the Quick Action frame uses `0 0 280 132`.
- Card content scales from each card's own inline size through CSS container query units, keeping the live icon, label, value, trend, and arrow proportional in large, compact, and responsive previews.
- The estimate and create-estimate artwork is rendered by the supplied live inline SVG components in `PremiumCardIcons.tsx`; it is not a pasted screenshot or background shell.
- The supplied v1.2 glass treatment darkens the center surface, sharpens the inner rim, retains non-scaling strokes, and adds restrained inline SVG circuit detail without masks or stretched card images.
- Pressed cards use the supplied lowered `scale(0.992)` treatment with reduced brightness and saturation. Focus cards strengthen the existing frame lighting without a separate outline or broad aura.
- The 390px, 402px, and 430px responsive preview frames retain their exact widths and report zero internal horizontal overflow.

### v1.2 files changed

- `src/components/card-lab/InlineGlassFrame.tsx`
- `src/components/card-lab/CardLabPrototypes.tsx`
- `src/components/card-lab/PremiumCardIcons.tsx`
- `src/screens/CardLabScreen.tsx`
- `src/screens/card-lab.css`
- `tests/CardLabScreen.v12.test.tsx`
- `tests/CardLabScreen.test.tsx` (updated the stale v1.1 heading assertion)
- `tests/CardLabScreen.v11.test.tsx` (updated the legacy compatibility assertions to the current v1.2 geometry)
- `docs/CARD_LAB_REPORT.md`

## Card Lab v1.3 exact-detail tuning

- The stat frame uses the supplied `0 0 136 226` inline SVG geometry and a responsive aspect ratio of `0.602`; the Quick Action frame uses `0 0 286 126` and a responsive aspect ratio of `2.27`.
- The live estimate document icon contains three strong horizontal document lines. The live create-estimate icon contains visible document lines and an attached plus badge.
- Both icon wells are slightly smaller relative to their cards. Stat label, value, and trend spacing is redistributed through more of the card height, while the two-line action label sits closer to the icon and uses a smaller arrow with a stable right inset.
- The center glass surface is darker with a controlled tone wash. The top reflection is shorter and localized, and every card includes a second subtle inner rim for depth.
- Pressed cards use the supplied lowered `scale(0.996)` treatment with reduced brightness and saturation. Focus cards use a tight 4.5px frame halo without a separate outline or broad aura.
- All visible SVG strokes remain non-scaling. No masks or stretched background shell images are used.

### v1.3 files changed

- `src/components/card-lab/InlineGlassFrame.tsx`
- `src/components/card-lab/CardLabPrototypes.tsx`
- `src/components/card-lab/PremiumCardIcons.tsx`
- `src/screens/CardLabScreen.tsx`
- `src/screens/card-lab.css`
- `tests/CardLabScreen.v13.test.tsx`
- `tests/CardLabScreen.test.tsx` (updated the stale v1.2 heading assertion)
- `tests/CardLabScreen.v11.test.tsx` (updated legacy compatibility geometry)
- `tests/CardLabScreen.v12.test.tsx` (updated container-scaling compatibility assertions)
- `docs/CARD_LAB_REPORT.md`

## Scope confirmation

The Home screen, Home CSS, Hero component, Hero CSS, Hero data and animation, navigation component and CSS, `AppState`, business logic, routing state, and persistence were not modified. The prototypes were not integrated into Home. Phase 4 was not started, and no deployment was performed.

## Validation results

- `npm run build`: passed.
- `npm test`: passed — 21 test files and 113 tests.
- Browser check: passed at 390px, 402px, and 430px viewport widths.
- All stat cards, Quick Action cards, state examples, tone variants, approved references, and responsive preview frames rendered.
- The 390px, 402px, and 430px preview-frame contents reported no horizontal overflow.
- The Card Lab page reported no viewport-level horizontal overflow during the browser check.
- Reference images loaded successfully.
- Runtime geometry reported `0 0 136 226` for stat SVGs and `0 0 286 126` for Quick Action SVGs.
- Responsive preview cards reported the required `0.602` stat and `2.27` Quick Action ratios at 390px, 402px, and 430px.
- Pressed and focus states reported distinct computed transforms, filters, opacity, and rim treatments.
- All Quick Action labels rendered as two live text lines with no arrow collisions.
- The supplied custom estimate and create-estimate SVG icons rendered as live DOM content.
- The supplied secondary inner rims and localized top reflections rendered on every live card.
- No SVG masks or stretched card-shell background images were present.
- Browser console errors: none.
- Standard navigation, Home, and Hero elements were absent from the Card Lab route.
