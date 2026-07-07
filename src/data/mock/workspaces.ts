import type {
  ActivityLogItem,
  BusinessProfile,
  BusinessWorkspaceData,
  CustomerTag,
  DashboardMetric,
  IntegrationConnection,
  RecordStatus,
  WorkshopItem,
  WorkshopItemStatus,
  WorkshopItemType,
} from "../../types/models";
import { businessProfiles } from "./businessProfiles";
import { createBusinessHomeKitSeed } from "./businessHomeKitSeeds";

const customerNames = [
  ["Smith Residence", "Johnson Property", "Miller Rental"],
  ["Sample Restaurant", "CleanPro RVA", "J Thomas Flooring"],
  ["Trial Lead - Maria", "John Parent", "East Side Youth"],
  [
    "Catering Lead - Office Lunch",
    "Promo Customer - Lisa",
    "Ocean State Events",
  ],
  [
    "Move-Out Lead - Amanda",
    "Weekly Customer - Mr. Harris",
    "Maple Street Realty",
  ],
];

const customerTagLabels = [
  [
    ["Estimate accepted", "Deposit paid", "In progress"],
    ["Change order pending", "In progress"],
    ["Estimate sent", "Waiting approval"],
  ],
  [
    ["Flyer help", "QR setup", "Active customer"],
    ["Custom kit request", "Waiting approval"],
    ["Invoice template setup", "QuickBooks help"],
  ],
  [
    ["Trial lead", "Needs follow-up"],
    ["Kids program", "Invoice unpaid"],
    ["Active member"],
  ],
  [
    ["Catering lead", "Estimate needed"],
    ["Promo customer", "Review needed"],
    ["Event customer"],
  ],
  [
    ["Move-out clean", "Quote needed"],
    ["Recurring customer", "Invoice due"],
    ["Commercial client"],
  ],
];

const dashboards: DashboardMetric[][] = [
  [
    { id: "waiting", label: "Estimates waiting", value: "2", tone: "info" },
    {
      id: "change",
      label: "Change order pending",
      value: "1",
      tone: "warning",
    },
    { id: "unpaid", label: "Unpaid invoices", value: "3", tone: "danger" },
    {
      id: "outstanding",
      label: "Outstanding",
      value: "$4,850",
      tone: "warning",
    },
  ],
  [
    { id: "help", label: "Help requests", value: "4", tone: "warning" },
    { id: "review", label: "Ready for review", value: "2", tone: "info" },
    { id: "leads", label: "New leads", value: "3", tone: "success" },
    { id: "kits", label: "Custom kit request", value: "1", tone: "info" },
  ],
  [
    { id: "trials", label: "Trial leads", value: "7", tone: "success" },
    { id: "unpaid", label: "Unpaid memberships", value: "2", tone: "danger" },
    { id: "draft", label: "Promo ready", value: "1", tone: "info" },
    { id: "reviews", label: "Reviews pending", value: "3", tone: "warning" },
  ],
  [
    { id: "catering", label: "Catering lead", value: "1", tone: "success" },
    { id: "promos", label: "Promo drafts", value: "2", tone: "info" },
    { id: "menu", label: "Menu QR", value: "Ready", tone: "success" },
    { id: "review", label: "Review QR", value: "Ready", tone: "success" },
  ],
  [
    { id: "quotes", label: "Quote requests", value: "5", tone: "success" },
    {
      id: "recurring",
      label: "Recurring invoices",
      value: "3",
      tone: "warning",
    },
    { id: "reviews", label: "Review requests", value: "2", tone: "info" },
    { id: "flyer", label: "Flyer draft", value: "1", tone: "info" },
  ],
];

const activityLabels = [
  [
    "Estimate #1042 accepted by Smith Residence",
    "Change Order #CO-03 sent for Johnson Property",
    "Invoice #221 marked partially paid",
    "QuickBooks imported 148 items",
  ],
  [
    "Flyer request submitted by Sample Restaurant",
    "QR code created for Coliseu signup",
    "Business card project ready for review",
    "Custom cleaning kit quote sent",
  ],
  [
    "Ladies Night promo saved for Facebook",
    "Trial class lead submitted",
    "Membership invoice sent",
    "Review QR created",
  ],
  [
    "Free chicken promo draft created",
    "Catering request received",
    "Daily special post saved",
    "Menu QR downloaded",
  ],
  [
    "Move-out cleaning lead received",
    "Deep cleaning estimate sent",
    "Invoice #118 paid",
    "Review request sent",
  ],
];

