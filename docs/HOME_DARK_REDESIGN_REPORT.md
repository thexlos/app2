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

## Step 6G completed

Step 6G is complete: the Home screen sizing/proportions were tightened and the bottom nav was rebuilt toward the locked mockup direction.

## Step 6G changes

- Corrected overall Home layout density so the screen is closer to the mockup’s compact mobile proportions.
- Reduced excessive vertical padding and section gaps.
- Tightened the header and connected business control bar height.
- Reduced hero height and internal spacing while keeping the approved hero content:
  - `Good morning,`
  - `Thomas!`
  - `Here’s what’s happening with your business today.`
  - `View Insights`
- Tightened stat card proportions:
  - four cards remain across
  - smaller icon chips
  - tighter label/number/trend spacing
  - no broken words
- Tightened Quick Actions card proportions:
  - still 3 columns × 2 rows
  - lower-profile cards
  - tighter icon/label spacing
  - exact six actions retained
- Tightened Upcoming Schedule proportions:
  - smaller date block
  - tighter text area
  - compact right-side location/extra-event area
- Tightened Smart Suggestions card proportions:
  - two cards only
  - compact icon/title/subtitle/arrow spacing
  - no inline action buttons
- Rebuilt the visible bottom nav to match the mockup direction:
  - `Home`
  - `Customers`
  - `Create`
  - `Calendar`
  - `More`
- Removed `Money` and `Help` from the visible primary bottom nav.
- Added a large raised circular gradient `Create` button overlapping the nav, matching the mockup direction.
- Routed `Calendar` to the existing calendar screen.
- Routed `More` to the existing Help/utility area without adding a new More system.

## Step 6G intentionally not changed

- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, money, help, or business logic was changed.
- No app functionality was deleted.
- Money and Help screens still exist; they are just not visible primary bottom-nav items in this step.
- No iPhone shell, iOS status bar, dynamic island, or home indicator was added inside the app UI.
- No Phase 4 work was started.

## Step 6G validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - rebuilt bottom nav labels: `Home`, `Customers`, `Create`, `Calendar`, `More`
  - `Money` and `Help` not appearing in the visible primary bottom nav
  - center Create nav item class
  - Calendar routing to the existing calendar screen
  - More routing safely to the existing Help/utility screen
  - Smart Suggestions remaining the last Home content section before bottom nav
  - exact six Quick Actions still rendered
  - no `My Business Kit` promo below Smart Suggestions
  - no `Recent Activity` below Smart Suggestions
  - no `Recent Creations` below Smart Suggestions
- In-app browser checks passed at 390px, 402px, and 430px:
  - no horizontal overflow
  - no broken words
  - stats measured as 4 columns × 1 row
  - Quick Actions measured as 3 columns × 2 rows
  - bottom nav labels measured as `Home`, `Customers`, `Create`, `Calendar`, `More`
  - center Create button was raised above the nav bar
  - Smart Suggestions stayed above the bottom nav
  - Smart Suggestions remained the last Home content child
  - no forbidden extra Home sections appeared

## Step 6H completed

Step 6H is complete: the uploaded `armadesk_home_reference_packet_v1.zip` was used as the visual handoff for a section-crop pass, and the Home hero analytics visual was rebuilt as a reusable data-driven React/CSS/SVG component.

## Step 6H reference packet used

- Extracted and reviewed:
  - `CODEX_HANDOFF.md`
  - `layout_measurements.json`
  - `12_reference_crop_contact_sheet.png`
- Used the section crops as visual references:
  - `02_header_reference.png`
  - `03_business_control_bar_reference.png`
  - `04_hero_card_reference.png`
  - `05_stat_cards_reference.png`
  - `06_quick_actions_reference.png`
  - `07_upcoming_schedule_reference.png`
  - `08_smart_suggestions_reference.png`
  - `09_bottom_nav_reference.png`
  - `10_hero_chart_visual_reference.png`
- The reference PNGs were not pasted into the app UI.
- The mockup’s StartHere text was not used; the app continues to use ArmaDesk branding.

## Step 6H changes

- Added `HomeHeroAnalyticsVisual`, a reusable component that receives the same visible stat-card values:
  - `Estimates`
  - `Invoices`
  - `Customers`
  - `Tasks`
- The hero visual now:
  - normalizes current stat values into glowing bar heights
  - renders five data-derived bars using the four visible metrics plus an averaged momentum bar
  - draws a generated SVG line through the bar tops
  - renders a neon platform/ring stack under the bars
  - renders a denser particle/starfield layer
  - exposes data attributes for test verification
