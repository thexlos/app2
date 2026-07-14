# Home Dark Redesign Report

## Step 2 completed

Step 2 is complete: the Home tab now has a dark ArmaDesk mobile shell, safe-area-aware spacing, a phone-first content container, and reusable Home-specific dark card foundation classes.

## What changed

- Added the `home-shell` and `home-content` wrapper structure to the Home tab only.
- Added Home-scoped safe-area handling:
  - `min-height: 100dvh`
  - top padding with `env(safe-area-inset-top)`
  - bottom padding for the fixed bottom nav plus `env(safe-area-inset-bottom)`
  - horizontal overflow protection
- Added a phone-first centered content width with a max width of 460px.
- Added dark futuristic Home background styling using deep navy, blue glow, purple glow, and a subtle grid layer.
- Added reusable Home foundation classes:
  - `home-card`
  - `home-card--glass`
  - `home-card--glow`
  - `home-section-title`
  - `home-muted`
  - `home-icon-chip`
  - `home-neon-border`
- Updated existing Home surfaces to use dark readable card, glass, border, shadow, and muted-text tokens.
- Kept the existing shared bottom nav structure intact. It was already dark and safe-area-aware, so no nav item restructuring was needed.

## What was intentionally not changed

- No full Home redesign was started.
- No section-by-section rebuild was started.
- Header layout, business selector layout, setup chip, hero content, stat card content, quick actions, schedule, smart suggestions, recent activity, and record-driven Home content remain in their existing order.
- No Phase 4 work was started.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No ArmaDesk brand assets were replaced or regenerated.
- No iPhone device shell was added inside the app UI.

## Validation

- `npm run build` — passed.
- `npm test` — passed.
- Phone-width checks at 390px, 402px, and 430px — passed with no horizontal overflow. Home top padding computed to 20px and bottom padding computed to 104px, leaving clearance for the 72px fixed bottom nav.

## Step 3 completed

Step 3 is complete: the Home top area now has a compact ArmaDesk header row, compact business selector, Open Kit shortcut, and setup status chip.

## Step 3 changes

- Updated the Home header row to keep the ArmaDesk logo mark and `ArmaDesk` text compact.
- Added a `compact` variant to the existing `BusinessSwitcher` so Home uses the current switch-business and unsaved-work guard behavior.
- Replaced the standalone Home business selector placement with a compact utility row:
  - compact business selector
  - `Open Kit` shortcut
  - setup status chip
- Added the `Open Kit` shortcut routing to `my-business-kit`.
- Added setup chip behavior:
  - incomplete setup shows `Set Up · 72%`
  - complete setup shows `Setup Complete`
  - clicking the chip routes to setup
- Updated the lower Business Kit promo CTA from `Open Kit` to `Manage Kit` so the new top shortcut is the only visible `Open Kit` action label. The lower promo section itself was not redesigned.
- Added Home tests for the ArmaDesk header/logo, compact business selector, Open Kit route, setup chip route, and completed setup chip.

## Step 3 assets used

- `appBrand.headerLogoMark`
- `src/assets/brand/armadesk-logo-mark-transparent-512.png`

No new artwork or logos were generated.

## Step 3 intentionally not changed

- Hero card was not redesigned.
- Stats cards were not redesigned.
- Quick actions were not redesigned.
- Smart suggestions, recent activity, and recent creations were not redesigned.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No Phase 4 work was started.
- No iPhone device shell was added inside the app UI.

## Step 3 validation

- `npm run build` — passed.
- `npm test` — passed.
- Phone-width checks at 390px, 402px, and 430px — passed with no horizontal overflow, no text spill, and visible compact business selector, Open Kit, and setup chip.
- Functional checks passed:
  - business selector opens the existing switch-business modal
  - Open Kit routes to My Business Kit
  - setup chip routes to Business setup
  - notification/profile buttons remained stable with no console errors
  - old `Start Here Helper` branding was not visible in the Home header

## Step 4 completed

Step 4 is complete: the old oversized Home hero/setup treatment has been replaced with a compact futuristic ArmaDesk hero that saves vertical space on phone screens.

## Step 4 changes

- Replaced the old setup-heavy hero with a compact command desk hero.
- Added the approved hero copy:
  - eyebrow: `Business Command Desk`
  - title: `Good morning, Thomas`
  - subtitle: `Create, store, send, and manage today’s work from one place.`
- Added one compact `Review Today` action that routes to the existing calendar/schedule view.
- Added a compact 100% setup hero state:
  - eyebrow: `Business ready`
  - subtitle: `Your workspace is ready. Let’s keep today moving.`
- Removed the old oversized setup progress ring from the hero.
- Removed the old `You’re on track` / `Continue setup` setup banner/card.
- Kept setup progress access in the Step 3 setup chip.

## Step 4 hero visual approach

- `src/assets/home/home-hero-analytics.png` was not present in the project.
- No external stock image was used.
- No ArmaDesk logo was reused as hero artwork.
- The hero visual was built directly in scoped React/CSS/SVG as an editable analytics visual:
  - glowing mini chart
  - neon bars
  - cyan line graph
  - subtle digital grid
  - blue/cyan/purple glow

## Step 4 intentionally not changed

- Stats cards were not redesigned.
- Quick actions were not redesigned.
- Smart suggestions, recent activity, recent creations, and bottom navigation were not redesigned.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No Phase 4 work was started.
- No iPhone device shell was added inside the app UI.

## Step 4 validation

