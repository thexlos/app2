# Phase 1 Flow Audit

Audit date: July 7, 2026  
Scope: mobile/tablet-first prototype routing, record selection, local state changes, and honest external-service boundaries.

Status meanings:

- **Working** — the action already reached the correct screen or state.
- **Fixed** — corrected during Phase 1.
- **Placeholder with message** — the action now explains the prototype limitation and the next useful step.
- **Needs backend later** — real completion requires storage, messaging, payments, authentication, or a provider API.
- **Needs later phase** — safe local behavior exists, but complete payload restoration or a dedicated detail surface is deferred.

## Navigation and business context

| Screen/component | Action | Current and intended behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| BottomNavigation | Home | Opens `HomeScreen`; Home remains active on Setup. | Working | Five-tab mobile navigation retained. |
| BottomNavigation | Customers | Opens `CustomersScreen`; customer, lead, import, sync, export, and calendar screens keep Customers active. | Working | No sidebar added. |
| BottomNavigation | Money | Opens `MoneyScreen`; estimate/invoice builders and document views keep Money active. | Working | — |
| BottomNavigation | Create | Opens `CreateScreen`; Workshop, kits, files, templates, assets, and integrations keep Create active. | Working | — |
| BottomNavigation | Help | Opens `HelpScreen`; request, support, and guide screens keep Help active. | Working | — |
| BusinessSwitcher | Select business | Switches the global `activeBusinessProfileId`, clears selected records and task context, and returns Home. | Fixed | Selected estimate, invoice, customer, lead, template, asset, file, Workshop item, guide, Help request, and calendar context are cleared. |
| BusinessSwitcher | Switch with unsaved work | Shows Save & Switch, Switch Without Saving, and Cancel. | Working | The full selector exists on Home only. |
| AppState | Workspace writes | Customers, leads, projects, events, estimates, invoices, files, Workshop items, Help requests, templates, and activities write under the active business. | Working | Covered by automated isolation tests. |

## Home

| Screen/component | Action | Current and intended behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| HomeScreen | Setup ring / Continue setup | Opens Setup. | Working | — |
| HomeScreen | Create Estimate | Opens Estimate Builder directly. | Working | Uses active business context. |
| HomeScreen | Create Invoice | Opens Invoice Builder directly. | Working | — |
| HomeScreen | Add Customer | Opens Add Customer directly. | Working | — |
| HomeScreen | Create Post / QR / Flyer / Promotion | Opens the selected tool's Create Mode screen. | Working | Help is optional after tool selection. |
| HomeScreen | Request Help | Opens the general Help Request form. | Working | — |
| HomeScreen | My Business Kit | Opens My Business Kit. | Working | — |
| HomeScreen | Smart suggestion primary action | Opens estimate, invoice, customer, lead, Help request, Workshop item, file, calendar, sync center, kit, or Create as appropriate; then marks the suggestion Completed. | Fixed | Previously handled only estimates, invoices, and generic fallbacks. |
| HomeScreen | Later / Dismiss | Persists Snoozed or Dismissed status and removes the item from the active list. | Working | — |
| HomeScreen | Recent Activity row | Resolves exact linked records for estimates, invoices, customers, leads, Help requests, Workshop items, and files; resolves calendar and transfer center routes; otherwise opens the closest section with a notice. | Fixed | Routing logic extracted to `flowRouting.ts`. |
| HomeScreen | Calendar | Opens Calendar/Schedule. | Working | — |

## Customers, leads, projects, and calendar

| Screen/component | Action | Current and intended behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| CustomersScreen | Add or Import | Opens menu for Add Customer, Add Lead, Import Customers, and Sync Customers. | Working | — |
| CustomersScreen | Customer row / Lead row | Opens the exact selected record. | Working | — |
| CustomerDetail | Call / Text / Email | Launches the appropriate device link when contact data exists; otherwise shows a useful notice. | Fixed | Previously inert. |
| CustomerDetail | Add Note | Opens a note form and persists the note plus activity under the active business. | Fixed | Previously inert in two locations. |
| CustomerDetail | New Estimate / New Invoice | Opens the correct builder with the customer selected. | Working | — |
| CustomerDetail | Send Promo / Review Request | Opens Create Mode for Send Promotion or Review Booster. | Fixed | Previously routed only to generic Create. |
| CustomerDetail | Add File | Creates linked prototype file metadata and opens File Vault with an honest storage notice. | Fixed | No file bytes are faked. |
| CustomerDetail | Schedule Appointment | Opens Calendar with customer context. | Working | — |
| CustomerDetail | Create Job / Project | Opens a project form and saves a business-scoped project. | Fixed | Previously routed incorrectly to File Vault. |
| CustomerDetail | Request Start Here Help | Opens a Help request. | Fixed | Previously routed only to generic Help. |
| CustomerDetail | Sync / Export | Opens Sync Center or Export Center. | Working | Live providers remain placeholders. |
| CustomerDetail | Estimate / Invoice history row | Opens the exact estimate detail or selected invoice modal. | Fixed | Previously estimates opened generic Money and invoices were not clickable. |
| CustomerDetail | Project / appointment row | Opens Calendar with the related customer/project context. | Fixed | Project rows were previously static. |
| AddLeadScreen | Create Estimate after save | Opens Estimate Builder with the saved lead prefilled. | Fixed | The builder now accepts selected lead context. |
| LeadDetail | Schedule Appointment | Opens Calendar with lead context. | Working | — |
| LeadDetail | Create Estimate | Opens Estimate Builder with lead name, contact data, address, and service context. | Fixed | — |
| LeadDetail | Convert to Customer | Creates/links a customer, marks the lead converted, logs activity, and opens the customer. | Working | — |
| LeadDetail | Add Note | Persists a lead note and activity. | Fixed | — |
| LeadDetail | Add File | Creates linked prototype file metadata and opens File Vault. | Fixed | Needs real storage later. |
| LeadDetail | Archive | Updates status/archived state and returns to Customers. | Fixed | — |
| ImportWizard | Duplicate decision buttons | Select Link Existing, Update Existing, Keep Separate, or Skip. | Fixed | Previously inert. |
| ImportWizard | Google Sheets / Paste table | Clearly disabled and labeled placeholder. | Placeholder with message | Needs provider/import parsing later. |
| Calendar | Add / Save Appointment | Saves an active-business event with customer, lead, project, estimate, or invoice context and activity. | Working | — |

