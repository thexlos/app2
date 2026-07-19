# ArmaDesk Reference Layer Lab v2.1 Report

## Isolated route

The cleaned reference-layer lab remains available locally at:

`http://127.0.0.1:<port>/#/card-lab-reference`

The route returns before `AppShell`. It is not part of the application `Screen` state and is not integrated into Home.

## Full-canvas layer registration

The v2.1 patch replaces the previous cropped icon treatment with six independently rendered elements per card:

1. Clean source-derived surface PNG.
2. Transparent texture PNG.
3. Transparent border/highlight PNG.
4. Transparent icon-well/glow PNG.
5. Transparent icon-glyph PNG.
6. Live DOM content for labels, values, trends, and arrows.

All five image layers are positioned with `position: absolute` and `inset: 0`; icon layers no longer use separate `left`, `top`, `width`, or `height` registration values.

- Stat canvas: `210 × 340` (`210 / 340`).
- Quick Action canvas: `283 × 167` (`283 / 167`).

## Source coordinates

### Stat cards

| Tone | Source coordinates |
| --- | --- |
| Cyan | `28, 78, 238, 418` |
| Green | `250, 78, 461, 418` |
| Purple | `473, 78, 684, 418` |
| Orange | `695, 78, 906, 418` |

### Quick Actions

| Tone | Source coordinates |
| --- | --- |
| Cyan | `30, 520, 313, 687` |
| Green | `327, 520, 610, 687` |
| Purple | `625, 520, 908, 687` |
| Orange | `30, 700, 313, 867` |
| Pink | `327, 700, 610, 867` |
| Blue | `625, 700, 908, 867` |

## Cleanup and content fitting

- Replaced the old dark icon crops with registered transparent icon-well and icon-glyph layers.
- Removed old label fragments from the icon assets; Add Customer and Business Kit contain only their two live label spans.
- Kept Calendar centered as one live line.
- Added compact fitting rules for long stat values and trends.
- Kept one shared percentage inset for every live action arrow.
- Contained pressed and focus examples inside their preview columns.
- Prevented page-level and responsive-preview horizontal overflow.

## Changed implementation

- Replaced `src/assets/card-reference-layers/` with the v2.1 registered asset set.
- Replaced `src/components/card-lab-reference/referenceLayerAssets.ts`.
- Replaced `src/components/card-lab-reference/ReferenceDerivedCards.tsx`.
- Replaced `src/screens/CardLabReferenceLayersScreen.tsx`.
- Replaced `src/screens/card-lab-reference.css`.
- Added `tests/CardLabReferenceLayers.v21.test.tsx`.
- Updated the earlier isolated-lab test to recognize the separate icon-well and icon-glyph layers.

## Validation

- Packet SHA256: `DD0F1EDF363A75CA2531B46CD8720017A61F544C0067EB664C124606529D1447` (verified; different from v2).
- Packet Python layer verifier: passed; every asset has its expected canonical canvas and RGBA mode.
- `npm run build`: passed.
- `npm test -- --run`: passed — 23 test files and 120 tests.
- Browser validation: 39 rendered examples; every card had five loaded image layers at `inset: 0` with the correct natural canvas.
- All four stat tones and all six Quick Action tones rendered.
- The 390px, 402px, and 430px preview frames each reported zero horizontal overflow.
- Page and body horizontal overflow were both zero.
- State examples remained contained, Calendar stayed on one line, and no broken images were found.
- The isolated route rendered without `AppShell`, Home, Hero, or standard navigation.

## Scope confirmation

`App.tsx`, Home, Home CSS, Hero components and CSS, navigation, `AppState`, persistence, business logic, and the existing `#/card-lab` files were not modified. The reference-layer cards were not integrated into Home. No deployment was performed.
