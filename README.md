# Start Here Helper

Start Here Helper is a mobile-first workshop for small businesses: customers, estimates, invoices, progress billing, change orders, flyers, QR codes, posts, business kits, and practical help in one place.

> Make it once. Use it anywhere.

This repository is the first-pass product foundation. It uses local mock data and explicit placeholder services. **QuickBooks, Facebook, Instagram, Google Business Profile, Canva, payments, email, and SMS are not live.**

## Run locally

Requirements: current Node.js LTS and npm.

```powershell
cd "C:\Users\Owner\Documents\APP V1 START HERE SUPPORT\StartHereHelper"
npm install
npm run dev
```

Open the local URL shown in the terminal (normally `http://localhost:5173`).

Verification commands:

```powershell
npm test
npm run build
```

## What works in this foundation

- Executable contracts for all 56 major screens and all 13 dedicated Create/Workshop builders.
- A destination-based QR builder with saved business links, contact cards, lead forms, validation, QR preview, and post-creation actions.
- Business-scoped My Creations library with realistic seed items, filters, search, sorting, duplicate/reuse, template, help, and archive actions.
- Dedicated five-step Estimate Builder owned by Money, with section/item cards, live totals, approval settings, customer preview, professional document preview, protected versions, and multi-page PDF export.
- My Business Kit home base with separate Item & Service Bank, document templates, message templates, Workshop Library, File Vault, and print/reorder references.
- Business-scoped item snapshots and editable official-document columns so later Item Bank changes do not rewrite saved estimates.
- Accepted-scope billing validation foundation for progress invoices and approved change orders.
- App-first phone/tablet shell with Home, Customers, Money, Create, and Help fixed bottom navigation at every browser width. The desktop sidebar is intentionally deferred.
- Five isolated mock business workspaces. Home owns the full selector; the selected `activeBusinessProfileId` remains global until changed, and an unsaved-work guard protects switches.
- Cross-industry starter library that saves copy-safe items into the active business's Item & Service Bank.
- Home setup progress, at-a-glance summary, focused quick actions, alerts, Business Kits, and activity history.
- Customer list, filters, search, reusable customer detail, tags, notes, and related money history.
- Separate lead records, lead-to-customer conversion, a six-step Excel/CSV import wizard, export history, sync queues, duplicate/conflict review, and a business-scoped calendar.
- Estimates, invoices, progress invoices, and change orders.
- Accepted-estimate lock, version history, revision/change-order/duplicate choices, internal-only notes, and customer-view preview.
- Account-free customer approval route using `#/approve/<mock-token>`. Reject and Request Changes require notes.
- Separate Builder View, Client Approval View, email preview, and Official Document route using `#/document/<mock-token>`.
- Real client-side PDF generation for the official estimate document; the PDF library loads only when requested.
- Business Kit preview and add-without-overwrite behavior.
- Cross-industry starter blueprints and a Global Starter Library with safe duplicate choices: Keep Both, Replace Existing, Skip, or Rename New Item.
- Config-driven guided sessions that ask one question at a time, preserve answers, and open the real editable builder.
- Separate estimate/invoice template records, reusable document parts, and a section-specific document style editor.
- Create/Workshop task routing: Do It Myself opens the builder, Walk Me Through It opens the guided wizard, and only Have Start Here Help opens a support request.
- Support-only Help tab with service cards, current projects, quotes/statuses, monthly support, guides, and Helper Access.
- Mock-only integration center and service interfaces.

Mock data resets when the page reloads. Production persistence and authentication are intentionally deferred.

## Project map

- `src/app`: application composition
- `src/screens`: first-pass product screens
- `src/components`: reusable UI and navigation
- `src/design-system`: tokens and shared styles
- `src/data/mock`: five isolated business workspaces
- `src/config`: editable mock settings such as service pricing
- `src/services`: integration and export placeholders
- `src/lib`: protected-record rules
- `src/state`: local application state and mock actions
- `src/types`: domain interfaces
- `src/assets/placeholders`: design concepts and placeholders
- `database`: schema planning
- `docs`: product, flow, model, design, scope, integration, and roadmap documentation
- `tests`: behavior-focused tests

## Documents

- [Product brief](docs/PRODUCT_BRIEF.md)
- [App flow](docs/APP_FLOW.md)
- [Data model](docs/DATA_MODEL.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Integration plan](docs/INTEGRATION_PLAN.md)
- [MVP scope](docs/MVP_SCOPE.md)
- [Roadmap](docs/ROADMAP.md)
- [Protected records rules](docs/PROTECTED_RECORDS_RULES.md)
- [Screen contracts](docs/SCREEN_CONTRACTS.md)
- [Five-layer correction audit](docs/FIVE_LAYER_CORRECTION_AUDIT.md)

## Next recommended build step

Add the real backend foundation before any provider integration: authentication, business membership/roles, PostgreSQL persistence, immutable version snapshots, signed public approval links, file storage with scanning, and audit logging. Once those boundaries are tested, connect one provider at a time—QuickBooks read-only import first is the safest candidate.

