# App Flow

## Main navigation

1. **Home** — current business, setup, attention items, summary, common actions, activity, kits, and help.
2. **Customers** — search/filter, customer detail, tags, history, projects, files, and contextual actions.
3. **Money** — estimates, invoices, progress invoices, change orders, payments, templates, and sync status.
4. **Create** — posts, flyers, QR codes, cards, promotions, review tools, lead forms, fixes, kits, and files. After selecting a task: Do It Myself → builder; Walk Me Through It → guided wizard; Have Start Here Help → support request.
5. **Help** — Start Here service requests, existing projects, quotes, uploaded files, monthly support, guides, and Helper Access. It is not the DIY mode selector.

## Active business context

Home owns the full business profile selector. A selection sets `activeBusinessProfileId` for the whole app until the user switches again. Other pages may show a small read-only “Working in …” label, but never a second full selector. Every list, creation, template, file, connection, sync setting, import/export entry, and save is scoped to this ID. Switching with unsaved work requires Save & Switch, Switch Without Saving, or Cancel.

## Reuse flows

- Lead → customer → estimate → accepted estimate → progress/final invoice.
- Accepted estimate + changed scope → tracked change order; accepted version remains locked.
- QR code → flyer, business card, estimate, invoice, post, or lead form.
- Flyer → send, post, download, print-check, or hand off.
- Customer → estimates, invoices, promos, reviews, files, and project history.
- Spreadsheet → Import Wizard → field mapping → duplicate review → business-owned records.
- Business record → Sync Center → ready queue → duplicate/conflict decision → mock sync result.
- Customer/lead/project/estimate/invoice → Calendar → related appointment with reminder.
- Builder contract → one-question guided session → prefilled real builder → saved creation marked Guided Wizard.

## Customer approval

1. Business sends a signed, expiring public link.
2. Customer views only allowed fields/files; no account is required.
3. Customer approves, rejects, or requests changes.
4. Reject/Request Changes requires a note.
5. Response saves a version snapshot and activity event.
6. Accepted content locks; future work becomes revision, change order, duplicate, or new document.

## Estimate and invoice delivery views

1. **Builder View** is internal and may contain private costs, profit, supplier notes, visibility settings, and mapping controls.
2. **Client Approval View** is a clean account-free summary with response controls and links to the full document.
3. **Official Document** is the itemized, customizable PDF/print version preserved in version history.
4. The short email message is separately previewed and customized; its review button opens Client Approval View.

## Create Estimate

Create Estimate belongs to Money, not Workshop. Home, Money, and Customer Detail open a dedicated five-step builder: Customer → Project → Items → Notes & Terms → Preview & Send. Phone layouts use stacked cards and a sticky total; tablets add a sticky summary rail. Saving or sending creates a version. Accepted versions cannot be edited in place and instead offer revision, change order, or duplicate flows.

## Helper Access

1. User chooses a project and help type.
2. User uploads files/screenshots, pastes share links, and provides notes.
3. User grants only required project permissions.
4. Start Here reviews; larger work receives a quote before work/payment.
5. All changes and approvals remain in project history.
