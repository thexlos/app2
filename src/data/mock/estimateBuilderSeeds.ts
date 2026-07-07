import type {
  ApprovalSettings,
  Estimate,
  EstimateLineItem,
  EstimateSection,
  EstimateTerms,
} from "../../types/models";

type SeedItem = [description: string, quantity: number, rate: number];
type SeedSection = [title: string, items: SeedItem[]];

const sampleSections: SeedSection[] = [
  [
    "PLANNING",
    [
      ["Site measure and planning", 1, 350],
      ["Area protection setup", 1, 425],
    ],
  ],
  [
    "SURFACE PREPARATION",
    [
      ["Standard floor preparation", 850, 1.75],
      ["Moisture evaluation", 1, 275],
    ],
  ],
  [
    "MAIN WORK AREA",
    [
      ["Sample finish material allowance", 850, 4.8],
      ["Standard installation labor", 850, 5.25],
    ],
  ],
  [
    "FINISHING",
    [
      ["Base trim finishing", 260, 3.2],
      ["Transition pieces", 4, 85],
      ["Debris removal", 1, 425],
      ["Final cleanup", 1, 300],
    ],
  ],
];

export const defaultApprovalSettings: ApprovalSettings = {
  allowApprove: true,
  allowReject: true,
  allowRequestChanges: true,
  requireRejectNote: true,
  requireChangeRequestNote: true,
  requireTypedName: false,
  requireCheckbox: true,
  allowPdfDownload: true,
  showFullDocumentBeforeApproval: false,
  sendBusinessCopy: false,
  requireSignature: false,
  requireInitialsOnTerms: false,
  allowPdfDownloadBeforeApproval: true,
  allowPdfDownloadAfterApproval: true,
  lockAfterApproval: true,
};

export const defaultEstimateTerms: EstimateTerms = {
  paymentTerms: "Balance due upon completion",
  depositRequired: false,
  expirationText: "Estimate expires in 30 days",
  changeOrderPolicy: "Change orders require written customer approval.",
  customTerms:
    "Shipping and material changes may be added later with approval.",
};

export interface EstimateBuilderSeed {
  estimate: Estimate;
  customer: {
    customerId: string;
    name: string;
    businessName: string;
    phone: string;
    email: string;
    billingAddress: string;
    jobSiteAddress: string;
    internalNote: string;
  };
}

export function createSampleEstimateSeed(
  businessId: string,
): EstimateBuilderSeed {
  const estimateId = `${businessId}-estimate-builder-sample`;
  const lineItems: EstimateLineItem[] = [];
  const sections: EstimateSection[] = sampleSections.map(
    ([title, items], sectionIndex) => {
      const sectionId = `${estimateId}-section-${sectionIndex + 1}`;
      const sectionItems = items.map(
        ([description, quantity, rate], itemIndex): EstimateLineItem => ({
          id: `${sectionId}-item-${itemIndex + 1}`,
          estimateId,
          sectionId,
          name: description,
          quantity,
          unitPrice: rate,
          unit: quantity === 1 ? "each" : "sq ft",
          taxable: false,
          visibleToCustomer: true,
          pdfVisible: true,
          internalOnly: false,
          sortOrder: itemIndex,
        }),
      );
      lineItems.push(...sectionItems);
      return {
        id: sectionId,
        estimateId,
        title,
        sortOrder: sectionIndex,
        lineItemIds: sectionItems.map((item) => item.id),
        subtotal: sectionItems.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0,
        ),
        customerVisible: true,
        pdfVisible: true,
        internalOnly: false,
        collapsed: false,
      };
    },
  );
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const estimate: Estimate = {
    id: estimateId,
    businessId,
    businessProfileId: businessId,
    number: "DRAFT-001",
    estimateNumber: "DRAFT-001",
    customerId: "",
    projectName: "Lakeside Office Refresh",
    title: "Project Estimate",
    status: "Draft",
    total: subtotal,
    lineItems,
    sections,
    versions: [],
    approvalToken: `${businessId}-estimate-sample-preview`,
    createdAt: "2026-07-06T12:00:00.000Z",
    updatedAt: new Date().toISOString(),
    estimateDate: "2026-07-06",
    expirationDate: "2026-08-05",
    preparedBy: "",
    jobLocation: "Sample job site",
    projectDescription:
      "Example project scope organized into clear sections for customer review.",
    customerMessage:
      "Thank you for the opportunity to provide this estimate. Please review the details and respond when ready.",
    customerNotes:
      "This fictional sample is provided to demonstrate the document layout.",
    internalNotes:
      "Sample-only internal note. Replace with real project information.",
    termsData: defaultEstimateTerms,
    numberedNotes: [
      "Final selections and measurements must be confirmed before work begins.",
      "Work outside the listed scope requires written approval.",
      "Schedule dates are confirmed after approval.",
    ],
    subtotal,
    discount: 0,
    tax: 0,
    depositRequested: 0,
    visibleFields: ["Description", "Quantity", "Rate", "Total"],
    internalFields: ["Internal cost", "Profit", "Supplier notes"],
    approvalSettings: defaultApprovalSettings,
    deliverySettings: {
      emailMessage:
        "Thank you for the opportunity to provide this estimate. Please review the details and respond when ready.",
      clientSummary:
        "A fictional sample scope organized into clear project sections.",
      reviewButtonLabel: "Review Full Document",
      downloadButtonLabel: "Download PDF",
      allowPdfDownload: true,
      allowReject: true,
      allowChanges: true,
      requireApprovalCheckbox: true,
      documentTitle: "ESTIMATE",
      documentFooter: "Thank you for your business.",
      terms:
        "Balance due upon completion. Change orders require written approval.",
    },
    clientApprovalLink: `#/approve/${businessId}-estimate-sample-preview`,
    quickBooksSyncStatus: "Not Synced",
    exportedFileIds: [],
    savedToWorkshopLibrary: false,
    activityHistory: [
      {
        id: `${estimateId}-activity-1`,
        label: "Fictional professional sample loaded",
        occurredAt: "Now",
      },
    ],
  };
  return {
    estimate,
    customer: {
      customerId: "",
      name: "Northwind Property Group",
      businessName: "Northwind Property Group",
      phone: "(555) 010-2040",
      email: "projects@northwind.example",
      billingAddress: "100 Example Avenue, Sample City, RI",
      jobSiteAddress: "250 Lakeside Way, Sample City, RI",
      internalNote: "Fictional sample customer—replace before sending.",
    },
  };
}