- Replaced the fake `+23% vs last week` badge with a truthful current-state badge:
  - `4 active`
  - `current work`
- Strengthened the reference-crop visual direction for:
  - hero chart glow and platform depth
  - stat card glow
  - Quick Action card glow
  - schedule card glow
  - Smart Suggestions card glow
- Preserved the existing Home order:
  1. Header
  2. Business control bar
  3. Hero
  4. Stat cards
  5. Quick Actions
  6. Upcoming Schedule
  7. Smart Suggestions
  8. Bottom nav

## Step 6H intentionally not changed

- No static screenshot UI was used.
- No section crop was pasted as a flat UI image.
- No iPhone shell, iOS status bar, dynamic island, or home indicator was added inside the app UI.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, routing, or business logic was changed.
- No routes were removed.
- No app functionality was deleted.
- No Phase 4 work was started.

## Step 6H validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - ArmaDesk header
  - connected business bar
  - hero text
  - data-driven hero analytics visual
  - no fake `+23%` / `vs last week`
  - four metric inputs
  - five rendered hero chart bars
  - stat cards: `Estimates`, `Invoices`, `Customers`, `Tasks`
  - six Quick Actions only
  - Upcoming Schedule
  - Smart Suggestions
  - no content below Smart Suggestions
  - bottom nav: `Home`, `Customers`, `Create`, `Calendar`, `More`
  - no `Money` / `Help` in visible primary nav
  - no old setup banner/ring
  - no `Start Here Helper` branding
- In-app browser checks passed at 390px, 402px, and 430px:
  - no horizontal overflow
  - no broken words
  - hero visual reported four input metrics
  - hero visual rendered five chart bars
  - hero visual rendered 36 particles
  - hero visual rendered four platform rings
  - hero visual rendered a generated SVG path
  - `+23%` and `vs last week` did not appear
  - Smart Suggestions stayed above the bottom nav
  - Smart Suggestions remained the last Home content child
  - no forbidden extra Home sections appeared

## Step 6I completed

Step 6I is complete: the Home screen received a final visual-detail polish against the reference packet crops without changing the locked Home structure.

## Step 6I reference packet used

- Reused the uploaded `armadesk_home_reference_packet_v1.zip` handoff.
- Used these crops only as visual references:
  - `03_business_control_bar_reference.png`
  - `04_hero_card_reference.png`
  - `05_stat_cards_reference.png`
  - `06_quick_actions_reference.png`
  - `07_upcoming_schedule_reference.png`
  - `08_smart_suggestions_reference.png`
  - `09_bottom_nav_reference.png`
  - `10_hero_chart_visual_reference.png`
- No reference image, mockup screenshot, phone shell, iOS status bar, dynamic island, or home indicator was pasted into the app UI.

## Step 6I changes

- Polished the connected business control bar proportions:
  - kept it as one connected glass control bar
  - restored the subtle internal divider
  - adjusted the business icon, Open Kit button, and setup ring sizing so the row is less cramped
- Improved the data-driven hero chart depth:
  - increased the particle field from 28 to 36 dots
  - strengthened cyan/blue/purple chart glow
  - strengthened the generated curved SVG line
  - deepened the editable platform/ring glow under the bars
  - kept the truthful `4 active / current work` badge instead of the fake `+23% vs last week`
- Polished stat card proportions and detail:
  - stronger neon corner accents
  - stronger icon-chip glow
  - clearer value hierarchy while keeping four cards across
- Polished Quick Action card proportions:
  - kept exactly six cards
  - preserved 3 columns × 2 rows at the checked phone widths
  - strengthened icon/card glow without adding helper text or arrows
- Polished Upcoming Schedule and Smart Suggestions cards:
  - tightened bottom clearance so Smart Suggestions stays above the bottom nav
  - strengthened glass borders, neon glows, date divider, and suggestion icon treatments
  - kept Smart Suggestions as the last visible Home content section
- Polished the bottom nav:
  - retained `Home`, `Customers`, `Create`, `Calendar`, `More`
  - kept `Money` and `Help` out of the visible primary nav
  - strengthened the active Home underline/glow, raised Create button glow, and More icon treatment

## Step 6I intentionally not changed

- Home order was not changed:
  1. Header
  2. Business control bar
  3. Hero
  4. Stat cards
  5. Quick Actions
  6. Upcoming Schedule
  7. Smart Suggestions
  8. Bottom nav
