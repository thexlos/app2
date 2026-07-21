# ArmaDesk Home Card Visual Approval Lab

## Correction

The direct Home integration from commit
`171c4ea2ff94690465c818c789a16619fa249904` was reverted with a normal
history-preserving `git revert`. The real Home screen and its CSS were restored
to the state before that integration.

## Isolated approval route

The supplied Home card artwork is now available only at:

`#/card-lab-home-visual`

This route renders outside `AppShell`, so it does not include or modify the real
Home screen, Hero, Header, business selector/setup row, schedule, suggestions,
or bottom navigation.

## Isolated files

- `src/assets/card-home-visual-v2/`
- `src/components/card-lab-home-visual/HomeVisualApprovalCards.tsx`
- `src/screens/CardLabHomeVisualScreen.tsx`
- `src/screens/card-lab-home-visual.css`
- `tests/CardLabHomeVisual.test.tsx`

`src/app/App.tsx` contains only the isolated hash-route import and route check.

## Artwork behavior

- Ten supplied transparent PNGs are used intact.
- Exact `ASSET_MAP.json` registration percentages are used.
- No PNG is cropped, sliced, masked, or redrawn.
- Artwork images are decorative and contain no live wording.
- Labels, values, trends, arrows, pressed/focus states, button semantics, and
  interactions remain live React/CSS elements.
- The approval screen includes 390px, 402px, and 430px preview controls.

## Protected scope

- `src/screens/HomeScreen.tsx` was not changed by the isolated lab commit.
- `src/screens/home.css` was not changed by the isolated lab commit.
- Hero, navigation, AppState, persistence, recovery drafts, business logic, QR,
  estimate, invoice, customer, and business-profile logic were not changed.
- No Phase 4 work was started.
- No deployment was performed.
