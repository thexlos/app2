export interface ScreenContract {
  screenId: string;
  screenName: string;
  purpose: string;
  primaryUserGoal: string;
  simpleModeBehavior: string;
  mainSections: string[];
  primaryActions: string[];
  secondaryActions: string[];
  emptyState: string;
  validationRules: string[];
  routingRules: string[];
  relatedData: string[];
  nextActions: string[];
  whatShouldNotAppear: string[];
  mobileLayoutRules: string[];
  tabletLayoutRules: string[];
  futureDesktopNotes: string;
}

type ScreenSeed = Pick<
  ScreenContract,
  | "screenId"
  | "screenName"
  | "purpose"
  | "primaryUserGoal"
  | "mainSections"
  | "primaryActions"
> &
  Partial<
    Omit<
      ScreenContract,
      | "screenId"
      | "screenName"
      | "purpose"
      | "primaryUserGoal"
      | "mainSections"
      | "primaryActions"
    >
  >;

const makeScreen = (seed: ScreenSeed): ScreenContract => ({
  simpleModeBehavior:
    "Show essential actions and fields first; keep advanced controls under More Options.",
  secondaryActions: [],
  emptyState: "Explain what belongs here and show one clear action to begin.",
  validationRules: [
    "Use plain-language inline validation before allowing a protected or external action.",
  ],
  routingRules: [
    "Back returns to the owning tab or prior detail screen without opening Help automatically.",
  ],
  relatedData: [],
  nextActions: seed.primaryActions,
  whatShouldNotAppear: [
    "Desktop sidebar",
    "Dense desktop tables",
    "Unrelated builder fields",
    "Unmarked live integration claims",
  ],
  mobileLayoutRules: [
    "Single-column content",
    "Full-width cards",
    "Large touch targets",
    "No horizontal page scroll",
  ],
  tabletLayoutRules: [
    "Use two or three columns only when it improves scanning",
    "Keep fixed bottom navigation",
    "No desktop sidebar",
  ],
  futureDesktopNotes:
    "A separate DesktopShell may be designed later; do not reuse it in the app shell.",
  ...seed,
});