- No visible content was added below Smart Suggestions except the fixed bottom nav.
- No `Needs Attention`, `My Business Kit` promo, `Recent Activity`, `Recent Creations`, `File Vault` primary quick action, or `My Creations` primary quick action was restored.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, routing, state, or business logic was changed.
- No route was removed and no app functionality was deleted.
- No Phase 4 work was started.

## Step 6I validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now additionally verify:
  - the data-driven hero visual renders 36 particles
  - the data-driven hero visual renders four platform rings
- In-app browser checks passed at 390px, 402px, and 430px:
  - no horizontal overflow
  - no broken words
  - visible Home content order matched the locked order
  - Smart Suggestions stayed above the bottom nav
  - Smart Suggestions remained the last Home content child
  - no forbidden Home sections or old action clutter appeared
  - hero visual reported four input metrics
  - hero visual rendered five chart bars
  - hero visual rendered 36 particles
  - hero visual rendered four platform rings
  - hero visual rendered a generated SVG path
  - `+23%` and `vs last week` did not appear
  - bottom nav labels measured as `Home`, `Customers`, `Create`, `Calendar`, `More`
  - `Money` and `Help` were absent from the visible primary nav

## Step 6K completed

Step 6K is complete: the Home screen was aligned against the uploaded `armadesk_home_exact_handoff_v1.zip` measurement handoff using the packet as a Figma-style sizing/spec source.

## Step 6K measurement packet used

- Extracted and reviewed:
  - `CODEX_IMPLEMENTATION_PROMPT_STEP_6K.txt`
  - `ARMA_DESK_HOME_EXACT_SPEC_v1.md`
  - `home_exact_measurements_v1.json`
  - `home_design_tokens_v1.css`
  - `13_measurement_overlay_v1.png`
- Used these reference crops only as visual measurement references:
  - `01_app_screen_reference_crop.png`
  - `03_business_control_bar_reference.png`
  - `04_hero_card_reference.png`
  - `05_stat_cards_reference.png`
  - `06_quick_actions_reference.png`
  - `07_upcoming_schedule_reference.png`
  - `08_smart_suggestions_reference.png`
  - `09_bottom_nav_reference.png`
  - `10_hero_chart_visual_reference.png`
- No reference PNG, phone shell, iOS status bar, dynamic island, or home indicator was pasted into the app UI.

## Step 6K changes

- Added measurement-derived Home sizing variables for the locked 390px, 402px, and 430px phone-width targets.
- Re-aligned the Home shell top padding, side padding, section gaps, and content max width to the measured handoff.
- Tightened the connected business bar to the handoff height while preserving the existing business selector, Open Kit route, and setup route.
- Locked the hero card to the measured height while keeping the existing data-driven hero analytics visual.
- Locked stat cards to the measured one-row dashboard sizing:
  - four stat cards
  - measured card heights
  - compact label/value/trend hierarchy
- Locked Quick Actions to the measured three-column by two-row structure:
  - six cards only
  - measured card heights
  - no broken action labels
- Locked Upcoming Schedule and Smart Suggestions cards to the measured card heights and spacing.
- Corrected the bottom nav sizing and grid row behavior so the raised Create button no longer pushes the other nav labels below the nav container.
- Changed the Home content width rule from viewport-width-based to parent-width-based so short desktop browser viewports with a scrollbar do not create horizontal overflow.

## Step 6K intentionally not changed

- Home order was not changed:
  1. Header
  2. Connected business control bar
  3. Hero card
  4. Four stat cards
  5. Quick Actions header
  6. Six Quick Action cards
  7. Upcoming Schedule header
  8. Schedule card
  9. Smart Suggestions header
  10. Two Smart Suggestion cards
  11. Bottom nav
- The hero chart remains functional and data-driven:
  - four metric inputs
  - five generated bars
  - one generated SVG line path
  - 36 particle spans
  - four platform/ring spans
  - truthful `4 active / current work` badge
- No fake `+23%` / `vs last week` badge was restored.
- No visible content was added below Smart Suggestions except the fixed bottom nav.
- `Needs Attention`, `My Business Kit`, `Recent Activity`, `Recent Creations`, `File Vault`, and `My Creations` were not restored into the visible Home flow.
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, routing, state, or business logic was changed.
- No route was removed and no app functionality was deleted.
- No Phase 4 work was started.

## Step 6K validation