## Money and protected records

| Screen/component | Action | Current and intended behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| MoneyScreen | Create on Estimates / Invoices | Opens the appropriate builder. | Working | — |
| MoneyScreen | Create on Progress / Changes | Opens an accepted estimate and explains the approved-scope requirement; warns when none exists. | Fixed | Prevents a silent no-op. |
| MoneyScreen | Create on Payments | Explains that payment is recorded from an invoice in mock mode. | Fixed | — |
| MoneyScreen | Create on Templates | Opens Template Library. | Fixed | — |
| MoneyScreen | Estimate row | Opens exact Estimate Detail. | Working | — |
| MoneyScreen | Invoice row | Opens selected invoice modal. | Working | — |
| Invoice modal | Record Payment | Updates mock payment history, invoice balance/status, and activity; explicitly states no provider was charged. | Working | — |
| Paid invoice modal | Adjustment / Duplicate | Opens a separate invoice draft and preserves the paid version. | Fixed | — |
| Invoice modal | Download PDF | Shows an honest prototype placeholder. | Fixed | Needs final invoice PDF export later. |
| EstimateDetail | More actions | Expands/collapses More Options. | Fixed | Previously inert. |
| EstimateDetail | Edit accepted estimate | Forces revision, change order, or duplicate; approved version remains locked. | Working | — |
| EstimateDetail | Send to QuickBooks | Opens Connected Accounts and states that no sync occurred. | Fixed | — |
| EstimateDetail | Archive rejected estimate | Explains protected-history limitation for this phase. | Placeholder with message | Record archival belongs in Phase 2. |
| EstimateDetail | Customer / document / email previews | Opens the correct view; email buttons open approval view or official document. | Fixed | — |
| Estimate Builder | Saved footer | Applies saved footer content to the delivery document. | Fixed | Previously inert. |
| Estimate Builder | Preview-only customer controls | Clearly disabled in owner preview; PDF opens official preview. | Fixed | Removes misleading dead controls. |
| Invoice Builder | Download / copy link / record payment | Shows honest PDF placeholder, copies a mock link, or saves then routes to Money for mock payment. | Fixed | No email, payment, or download is falsely claimed. |
| OfficialDocumentScreen | Download PDF | Generates the client-side estimate PDF. | Working | — |

## Create and My Creations

| Screen/component | Action | Current and intended behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| CreateScreen | Workshop tool card | Opens Create Mode for the selected tool. | Working | Covers Post, Flyer, QR, Cards, Promotion, Review, Lead Form, Menu, Sign, Door Hanger, Event, Fix, Canva, and VistaPrint. |
| CreateModeScreen | Do It Myself | Opens the tool-specific contract builder or QR builder. | Working | — |
| CreateModeScreen | Walk Me Through It | Opens tool-specific guided fields. | Working | — |
| CreateWizard | Finish | Saves a guided session and opens the real builder with mapped answers. | Working | Full builder-payload restoration is still Phase 2 for reopened creations. |
| CreateModeScreen | Have Start Here Help | Opens service/task-specific Help Request. | Working | — |
| ContractBuilder | Save / preview / check / copy | Saves a meaningful Workshop item, preserves form state, and labels mock actions honestly. | Working | Tool-specific contracts control fields and validation. |
| ContractBuilder | External send/post actions | Records a prepared mock action without changing status to Sent/Posted. | Fixed | Prevents fake external success. |
| QR Builder | Test / create / draft | Validates links and saves QR plus Workshop item under the active business. | Working | — |
| QR Builder | Next actions | Download creates a File Vault export; Flyer/Card/Form open their exact Create Mode; Estimate/Invoice opens Money; Send opens Customers; Help is service-specific. | Fixed | Previously several actions only showed a generic message. |
| WorkshopLibrary | Open / Edit | Opens the correct builder by item type. | Working | Full saved field restoration is Phase 2 and documented. |
| WorkshopLibrary | Duplicate / Use Again | Creates a new active-business draft copy. | Working | — |
| WorkshopLibrary | Download | Creates and links a File Vault record. | Working | File contents remain prototype-only. |
| WorkshopLibrary | Save as Template | Marks the item and creates a template record. | Working | — |
| WorkshopLibrary | Post to Social | Records a prepared action and opens Connected Accounts. | Fixed | Does not claim a post occurred. |
| WorkshopLibrary | Request Help / Archive | Opens task-specific Help or updates archived state. | Working | — |
| WorkshopLibrary | Activity deep link | Opens and highlights the linked creation. | Fixed | — |

