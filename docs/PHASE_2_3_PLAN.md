# Phase 2 + 3 Plan — Local Persistence, Saved Creations, Real QR Generation

## Scope

This phase keeps the existing Phase 1 app flow and adds local prototype durability:

- Browser `localStorage` persistence for business workspaces and active business context.
- Versioned builder payloads for My Creations so saved drafts reopen with the user's actual fields.
- Real in-browser QR generation, previews, downloads, and File Vault metadata.

No backend, authentication, real integrations, payments, social posting, file storage, or account syncing are added in this phase.

## Local persistence approach

The app will load persisted state in `AppStateProvider` during initial state setup. If persisted state is valid, it becomes the app's starting workspace state. If storage is missing, corrupt, wrong-version, or structurally invalid, the app falls back to `initialWorkspaces`.

Saves happen automatically when either `workspaces` or `currentBusinessId` changes.

## Storage keys

- `startHereHelper.storageVersion`
- `startHereHelper.activeBusinessProfileId`
- `startHereHelper.workspaces`

## Storage version

- `APP_STORAGE_VERSION = 1`

## Migration strategy

`migrateStoredAppState(raw)` validates high-level storage shape and returns normalized state for the current version. Version 1 has no historical migrations yet. Missing business workspaces are merged from `initialWorkspaces`. Invalid active business IDs fall back to the first configured business profile.

If migration fails, the app uses mock seed data without crashing.

## Persisted data

The persisted workspace object includes customers, leads, projects/jobs, calendar events, estimates, invoices, progress invoices, change orders, payments inside invoices, item bank, templates, document templates, document styles, QR codes, workshop items, business assets, File Vault metadata, help requests, setup tasks, suggestion statuses, recent activity, import/export history, integration mock statuses, business home kit state, and guided wizard sessions.

## Data not persisted

The app does not persist real credentials, OAuth tokens, passwords, private secrets, actual uploaded file bytes, huge generated binaries, `node_modules`, `dist`, or `tmp`.

Small QR SVG strings and compact PNG data URLs may be persisted so QR previews reopen without a backend. Large generated files should be regenerated from the saved QR payload later.

## Saved builder payload design

Every saved Workshop item will normalize to include:

- `builderId`
- `sourceTool`
- `builderData`
- `previewData`
- linked customer/lead/project/estimate/invoice IDs
- linked QR/file/social IDs
- `exportHistory`
- versioning and activity history fields

Save Draft updates an existing selected draft instead of creating a duplicate. Duplicate and Use Again copy payloads into a new draft without mutating the original.

## QR generation package choice

This phase uses the `qrcode` npm package with `@types/qrcode`. It is browser-safe for Vite and supports SVG and PNG data URL generation without adding a heavy PDF package.

## QR download approach

QR SVG and PNG downloads are generated in the browser from the saved payload. Downloads trigger a real browser download and then create File Vault metadata linked to the QR and Workshop item.

PDF sign generation is deferred unless it can be done cleanly without adding a large dependency. A printable-sign path may be added as honest prototype behavior.

## Known limitations

- Storage is local to the browser and device.
- File Vault still stores metadata and small generated content only, not cloud files.
- Integrations remain placeholders.
- QR scan counts are mock counters until a backend redirect/tracking service exists.
- PDF sign export may remain a documented later phase if it would add unnecessary package weight.