const workshopSeedRows: Array<
  Array<[string, WorkshopItemType, WorkshopItemStatus, string]>
> = [
  [
    [
      "Flooring Estimate QR",
      "qr_code",
      "Ready",
      "Estimate request form · Last used 2 days ago",
    ],
    [
      "Before/After Flooring Post",
      "social_post",
      "Draft",
      "Facebook · Smith Residence Flooring",
    ],
    [
      "Flooring Business Card",
      "business_card",
      "Needs Review",
      "QR code may be too small",
    ],
    [
      "Room-by-Room Estimate Template",
      "estimate_template",
      "Ready",
      "Reusable flooring estimate structure",
    ],
  ],
  [
    [
      "Start Here General Business Card",
      "business_card",
      "Ready",
      "PDF Print · PNG Front · PNG Back",
    ],
    ["QR Code Setup Flyer", "flyer", "Ready", "Related service: QR Code Setup"],
    ["Custom Cleaning Kit Quote", "promotion", "Sent", "Sent to customer"],
    [
      "Canva Flyer Fix Request",
      "canva_help_item",
      "In Help Request",
      "Start Here support project",
    ],
  ],
  [
    [
      "Membership Signup Flyer",
      "flyer",
      "Ready",
      "Includes membership signup QR",
    ],
    [
      "Ladies Night Boxing Post",
      "social_post",
      "Draft",
      "Facebook and Instagram",
    ],
    ["Trial Class QR", "qr_code", "Ready", "42 scans"],
    ["Kids Program Lead Form", "lead_form", "Ready", "Public signup form"],
  ],
  [
    ["Free Chicken Promo", "flyer", "Needs Review", "QR code missing"],
    ["Menu QR", "qr_code", "Ready", "118 scans"],
    [
      "Catering Request Form",
      "lead_form",
      "Ready",
      "Public catering inquiry form",
    ],
    ["Daily Special Post", "social_post", "Draft", "Facebook Page"],
  ],
  [
    [
      "Deep Cleaning Special Flyer",
      "flyer",
      "Draft",
      "Spring cleaning promotion",
    ],
    ["Free Cleaning Quote QR", "qr_code", "Ready", "5 leads"],
    ["Move-Out Cleaning Lead Form", "lead_form", "Ready", "Public quote form"],
    ["Review Request Card", "review_booster", "Ready", "Google review request"],
  ],
];

const integrationProviders: IntegrationConnection["provider"][] = [
  "QuickBooks",
  "Facebook Page",
  "Instagram Business",
  "Google Business Profile",
  "Canva",
  "Payment Links",
  "Google Drive",
  "Google Contacts",
  "Google Sheets",
  "Excel / CSV",
  "Email / SMS",
  "Website / Lead Forms",
  "VistaPrint Prep",
];
const connected: Record<number, IntegrationConnection["provider"][]> = {
  0: ["QuickBooks", "Google Business Profile"],
  1: [
    "Facebook Page",
    "Instagram Business",
    "Google Business Profile",
    "Canva",
  ],
  2: ["Facebook Page", "Instagram Business", "Google Business Profile"],
  3: ["Facebook Page", "Google Business Profile"],
  4: ["QuickBooks"],
};

function tag(id: string, label: string, index: number): CustomerTag {
  const tone = /paid|accepted|active|recurring|progress/i.test(label)
    ? "success"
    : /pending|waiting|needed|due|follow/i.test(label)
      ? "warning"
      : "info";
  return { id: `${id}-tag-${index}`, label, tone };
}

