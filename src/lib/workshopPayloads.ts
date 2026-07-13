import type {
  BuilderData,
  WorkshopActivity,
  WorkshopCreatedFrom,
  WorkshopItem,
  WorkshopItemStatus,
  WorkshopItemType,
} from "../types/models";

export interface BuilderToolDefinition {
  builderId: string;
  sourceTool: string;
  itemType: WorkshopItemType;
  createTask: string;
}

export const builderToolMap = [
  {
    builderId: "social-post-builder",
    sourceTool: "Create Post",
    itemType: "social_post",
    createTask: "Create Post",
  },
  {
    builderId: "flyer-builder",
    sourceTool: "Make a Flyer",
    itemType: "flyer",
    createTask: "Make a Flyer",
  },
  {
    builderId: "qr-code-builder",
    sourceTool: "Create QR Code",
    itemType: "qr_code",
    createTask: "Create QR Code",
  },
  {
    builderId: "business-card-builder",
    sourceTool: "Business Cards",
    itemType: "business_card",
    createTask: "Business Cards",
  },
  {
    builderId: "send-promotion-builder",
    sourceTool: "Send Promotion",
    itemType: "promotion",
    createTask: "Send Promotion",
  },
  {
    builderId: "review-booster-builder",
    sourceTool: "Review Booster",
    itemType: "review_booster",
    createTask: "Review Booster",
  },
  {
    builderId: "lead-form-builder",
    sourceTool: "Lead Forms",
    itemType: "lead_form",
    createTask: "Lead Forms",
  },
  {
    builderId: "menu-price-sheet-builder",
    sourceTool: "Menu / Price Sheet",
    itemType: "menu_price_sheet",
    createTask: "Menu / Price Sheet",
  },
  {
    builderId: "sign-door-hanger-builder",
    sourceTool: "Yard Sign",
    itemType: "yard_sign",
    createTask: "Yard Sign",
  },
  {
    builderId: "sign-door-hanger-builder",
    sourceTool: "Door Hanger",
    itemType: "door_hanger",
    createTask: "Door Hanger",
  },
  {
    builderId: "event-promo-builder",
    sourceTool: "Event Promo",
    itemType: "event_promo",
    createTask: "Event Promo",
  },
  {
    builderId: "fix-something-flow",
    sourceTool: "Fix Something",
    itemType: "custom_template",
    createTask: "Fix Something",
  },
  {
    builderId: "canva-help-flow",
    sourceTool: "Canva Help",
    itemType: "canva_help_item",
    createTask: "Canva Help",
  },
  {
    builderId: "vistaprint-print-setup-flow",
    sourceTool: "VistaPrint / Print Setup Help",
    itemType: "vistaprint_print_setup",
    createTask: "VistaPrint / Print Setup Help",
  },
] as const satisfies BuilderToolDefinition[];

const fallbackByType: Partial<Record<WorkshopItemType, BuilderToolDefinition>> =
  Object.fromEntries(
    builderToolMap.map((definition) => [definition.itemType, definition]),
  );

const fallbackByBuilderId: Record<string, BuilderToolDefinition> =
  Object.fromEntries(
    builderToolMap.map((definition) => [
      `${definition.builderId}:${definition.sourceTool}`,
      definition,
    ]),
  );

export function getBuilderDefinitionForTask(
  task: string,
): BuilderToolDefinition | undefined {
  return builderToolMap.find((definition) => definition.createTask === task);
}

export function getBuilderDefinitionForItem(
  item: Pick<WorkshopItem, "builderId" | "sourceTool" | "itemType">,
): BuilderToolDefinition | undefined {
  if (item.builderId && item.sourceTool) {
    const exact = fallbackByBuilderId[`${item.builderId}:${item.sourceTool}`];
    if (exact) return exact;
  }
  if (item.builderId) {
    return builderToolMap.find(
      (definition) => definition.builderId === item.builderId,
    );
  }
  return fallbackByType[item.itemType];
}

export function getBuilderIdForWorkshopItem(
  item: Pick<WorkshopItem, "builderId" | "sourceTool" | "itemType">,
) {
  return item.builderId ?? getBuilderDefinitionForItem(item)?.builderId;
}

export function getCreateTaskForBuilderId(
  builderId: string,
  itemType?: WorkshopItemType,
) {
  const exact = itemType
    ? builderToolMap.find(
        (definition) =>
          definition.builderId === builderId && definition.itemType === itemType,
      )
    : undefined;
  return (
    exact?.createTask ??
    builderToolMap.find((definition) => definition.builderId === builderId)
      ?.createTask
  );
}

export function getWorkshopItemTitle(
  builderId: string,
  builderData: BuilderData,
  fallback: string,
) {
  const preferredKeys = [
    "headline",
    "title",
    "formTitle",
    "eventTitle",
    "caption",
    "qrName",
    "name",
    "printItem",
  ];
  const preferred = preferredKeys
    .map((key) => builderData[key])
    .find((value) => typeof value === "string" && value.trim());
  if (typeof preferred === "string") return preferred.trim();
  if (builderId === "qr-code-builder") return "Untitled QR Draft";
  return fallback;
}

function cloneBuilderData(data?: BuilderData): BuilderData {
  return JSON.parse(JSON.stringify(data ?? {})) as BuilderData;
}

function activity(label: string): WorkshopActivity {
  return {
    id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label,
    occurredAt: "Just now",
  };
}

