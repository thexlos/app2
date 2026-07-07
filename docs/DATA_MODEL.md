# Data Model

`BusinessProfile` is the tenant boundary. Every business-owned table carries `business_id`; queries must require it. The UI’s global `activeBusinessProfileId` selects exactly one mock `BusinessWorkspaceData` at a time and automatically stamps new business-owned records with that ID.

Connections, sync settings, import/export history, document numbers, templates, files, Help requests, calendar entries, Workshop creations, and My Business Kit assets are tenant-owned records. Global starter-library rows are read-only seeds; using one creates a business-owned copy and never changes the global source.

## Identity and tenancy

- User, BusinessProfile, BusinessMembership, BrandKit
- HelperAccessGrant with project scope, permissions, expiry, revocation, and audit history

## Customer and work

- Customer, CustomerTag, Lead, LeadForm, ProjectJob
- Estimate, EstimateSection, EstimateLineItem, EstimateTerms, ApprovalSettings, EstimateVersion
- Invoice, InvoiceVersion, InvoicePayment
- ProgressInvoice, ChangeOrder

## Create and files

- QRCodeRecord, Promo, SocialPost, FlyerDesign, BusinessCardDesign, Template
- BusinessKit, AppliedBusinessKit
- FileAsset with business, project, visibility, scan status, and storage key

## Help and integrations

- HelpRequest, HelpQuote, HelperAccessGrant
- IntegrationConnection, QuickBooksSyncRecord
- ImportHistoryRecord, ExportHistoryRecord, SyncMetadata
- CalendarEvent and GuidedWizardSession
- ActivityLogItem, SmartSuggestion, Notification, SetupTask

Customers, leads, projects, estimates, invoices, payments, files, item-bank rows, templates, and connected-account records may carry sync metadata. Sync metadata tracks provider, external ID, local and remote edit times, sync status, conflict status, and last exported time without pretending a provider is connected.

## Protected records

The mutable document points to a current version. `EstimateDeliverySettings` keeps email/client controls separate from the official document configuration. Every send/response/protected transition stores an append-only version with totals, actor, timestamp, customer response, change summary, exact client-view data, and immutable official PDF/object snapshot reference. Production enforcement belongs in database transactions and service authorization—not only the UI.

The Estimate Builder stores customer/project identity, ordered sections, card-based line items, visibility flags, internal-only fields, numbered document notes, approval controls, calculated subtotal/discount/tax/total, source template/kit references, export links, and QuickBooks placeholder status. Version snapshots copy sections, terms, approval settings, client-view data, and the official-document reference.

## My Business Kit

Each business workspace owns its own `BusinessHomeKit`, `ItemServiceBankItem`, `DocumentTemplate`, message template, print/reorder, Workshop Library, and File Vault records. Starter Kits may add records, but they do not replace My Business Kit.

When a saved item or service is added to an estimate, the estimate stores both the source bank ID and an exact item snapshot. Editing the bank later does not silently change an existing document.

Document templates configure the official downloadable document independently from the internal Builder View and Client Approval View. Internal costs, profit, supplier notes, and sync mappings default to hidden.

`DocumentStyleTemplate` stores business-owned page, header, independent info-box, table, column, row, section-row, totals, notes, terms, payment, change-order-policy, footer, QR, and signature styles. `ColumnStyleBlock` keeps per-column width, header/body colors, font, size, weight, alignment, border, and Builder/Customer/PDF/internal visibility. Internal-only columns are forced out of customer and PDF views.

Accepted-scope billing uses the accepted estimate version plus accepted change orders, less invoices already created. Attempts to invoice outside that scope require a change order or adjustment first.

See `database/schema-plan.sql` for relational constraints and indexes.
