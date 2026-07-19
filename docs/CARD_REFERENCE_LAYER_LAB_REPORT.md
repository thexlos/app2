# ArmaDesk Reference-Derived Card Layer Lab Report

## Isolated route

The reference-derived layer lab is available locally at:

`http://127.0.0.1:<port>/#/card-lab-reference`

The route returns before `AppShell`. It is not added to the application `Screen` state and is not integrated into Home.

## Source-derived architecture

Each working card remains separated into five layers:

1. A stretchable, code-built center surface.
2. A transparent reference-derived texture PNG.
3. A transparent reference-derived border/highlight PNG.
4. A transparent reference-derived icon-and-glow PNG.
5. Live DOM text, values, trends, labels, arrows, accessibility, and button interactions.

The border, texture, and icon/glow files remain independent assets. They are not flattened into a single card image. The approved full-card crops are retained only as reference assets and are not used as the working-card background.

## Exact source geometry

- Stat working ratio: `210 / 340` (`0.617647`).
- Quick Action working ratio: `283 / 167` (`1.694611`).

### Stat crop coordinates

| Tone | Source coordinates |
| --- | --- |
| Cyan | `28, 78, 238, 418` |
| Green | `250, 78, 461, 418` |
| Purple | `473, 78, 684, 418` |
| Orange | `695, 78, 906, 418` |

### Quick Action crop coordinates

| Tone | Source coordinates |
| --- | --- |
| Cyan | `30, 520, 313, 687` |
| Green | `327, 520, 610, 687` |
| Purple | `625, 520, 908, 687` |
| Orange | `30, 702, 313, 866` |
| Pink | `327, 702, 610, 866` |
| Blue | `625, 702, 908, 866` |

## Generated layer files

The repository contains four stat tone sets under `src/assets/card-reference-layers/stat/` and six action tone sets under `src/assets/card-reference-layers/action/`. Every tone directory preserves:

- `reference-card.png`
- `border-overlay.png`
- `texture-overlay.png`
- `icon-cluster.png`
- `surface-tokens.json`

Representative border, texture, and icon assets report a 32-bit ARGB pixel format. All 55 supplied asset, source, and test files were verified byte-for-byte after copying.

## Validation

- `npm run build`: passed.
- `npm test`: passed — 22 test files and 116 tests.
- Browser route: `#/card-lab-reference` rendered successfully with no console errors.
- All four stat tone sets and all six action tone sets rendered.
- Every rendered working card contained independent surface, texture, border, icon/glow, and live-content elements.
- Approved stat and Quick Action references loaded successfully.
- Live labels, values, trends, two-line action labels, arrows, accessible names, and interaction states remained DOM content.
- The 390px, 402px, and 430px preview frames reported zero horizontal overflow.
- Measured preview ratios matched approximately `210/340` and `283/167`.
- The route rendered without `AppShell`, Home, Hero, or standard navigation.

## Scope confirmation

Home, Home CSS, Hero components and CSS, navigation, `AppState`, business logic, persistence, and the existing `#/card-lab` implementation were not modified. The reference-derived cards were not integrated into Home. No deployment was performed.
