# ArmaDesk Complete Blank Card Base Lab v3 Report

## Isolated route

The complete-base lab is available locally at:

`http://127.0.0.1:<port>/#/card-lab-complete-base`

`App.tsx` handles this as an isolated hash route before `AppShell`. It is not part of the `AppState` screen map and is not integrated into Home.

## Complete-base architecture

Every card renders exactly one supplied `complete-blank-base.png`. That single image contains:

- The complete card body.
- All four borders and every corner.
- The complete outer glow.
- Texture and lighting.
- The complete icon and icon glow.

The supplied bases contain no original labels, values, trends, action wording, or arrows. All copy, numbers, trends, Lucide arrows, pressed/focus states, button behavior, and accessibility names remain live React/CSS elements.

## Padded registration

- Stat core: `210 × 340`.
- Stat complete base: `270 × 400` with 30px transparent padding on every side.
- Quick Action core: `283 × 167`.
- Quick Action complete base: `343 × 227` with 30px transparent padding on every side.

The supplied CSS positions each base around its core using the packet's exact percentage offsets and dimensions. No base image is cropped, split, squeezed into the core, redrawn, or reinterpreted.

## Preview containment correction

Browser measurement found that the supplied large Quick Action preview container was shorter than its fully padded rendered base and that the 402px/430px example frames exceeded their inner width by one to two pixels. Only the lab preview containers were adjusted:

- Large Quick Action preview minimum height increased from 330px to 370px.
- Responsive preview padding increased from 12px to 14px.

The card components, complete-base assets, core geometry, registration offsets, and live-content layout remain unchanged.

## Files added or changed

- Added `src/assets/card-complete-bases/`.
- Added `src/components/card-lab-complete-base/completeBaseAssets.ts`.
- Added `src/components/card-lab-complete-base/CompleteBaseCards.tsx`.
- Added `src/screens/CardLabCompleteBaseScreen.tsx`.
- Added `src/screens/card-lab-complete-base.css`.
- Added `tests/CardLabCompleteBase.v3.test.tsx`.
- Updated `src/app/App.tsx` only to import the lab and add `#/card-lab-complete-base`.

## Validation

- ZIP SHA256: `041AD63031196BC967E60DCE154C130E41DD188A2ADD3FDABC58B399B5FE296A` — verified.
- Packet complete-base verifier: passed.
- `npm run build`: passed.
- `npm test -- --run`: passed — 25 test files and 126 tests.
- Browser route rendered 39 examples with exactly one complete-base image per card.
- Every stat base reported a `270 × 400` natural canvas.
- Every Quick Action base reported a `343 × 227` natural canvas.
- Every base extended beyond all four sides of its core and remained fully visible.
- No broken or non-decorative base images were found.
- All labels, values, trends, and arrows remained live elements inside their core cards.
- Default, Pressed, and Focus examples reported zero overflow.
- The 390px, 402px, and 430px preview frames each reported zero overflow.
- Page and body horizontal overflow were zero.
- The isolated route rendered without `AppShell`, Home, Hero, or standard navigation.

## Scope confirmation

Home, Home CSS, Hero components and CSS, navigation, `AppState`, persistence, business logic, and every existing Card Lab route and file were not modified. The complete-base cards were not integrated into Home. No deployment was performed.
