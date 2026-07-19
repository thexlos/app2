# ArmaDesk Clean Artwork Lab v2.2 Report

## Isolated route

The v2.2 artwork-only Card Lab is available locally at:

`http://127.0.0.1:<port>/#/card-lab-artwork`

`App.tsx` handles this as an isolated hash route before `AppShell`. It is not part of the `AppState` screen map and is not integrated into Home.

## Artwork architecture

Every card uses exactly three supplied PNG layers:

1. Border/reflection.
2. Texture/lighting.
3. Icon artwork.

The card center surface, labels, values, trends, action words, Lucide arrows, spacing, pressed/focus states, button interaction, and accessibility names remain live React/CSS elements.

## Padded registration

- Stat core: `210 × 340`.
- Stat artwork: `250 × 380`, positioned with 20px-equivalent transparent padding on every side.
- Quick Action core: `283 × 167`.
- Quick Action artwork: `327 × 211`, positioned with 22px-equivalent transparent padding on every side.

The artwork wrapper extends beyond the core card using the supplied percentage offsets and dimensions. It is not squeezed into the core.

## Source-pixel safety

The packet assets were copied byte-for-byte. The supplied verifier confirms RGBA canvases, transparent six-pixel outer gutters, and its declared icon-safe zones.

Browser inspection found that several action icon canvases retain small source-letter pixels immediately before the packet verifier's x=150 text-zone boundary. The implementation therefore applies one shared action-icon safe mask at 140/327 of the padded canvas and uses screen blending for the icon artwork. This keeps the actual icon/glow, prevents dark source mattes from affecting the code-built surface, and ensures no supplied label pixels render beneath live React copy. Border/reflection and texture/lighting layers remain complete and unmasked.

## Content and states

- Stat labels, values, and trends are live and include compact rules for long values/trends.
- Quick Action words and arrows are live.
- Calendar renders as one line.
- Add Customer and Business Kit render as two live spans.
- Pressed and focus states are code-built and remain contained.
- All arrows share one percentage-based right inset.

## Files added or changed

- Added `src/assets/card-clean-artwork/`.
- Added `src/components/card-lab-artwork/cleanArtworkAssets.ts`.
- Added `src/components/card-lab-artwork/CleanArtworkCards.tsx`.
- Added `src/screens/CardLabCleanArtworkScreen.tsx`.
- Added `src/screens/card-lab-artwork.css`.
- Added `tests/CardLabCleanArtwork.v22.test.tsx`.
- Updated `src/app/App.tsx` only to import the screen and add `#/card-lab-artwork`.

## Validation

- ZIP SHA256: `A7907BCD745A1D6E535D95D12E853804E2A656A5AA5DFC5D3FDE9B885D6A1AD4` — verified.
- Packet artwork verifier: passed.
- `npm run build`: passed.
- `npm test -- --run`: passed — 24 test files and 123 tests.
- Browser route rendered 39 card examples with three loaded artwork images per card.
- Every stat image reported a `250 × 380` natural canvas.
- Every Quick Action image reported a `327 × 211` natural canvas.
- Every artwork wrapper extended beyond all four sides of its core.
- All live content remained within its core card.
- The 390px, 402px, and 430px preview frames each reported zero horizontal overflow.
- Page and body horizontal overflow were zero.
- No `AppShell`, Home, Hero, or standard navigation rendered on the isolated route.

## Scope confirmation

Home, Home CSS, Hero components and CSS, navigation, `AppState`, persistence, business logic, and all existing Card Lab files and routes were not modified. The new cards were not integrated into Home. No deployment was performed.
