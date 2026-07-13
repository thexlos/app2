# Phase 2 + 3 Cleanup Report

## Status

Implemented locally for the Phase 2 + 3 cleanup scope.

## Scope guardrails followed

- Did not start Phase 4.
- Did not add backend, auth, login, payments, or live integrations.
- Kept localStorage persistence, saved builder payloads, and the real QR generator.
- Kept all live-account features as honest placeholders.

## Download behavior corrected

- QR Builder downloads now trigger a real browser/device download.
- The QR Builder no longer uses a hidden File Vault checkbox.
- After Create QR Code, the app shows “Save a copy to File Vault?” with Yes/No choices.
- After QR PNG/SVG/PDF download, the app shows “Also save this downloaded file to File Vault?” with Save Copy / No thanks choices.
- File Vault copies are only created after the user explicitly chooses to save a copy.
- My Business Kit QR actions now separate:
  - Download PNG
  - Download SVG
  - Save Copy
- PDF sign download uses a generic data URL download helper.
- Metadata-only workshop exports no longer change the creation status to “Downloaded”.
- Flyer, business card, and other workshop export references now use an explicit Save Copy to File Vault prompt where real file generation is not connected yet.
- Metadata-only records now explain that real storage/file bytes are not connected.

## Auto-save / recovery draft behavior

- Create builders now keep auto-save recovery drafts separate from File Vault.
- Recovery drafts are stored in localStorage under `startHereHelper.recoveryDrafts`.
- Recovery drafts store builder id, source tool, selected task, active business id, selected workshop item id when editing, form values, updated time, and `Recoverable Draft` status.
- Fresh builders still open blank.
- Auto-save begins only after meaningful user input.
- Auto-save does not create File Vault metadata.
- Auto-save does not mark anything downloaded, sent, posted, or ready.
- Recovery drafts can be continued, saved as My Creations drafts, or discarded from My Creations.
- Discarding a recovery draft does not delete official saved WorkshopItems.
- Manual Save Draft converts/updates the normal My Creations draft and clears the temporary recovery draft.

## My Creations vs File Vault

- My Creations stores editable projects and creations automatically.
- My Business Kit stores reusable business assets like saved QR records.
- File Vault stores chosen files, exports, links, uploads, and references.
- File Vault is not the automatic home for every generated item or unfinished draft.

## Recoverable draft vs saved draft

- A recoverable draft protects in-progress form values after refresh, browser close, app close, or accidental navigation.
- A saved draft is a normal editable WorkshopItem visible in My Creations.
- A File Vault copy is optional file/reference storage created only by explicit user choice.

## File Vault organization added

- Summary cards:
  - Active files
  - Generated exports
  - Metadata only
  - Customer visible
  - Archived
- Filters:
  - All
  - Logos & Brand
  - QR Codes
  - Flyers & Posts
  - Business Cards
  - Print Files
  - Estimates & Invoices
  - Customer Files
  - Project Files
  - Help Request Files
  - Canva / VistaPrint
  - Uploads
  - Generated Exports
  - Metadata Only
  - Archived
- File cards now show status, visibility, type, linked records, and saved date.
- Detail modal now shows storage status, previews when generated content exists, download/open/copy actions, use in Create, attach to help request, pin to kit, visibility toggle, and archive.

## Sample data behavior corrected

- Fresh Workshop builders now open blank.
- Guided wizard field defaults no longer come from sample mock data.
- Saved creations and guided drafts still restore their saved values.
- “Load Example” explicitly loads the builder’s sample mock data.

## QR controls corrected

- The QR logo option is labeled “Show logo/initials in preview only”.
- Exported QR files do not claim embedded logos.
- Advanced QR placeholders remain behind More Options.
- Download success messages distinguish device download from optional File Vault copy.

## Tests added or expanded

- Builder opens blank until “Load Example” is clicked.
- Recovery drafts auto-save after meaningful flyer input.
- Blank opened builders do not create recovery drafts.
- Recovery drafts survive localStorage reload.
- Recovery drafts can restore flyer and QR fields.
- Recovery drafts can be discarded.
- Manual Save Draft clears the related recovery draft.
- QR recovery drafts do not create File Vault records.
- File Vault helpers categorize generated QR files and metadata-only exports.
- File Vault helper identifies downloadability correctly.
- Download data URL helper triggers the browser anchor download path.

## Validation result

Passed:

```text
npm run build
npm test
```

Build completed with the existing Vite chunk-size warning only. Tests passed:

```text
9 test files passed
46 tests passed
```

Commit and push to `main` with:

```text
Phase 2 and 3 cleanup downloads file vault and sample data
```