- Browser checks passed at 390px, 402px, and 430px.
- Short-height browser check passed at 390px × 844px.
- Measurement highlights:
  - 430px: header ~45px, business bar ~56px, hero ~172px, stats ~125px, Quick Action cards ~59px, schedule card ~76px, suggestion cards ~67px, nav ~63px.
  - 390px: header ~41px, business bar ~50px, hero ~156px, stats ~114px, Quick Action cards ~54px, schedule card ~69px, suggestion cards ~61px, nav ~57px.
- Guard checks passed:
  - no horizontal overflow
  - no broken action labels
  - visible Home order matched the handoff
  - Smart Suggestions remained the last Home content child
  - Smart Suggestions was not covered by the bottom nav
  - no forbidden Home sections appeared
  - bottom nav labels measured as `Home`, `Customers`, `Create`, `Calendar`, `More`
  - `Money` and `Help` were absent from the visible primary nav
  - hero visual reported four input metrics
  - hero visual rendered five chart bars, 36 particles, four platform/ring spans, and one generated SVG path

## Phase 2B hero analytics visual handoff completed

Phase 2B is complete: the Home hero analytics visual was refined against the uploaded `armadesk_phase2b_hero_visual_handoff_v1.zip` packet and the addendum animation requirements.

## Phase 2B reference used

- Extracted and reviewed the handoff packet.
- Used `approved_hero_design_reference.png` as the visual source of truth for the hero analytics visual.
- The reference image was not pasted as a static chart or flat UI.
- The app continues to render the chart with React, CSS, and SVG.

## Phase 2B changes

- Rebuilt the hero analytics visual around exactly four metric bars:
  1. `Estimates`
  2. `Invoices`
  3. `Customers`
  4. `Tasks`
- Each bar uses the same current Home stat values shown in the visible stat cards.
- Bar heights are normalized with:
  - `maxValue = Math.max(...metricValues, 1)`
  - a minimum visible bar height so low values still render
  - a maximum display height so the visual stays compact inside the hero
- The glowing SVG line graph is generated from the normalized bar-top points.
- Each metric renders a compact futuristic callout/pin with the metric label and current value.
- Replaced the older hero badge behavior with a truthful total active work summary:
  - `13 active`
  - `work items`
- Added subtle professional animation:
  - bars rise from the platform with staggered timing
  - the SVG line draws across the bars
  - callouts and pins fade/slide into place
  - the platform/glow pulses subtly after load
- Added reduced-motion protection with a `prefers-reduced-motion: reduce` override.
- Tightened the hero split at phone widths so the existing left greeting/CTA and the chart both stay inside the hero card.

## Phase 2B intentionally not changed

- Home section order was not changed:
  1. Header
  2. Connected business control bar
  3. Hero card
  4. Four stat cards
  5. Quick Actions header
  6. Six Quick Action cards
  7. Upcoming Schedule header
  8. Schedule card
  9. Smart Suggestions header
  10. Two Smart Suggestion cards
  11. Bottom nav
- No QR, estimate, invoice, customer, File Vault, recovery draft, persistence, routing, state, or business logic was changed.
- No old Home sections were restored.
- No fake `+23%`, `vs last week`, fake revenue, or fake growth claims were introduced.
- No static screenshot UI, iPhone shell, status bar, dynamic island, or home indicator was added.
- No Phase 4 work was started.
- No deployment was performed.

## Phase 2B validation

- `npm run build` — passed.
- `npm test` — passed.
- Home tests now cover:
  - hero greeting and `View Insights`
  - four hero analytics bars
  - locked bar order: `Estimates`, `Invoices`, `Customers`, `Tasks`
  - values sourced from current Home stat data
  - normalized bar-height metadata
  - generated SVG line and point markers
  - line source marked as normalized bar-top points
  - four callouts mapped to the same metric categories and values
  - total active work badge
  - fake `+23%` / `vs last week` remaining absent
  - reduced-motion-safe marker
  - locked Home order ending after Smart Suggestions
- In-app browser checks passed at 390px, 402px, and 430px:
  - no horizontal overflow
  - hero copy stayed inside the hero card
  - analytics visual stayed inside the hero card
  - callouts stayed inside the analytics visual
  - four bars rendered in the correct order
  - SVG line rendered with four points
  - fake growth text did not render
  - Home order remained locked
  - Smart Suggestions remained the last Home content child
  - console error count was zero

## Known follow-up steps

- Later Home pass: Recent Activity and Recent Creations visual treatment.
- Step 7: final polish.
