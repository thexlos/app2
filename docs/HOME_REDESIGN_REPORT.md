# Home Redesign Report

## Summary

Redesigned the Home tab to match the supplied futuristic mobile/tablet mockups while preserving existing app data and route behavior. This pass is scoped to Home display/routing, Home-specific assets, bottom navigation styling, and regression tests.

## Assets added

- `src/assets/home/app_logo_sh.png`
- `src/assets/home/setup_rocket_illustration.png`
- `src/assets/home/business_kit_illustration.png`

## Setup below 100% behavior

- Shows a dark navy/blue/purple hero with the active business owner greeting.
- Shows the setup progress as a compact conic-gradient ring.
- Shows the floating setup banner with the rocket illustration.
- `Continue setup` routes to the existing setup screen.

## Setup 100% behavior

- Removes the setup banner completely.
- Removes `Continue setup`.
- Removes the setup percentage ring.
- Shows the ready-state hero with `Today at a glance` and `Business ready`.
- The glance card uses current workspace data for approvals waiting, unpaid invoices, and scheduled appointments for the day.

## Quick action map

| Home quick action | Route/action |
| --- | --- |
| Create Estimate | `openEstimateBuilder()` |
| Create Invoice | `openInvoiceBuilder()` |
| Add Customer | `setCurrentScreen("add-customer")` |
| Calendar & Schedule | `setCurrentScreen("calendar")` |
| Create QR Code | `openCreateTask("Create QR Code")` |
| My Creations | `setCurrentScreen("workshop-library")` |
| File Vault | `setCurrentScreen("file-vault")` |
| Business Kit | `setCurrentScreen("my-business-kit")` |

## Responsive notes

- Mobile uses 2-column stat and quick-action grids.
- Tablet and wider screens use 4-column stat and quick-action grids.
- Recent creations use a contained horizontal row only inside that section.
- Grid children use `min-width: 0` and long text uses wrapping where needed to avoid page-level horizontal scroll.

## Changed files

- `src/app/AppShell.tsx`
- `src/components/common/BusinessSwitcher.tsx`
- `src/components/navigation/Navigation.tsx`
- `src/components/navigation/navigation.css`
- `src/screens/HomeScreen.tsx`
- `src/screens/home.css`
- `src/assets/home/app_logo_sh.png`
- `src/assets/home/setup_rocket_illustration.png`
- `src/assets/home/business_kit_illustration.png`
- `tests/homeRedesign.test.tsx`
- `docs/HOME_REDESIGN_REPORT.md`

## Build result

Passed: `npm run build`

## Test result

Passed: `npm test` — 10 test files, 77 tests.

## Known limitations

- This pass does not start Phase 4.
- This pass does not change QR, estimate, invoice, persistence, recovery draft, File Vault, or customer logic except for Home navigation/display.
