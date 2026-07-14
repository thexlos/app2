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

## Step 6B completed

Step 6B is complete: the Home middle layout has been corrected so the stats and Quick Actions area follows the locked Home reference image more closely while preserving the existing Home behavior.

## Step 6B changes

- Removed the visible `Today’s Snapshot` heading and helper text.
- Moved the stat cards directly under the compact hero.
- Increased stat card sizing and hierarchy so the cards feel like premium dashboard cards instead of thin strips:
  - two-column phone grid
  - four-column grid on wider containers
  - larger icon chips
  - larger value text
  - stronger label/status hierarchy
- Moved `Needs attention` below Quick Actions and before Upcoming Schedule.
- Corrected the primary Home Quick Actions grid to the six reference actions:
  - `Create Estimate`
  - `Create Invoice`
  - `Add Customer`
  - `Calendar`
  - `QR Code`
  - `Business Kit`
- Updated Quick Action cards to use a compact horizontal card feel with the icon on the left and short label text beside it.
- Removed long helper text from the primary Quick Action cards so labels do not crowd the cards.
- Kept `Calendar`, `QR Code`, and `Business Kit` as the short primary labels requested for this layout.

## Step 6B extra action handling

- `My Creations` and `File Vault` were removed only from the primary Home Quick Actions grid.
- Their routes and features were not deleted from the app.
- Those areas remain available elsewhere in the existing app flow.

## Step 6B intentionally not changed

- Upcoming Schedule was not redesigned.
- Smart Suggestions was not redesigned.
- Header, business selector, Open Kit shortcut, setup chip, and hero were not redesigned.
- Bottom navigation was not redesigned.
- Recent Activity and Recent Creations were not redesigned.
- Business Kit promo layout was not redesigned.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No Phase 4 work was started.
- No iPhone device shell was added inside the app UI.

## Step 6B icons and assets

- Used existing Lucide/editable SVG icons only.
- Added no new PNG, JPG, AI-generated, stock, or Figma-exported artwork.
- Did not replace or modify ArmaDesk brand assets.

## Step 6B validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - state-derived stats still render
  - `Today’s Snapshot` no longer appears
  - the primary Quick Actions grid contains the six requested reference actions
  - `My Creations` and `File Vault` do not appear in the primary Quick Actions grid
  - `Needs attention` still renders and routes to the estimate review
  - Upcoming Schedule still renders
  - Smart Suggestions still render
  - header/top/hero behavior remains covered
  - old setup ring/banner remain absent
  - old `Start Here Helper` app branding remains absent
- In-app browser check on `http://127.0.0.1:5176/` passed:
  - no horizontal overflow in the active app view
  - four stat cards rendered
  - six Quick Actions rendered
  - `Today’s Snapshot` was absent
  - `My Creations` and `File Vault` were absent from the primary Quick Actions grid
  - `Needs attention` appeared below Quick Actions and before Upcoming Schedule
  - Upcoming Schedule and Smart Suggestions remained visible

## Step 6C completed

Step 6C is complete: the Home card layout has been hard-locked closer to the supplied mockup at normal phone widths.

## Step 6C changes

- Forced the Home stats grid to one row of four cards at normal phone widths.
- Added a tiny-width fallback only below 340px so 390px, 402px, and 430px stay four-across.
- Shortened visible stat labels to match the mockup proportions:
  - `Estimates`
  - `Changes`
  - `Invoices`
  - `Outstanding`
- Kept the same state-derived stat values and existing stat click behavior.
- Forced the primary Quick Actions grid to three columns by two rows at normal phone widths.
- Kept the six requested primary Quick Actions only:
  - `Create Estimate`
  - `Create Invoice`
  - `Add Customer`
  - `Calendar`
  - `QR Code`
  - `Business Kit`
- Fixed bad action-label word breaking by removing `overflow-wrap: anywhere` from the Quick Action labels and locking labels to:
  - `word-break: normal`
  - `overflow-wrap: normal`
  - `hyphens: none`
- Scoped the tighter Quick Actions header spacing to the Quick Actions section only.
- Kept `Needs attention` below Quick Actions and before Upcoming Schedule.