## My Business Kit, assets, and files

| Screen/component | Action | Current and intended behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| MyBusinessKit | Search result | Opens the correct asset/template/builder or gives a useful item/message result. | Working | — |
| MyBusinessKit | Pinned asset | Opens asset summary and detail. | Working | — |
| MyBusinessKit | Quick Link Copy / Test / Create QR | Copies, opens the saved URL, or starts QR Create Mode. | Fixed | Test and Edit explanation were added. |
| MyBusinessKit | Quick Link Edit | Explains that link editing is Phase 2. | Placeholder with message | Current link remains copyable/testable. |
| MyBusinessKit | QR / Template / Style / Item Bank actions | Open QR asset/builder, template detail, style editor, and item edit/delete flows. | Working | — |
| AssetDetail | Pin / Unpin | Persists pin state. | Working | — |
| AssetDetail | Download | Shows live-storage placeholder. | Working | — |
| AssetDetail | Use in builder / Help | Opens matching Create Mode or Help request. | Working | — |
| AssetDetail | Archive | Updates asset archived/pinned state and returns to My Business Kit. | Fixed | Previously only navigated away. |
| FileVault | Upload | Saves selected file metadata under the active business and clearly states storage is not connected. | Fixed | — |
| FileVault | File row | Opens file detail modal. | Fixed | Previously static. |
| FileVault | Download / Copy / Use / Help / Pin / Archive | Provides honest download notice, copies real URLs, opens Create/Help, creates/pins a business asset, or archives metadata. | Fixed | — |
| FileVault | Project row | Opens Calendar with project context. | Fixed | Previously static. |

## Help, guides, and integrations

| Screen/component | Action | Current and intended behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| HelpScreen | Start request / requests / guides | Opens general request or scrolls to the selected section. | Working | — |
| HelpScreen | Service card | Opens service detail first, including price, uploads, and next steps. | Working | — |
| HelpRequestScreen | Submit | Creates a business-scoped request, files, activity, timeline, and messages. | Working | — |
| Help submitted | View Request | Opens the exact created request. | Working | — |
| HelpRequestDetail | File Open | Explains metadata-only storage. | Fixed | — |
| HelpRequestDetail | Upload More Files | Adds selected file metadata to the request and File Vault. | Fixed | — |
| HelpRequestDetail | Add Note or Question | Persists supplied text in messages and timeline. | Fixed | Previously temporary UI text only. |
| HelpRequestDetail | Quote / approval / revision actions | Updates quote/status/payment/timeline where applicable. | Fixed | View Quote never charges or approves automatically. |
| HelpRequestDetail | Save to Kit / Vault / Use in Create | Creates linked local prototype records and routes to the destination. | Working | — |
| MonthlySupport | Request plan | Creates and opens a request for the selected plan. | Working | — |
| HelpGuide | Guide card / related action / request help | Opens full guide, correct related surface, or related Help service. | Working | — |
| IntegrationCenter | Import / Export / QuickBooks queue | Opens real prototype centers. | Working | — |
| IntegrationCenter | Connection Details / Demo Status | Updates local review state/activity and explains credentials/provider setup. | Fixed | Disabled dead controls removed. |
| IntegrationCenter | Read integration plan | Shows the active-business integration boundary. | Fixed | — |

## Intentional later work

| Area | Current safe behavior | Status | Why deferred |
| --- | --- | --- | --- |
| Real file upload/download | Stores metadata, record links, and activity; never claims bytes are stored. | Needs backend later | Requires object storage, signed URLs, retention, and access control. |
| Email/SMS/social sending | Saves/prepares drafts and routes to Connected Accounts. | Needs backend later | Requires provider credentials, consent, delivery status, and error handling. |
| QuickBooks and other account sync | Uses mock review/import/export queues and explicit connection notices. | Needs backend later | Requires OAuth, mappings, conflict policy, and audit logging. |
| Payment collection | Records local mock payment history only. | Needs backend later | Requires payment provider, authorization, reconciliation, and receipts. |
| Reopen exact Workshop builder payload | Opens the correct tool and preserves item identity/highlight. | Needs later phase | Requires a versioned saved-payload contract for each builder. |
| Dedicated project/change-order/progress detail screens | Routes to the closest protected Money or Calendar surface. | Needs later phase | Phase 1 avoids rebuilding the money engine. |
| Browser-refresh persistence | In-session business isolation is complete. | Needs backend later | Durable persistence/authentication is intentionally outside Phase 1. |

