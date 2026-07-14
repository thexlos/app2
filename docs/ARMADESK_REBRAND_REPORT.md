# ArmaDesk Rebrand Report

## Summary

- App-facing product name changed from Start Here Helper / Start Here to ArmaDesk where the wording referred to the app itself.
- ArmaDesk brand assets from the provided logo pack were added under `src/assets/brand/`.
- Shared header branding now uses the ArmaDesk logo mark asset and live `ArmaDesk` text.
- Browser metadata now uses the ArmaDesk title and app icon references.

## Brand assets added

- `src/assets/brand/armadesk-app-icon-1024.png`
- `src/assets/brand/armadesk-app-icon-128.png`
- `src/assets/brand/armadesk-app-icon-180.png`
- `src/assets/brand/armadesk-app-icon-256.png`
- `src/assets/brand/armadesk-app-icon-512.png`
- `src/assets/brand/armadesk-app-icon-64.png`
- `src/assets/brand/armadesk-app-icon.png`
- `src/assets/brand/armadesk-header-logo-transparent.png`
- `src/assets/brand/armadesk-logo-full-dark-bg.png`
- `src/assets/brand/armadesk-logo-full-transparent.png`
- `src/assets/brand/armadesk-logo-mark-transparent-1024.png`
- `src/assets/brand/armadesk-logo-mark-transparent-128.png`
- `src/assets/brand/armadesk-logo-mark-transparent-2048.png`
- `src/assets/brand/armadesk-logo-mark-transparent-256.png`
- `src/assets/brand/armadesk-logo-mark-transparent-512.png`
- `src/assets/brand/armadesk-logo-mark-transparent-64.png`
- `src/assets/brand/armadesk-logo-mark-transparent.png`
- `src/assets/brand/armadesk-logo-mark.png`
- `src/assets/brand/armadesk-logo-reference-dark-bg.png`
- `src/assets/brand/armadesk-splash-logo-dark.png`
- `src/assets/brand/armadesk_brand_manifest.json`

## Files changed

- `README.md`
- `docs/ARMADESK_REBRAND_REPORT.md`
- `docs/INTEGRATION_PLAN.md`
- `docs/PHASE_2_3_CLEANUP_REPORT.md`
- `docs/PRODUCT_BRIEF.md`
- `index.html`
- `src/assets/brand/*`
- `src/components/common/ScreenHeader.tsx`
- `src/config/brandAssets.ts`
- `src/config/helpCatalog.ts`
- `src/design-system/global.css`
- `src/screens/BusinessOperationsScreens.tsx`
- `src/screens/HelpRequestScreen.tsx`
- `src/screens/HomeScreen.tsx`
- `src/screens/IntegrationCenterScreen.tsx`
- `src/screens/QRCodeDetailScreen.tsx`
- `src/state/AppState.tsx`
- `src/types/models.ts`
- `tests/homeRedesign.test.tsx`

## Intentionally not changed

- No Home redesign or Home layout rewrite was started.
- No Phase 4 work was started.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, or routing logic was changed.
- Existing mock business profiles, including `J Thomas Flooring` and `Start Here Support`, were not renamed.
- Support/service-provider wording such as `Start Here Help` and `Start Here services` was left in place where it refers to the mock support provider rather than the app brand.

## Validation

- `npm run build` — passed.
- `npm test` — passed, 10 test files and 77 tests.