export function createBlankEstimateSeed(
  businessId: string,
  estimateNumber: string,
): EstimateBuilderSeed {
  const estimateId = `${businessId}-estimate-new-${Date.now()}`;
  const sectionId = `${estimateId}-section-1`;
  return {
    estimate: {
      id: estimateId,
      businessId,
      businessProfileId: businessId,
      number: estimateNumber,
      estimateNumber,
      customerId: "",
      projectName: "",
      title: "Estimate",
      status: "Draft",
      total: 0,
      subtotal: 0,
      lineItems: [],
      sections: [
        {
          id: sectionId,
          estimateId,
          title: "New Category",
          sortOrder: 0,
          lineItemIds: [],
          subtotal: 0,
          customerVisible: true,
          pdfVisible: true,
          internalOnly: false,
          collapsed: false,
        },
      ],
      versions: [],
      approvalToken: `${businessId}-${Date.now()}-preview`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimateDate: new Date().toISOString().slice(0, 10),
      expirationDate: "",
      preparedBy: "",
      jobLocation: "",
      projectDescription: "",
      customerMessage: "Please review this estimate and respond when ready.",
      customerNotes: "",
      internalNotes: "",
      termsData: defaultEstimateTerms,
      numberedNotes: [],
      discount: 0,
      tax: 0,
      depositRequested: 0,
      visibleFields: ["Description", "Quantity", "Rate", "Total"],
      internalFields: ["Internal cost", "Profit", "Supplier notes"],
      approvalSettings: { ...defaultApprovalSettings, requireTypedName: false },
      deliverySettings: {
        emailMessage: "Your estimate is ready to review.",
        clientSummary: "Please review the project scope and total.",
        reviewButtonLabel: "Review Full Document",
        downloadButtonLabel: "Download PDF",
        allowPdfDownload: true,
        allowReject: true,
        allowChanges: true,
        requireApprovalCheckbox: true,
        documentTitle: "ESTIMATE",
        documentFooter: "Thank you for your business.",
        terms: "Change orders require written customer approval.",
      },
      clientApprovalLink: `#/approve/${businessId}-${Date.now()}-preview`,
      quickBooksSyncStatus: "Not Synced",
      exportedFileIds: [],
      savedToWorkshopLibrary: false,
      activityHistory: [
        {
          id: `${estimateId}-activity-1`,
          label: "Blank estimate started",
          occurredAt: "Now",
        },
      ],
    },
    customer: {
      customerId: "",
      name: "",
      businessName: "",
      phone: "",
      email: "",
      billingAddress: "",
      jobSiteAddress: "",
      internalNote: "",
    },
  };
}