- `npm run build` — passed.
- `npm test` — passed.
- Phone-width browser checks passed at 390px, 402px, and 430px:
  - no horizontal overflow
  - compact hero title/subtitle rendered
  - hero visual stayed inside the viewport
  - old setup ring label was absent
  - old `You’re on track` / `Continue setup` banner text was absent
  - setup chip still rendered at 72%
  - Open Kit remained visible
  - Quick actions remained present
- Measured compact hero heights:
  - 390px viewport: 157px
  - 402px viewport: 142px
  - 430px viewport: 142px
- Functional check passed: `Review Today` routes to the existing calendar/schedule view.

## Step 5 completed

Step 5 is complete: the Home stats cards and Quick Actions cards now use the darker, tighter ArmaDesk dashboard treatment while preserving the existing data and routes. This step followed the attached Home reference image as the visual target for stats and Quick Actions only.

## Step 5 changes

- Added a compact `Today’s Snapshot` stats section header.
- Redesigned the four existing Home stat cards as compact dashboard cards:
  - dark glass background
  - reference-style neon corner/accent highlight
  - glowing icon chip at the top
  - label/value/status hierarchy
  - large value
  - small status hint
- Kept the same state-derived stat values and existing click behavior.
- Redesigned the existing Quick Actions cards as compact futuristic action buttons:
  - two-column phone grid
  - editable Lucide icon chips
  - action title
  - short helper line
  - small arrow affordance
  - thin neon corner/glow accents
  - 44px+ tap targets
- Kept the existing Quick Actions list and routes.
- Kept `Open Kit` as the only top shortcut label; the lower Business Kit promo still uses `Manage Kit`.

## Step 5 icons and assets

- Used existing Lucide/editable SVG icons only.
- Added no new PNG, JPG, AI-generated, or stock artwork.
- Did not replace or modify ArmaDesk logo assets.
- Did not add hero artwork.

## Step 5 intentionally not changed

- Compact hero from Step 4 was not redesigned or rewritten.
- Top header, business selector, Open Kit shortcut, and setup chip were not changed.
- Smart Suggestions, Recent Activity, Recent Creations, schedule/upcoming content, Business Kit promo layout, and bottom navigation were not redesigned.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No Phase 4 work was started.
- No iPhone device shell was added inside the app UI.

## Step 5 validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - stats section rendering
  - state-derived stat values
  - stat card routing behavior
  - Quick Actions routing behavior
  - Step 3 Open Kit routing
  - Step 4 compact hero rendering
  - old setup ring/banner remaining absent
  - old `Start Here Helper` app branding remaining absent
- Phone-width browser checks passed at 390px, 402px, and 430px:
  - no horizontal overflow
  - stats stayed in a clean two-column grid
  - Quick Actions stayed in a clean two-column grid
  - no text overflow or card overlap
  - bottom nav did not cover content
  - start of Quick Actions was visible after the stats

## Step 6A completed

Step 6A is complete: Upcoming Schedule and Smart Suggestions now follow the attached Home reference image style while preserving existing state data and routes.

## Step 6A changes

- Added a dedicated `Upcoming Schedule` section after Quick Actions.
- Added the `View Calendar` action, routed through the existing calendar/schedule behavior.
- Added a compact schedule card using existing calendar event data:
  - left date block
  - neon divider
  - event title
  - event time/location line
  - event type/status pill
  - right-side icon chip
  - existing “more event” count when additional scheduled events exist
- Added a compact empty schedule state for businesses with no scheduled events.
- Redesigned `Smart Suggestions` as a reference-style card grid using existing suggestion data.
- Preserved suggestion actions:
  - primary action
  - `Later`
  - `Dismiss`
- Added `See All` / `Show Less` behavior to reveal additional existing suggestions without creating a new route.

## Step 6A icons and assets

- Used existing Lucide/editable SVG icons only:
  - `CalendarClock`
  - `CalendarDays`
  - `MapPin`
  - `Sparkles`
  - `Star`
  - existing estimate/invoice/customer icons where relevant
- Added no new PNG, JPG, AI-generated, or stock artwork.
- Did not use the ArmaDesk logo as a section icon.
- Did not replace or modify ArmaDesk brand assets.

## Step 6A intentionally not changed

- Stats layout was not changed.
- Quick Actions layout was not changed.
- Needs Attention placement was not changed.
- Header, business selector, Open Kit shortcut, setup chip, and hero were not changed.
- Bottom navigation was not redesigned.
- Recent Activity and Recent Creations were not redesigned.
- Business Kit promo layout was not redesigned.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No Phase 4 work was started.
- No iPhone device shell was added inside the app UI.

## Step 6A validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - Upcoming Schedule rendering
  - View Calendar routing to the existing calendar/schedule screen
  - existing schedule data rendering
  - Smart Suggestions rendering
  - existing suggestion data rendering
  - Smart Suggestions primary action behavior
  - See All expansion behavior
  - old setup ring/banner remaining absent
  - old `Start Here Helper` app branding remaining absent
- Phone-width browser checks passed at 390px, 402px, and 430px:
  - no horizontal overflow
  - schedule and suggestion cards rendered as dark glass/neon cards
  - text did not overflow
  - cards did not overlap
  - bottom nav did not cover content

## Known follow-up steps

- Later correction pass: exact stats sizing, Quick Actions sizing, and Needs Attention placement.
- Step 6B: Recent Activity and Recent Creations.
- Step 7: final polish.