## Step 6C intentionally not changed

- Header, business selector, Open Kit shortcut, setup chip, and hero were not redesigned.
- Upcoming Schedule was not redesigned.
- Smart Suggestions was not redesigned.
- Bottom navigation was not redesigned.
- Business Kit promo, Recent Activity, and Recent Creations were not redesigned.
- `My Creations` and `File Vault` were not deleted from the app.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No Phase 4 work was started.
- No iPhone shell, iOS status bar, dynamic island, or home indicator was added inside the app UI.
- No new artwork was added.

## Step 6C validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - stats render after the hero
  - short visible stat labels
  - existing stat routing behavior
  - six primary Quick Actions
  - `My Creations` and `File Vault` staying out of the primary Quick Actions grid
  - `Needs attention` rendering below Quick Actions and before Upcoming Schedule
  - Upcoming Schedule still renders
  - Smart Suggestions still renders
  - bottom navigation label/class structure
  - old setup ring/banner remaining absent
  - old `Start Here Helper` app branding remaining absent
- In-app browser checks passed at 390px, 402px, and 430px:
  - stat cards measured as 4 columns × 1 row
  - Quick Actions measured as 3 columns × 2 rows
  - no action label broke inside words
  - no horizontal overflow
  - `Needs attention` remained below Quick Actions
  - Upcoming Schedule remained below `Needs attention`
  - Smart Suggestions remained below Upcoming Schedule

## Step 6E completed

Step 6E is complete: the Home screen visible structure is now locked to the supplied mockup order and stops after Smart Suggestions.

## Step 6E changes

- Locked the visible Home content order to:
  1. Header row
  2. Business control row
  3. Hero card
  4. Four stat cards
  5. Quick Actions header
  6. Six Quick Action cards
  7. Upcoming Schedule header
  8. One Upcoming Schedule card
  9. Smart Suggestions header
  10. Smart Suggestions cards
- Removed `Needs attention` as a separate visible Home strip.
- Removed the `My Business Kit` promo card from the visible Home layout.
- Removed the `Recent activity` collapsed section from the visible Home layout.
- Removed the `Recent creations` section from the visible Home layout.
- Removed extra visible Home content below Smart Suggestions.
- Removed the large shared `home-panel` wrapper class from Quick Actions, Upcoming Schedule, and Smart Suggestions so those sections now render as title row plus individual cards.

## Step 6E feature access retained

- Business Kit remains accessible through `Open Kit` and the `Business Kit` Quick Action.
- My Creations / Workshop Library features were not deleted.
- File Vault features were not deleted.
- Recent activity data and app state were not deleted.
- Existing routes and app business logic were not changed.

## Step 6E intentionally not changed

- Header, business selector, Open Kit shortcut, setup chip, and hero were not redesigned.
- Stat data and stat click behavior were not changed.
- Quick Action routes were not changed.
- Upcoming Schedule card behavior was not changed.
- Smart Suggestions behavior was not changed.
- Bottom navigation was not redesigned.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, or business logic was changed.
- No Phase 4 work was started.
- No iPhone shell, iOS status bar, dynamic island, or home indicator was added inside the app UI.

## Step 6E validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - Header rendering
  - Hero rendering
  - stat card rendering
  - six primary Quick Actions
  - Upcoming Schedule rendering
  - Smart Suggestions rendering
  - no `My Business Kit` promo visible below Smart Suggestions
  - no `Recent activity` section visible below Smart Suggestions
  - no `Recent creations` section visible below Smart Suggestions
  - no extra visible Home sections after Smart Suggestions
  - no `My Creations` or `File Vault` cards in the primary Quick Actions grid
  - no old `Start Here Helper` app branding
  - old setup ring/banner remaining absent
- In-app browser checks passed at 390px, 402px, and 430px:
  - visible Home layout order matched the mockup structure
  - Smart Suggestions was the last Home content child
  - no visible content appeared under Smart Suggestions except the fixed bottom nav
  - stats remained directly under hero
  - Quick Actions directly followed stats
  - Upcoming Schedule directly followed Quick Actions
  - Smart Suggestions directly followed Upcoming Schedule
  - no large extra wrapper boxes appeared around Quick Actions, Upcoming Schedule, or Smart Suggestions
  - no Quick Action words broke inside labels
  - no horizontal overflow