export function normalizeWorkshopItem(item: WorkshopItem): WorkshopItem {
  const definition = getBuilderDefinitionForItem(item);
  return {
    ...item,
    builderId: item.builderId ?? definition?.builderId ?? "custom-template",
    sourceTool:
      item.sourceTool ?? definition?.sourceTool ?? item.itemType.replaceAll("_", " "),
    builderData: cloneBuilderData(item.builderData),
    previewData: cloneBuilderData(item.previewData),
    linkedCustomerIds:
      item.linkedCustomerIds ??
      (item.relatedCustomerId ? [item.relatedCustomerId] : []),
    linkedLeadIds: item.linkedLeadIds ?? [],
    linkedProjectIds:
      item.linkedProjectIds ??
      (item.relatedProjectId ? [item.relatedProjectId] : []),
    linkedEstimateIds: item.linkedEstimateIds ?? [],
    linkedInvoiceIds: item.linkedInvoiceIds ?? [],
    fileAssetIds: item.fileAssetIds ?? [],
    qrCodeIds: item.qrCodeIds ?? [],
    socialPostIds: item.socialPostIds ?? [],
    tags: item.tags ?? [],
    exportFormats: item.exportFormats ?? [],
    exportHistory: item.exportHistory ?? [],
    isTemplate: item.isTemplate ?? false,
    archived: item.archived ?? false,
    trashed: item.trashed ?? false,
    trashedAt: item.trashedAt,
    trashedFrom: item.trashedFrom,
    trashReason: item.trashReason,
    version: item.version ?? 1,
    lastUsedAt: item.lastUsedAt ?? "Not yet",
    activityHistory: item.activityHistory ?? [],
  };
}

export function createWorkshopItemFromBuilder(params: {
  id: string;
  businessProfileId: string;
  builderId: string;
  sourceTool: string;
  itemType: WorkshopItemType;
  title: string;
  description: string;
  status?: WorkshopItemStatus;
  createdFrom: WorkshopCreatedFrom;
  builderData: BuilderData;
  previewData?: BuilderData;
  tags?: string[];
  exportFormats?: string[];
  fileAssetIds?: string[];
  qrCodeIds?: string[];
  socialPostIds?: string[];
  linkedCustomerIds?: string[];
  linkedLeadIds?: string[];
  linkedProjectIds?: string[];
  linkedEstimateIds?: string[];
  linkedInvoiceIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  activityLabel?: string;
}): WorkshopItem {
  const now = new Date().toISOString();
  return normalizeWorkshopItem({
    id: params.id,
    businessProfileId: params.businessProfileId,
    itemType: params.itemType,
    title: params.title,
    description: params.description,
    status: params.status ?? "Draft",
    builderId: params.builderId,
    sourceTool: params.sourceTool,
    builderData: cloneBuilderData(params.builderData),
    previewData: cloneBuilderData(params.previewData ?? params.builderData),
    createdAt: params.createdAt ?? now,
    updatedAt: params.updatedAt ?? now,
    lastUsedAt: "Just now",
    createdFrom: params.createdFrom,
    fileAssetIds: params.fileAssetIds ?? [],
    qrCodeIds: params.qrCodeIds ?? [],
    socialPostIds: params.socialPostIds ?? [],
    linkedCustomerIds: params.linkedCustomerIds ?? [],
    linkedLeadIds: params.linkedLeadIds ?? [],
    linkedProjectIds: params.linkedProjectIds ?? [],
    linkedEstimateIds: params.linkedEstimateIds ?? [],
    linkedInvoiceIds: params.linkedInvoiceIds ?? [],
    tags: params.tags ?? [],
    exportFormats: params.exportFormats ?? [],
    exportHistory: [],
    isTemplate: false,
    archived: false,
    version: 1,
    activityHistory: [activity(params.activityLabel ?? "Saved draft")],
  });
}

export function duplicateWorkshopItemPayload(
  item: WorkshopItem,
  newId = `creation-${Date.now()}`,
): WorkshopItem {
  const source = normalizeWorkshopItem(item);
  const now = new Date().toISOString();
  return {
    ...source,
    id: newId,
    title: `${source.title} Copy`,
    status: "Draft",
    createdFrom: "Duplicate",
    archived: false,
    trashed: false,
    trashedAt: undefined,
    trashedFrom: undefined,
    trashReason: undefined,
    createdAt: now,
    updatedAt: now,
    lastUsedAt: "Just now",
    lastOpenedAt: undefined,
    builderData: cloneBuilderData(source.builderData),
    previewData: cloneBuilderData(source.previewData),
    exportHistory: [],
    fileAssetIds: [...source.fileAssetIds],
    qrCodeIds: [...source.qrCodeIds],
    socialPostIds: [...source.socialPostIds],
    linkedCustomerIds: [...(source.linkedCustomerIds ?? [])],
    linkedLeadIds: [...(source.linkedLeadIds ?? [])],
    linkedProjectIds: [...(source.linkedProjectIds ?? [])],
    linkedEstimateIds: [...(source.linkedEstimateIds ?? [])],
    linkedInvoiceIds: [...(source.linkedInvoiceIds ?? [])],
    version: 1,
    activityHistory: [activity("Duplicated item")],
  };
}

export function stripOneTimeDataForTemplate(item: WorkshopItem): WorkshopItem {
  const source = normalizeWorkshopItem(item);
  const templateData = cloneBuilderData(source.builderData);
  for (const key of ["date", "time", "eventTitle", "customerName"]) {
    if (key in templateData) templateData[key] = "";
  }
  return {
    ...source,
    id: `creation-${Date.now()}`,
    title: `${source.title} Template`,
    status: "Draft",
    createdFrom: "Template",
    builderData: templateData,
    previewData: cloneBuilderData(templateData),
    isTemplate: true,
    templateSourceItemId: source.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUsedAt: "Not yet",
    exportHistory: [],
    activityHistory: [activity("Saved as template")],
  };
}