export const screenContracts: ScreenContract[] = [
  makeScreen({
    screenId: "app-shell",
    screenName: "App Shell",
    purpose:
      "Wrap the mobile/tablet app with persistent navigation and business context.",
    primaryUserGoal:
      "Move between the five main areas without losing business context.",
    mainSections: [
      "Top header",
      "Read-only active business context where useful",
      "Scrollable content",
      "Fixed bottom navigation",
    ],
    primaryActions: ["Home", "Customers", "Money", "Create", "Help"],
    routingRules: ["The full business selector appears on Home only."],
    whatShouldNotAppear: [
      "Full business dropdown outside Home",
      "Left sidebar",
      "Desktop admin shell",
      "Horizontal page scroll",
    ],
  }),
  makeScreen({
    screenId: "home",
    screenName: "Home",
    purpose: "Show what needs attention and the fastest ways to begin work.",
    primaryUserGoal: "Understand today and start a common task.",
    mainSections: [
      "Greeting",
      "Setup progress",
      "Today summary",
      "Important alert",
      "Quick actions",
      "Business Kits",
      "Suggestions",
      "Recent activity",
    ],
    primaryActions: [
      "Continue Setup",
      "Create Estimate",
      "Create Invoice",
      "Add Customer",
      "Create Post",
      "Create QR Code",
      "Make Flyer",
      "Request Help",
    ],
    relatedData: [
      "Dashboard metrics",
      "Activity",
      "Suggestions",
      "Setup tasks",
    ],
  }),
  makeScreen({
    screenId: "business-profile-switcher",
    screenName: "Business Profile Switcher",
    purpose: "Switch between fully separated business workspaces.",
    primaryUserGoal: "Work in the correct business without mixing records.",
    mainSections: [
      "Current business",
      "Business list",
      "Unsaved changes warning",
    ],
    primaryActions: [
      "Switch business",
      "Save & Switch",
      "Switch Without Saving",
      "Cancel",
    ],
    validationRules: [
      "Warn before switching when the current screen has unsaved changes.",
    ],
    relatedData: ["Business profiles", "Workspace data"],
    nextActions: ["Open selected business Home"],
  }),
  makeScreen({
    screenId: "setup-checklist",
    screenName: "Setup Checklist",
    purpose: "Guide first-time setup without overwhelming the user.",
    primaryUserGoal: "Make the active business ready for daily work.",
    mainSections: ["Progress", "Essential checklist", "Optional integrations"],
    primaryActions: ["Continue Setup", "Skip for Now", "Add Later"],
    relatedData: [
      "Business profile",
      "Brand kit",
      "Setup tasks",
      "Integration statuses",
    ],
  }),
  makeScreen({
    screenId: "customers-list",
    screenName: "Customers List",
    purpose: "Track reusable customer records.",
    primaryUserGoal: "Find, filter, open, or add a customer.",
    mainSections: ["Search", "Filter chips", "Customer cards", "Add customer"],
    primaryActions: ["Add Customer", "Open Customer"],
    relatedData: ["Customers", "Leads", "Tags", "Balances"],
  }),
  makeScreen({
    screenId: "customer-detail",
    screenName: "Customer Detail",
    purpose: "Connect one customer to every relevant record and workflow.",
    primaryUserGoal: "See the complete relationship and take the next action.",
    mainSections: [
      "Contact summary",
      "Tags",
      "Quick actions",
      "Notes",
      "Estimates",
      "Invoices",
      "Projects",
      "Files",
      "Promos",
      "Reviews",
      "Lead history",
      "Help requests",
      "Activity",
    ],
    primaryActions: [
      "Call",
      "Text",
      "Email",
      "New Estimate",
      "New Invoice",
      "Send Promo",
      "Send Review Request",
      "Add Note",
      "Add File",
      "Create Job",
      "Request Help",
    ],
    relatedData: ["Customer", "Money records", "Projects", "Files", "Activity"],
  }),
  makeScreen({
    screenId: "customer-send-center",
    screenName: "Customer Send Center",
    purpose: "Prepare materials for customer groups.",
    primaryUserGoal:
      "Choose recipients and prepare a reusable message or document.",
    mainSections: [
      "Material type",
      "Recipient group",
      "Message preview",
      "Send status",
    ],
    primaryActions: [
      "Copy Message",
      "Export List",
      "Save Draft",
      "Mark as Sent",
    ],
    validationRules: ["Require material and recipients before marking sent."],
    relatedData: ["Customers", "Tags", "Promos", "Documents"],
  }),
  makeScreen({
    screenId: "money-dashboard",
    screenName: "Money Dashboard",
    purpose:
      "Summarize estimates, invoices, payments, progress billing, and changes.",
    primaryUserGoal: "Find a money record or start a money task.",
    mainSections: [
      "Summary cards",
      "Segmented tabs",
      "Record cards",
      "QuickBooks placeholder",
    ],
    primaryActions: ["Create", "Open Record", "Change Tab"],
    relatedData: [
      "Estimates",
      "Invoices",
      "Payments",
      "Progress invoices",
      "Change orders",
    ],
  }),
  makeScreen({
    screenId: "estimate-list",
    screenName: "Estimate List",
    purpose: "Find and manage estimate records.",
    primaryUserGoal: "Open an estimate or create a new one.",
    mainSections: ["Status filters", "Estimate cards", "Protected status"],
    primaryActions: ["Create Estimate", "Open Estimate"],
    relatedData: ["Estimates", "Customers", "Versions"],
  }),
  makeScreen({
    screenId: "estimate-builder",
    screenName: "Estimate Builder",
    purpose: "Create customizable estimates with protected approvals.",
    primaryUserGoal: "Build, preview, and send an estimate for approval.",
    mainSections: [
      "Customer/project",
      "Sections and items",
      "Notes and terms",
      "More Options",
      "Client preview",
      "Document preview",
    ],
    primaryActions: [
      "Save Draft",
      "Preview Customer View",
      "Preview Document",
      "Send for Approval",
      "Save as Template",
    ],
    validationRules: [
      "Require customer and at least one item before sending.",
      "Accepted estimates are locked.",
    ],
    relatedData: ["Estimate", "Customer", "Versions", "Delivery settings"],
  }),
  makeScreen({
    screenId: "client-approval-view",
    screenName: "Client Approval View",
    purpose: "Provide an account-free customer approval page.",
    primaryUserGoal: "Review, download, approve, reject, or request changes.",
    mainSections: [
      "Business identity",
      "Estimate summary",
      "Large total",
      "Message",
      "Document actions",
      "Approval actions",
      "Notes",
    ],
    primaryActions: [
      "Review Full Document",
      "Download PDF",
      "Approve",
      "Reject",
      "Request Changes",
    ],
    validationRules: [
      "Approval requires customer name and terms checkbox.",
      "Reject and changes require notes.",
    ],
    relatedData: [
      "Protected estimate version",
      "Client snapshot",
      "Customer action",
    ],
  }),
  makeScreen({
    screenId: "official-document-preview",
    screenName: "Official Downloadable Document Preview",
    purpose:
      "Show the exact professional document that is preserved and downloaded.",
    primaryUserGoal: "Review or download the official estimate/invoice.",
    mainSections: [
      "Header",
      "Parties",
      "Project",
      "Sections/items",
      "Notes",
      "Terms",
      "Final total",
      "Signature",
      "Footer",
    ],
    primaryActions: ["Download PDF", "Print"],
    relatedData: ["Official document snapshot", "Estimate/invoice version"],
  }),
  makeScreen({
    screenId: "invoice-list",
    screenName: "Invoice List",
    purpose: "Find invoices and understand payment status.",
    primaryUserGoal: "Open an invoice or start billing.",
    mainSections: ["Status filters", "Invoice cards", "Payment summaries"],
    primaryActions: ["Create Invoice", "Open Invoice"],
    relatedData: ["Invoices", "Customers", "Payments"],
  }),
  makeScreen({
    screenId: "invoice-builder",
    screenName: "Invoice Builder",
    purpose: "Create and send invoices with protected paid totals.",
    primaryUserGoal: "Prepare an invoice and collect or record payment.",
    mainSections: [
      "Customer",
      "Items",
      "Due date",
      "Payment instructions",
      "Notes",
      "More Options",
      "Previews",
    ],
    primaryActions: [
      "Save Draft",
      "Preview Customer View",
      "Preview PDF",
      "Send Invoice",
      "Record Payment",
      "Download PDF",
    ],
    validationRules: [
      "Require customer, item, and due date before sending.",
      "Paid totals require an adjustment or duplicate.",
    ],
    relatedData: ["Invoice", "Customer", "Payments", "Accepted estimate"],
  }),
  makeScreen({
    screenId: "progress-invoice-builder",
    screenName: "Progress Invoice Builder",
    purpose:
      "Bill approved work by deposit, phase, completed items, or amount.",
    primaryUserGoal: "Create the next valid partial invoice.",
    mainSections: [
      "Accepted estimate",
      "Approved changes",
      "Project value",
      "Already invoiced",
      "Paid",
      "Remaining",
      "Billing method",
    ],
    primaryActions: [
      "Create Deposit Invoice",
      "Create Phase Invoice",
      "Create Final Invoice",
      "Record Payment",
      "Download PDF",
    ],
    relatedData: [
      "Accepted estimate",
      "Change orders",
      "Progress invoices",
      "Payments",
    ],
  }),
  makeScreen({
    screenId: "change-order-builder",
    screenName: "Change Order Builder",
    purpose: "Track and approve changes after estimate acceptance.",
    primaryUserGoal:
      "Document a project change without altering the accepted estimate.",
    mainSections: [
      "Reason",
      "Added/removed work",
      "Amount",
      "Completion date",
      "Internal notes",
      "Customer message",
    ],
    primaryActions: ["Save Draft", "Send for Approval", "Preview"],
    validationRules: [
      "Customer approval is required before changing project total.",
    ],
    relatedData: ["Accepted estimate", "Change order", "Versions"],
  }),
  makeScreen({
    screenId: "payments",
    screenName: "Payments",
    purpose: "Record and review invoice payments.",
    primaryUserGoal: "See payment history or record a payment.",
    mainSections: ["Payment summary", "Payment history", "Record payment"],
    primaryActions: ["Record Payment", "Open Invoice"],
    validationRules: [
      "Amount must be greater than zero and cannot exceed the remaining balance.",
    ],
    relatedData: ["Invoices", "Payments"],
  }),
  makeScreen({
    screenId: "templates",
    screenName: "Templates",
    purpose: "Manage reusable business document and message templates.",
    primaryUserGoal: "Start from or manage a saved template.",
    mainSections: ["Template categories", "Template cards"],
    primaryActions: ["Use Template", "Create Template", "Duplicate"],
    relatedData: ["Templates", "Business Kits"],
  }),
  makeScreen({
    screenId: "business-kits",
    screenName: "Business Kits",
    purpose: "Add an industry starter setup without overwriting data.",
    primaryUserGoal: "Preview and apply selected starter items.",
    mainSections: [
      "Kit list",
      "Kit preview",
      "Selectable sections",
      "Safety summary",
    ],
    primaryActions: ["Preview Kit", "Apply Selected Items"],
    validationRules: [
      "Never overwrite existing data without explicit confirmation.",
    ],
    relatedData: [
      "Business Kits",
      "Templates",
      "Forms",
      "QR codes",
      "Tags",
      "Folders",
    ],
  }),
  makeScreen({
    screenId: "my-business-kit",
    screenName: "My Business Kit",
    purpose:
      "Provide one business-specific home base for reusable settings and assets.",
    primaryUserGoal: "Find and reuse saved business tools.",
    mainSections: [
      "Brand kit",
      "Item & Service Bank",
      "Document Template Library",
      "Workshop Library",
      "File Vault",
      "Print & Reorder",
      "Message templates",
    ],
    primaryActions: ["Use Template", "Open Library", "Open File Vault"],
    relatedData: [
      "Business profile",
      "Items",
      "Document templates",
      "Workshop items",
      "Files",
    ],
  }),
  makeScreen({
    screenId: "global-starter-library",
    screenName: "Search All Options",
    purpose:
      "Offer copy-safe starter items across industries without mixing business data.",
    primaryUserGoal:
      "Find a useful starter item and save a business-owned copy.",
    mainSections: ["Search", "Type filter", "Cross-industry starter results"],
    primaryActions: ["Save to My Business Kit", "Use Only This Time"],
    validationRules: [
      "Saving creates a copy under activeBusinessProfileId.",
      "Global starters never overwrite business-owned records.",
    ],
    relatedData: ["Global starter library", "Item & Service Bank"],
  }),
  makeScreen({
    screenId: "create-workshop-hub",
    screenName: "Create / Workshop Hub",
    purpose: "Start creative and customer communication tasks.",
    primaryUserGoal: "Choose what to make.",
    mainSections: [
      "Create Post",
      "Workshop tools",
      "Business Kits",
      "File Vault",
      "Connected Accounts",
      "Walkthrough",
    ],
    primaryActions: ["Select Tool"],
    routingRules: ["Every tool opens Mode Selector first."],
    relatedData: ["Builder contracts"],
  }),
  makeScreen({
    screenId: "mode-selector",
    screenName: "Mode Selector",
    purpose: "Choose DIY, guided, or Start Here help after selecting a tool.",
    primaryUserGoal: "Choose the preferred level of assistance.",
    mainSections: ["Selected task", "Three mode choices"],
    primaryActions: [
      "Do It Myself",
      "Walk Me Through It",
      "Have Start Here Help",
    ],
    routingRules: [
      "DIY opens the selected builder.",
      "Walkthrough opens its guided wizard.",
      "Only Start Here Help opens a help request.",
    ],
    whatShouldNotAppear: [
      "Help Home content",
      "Unrelated task fields",
      "Forced help form",
    ],
  }),
  ...[
    ["qr-code-builder", "QR Code Builder"],
    ["flyer-builder", "Flyer Builder"],
    ["social-post-builder", "Social Post Builder"],
    ["business-card-builder", "Business Card Builder"],
    ["send-promotion-builder", "Send Promotion Builder"],
    ["review-booster-builder", "Review Booster Builder"],
    ["lead-form-builder", "Lead Form Builder"],
    ["menu-price-sheet-builder", "Menu / Price Sheet Builder"],
    ["sign-door-hanger-builder", "Yard Sign / Door Hanger Builder"],
    ["event-promo-builder", "Event Promo Builder"],
    ["fix-something-flow", "Fix Something Flow"],
    ["canva-help-flow", "Canva Help Flow"],
    ["vistaprint-print-setup-flow", "VistaPrint / Print Setup Flow"],
  ].map(([screenId, screenName]) =>
    makeScreen({
      screenId,
      screenName,
      purpose: `Run the dedicated ${screenName} contract without fields from another tool.`,
      primaryUserGoal: "Complete the selected task in Simple Mode.",
      mainSections: [
        "Title and purpose",
        "Simple Mode fields",
        "More Options",
        "Purpose-specific preview",
        "Primary actions",
        "Next actions",
      ],
      primaryActions: ["Use builder contract actions"],
      relatedData: ["Builder contract", "Active business workspace"],
      routingRules: [
        "DIY opens this builder.",
        "Optional help opens a preselected help request.",
      ],
    }),
  ),
  makeScreen({
    screenId: "workshop-library",
    screenName: "My Creations",
    purpose: "Store the reusable items the active business actually created.",
    primaryUserGoal:
      "Find, reopen, duplicate, reuse, export, send, template, or archive a creation.",
    mainSections: [
      "Search",
      "Filters",
      "Sorting",
      "Creation cards",
      "Context-specific actions",
    ],
    primaryActions: [
      "Open",
      "Edit",
      "Duplicate",
      "Use Again",
      "Download",
      "Send",
      "Post",
      "Save as Template",
      "Archive",
    ],
    relatedData: [
      "Workshop items",
      "Files",
      "QR codes",
      "Posts",
      "Lead forms",
      "Customers",
      "Projects",
    ],
    routingRules: [
      "Only show the active business profile’s creations.",
      "Exports belong in File Vault and link back to the creation.",
    ],
    whatShouldNotAppear: [
      "Business Kit starter packs presented as creations",
      "Raw File Vault uploads presented as reusable creations",
      "Desktop data table",
    ],
  }),
  makeScreen({
    screenId: "file-vault",
    screenName: "File Vault",
    purpose: "Store and reuse business files.",
    primaryUserGoal: "Find a file and use it in another workflow.",
    mainSections: ["Search/filter", "File cards", "File actions"],
    primaryActions: [
      "Preview",
      "Rename",
      "Add to Customer",
      "Add to Project",
      "Use in Builder",
      "Download",
      "Archive",
      "Request Help",
    ],
    relatedData: ["Files", "Customers", "Projects"],
  }),
  makeScreen({
    screenId: "project-job-folder",
    screenName: "Project / Job Folder",
    purpose: "Group one job’s customer, documents, files, and activity.",
    primaryUserGoal: "See everything connected to a project.",
    mainSections: [
      "Project summary",
      "Customer",
      "Documents",
      "Files",
      "Activity",
    ],
    primaryActions: [
      "Add File",
      "Create Estimate",
      "Create Invoice",
      "Create Change Order",
    ],
    relatedData: ["Projects", "Customers", "Money records", "Files"],
  }),
  makeScreen({
    screenId: "help-home",
    screenName: "Help Home",
    purpose: "Access Start Here services, requests, and guides.",
    primaryUserGoal: "Request or review actual support.",
    mainSections: [
      "Need Start Here Help",
      "Services",
      "Current requests",
      "Monthly support",
      "Guides",
      "Helper Access",
    ],
    primaryActions: ["Start a Help Request", "View My Requests", "View Guides"],
    whatShouldNotAppear: [
      "Do It Myself selector",
      "Walk Me Through It selector",
      "Generic builder form",
    ],
  }),
  makeScreen({
    screenId: "help-request-flow",
    screenName: "Help Request Flow",
    purpose:
      "Submit a scoped Start Here support request without sharing passwords.",
    primaryUserGoal:
      "Explain the work, attach safe access, and request review.",
    mainSections: [
      "Service",
      "Description",
      "Files/screenshots/links",
      "Service level",
      "Quote notice",
      "Helper Access",
    ],
    primaryActions: ["Submit for Review"],
    validationRules: [
      "Require service and description.",
      "Never request passwords.",
    ],
    relatedData: ["Help requests", "Files", "Service catalog"],
  }),
  makeScreen({
    screenId: "help-request-detail",
    screenName: "Help Request Detail",
    purpose: "Track one support project, quote, files, and status.",
    primaryUserGoal: "Understand status and provide what is needed.",
    mainSections: [
      "Status",
      "Description",
      "Quote",
      "Files",
      "Messages",
      "Activity",
    ],
    primaryActions: ["Upload File", "Approve Quote", "Request Revision"],
    relatedData: ["Help request", "Quote", "Files"],
  }),
  makeScreen({
    screenId: "service-cart",
    screenName: "Service Cart",
    purpose:
      "Review requested Start Here services before submission or payment.",
    primaryUserGoal: "Confirm scope and estimated pricing.",
    mainSections: [
      "Selected services",
      "Editable quantities",
      "Estimate notice",
      "Total",
    ],
    primaryActions: ["Submit for Review", "Remove Service"],
    validationRules: [
      "Pricing comes from editable settings, never permanent UI constants.",
    ],
    relatedData: ["Service catalog", "Help request"],
  }),
  makeScreen({
    screenId: "guides-resources",
    screenName: "Guides / Resources",
    purpose: "Provide plain-language self-service education.",
    primaryUserGoal: "Learn a task without opening paid support.",
    mainSections: ["Guide categories", "Guide cards", "Search"],
    primaryActions: ["Open Guide"],
    relatedData: ["Guide content"],
  }),
  makeScreen({
    screenId: "integration-center",
    screenName: "Integration Center",
    purpose: "Show future connections without pretending they are live.",
    primaryUserGoal:
      "Understand connection status and what each provider will support.",
    mainSections: [
      "Integration cards",
      "Status",
      "Purpose",
      "Issues",
      "Mock-mode notice",
    ],
    primaryActions: ["Connect Placeholder", "Manage Placeholder"],
    validationRules: [
      "All providers remain explicitly mock/stub until credentials and API setup exist.",
    ],
    relatedData: ["Integration statuses"],
  }),
  makeScreen({
    screenId: "quickbooks-placeholder",
    screenName: "QuickBooks Sync Placeholder",
    purpose: "Plan future accounting sync safely.",
    primaryUserGoal: "Review planned mappings and mock status.",
    mainSections: [
      "Connection status",
      "Record mappings",
      "Sync history placeholder",
    ],
    primaryActions: ["Review Setup"],
    whatShouldNotAppear: ["Fake synced records", "Credential collection"],
  }),
  makeScreen({
    screenId: "social-accounts-placeholder",
    screenName: "Social Accounts Placeholder",
    purpose:
      "Plan future Facebook, Instagram, and Google Business connections.",
    primaryUserGoal:
      "See planned account capabilities and current mock status.",
    mainSections: [
      "Provider cards",
      "Connection status",
      "Posting limitations",
    ],
    primaryActions: ["Review Setup"],
    whatShouldNotAppear: ["Fake live posting", "Fake connected account claims"],
  }),
  makeScreen({
    screenId: "settings",
    screenName: "Settings",
    purpose:
      "Manage business preferences, editable service settings, and safe defaults.",
    primaryUserGoal:
      "Adjust the active business without affecting another workspace.",
    mainSections: [
      "Business settings",
      "Brand settings",
      "Saved links",
      "Document defaults",
      "Service catalog",
      "Privacy",
    ],
    primaryActions: ["Save Settings"],
    relatedData: [
      "Business profile",
      "Brand kit",
      "Saved links",
      "Service catalog",
    ],
  }),
  makeScreen({
    screenId: "lead-detail",
    screenName: "Lead Detail",
    purpose:
      "Follow up, schedule, estimate, or convert a lead without retyping it.",
    primaryUserGoal: "Move a lead to its next useful action.",
    mainSections: ["Lead summary", "Source", "Contact", "Request", "Actions"],
    primaryActions: [
      "Schedule Appointment",
      "Create Estimate",
      "Convert to Customer",
    ],
    relatedData: ["Lead", "Customer", "Calendar", "Estimate"],
  }),
  makeScreen({
    screenId: "import-wizard",
    screenName: "Import Wizard",
    purpose:
      "Safely import spreadsheet records with mapping and duplicate review.",
    primaryUserGoal: "Bring existing data into the active business.",
    mainSections: [
      "Record type",
      "File upload",
      "Column preview",
      "Mapping",
      "Duplicates",
      "Summary",
    ],
    primaryActions: ["Import Selected Records", "Review Duplicates"],
    validationRules: [
      "Only .xlsx and .csv are accepted.",
      "Possible duplicates require review.",
    ],
    relatedData: [
      "Customers",
      "Leads",
      "Projects",
      "Items",
      "Appointments",
      "Import history",
    ],
  }),
  makeScreen({
    screenId: "sync-center",
    screenName: "Ready to Sync",
    purpose:
      "Review accounting-ready changes, duplicates, and conflicts without faking a live connection.",
    primaryUserGoal: "Understand what is safe to sync.",
    mainSections: [
      "Mock-mode notice",
      "Sync queue",
      "Duplicate review",
      "Conflict review",
    ],
    primaryActions: [
      "Sync Selected",
      "Sync Everything Safe",
      "Export to Excel/CSV",
    ],
    relatedData: [
      "Sync metadata",
      "Customers",
      "Items",
      "Invoices",
      "Payments",
    ],
  }),
  makeScreen({
    screenId: "export-center",
    screenName: "Export Updates",
    purpose: "Prepare full or incremental spreadsheet exports.",
    primaryUserGoal: "Get updated app data back into Excel or CSV.",
    mainSections: ["Export type", "Format", "Record count", "Export history"],
    primaryActions: [
      "Prepare Export",
      "Mark as Exported",
      "Keep as Needs Export",
    ],
    relatedData: [
      "Customers",
      "Leads",
      "Projects",
      "Items",
      "Appointments",
      "Export history",
    ],
  }),
  makeScreen({
    screenId: "calendar",
    screenName: "Calendar & Schedule",
    purpose:
      "Schedule appointments, site visits, follow-ups, jobs, and reminders.",
    primaryUserGoal: "See upcoming work or add a schedule item.",
    mainSections: ["Today", "Week", "Month", "List", "Schedule form"],
    primaryActions: ["Add", "Save Appointment"],
    relatedData: [
      "Calendar events",
      "Customers",
      "Leads",
      "Projects",
      "Estimates",
      "Invoices",
    ],
  }),
  makeScreen({
    screenId: "template-detail",
    screenName: "Template Detail",
    purpose: "Inspect and manage one reusable document template.",
    primaryUserGoal:
      "Use, preview, edit, duplicate, default, or archive a template.",
    mainSections: [
      "Summary",
      "Included reusable settings",
      "Three previews",
      "Actions",
    ],
    primaryActions: [
      "Use Template",
      "Preview Template",
      "Edit Style",
      "Rename",
      "Duplicate",
      "Set as Default",
      "Archive",
    ],
    relatedData: ["Document template", "Document style"],
  }),
  makeScreen({
    screenId: "document-style-editor",
    screenName: "Document Style Editor",
    purpose:
      "Style different official-document sections without hardcoding one layout.",
    primaryUserGoal:
      "Choose a preset or adjust section-specific typography, color, border, spacing, and alignment.",
    mainSections: [
      "Simple Style presets",
      "Collapsed Advanced Style",
      "Overall and Header",
      "Independent Info Blocks",
      "Table, Columns, and Rows",
      "Totals, Notes, Terms, and Payment",
      "Footer, QR, and Signature",
      "Live official-document preview",
    ],
    primaryActions: ["Apply Preset", "Save Document Style"],
    relatedData: ["Document style", "Document template"],
  }),
  makeScreen({
    screenId: "business-asset-detail",
    screenName: "Business Asset Detail",
    purpose: "Reuse important logos, QR codes, cards, links, and files.",
    primaryUserGoal: "Find the right asset and use it elsewhere.",
    mainSections: ["Preview", "Metadata", "Usage actions"],
    primaryActions: [
      "Pin",
      "Download",
      "Use in App",
      "Duplicate",
      "Request Help",
      "Archive",
    ],
    relatedData: ["Business asset", "Files", "Workshop items", "Templates"],
  }),
];

export function getScreenContract(screenId: string) {
  return screenContracts.find((contract) => contract.screenId === screenId);
}