function workspace(
  profile: BusinessProfile,
  index: number,
): BusinessWorkspaceData {
  const id = profile.id;
  const deliverySettings = {
    emailMessage: `Hi, please review the estimate from ${profile.name}. You can open the full document, download the PDF, or send your response without creating an account.`,
    clientSummary:
      "Please review the project summary, total, and terms before responding.",
    reviewButtonLabel: "Review Full Document",
    downloadButtonLabel: "Download PDF",
    allowPdfDownload: true,
    allowReject: true,
    allowChanges: true,
    requireApprovalCheckbox: true,
    documentTitle: "ESTIMATE",
    documentFooter: `Thank you for choosing ${profile.name}.`,
    terms:
      "Pricing covers the listed scope. Added work requires written approval through a revision or change order. Payment timing follows the approved schedule.",
  };
  const customers = customerNames[index].map((name, customerIndex) => ({
    id: `${id}-customer-${customerIndex + 1}`,
    businessId: id,
    name,
    businessName: name.includes("Lead -") ? undefined : name,
    phone: `(401) 555-01${20 + index * 3 + customerIndex}`,
    email: `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.|\.$/g, "")}@example.com`,
    address: `${120 + customerIndex * 18} Main Street, Providence, RI`,
    billingAddress: `${120 + customerIndex * 18} Main Street, Providence, RI`,
    jobSiteAddress: `${45 + customerIndex * 11} Job Site Road, Providence, RI`,
    status:
      customerIndex === 0 && /Lead/.test(name) ? "Lead" : "Active customer",
    tags: customerTagLabels[index][customerIndex].map((label, tagIndex) =>
      tag(`${id}-${customerIndex}`, label, tagIndex),
    ),
    leadSource: customerIndex === 0 ? "QR lead form" : "Referral",
    lastActivity:
      customerIndex === 0
        ? "2 days ago"
        : customerIndex === 1
          ? "5 days ago"
          : "1 week ago",
    notes:
      customerIndex === 0
        ? [
            "Prefers text messages.",
            "Important files are saved in the project folder.",
          ]
        : [],
    history: customerTagLabels[index][customerIndex].map((label) => label),
    balanceDue: index === 0 ? [2800, 1200, 0][customerIndex] : 0,
    estimateCount: customerIndex + 1,
    invoiceCount: customerIndex,
    filesCount: customerIndex + 2,
  }));

  const acceptedTotal = index === 0 ? 7500 : 8450;
  const acceptedNumber =
    index === 1 ? "#SH-203" : index === 3 ? "#REST-55" : "#1042";
  const acceptedStatus: RecordStatus =
    index === 1 ? "Sent" : index === 3 ? "Draft" : "Accepted";
  const estimates = [
    {
      id: `${id}-estimate-primary`,
      businessId: id,
      number: acceptedNumber,
      customerId: customers[0].id,
      projectName:
        index === 0
          ? "Smith Residence Flooring"
          : index === 1
            ? "Pro Custom Cleaning Business Kit Setup"
            : index === 3
              ? "Office Lunch Catering"
              : "Primary Service Package",
      status: acceptedStatus,
      total: index === 1 ? 199 : index === 3 ? 480 : acceptedTotal,
      lineItems:
        index === 0
          ? [
              {
                id: `${id}-li-1`,
                name: "Flooring materials",
                quantity: 1,
                unitPrice: 5000,
                visibleToCustomer: true,
              },
              {
                id: `${id}-li-2`,
                name: "Installation labor",
                quantity: 1,
                unitPrice: 2000,
                visibleToCustomer: true,
              },
              {
                id: `${id}-li-3`,
                name: "Prep and disposal",
                quantity: 1,
                unitPrice: 500,
                visibleToCustomer: true,
              },
            ]
          : [
              {
                id: `${id}-li-1`,
                name: index === 1 ? "Pro Custom Kit Setup" : "Service package",
                quantity: 1,
                unitPrice:
                  index === 1 ? 199 : index === 3 ? 480 : acceptedTotal,
                visibleToCustomer: true,
              },
            ],
      versions: [
        {
          id: `${id}-primary-v2`,
          version: 2,
          status: acceptedStatus,
          createdAt: "2026-07-05T14:30:00.000Z",
          changedBy: profile.ownerName,
          total: index === 1 ? 199 : index === 3 ? 480 : acceptedTotal,
          changeSummary:
            acceptedStatus === "Accepted"
              ? "Accepted by customer"
              : acceptedStatus === "Sent"
                ? "Sent to customer"
                : "Draft created",
          snapshotPath: `/snapshots/${id}-primary-v2.pdf`,
          officialDocumentSnapshot: `/snapshots/${id}-primary-v2.pdf`,
          clientViewSnapshot: {
            estimateNumber: acceptedNumber,
            projectName:
              index === 0
                ? "Smith Residence Flooring"
                : "Primary Service Package",
            total: index === 1 ? 199 : index === 3 ? 480 : acceptedTotal,
            allowPdfDownload: true,
          },
          customerAction:
            acceptedStatus === "Accepted" ? ("Approved" as const) : undefined,
        },
        {
          id: `${id}-primary-v1`,
          version: 1,
          status: "Sent" as const,
          createdAt: "2026-07-01T09:15:00.000Z",
          changedBy: profile.ownerName,
          total: index === 1 ? 199 : index === 3 ? 480 : acceptedTotal,
          changeSummary:
            index === 0
              ? "Customer asked to remove bedroom closet before Version 2"
              : "Initial version sent",
        },
      ],
      internalNote:
        index === 0
          ? "Material cost, profit margin, and supplier lead time stay internal."
          : "Internal planning note.",
      approvalToken: `${id}-public-primary`,
      deliverySettings,
    },
    {
      id: `${id}-estimate-changes`,
      businessId: id,
      number: "#1040",
      customerId: customers[index === 0 ? 0 : 1].id,
      projectName: "Optional Service Update",
      status: "Changes Requested" as const,
      total: 3200,
      lineItems: [
        {
          id: `${id}-li-change`,
          name: "Project services",
          quantity: 1,
          unitPrice: 3200,
          visibleToCustomer: true,
        },
      ],
      versions: [
        {
          id: `${id}-changes-v2`,
          version: 2,
          status: "Changes Requested" as const,
          createdAt: "2026-07-05T12:00:00.000Z",
          changedBy: customers[0].name,
          total: 3200,
          changeSummary: "Customer requested an optional add-on",
          customerNote:
            "Please add the upgraded option and show it as an optional add-on.",
          officialDocumentSnapshot: `/snapshots/${id}-changes-v2.pdf`,
          clientViewSnapshot: {
            estimateNumber: "#1040",
            total: 3200,
            allowPdfDownload: true,
          },
          customerAction: "Changes Requested" as const,
        },
        {
          id: `${id}-changes-v1`,
          version: 1,
          status: "Sent" as const,
          createdAt: "2026-07-03T10:00:00.000Z",
          changedBy: profile.ownerName,
          total: 3200,
          changeSummary: "Sent to customer",
        },
      ],
      approvalToken: `${id}-public-changes`,
      deliverySettings,
    },
    {
      id: `${id}-estimate-sent`,
      businessId: id,
      number: index === 0 ? "#1044" : "#1039",
      customerId: customers[2].id,
      projectName:
        index === 0 ? "Miller Rental Flooring" : "Commercial Refresh",
      status: "Sent" as const,
      total: index === 0 ? 3250 : 12750,
      lineItems: [
        {
          id: `${id}-li-sent`,
          name: "Service package",
          quantity: 1,
          unitPrice: index === 0 ? 3250 : 12750,
          visibleToCustomer: true,
        },
      ],
      versions: [
        {
          id: `${id}-sent-v1`,
          version: 1,
          status: "Sent" as const,
          createdAt: "2026-07-04T11:00:00.000Z",
          changedBy: profile.ownerName,
          total: index === 0 ? 3250 : 12750,
          changeSummary: "Customer viewed this estimate",
        },
      ],
      approvalToken: `${id}-public-sent`,
      deliverySettings,
    },
    ...(index === 0
      ? [
          {
            id: `${id}-estimate-rejected`,
            businessId: id,
            number: "#1038",
            customerId: customers[1].id,
            projectName: "Living Room and Hallway",
            status: "Rejected" as const,
            total: 4100,
            lineItems: [
              {
                id: `${id}-li-rejected`,
                name: "Flooring scope",
                quantity: 1,
                unitPrice: 4100,
                visibleToCustomer: true,
              },
            ],
            versions: [
              {
                id: `${id}-rejected-v1`,
                version: 1,
                status: "Rejected" as const,
                createdAt: "2026-06-30T11:00:00.000Z",
                changedBy: customers[1].name,
                total: 4100,
                changeSummary: "Rejected with customer note",
                customerNote:
                  "Price is higher than expected. Can we remove the hallway and quote only the living room?",
              },
            ],
            approvalToken: `${id}-public-rejected`,
            deliverySettings,
          },
        ]
      : []),
  ];

  const activities: ActivityLogItem[] = activityLabels[index].map(
    (label, itemIndex) => ({
      id: `${id}-activity-${itemIndex}`,
      businessId: id,
      label,
      detail:
        itemIndex === 3 && label.includes("QuickBooks")
          ? "Mock connection activity — no live import occurred"
          : "Saved in activity history",
      occurredAt: ["2 min ago", "15 min ago", "1 hr ago", "Yesterday"][
        itemIndex
      ],
      tone: itemIndex === 0 ? "success" : itemIndex === 1 ? "warning" : "info",
      type: label.toLowerCase().includes("invoice")
        ? "invoice.updated"
        : label.toLowerCase().includes("qr")
          ? "qr.created"
          : "activity.mock",
      relatedRecordType: label.includes("Estimate")
        ? "estimate"
        : label.includes("Invoice")
          ? "invoice"
          : label.includes("QR")
            ? "qr_code"
            : label.includes("Flyer")
              ? "workshop_creation"
              : undefined,
      relatedRecordId: label.includes("Estimate")
        ? (estimates.find((estimate) =>
            label.includes(estimate.number.replace("#", "")),
          )?.id ?? estimates[0].id)
        : label.includes("Invoice")
          ? `${id}-invoice-${label.includes("222") ? "222" : "221"}`
          : label.includes("QR")
            ? `${id}-qr-1`
            : undefined,
      deepLinkRoute:
        label.includes("Estimate") || label.includes("Invoice")
          ? "money"
          : label.includes("QR") || label.includes("Flyer")
            ? "workshop-library"
            : "home",
    }),
  );

  const workshopItems: WorkshopItem[] = workshopSeedRows[index].map(
    ([title, itemType, status, description], itemIndex) => ({
      id: `${id}-creation-${itemIndex + 1}`,
      businessProfileId: id,
      itemType,
      title,
      description,
      status,
      createdAt: `2026-07-0${itemIndex + 1}T10:00:00.000Z`,
      updatedAt: `2026-07-0${itemIndex + 2}T14:00:00.000Z`,
      lastUsedAt:
        itemIndex === 0
          ? "2 days ago"
          : itemIndex === 1
            ? "5 days ago"
            : "1 week ago",
      createdFrom: itemIndex === 3 ? "Business Kit" : "Blank",
      sourceKitId: itemIndex === 3 ? profile.appliedKitIds[0] : undefined,
      relatedCustomerId: itemIndex === 1 ? customers[0].id : undefined,
      relatedProjectId: itemIndex === 1 ? `${id}-project-1` : undefined,
      fileAssetIds:
        itemType === "flyer" || itemType === "business_card"
          ? [`${id}-file-1`]
          : [],
      qrCodeIds: itemType === "qr_code" ? [`${id}-qr-1`] : [],
      socialPostIds: itemType === "social_post" ? [`${id}-post-1`] : [],
      leadFormId: itemType === "lead_form" ? `${id}-form-1` : undefined,
      tags: [itemType.replaceAll("_", " "), status],
      exportFormats:
        itemType === "qr_code"
          ? ["PNG", "PDF Sign"]
          : itemType === "business_card"
            ? ["PDF Print", "PNG Front", "PNG Back"]
            : itemType === "flyer"
              ? ["PDF Print", "PNG", "JPG"]
              : [],
      isTemplate: itemType.endsWith("template"),
      archived: false,
      activityHistory: [
        {
          id: `${id}-creation-${itemIndex + 1}-activity`,
          label: status === "Draft" ? "Saved draft" : "Created item",
          occurredAt: "This week",
        },
      ],
    }),
  );
  const homeKit = createBusinessHomeKitSeed(
    profile,
    index,
    workshopItems.map((item) => item.id),
  );

  return {
    dashboardMetrics: dashboards[index],
    customers,
    leads: [
      {
        id: `${id}-lead-1`,
        businessId: id,
        name: customers[0].name,
        serviceNeeded: profile.industry,
        source: "Public lead form",
        status: "New",
      },
    ],
    leadForms: [
      {
        id: `${id}-form-1`,
        businessId: id,
        name:
          index === 0
            ? "Get a Free Flooring Estimate"
            : index === 2
              ? "Free Trial Class"
              : index === 3
                ? "Catering Request"
                : index === 4
                  ? "Free Cleaning Quote"
                  : "Request Start Here Help",
        publicPath: `/forms/${id}/request`,
        submissions: [4, 3, 7, 1, 5][index],
      },
    ],
    estimates,
    invoices:
      index === 0
        ? [
            {
              id: `${id}-invoice-221`,
              businessId: id,
              number: "#221",
              customerId: customers[0].id,
              status: "Partially Paid",
              total: 3000,
              amountPaid: 1500,
              dueDate: "2026-07-10",
              payments: [
                {
                  id: "pay-1",
                  date: "2026-07-02",
                  amount: 1500,
                  method: "Zelle",
                  reference: "JTF-221",
                },
              ],
            },
            {
              id: `${id}-invoice-222`,
              businessId: id,
              number: "#222",
              customerId: customers[1].id,
              status: "Overdue",
              total: 1200,
              amountPaid: 0,
              dueDate: "2026-06-25",
              payments: [],
            },
          ]
        : [
            {
              id: `${id}-invoice-1`,
              businessId: id,
              number: index === 1 ? "#SH-88" : index === 4 ? "#118" : "#221",
              customerId: customers[0].id,
              status: index === 1 || index === 4 ? "Paid" : "Sent",
              total: index === 1 ? 45 : 2850,
              amountPaid:
                index === 1 || index === 4 ? (index === 1 ? 45 : 2850) : 0,
              dueDate: "2026-07-12",
              payments: [],
            },
          ],
    progressInvoices:
      index === 0
        ? [
            {
              id: `${id}-progress-1`,
              businessId: id,
              number: "#P-1042-1",
              estimateId: estimates[0].id,
              label: "Deposit Invoice",
              percent: 20,
              amount: 1500,
              status: "Paid",
            },
            {
              id: `${id}-progress-2`,
              businessId: id,
              number: "#P-1042-2",
              estimateId: estimates[0].id,
              label: "Phase 1 Invoice",
              percent: 40,
              amount: 3000,
              status: "Partially Paid",
            },
            {
              id: `${id}-progress-3`,
              businessId: id,
              number: "#P-1042-3",
              estimateId: estimates[0].id,
              label: "Final Invoice",
              percent: 40,
              amount: 3500,
              status: "Draft",
            },
          ]
        : [
            {
              id: `${id}-progress-1`,
              businessId: id,
              number: "#P-1",
              estimateId: estimates[0].id,
              label: "Deposit",
              percent: 30,
              amount: 600,
              status: "Draft",
            },
          ],
    changeOrders: [
      {
        id: `${id}-change-1`,
        businessId: id,
        number: index === 0 ? "#CO-03" : "#CO-01",
        estimateId: estimates[0].id,
        reason:
          index === 0
            ? "Additional floor prep and leveling needed"
            : "Additional work requested",
        amount: index === 0 ? 650 : 250,
        status: index === 0 ? "Sent" : "Draft",
      },
    ],
    qrCodes: [
      {
        id: `${id}-qr-1`,
        businessId: id,
        name:
          index === 2
            ? "Coliseu Signup QR"
            : index === 3
              ? "Sample Restaurant Menu QR"
              : index === 4
                ? "Cleaning Quote QR"
                : index === 1
                  ? "Start Here Support QR"
                  : "Free Flooring Estimate QR",
        type: index === 3 ? "Menu" : index === 2 ? "Signup link" : "Lead form",
        url: `https://example.com/forms/${id}`,
        scans: [14, 8, 42, 118, 27][index],
      },
    ],
    promos: [
      {
        id: `${id}-promo-1`,
        businessId: id,
        name:
          index === 3
            ? "Free Chicken Special"
            : index === 4
              ? "Deep Cleaning Openings"
              : "Customer Promotion",
        audience: "Active customers",
        status: "Draft",
      },
    ],
    socialPosts: [
      {
        id: `${id}-post-1`,
        businessId: id,
        title:
          index === 2
            ? "Ladies Night Boxing Promo"
            : index === 3
              ? "Free Chicken Special"
              : index === 4
                ? "Deep Cleaning Openings This Week"
                : "This Week’s Update",
        destination:
          index === 2
            ? ["Facebook Page", "Instagram Business"]
            : ["Facebook Page"],
        status: index === 4 ? "Ready" : "Draft",
      },
    ],
    flyers: [
      {
        id: `${id}-flyer-1`,
        businessId: id,
        name:
          index === 2
            ? "Membership Signup Flyer"
            : index === 3
              ? "Free Chicken Promo Flyer"
              : index === 4
                ? "Deep Cleaning Special Flyer"
                : "Summer Offer",
        status:
          index === 2
            ? "Ready to post"
            : index === 3
              ? "Needs review · QR code missing"
              : index === 4
                ? "Draft · Phone number missing"
                : "Ready for review",
        hasQrCode: index === 2,
      },
    ],
    businessCards: [
      {
        id: `${id}-card-1`,
        businessId: id,
        name:
          index === 1
            ? "Start Here Support General Card"
            : index === 0
              ? "J Thomas Flooring Card"
              : "Owner Card",
        status: index === 1 ? "Ready for print" : "Needs print check",
      },
    ],
    templates: [
      {
        id: `${id}-template-1`,
        businessId: id,
        name: `${profile.industry} estimate`,
        type: "Estimate",
        sourceKitId: profile.appliedKitIds[0],
      },
    ],
    files: [
      {
        id: `${id}-file-1`,
        businessId: id,
        name: "Primary logo.png",
        type: "image/png",
        visibility: "Internal",
      },
      {
        id: `${id}-file-2`,
        businessId: id,
        name: "Estimate accepted.pdf",
        type: "application/pdf",
        visibility: "Customer",
      },
      {
        id: `${id}-file-3`,
        businessId: id,
        name: "Canva screenshot.png",
        type: "image/png",
        visibility: "Internal",
      },
      {
        id: `${id}-file-4`,
        businessId: id,
        name: "Signed approval.pdf",
        type: "application/pdf",
        visibility: "Customer",
      },
    ],
    workshopItems,
    ...homeKit,
    projects: [
      {
        id: `${id}-project-1`,
        businessId: id,
        customerId: customers[0].id,
        name:
          index === 0
            ? "Smith Residence Flooring"
            : index === 1
              ? "Sample Restaurant Free Chicken Promo"
              : `${profile.shortName} Main Project`,
        status: "In progress",
        fileIds: [`${id}-file-2`, `${id}-file-4`],
      },
    ],
    helpRequests:
      index === 1
        ? [
            {
              id: `${id}-help-1`,
              businessId: id,
              type: "Flyer Cleanup",
              serviceLevel: "Have Start Here Fix It",
              description: "Sample Restaurant flyer cleanup",
              status: "Needs Review",
              fileNames: ["flyer-screenshot.png"],
            },
            {
              id: `${id}-help-2`,
              businessId: id,
              type: "VistaPrint Business Card Setup",
              serviceLevel: "Have Start Here Fix It",
              description: "J Thomas Flooring print setup",
              status: "In Progress",
              fileNames: ["card-front.png", "card-back.png"],
            },
            {
              id: `${id}-help-3`,
              businessId: id,
              type: "Custom Cleaning Business Kit",
              serviceLevel: "Have Start Here Fix It",
              description: "CleanPro RVA custom kit",
              status: "Quote Sent",
              fileNames: ["logo.png", "service-list.pdf"],
            },
            {
              id: `${id}-help-4`,
              businessId: id,
              type: "QR Code Setup",
              serviceLevel: "Have Start Here Fix It",
              description: "Coliseu signup QR",
              status: "Completed",
              fileNames: [],
            },
          ]
        : [
            {
              id: `${id}-help-1`,
              businessId: id,
              type: "Flyer refresh",
              serviceLevel: "Start Here Service Request",
              description: "Clean up spacing and add the quote QR.",
              status: "Ready for Review",
              fileNames: ["summer-offer.png"],
            },
            {
              id: `${id}-help-2`,
              businessId: id,
              type: "VistaPrint setup",
              serviceLevel: "Start Here Service Request",
              description: "Check the print-safe card layout.",
              status: "In Progress",
              fileNames: ["card-preview.png"],
            },
            {
              id: `${id}-help-3`,
              businessId: id,
              type: "Custom kit setup",
              serviceLevel: "Start Here Service Request",
              description: "Build a starter kit around current services.",
              status: "Quote Sent",
              fileNames: ["service-list.pdf"],
            },
          ],
    integrations: integrationProviders.map((provider, providerIndex) => {
      const isConnected = connected[index].includes(provider);
      const placeholder = [
        "Payment Links",
        "Google Drive",
        "Google Contacts",
        "Google Sheets",
        "Email / SMS",
        "Website / Lead Forms",
        "VistaPrint Prep",
      ].includes(provider);
      return {
        id: `${id}-integration-${providerIndex}`,
        businessId: id,
        provider,
        status: isConnected ? "Mock Connected" : "Not Connected",
        mockMode: true as const,
        detail: isConnected
          ? `${provider} demo status for ${profile.name}. No live external action occurs.`
          : placeholder
            ? `${provider} is a future guided placeholder.`
            : `Ready for a future ${provider} account connection.`,
      };
    }),
    activity: activities,
    setupTasks: [
      {
        id: `${id}-setup-1`,
        businessId: id,
        label: "Add business name",
        complete: true,
      },
      {
        id: `${id}-setup-2`,
        businessId: id,
        label: "Add logo",
        complete: index < 3,
      },
      {
        id: `${id}-setup-3`,
        businessId: id,
        label: "Add phone and email",
        complete: true,
      },
      {
        id: `${id}-setup-4`,
        businessId: id,
        label: "Choose or apply a Business Kit",
        complete: profile.appliedKitIds.length > 0,
      },
      {
        id: `${id}-setup-5`,
        businessId: id,
        label: "Connect QuickBooks",
        complete: connected[index].includes("QuickBooks"),
        optional: true,
      },
      {
        id: `${id}-setup-6`,
        businessId: id,
        label: "Create first QR code",
        complete: true,
      },
    ],
    suggestions: [
      {
        id: `${id}-suggestion-1`,
        businessId: id,
        suggestionType:
          index === 0 ? "estimate_follow_up" : "creation_next_step",
        title:
          index === 0
            ? "Estimate needs follow-up"
            : "Finish the next business step",
        message:
          index === 0
            ? "Estimate #1044 was viewed but not approved. Send a follow-up?"
            : index === 3
              ? "This flyer has no QR code. Add one?"
              : "This promo could collect leads. Create a lead form?",
        actionLabel: "Do It",
        actions: ["Open", "Dismiss", "Remind Me Later"],
        priority: "High",
        status: "Active",
        createdAt: "2026-07-06T09:00:00.000Z",
        relatedRecordType: index === 0 ? "estimate" : "workshop_creation",
        relatedRecordId: index === 0 ? estimates[2].id : workshopItems[0].id,
      },
      {
        id: `${id}-suggestion-2`,
        businessId: id,
        suggestionType: index === 0 ? "invoice_overdue" : "business_setup",
        title: index === 0 ? "Invoice is overdue" : "Finish business setup",
        message:
          index === 0
            ? "Invoice #222 is overdue. Send a payment reminder?"
            : "Your business profile is missing a Google review link.",
        actionLabel: "Review",
        actions: ["Review", "Dismiss", "Remind Me Later"],
        priority: index === 0 ? "Urgent" : "Medium",
        status: "Active",
        createdAt: "2026-07-06T08:30:00.000Z",
        relatedRecordType: index === 0 ? "invoice" : "business_profile",
        relatedRecordId: index === 0 ? `${id}-invoice-222` : id,
      },
      {
        id: `${id}-suggestion-3`,
        businessId: id,
        suggestionType: "approval_received",
        title: "Approval received",
        message: `Estimate ${acceptedNumber} was approved. Review it and create the next invoice when ready.`,
        actionLabel: "Open",
        actions: ["Open", "Dismiss", "Remind Me Later"],
        priority: "High",
        status: acceptedStatus === "Accepted" ? "Active" : "Completed",
        createdAt: "2026-07-06T08:00:00.000Z",
        relatedRecordType: "estimate",
        relatedRecordId: estimates[0].id,
      },
    ],
    calendarEvents: [
      {
        id: `${id}-event-1`,
        businessProfileId: id,
        title: index === 2 ? "Trial class follow-up" : "Customer appointment",
        eventType: index === 0 ? "Site Visit" : "Appointment",
        startDate: "2026-07-06",
        startTime: "10:00",
        allDay: false,
        location: customers[0].jobSiteAddress,
        notes: "Business-specific mock schedule item.",
        status: "Scheduled",
        relatedCustomerId: customers[0].id,
        createdFrom: "Customer",
        reminders: ["1 hour before"],
        createdAt: "2026-07-05T10:00:00.000Z",
        updatedAt: "2026-07-05T10:00:00.000Z",
        archived: false,
      },
      {
        id: `${id}-event-2`,
        businessProfileId: id,
        title: "Estimate follow-up",
        eventType: "Follow-Up",
        startDate: "2026-07-07",
        startTime: "14:30",
        allDay: false,
        status: "Scheduled",
        relatedEstimateId: estimates[2].id,
        createdFrom: "Estimate",
        reminders: ["30 minutes before"],
        createdAt: "2026-07-05T11:00:00.000Z",
        updatedAt: "2026-07-05T11:00:00.000Z",
        archived: false,
      },
    ],
    importHistory: [
      {
        id: `${id}-import-1`,
        businessProfileId: id,
        recordType: "Customers",
        fileName: "customer-list.csv",
        status: "Imported",
        importedCount: 3,
        duplicateCount: 1,
        createdAt: "2026-07-01T09:00:00.000Z",
      },
    ],
    exportHistory: [
      {
        id: `${id}-export-1`,
        businessProfileId: id,
        exportType: "Updated customers",
        format: "CSV",
        recordCount: 2,
        status: "Needs Export",
        createdAt: "2026-07-04T09:00:00.000Z",
      },
    ],
    guidedWizardSessions: [],
  };
}

export const initialWorkspaces: Record<string, BusinessWorkspaceData> =
  Object.fromEntries(
    businessProfiles.map((profile, index) => [
      profile.id,
      workspace(profile, index),
    ]),
  );