## Step 6F completed

Step 6F is complete: the Home screen visible components were rebuilt to follow the locked reference mockup structure as closely as possible while keeping the app name as ArmaDesk and preserving existing app logic.

## Step 6F changes

- Rebuilt the visible Home component structure around the exact requested order:
  1. Header
  2. Connected business control bar
  3. Hero analytics card
  4. Four stat cards
  5. Quick Actions header
  6. Six Quick Action cards
  7. Upcoming Schedule header
  8. One Upcoming Schedule card
  9. Smart Suggestions header
  10. Smart Suggestions cards
- Reworked the header to keep the ArmaDesk logo mark and ArmaDesk text compact on the left with notification/profile circular controls on the right.
- Rebuilt the business control row as one connected glass card containing:
  - business switcher
  - `Open Kit`
  - circular setup progress ring with `72%` and `Set up`
- Updated the hero copy to exactly:
  - `Good morning,`
  - `Thomas!`
  - `Here’s what’s happening with your business today.`
  - `View Insights`
- Rebuilt the hero analytics visual in code with glowing bars, line graph, particles, platform rings, and `+23% vs last week` badge.
- Replaced the old stat set with the four reference labels:
  - `Estimates`
  - `Invoices`
  - `Customers`
  - `Tasks`
- Added the requested stat trend text:
  - `↑ 3 today`
  - `↑ 2 paid`
  - `↑ 6 this week`
  - `↑ 2 due today`
- Rebuilt Quick Actions to the exact six-card set:
  - `Create Estimate`
  - `Create Invoice`
  - `Add Customer`
  - `Calendar`
  - `QR Code`
  - `Business Kit`
- Rebuilt the Upcoming Schedule card to show the requested reference content:
  - `JUL / 13 / MON`
  - `Site Visit`
  - `10:00 AM • 123 Main St`
  - `Upcoming`
  - `1 more event`
- Rebuilt Smart Suggestions to exactly two Home cards:
  - `Send 2 pending estimates` / `Worth $4,250`
  - `Follow up with 3 recent leads` / `High opportunity`
- Removed inline suggestion action clutter from Home suggestions.
- Tightened phone-width styles so the connected business row and Quick Action labels do not visually break at 390px, 402px, or 430px.

## Step 6F intentionally not changed

- App name remains ArmaDesk, not StartHere.
- No iPhone shell, iOS status bar, dynamic island, or home indicator was added inside the app UI.
- Bottom navigation was not fully redesigned.
- QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, routing, and business logic were not changed.
- My Creations, File Vault, Recent Activity, and Business Kit functionality were not deleted from the app.
- No Phase 4 work was started.

## Step 6F validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - ArmaDesk header and logo
  - connected business control bar
  - Open Kit routing
  - setup ring routing
  - exact hero copy and analytics visual
  - exact four stat labels and trend text
  - stat routing behavior
  - exact six Quick Actions and routes
  - exact Upcoming Schedule reference content
  - exact two Smart Suggestions cards
  - no inline suggestion action clutter
  - Home content order ending after Smart Suggestions
  - no Business Kit promo, Recent Activity, Recent Creations, or Needs Attention strip in the visible Home flow
  - no old `Business Command Desk`, `Review Today`, or `Start Here Helper` content
- In-app browser checks passed at 390px, 402px, and 430px:
  - one connected business control bar rendered
  - hero copy and code-built analytics visual rendered
  - stats measured as 4 columns × 1 row
  - Quick Actions measured as 3 columns × 2 rows
  - Quick Action labels used normal word wrapping rules with no forced word breaking
  - Upcoming Schedule and Smart Suggestions rendered in the locked order
  - Smart Suggestions remained the last Home content child
  - no forbidden extra Home sections appeared
  - no horizontal overflow

## Known follow-up steps

- Later Home pass: Recent Activity and Recent Creations visual treatment.
- Step 7: final polish.
