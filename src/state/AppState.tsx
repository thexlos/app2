import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { businessProfiles } from "../data/mock/businessProfiles";
import { initialWorkspaces } from "../data/mock/workspaces";
import { createEstimateVersion } from "../lib/protectedRecords";
import { validateInvoiceAgainstAcceptedScope } from "../lib/acceptedEstimateBilling";
import { resolveActivityTarget } from "../lib/flowRouting";
import {
  createWorkshopItemFromBuilder,
  duplicateWorkshopItemPayload,
  getBuilderDefinitionForItem,
  getBuilderDefinitionForTask,
  getCreateTaskForBuilderId,
  normalizeWorkshopItem,
  stripOneTimeDataForTemplate,
} from "../lib/workshopPayloads";
import {
  clearStoredAppState,
  loadStoredAppState,
  saveStoredAppState,
} from "../services/storage/appStorage";
import type {
  BuilderData,
  BusinessKit,
  BusinessWorkspaceData,
  CalendarEvent,
  Customer,
  DocumentTemplate,
  DocumentStyleTemplate,
  GlobalLibraryItem,
  Estimate,
  HelpRequest,
  Invoice,
  ItemServiceBankItem,
  ProjectJob,
  QRCodeRecord,
  Template,
  WorkshopItem,
  WorkshopItemStatus,
  WorkshopItemType,
} from "../types/models";

export type MainTab = "home" | "customers" | "money" | "create" | "help";
export type Screen =
  | MainTab
  | "business-kits"
  | "my-business-kit"
  | "global-library"
  | "integrations"
  | "estimate-detail"
  | "estimate-builder"
  | "invoice-builder"
  | "customer-detail"
  | "add-customer"
  | "add-lead"
  | "lead-detail"
  | "import-wizard"
  | "sync-center"
  | "export-center"
  | "calendar"
  | "template-library"
  | "template-detail"
  | "document-style-editor"
  | "asset-detail"
  | "setup"
  | "file-vault"
  | "workshop-library"
  | "create-mode"
  | "create-builder"
  | "create-wizard"
  | "help-request"
  | "help-request-detail"
  | "monthly-support"
  | "help-guide"
  | "official-document";
export type KitSectionKey =
  | "estimateTemplates"
  | "invoiceTemplates"
  | "progressChangeTemplates"
  | "leadForms"
  | "qrStarters"
  | "flyerPostTemplates"
  | "businessCardTemplate"
  | "reviewBoosterTools"
  | "customerTags"
  | "messageTemplates"
  | "setupChecklist"
  | "suggestedServices"
  | "suggestedTerms"
  | "suggestedFolders";

interface AppStateValue {
  /** Global tenant context. All business-owned reads and writes use this id. */
  activeBusinessProfileId: string;
  currentBusinessId: string;
  currentBusiness: (typeof businessProfiles)[number];
  profiles: typeof businessProfiles;
  workspace: BusinessWorkspaceData;
  currentScreen: Screen;
  selectedEstimateId?: string;
  selectedInvoiceId?: string;
  selectedCustomerId?: string;
  selectedLeadId?: string;
  selectedTemplateId?: string;
  selectedAssetId?: string;
  selectedWorkshopItemId?: string;
  selectedFileId?: string;
  selectedQrId?: string;
  qrBuilderPrefill?: {
    qrType?: string;
    destination?: string;
    qrName?: string;
    shortLabel?: string;
  };
  selectedCreateTask?: string;
  selectedHelpService?: string;
  selectedHelpRequestId?: string;
  selectedGuideKey?: string;
  notice?: string;
  unsavedWorkLabel?: string;
  guidedDraft?: {
    builderId: string;
    answers: Record<string, string | string[]>;
    sessionId: string;
  };
  scheduleContext?: {
    customerId?: string;
    leadId?: string;
    projectId?: string;
    estimateId?: string;
    invoiceId?: string;
  };
  setCurrentScreen: (screen: Screen) => void;
  switchBusiness: (businessId: string) => void;
  markUnsavedWork: (label: string, save?: () => void) => void;
  clearUnsavedWork: () => void;
  saveUnsavedWork: () => void;
  openEstimate: (estimateId: string) => void;
  openInvoice: (invoiceId: string) => void;
  openEstimateBuilder: (
    customerId?: string,
    estimateId?: string,
    leadId?: string,
  ) => void;
  openInvoiceBuilder: (customerId?: string, sourceEstimateId?: string) => void;
  openCustomer: (customerId: string) => void;
  openLead: (leadId: string) => void;
  convertLeadToCustomer: (leadId: string) => string | undefined;
  openSchedule: (context?: {
    customerId?: string;
    leadId?: string;
    projectId?: string;
    estimateId?: string;
    invoiceId?: string;
  }) => void;
  scheduleEvent: (
    event: Omit<
      CalendarEvent,
      "id" | "businessProfileId" | "createdAt" | "updatedAt" | "archived"
    >,
  ) => string;
  completeMockImport: (recordType: string, fileName: string) => void;
  recordExport: (
    exportType: string,
    format: "CSV" | "Excel",
    markExported: boolean,
  ) => void;
  updateSuggestion: (
    suggestionId: string,
    status: "Dismissed" | "Snoozed" | "Completed",
  ) => void;
  openActivity: (activityId: string) => void;
  openTemplate: (templateId: string) => void;
  openDocumentStyleEditor: (templateId?: string) => void;
  openAsset: (assetId: string) => void;
  openWorkshopItem: (itemId: string) => void;
  openFile: (fileId: string) => void;
  toggleAssetPin: (assetId: string) => void;
  archiveBusinessAsset: (assetId: string) => void;
  showNotice: (message: string) => void;
  addCustomerNote: (customerId: string, note: string) => void;
  addLeadNote: (leadId: string, note: string) => void;
  archiveLead: (leadId: string) => void;
  addFileMetadata: (file: {
    name: string;
    type?: string;
    customerId?: string;
    leadId?: string;
    projectId?: string;
    helpRequestId?: string;
    workshopItemId?: string;
    qrCodeId?: string;
    source?: string;
    dataUrl?: string;
    generatedContent?: string;
    metadataOnly?: boolean;
    url?: string;
  }) => string;
  archiveFile: (fileId: string) => void;
  pinFileToBusinessKit: (fileId: string) => void;
  recordIntegrationAction: (provider: string, action: string) => void;
  toggleSetupTask: (taskId: string) => void;
  completeGuidedWizard: (
    builderId: string,
    sourceTool: string,
    answers: Record<string, string | string[]>,
  ) => void;
  clearGuidedDraft: () => void;
  createCustomer: (
    customer: Pick<
      Customer,
      | "name"
      | "businessName"
      | "primaryContactName"
      | "phone"
      | "alternatePhone"
      | "email"
      | "website"
      | "billingAddress"
      | "jobSiteAddress"
      | "customerType"
      | "preferredContactMethod"
      | "status"
      | "notes"
      | "leadSource"
      | "internalNotes"
      | "taxable"
      | "paymentTerms"
    >,
  ) => string;
  createLead: (
    lead: Pick<
      import("../types/models").Lead,
      | "name"
      | "businessName"
      | "phone"
      | "email"
      | "address"
      | "interestedService"
      | "source"
      | "preferredContactMethod"
      | "status"
      | "message"
      | "budget"
      | "dateNeeded"
      | "tags"
      | "notes"
      | "internalNotes"
    >,
  ) => string;
  openCreateTask: (
    task: string,
    options?: {
      workshopItemId?: string;
      qrCodeId?: string;
      qrBuilderPrefill?: AppStateValue["qrBuilderPrefill"];
    },
  ) => void;
  openGuidedBuilder: (task: string) => void;
  openHelpRequest: (service?: string) => void;
  openHelpRequestDetail: (requestId: string) => void;
  openHelpGuide: (guideKey: string) => void;
  createQrCode: (
    record: Pick<QRCodeRecord, "name" | "type" | "label" | "status"> &
      Partial<QRCodeRecord> & {
        builderData?: BuilderData;
        previewData?: BuilderData;
      },
  ) => { qrCodeId: string; workshopItemId: string };
  saveWorkshopItem: (
    item: Pick<
      WorkshopItem,
      | "itemType"
      | "title"
      | "description"
      | "status"
      | "createdFrom"
      | "tags"
      | "exportFormats"
    > &
      Partial<WorkshopItem>,
  ) => string;
  duplicateWorkshopItem: (itemId: string, openCopy?: boolean) => string | undefined;
  archiveWorkshopItem: (itemId: string) => void;
  saveWorkshopItemAsTemplate: (itemId: string) => void;
  exportWorkshopItem: (itemId: string, format: string) => void;
  recordWorkshopAction: (itemId: string, action: string) => void;
  saveEstimateFromBuilder: (
    estimate: Estimate,
    customer: Pick<
      Customer,
      | "name"
      | "businessName"
      | "phone"
      | "email"
      | "address"
      | "billingAddress"
      | "jobSiteAddress"
    >,
    status: "Draft" | "Sent",
  ) => string;
  saveEstimateAsTemplate: (estimate: Estimate, templateName: string) => void;
  saveInvoiceFromBuilder: (invoice: Invoice) => string;
  saveDocumentTemplate: (template: DocumentTemplate) => void;
  saveDocumentStyle: (style: DocumentStyleTemplate) => void;
  saveItemBankItem: (item: ItemServiceBankItem) => void;
  deleteItemBankItem: (itemId: string) => void;
  updateBusinessKitCategories: (categories: string[]) => void;
  saveGlobalLibraryItem: (item: GlobalLibraryItem) => void;
  saveProject: (
    project: Pick<
      ProjectJob,
      | "customerId"
      | "name"
      | "status"
      | "leadId"
      | "projectType"
      | "jobLocation"
      | "description"
      | "startDate"
      | "targetCompletionDate"
      | "notes"
      | "internalNotes"
    >,
  ) => string;
  createInvoiceFromAcceptedEstimate: (
    estimateId: string,
    label: string,
    amount: number,
    sourceLineItemIds?: string[],
  ) => boolean;
  applyKit: (
    kit: BusinessKit,
    selectedSections: KitSectionKey[],
    duplicatePolicy?:
      "Keep Both" | "Replace Existing" | "Skip" | "Rename New Item",
  ) => void;
  createProtectedFollowUp: (
    kind: "revision" | "change-order" | "duplicate",
  ) => void;
  submitHelpRequest: (
    request: Omit<HelpRequest, "id" | "businessId" | "status">,
  ) => string;
  handleHelpRequestAction: (
    requestId: string,
    action: string,
    detail?: string,
  ) => void;
  respondToEstimate: (
    estimateId: string,
    action: "approve" | "reject" | "request-changes",
    note: string,
  ) => boolean;
  recordPayment: (invoiceId: string, amount: number, method: string) => void;
  resetDemoData: () => void;
  clearNotice: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildKitTemplates(
  kit: BusinessKit,
  selected: Set<KitSectionKey>,
  existing: Template[],
  businessId: string,
  duplicatePolicy:
    "Keep Both" | "Replace Existing" | "Skip" | "Rename New Item" = "Keep Both",
): Template[] {
  const groups: { key: KitSectionKey; values: string[]; type: string }[] = [
    {
      key: "estimateTemplates",
      values: kit.estimateTemplates,
      type: "Estimate",
    },
    { key: "invoiceTemplates", values: kit.invoiceTemplates, type: "Invoice" },
    {
      key: "progressChangeTemplates",
      values: kit.progressChangeTemplates,
      type: "Progress / Change Order",
    },
    {
      key: "flyerPostTemplates",
      values: kit.flyerPostTemplates,
      type: "Flyer / Post",
    },
    {
      key: "reviewBoosterTools",
      values: kit.reviewBoosterTools,
      type: "Review Booster",
    },
    { key: "customerTags", values: kit.customerTags, type: "Customer Tag" },
    { key: "messageTemplates", values: kit.messageTemplates, type: "Message" },
    {
      key: "suggestedServices",
      values: kit.suggestedServices,
      type: "Service Item",
    },
    { key: "suggestedTerms", values: kit.suggestedTerms, type: "Terms" },
    {
      key: "businessCardTemplate",
      values: kit.businessCardTemplate ? [kit.businessCardTemplate] : [],
      type: "Business Card",
    },
  ];
  const existingNames = new Set(
    existing.map((item) => item.name.toLowerCase()),
  );
  return groups
    .flatMap((group) => (selected.has(group.key) ? group.values : []))
    .flatMap((originalName, index) => {
      const duplicate = existingNames.has(originalName.toLowerCase());
      if (duplicate && duplicatePolicy === "Skip") return [];
      const name =
        duplicate &&
        (duplicatePolicy === "Keep Both" ||
          duplicatePolicy === "Rename New Item")
          ? `${originalName} Copy`
          : originalName;
      return [
        {
          id: `${businessId}-${kit.id}-template-${index}-${name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .slice(0, 24)}`,
          businessId,
          name,
          type:
            groups.find((group) => group.values.includes(name))?.type ??
            "Template",
          sourceKitId: kit.id,
        },
      ];
    });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [storedInitialState] = useState(() => loadStoredAppState());
  const [currentBusinessId, setCurrentBusinessId] = useState(
    storedInitialState?.activeBusinessProfileId ?? businessProfiles[0].id,
  );
  const [workspaces, setWorkspaces] = useState(
    storedInitialState?.workspaces ?? initialWorkspaces,
  );
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>();
  const [selectedLeadId, setSelectedLeadId] = useState<string>();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [selectedAssetId, setSelectedAssetId] = useState<string>();
  const [selectedWorkshopItemId, setSelectedWorkshopItemId] =
    useState<string>();
  const [selectedFileId, setSelectedFileId] = useState<string>();
  const [selectedQrId, setSelectedQrId] = useState<string>();
  const [qrBuilderPrefill, setQrBuilderPrefill] =
    useState<AppStateValue["qrBuilderPrefill"]>();
  const [selectedCreateTask, setSelectedCreateTask] = useState<string>();
  const [selectedHelpService, setSelectedHelpService] = useState<string>();
  const [selectedHelpRequestId, setSelectedHelpRequestId] = useState<string>();
  const [selectedGuideKey, setSelectedGuideKey] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [unsavedWorkLabel, setUnsavedWorkLabel] = useState<string>();
  const [guidedDraft, setGuidedDraft] =
    useState<AppStateValue["guidedDraft"]>();
  const [scheduleContext, setScheduleContext] =
    useState<AppStateValue["scheduleContext"]>();
  const unsavedSaverRef = useRef<(() => void) | undefined>(undefined);
  const suppressNextStorageSaveRef = useRef(false);

  const currentBusiness = businessProfiles.find(
    (profile) => profile.id === currentBusinessId,
  )!;
  const workspace = workspaces[currentBusinessId];

  useEffect(() => {
    if (suppressNextStorageSaveRef.current) {
      suppressNextStorageSaveRef.current = false;
      return;
    }
    saveStoredAppState({
      activeBusinessProfileId: currentBusinessId,
      workspaces,
    });
  }, [currentBusinessId, workspaces]);

  const updateWorkspace = (
    updater: (value: BusinessWorkspaceData) => BusinessWorkspaceData,
  ) => {
    setWorkspaces((current) => ({
      ...current,
      [currentBusinessId]: updater(current[currentBusinessId]),
    }));
  };

  const switchBusiness = (businessId: string) => {
    setCurrentBusinessId(businessId);
    setSelectedEstimateId(undefined);
    setSelectedInvoiceId(undefined);
    setSelectedCustomerId(undefined);
    setSelectedLeadId(undefined);
    setSelectedTemplateId(undefined);
    setSelectedAssetId(undefined);
    setSelectedWorkshopItemId(undefined);
    setSelectedFileId(undefined);
    setSelectedQrId(undefined);
    setQrBuilderPrefill(undefined);
    setSelectedCreateTask(undefined);
    setSelectedHelpService(undefined);
    setSelectedHelpRequestId(undefined);
    setSelectedGuideKey(undefined);
    setScheduleContext(undefined);
    setGuidedDraft(undefined);
    setCurrentScreen("home");
    setNotice(
      `Switched to ${businessProfiles.find((profile) => profile.id === businessId)?.name}. Its records are kept separate.`,
    );
  };

  const openEstimate = (estimateId: string) => {
    setSelectedEstimateId(estimateId);
    setCurrentScreen("estimate-detail");
  };

  const openInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setCurrentScreen("money");
  };

  const openEstimateBuilder = (
    customerId?: string,
    estimateId?: string,
    leadId?: string,
  ) => {
    setSelectedEstimateId(estimateId);
    setSelectedCustomerId(customerId);
    setSelectedLeadId(leadId);
    setCurrentScreen("estimate-builder");
  };

  const openInvoiceBuilder = (
    customerId?: string,
    sourceEstimateId?: string,
  ) => {
    setSelectedCustomerId(customerId);
    setSelectedEstimateId(sourceEstimateId);
    setCurrentScreen("invoice-builder");
  };

  const openCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setCurrentScreen("customer-detail");
  };

  const openLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentScreen("lead-detail");
  };

  const createCustomer: AppStateValue["createCustomer"] = (customer) => {
    const duplicate = workspace.customers.find(
      (item) =>
        (customer.email &&
          item.email.toLowerCase() === customer.email.toLowerCase()) ||
        (customer.phone && item.phone === customer.phone),
    );
    if (duplicate) {
      setNotice(
        `Possible duplicate found: ${duplicate.name}. Open the existing customer or review before keeping both.`,
      );
      setSelectedCustomerId(duplicate.id);
      return duplicate.id;
    }
    const id = `${currentBusinessId}-customer-${Date.now()}`;
    const now = new Date().toISOString();
    updateWorkspace((value) => ({
      ...value,
      customers: [
        {
          id,
          businessId: currentBusinessId,
          name: customer.name,
          businessName: customer.businessName,
          primaryContactName: customer.primaryContactName,
          phone: customer.phone,
          alternatePhone: customer.alternatePhone,
          email: customer.email,
          website: customer.website,
          address: customer.billingAddress ?? "",
          billingAddress: customer.billingAddress,
          jobSiteAddress: customer.jobSiteAddress,
          customerType: customer.customerType,
          preferredContactMethod: customer.preferredContactMethod,
          status: customer.status || "New",
          tags: [],
          lastActivity: "Just now",
          notes: customer.notes ?? [],
          internalNotes: customer.internalNotes ?? [],
          leadSource: customer.leadSource,
          taxable: customer.taxable,
          paymentTerms: customer.paymentTerms,
          projectIds: [],
          appointmentIds: [],
          fileIds: [],
          syncMetadata: {
            sourceSystem: "Manual",
            externalLinks: [],
            syncStatus: "Needs Sync",
            pendingSyncTargets: [],
            pendingExport: false,
            dirtyFields: [],
            possibleDuplicateIds: [],
            syncHistory: ["Created in Start Here Helper"],
          },
          createdAt: now,
          updatedAt: now,
          archived: false,
        },
        ...value.customers,
      ],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Customer saved",
          detail: customer.name,
          occurredAt: "Just now",
          tone: "success",
          type: "customer.created",
          relatedRecordType: "customer",
          relatedRecordId: id,
          deepLinkRoute: "customer-detail",
        },
        ...value.activity,
      ],
    }));
    setSelectedCustomerId(id);
    setNotice("Customer saved.");
    return id;
  };

  const createLead: AppStateValue["createLead"] = (lead) => {
    const duplicate = workspace.leads.find(
      (item) =>
        (lead.email &&
          item.email?.toLowerCase() === lead.email.toLowerCase()) ||
        (lead.phone && item.phone === lead.phone),
    );
    if (duplicate) {
      setNotice(
        `Possible duplicate lead found: ${duplicate.name}. Review it before creating another.`,
      );
      return duplicate.id;
    }
    const id = `${currentBusinessId}-lead-${Date.now()}`;
    const now = new Date().toISOString();
    updateWorkspace((value) => ({
      ...value,
      leads: [
        {
          id,
          businessId: currentBusinessId,
          name: lead.name,
          businessName: lead.businessName,
          phone: lead.phone,
          email: lead.email,
          address: lead.address,
          interestedService: lead.interestedService,
          serviceNeeded: lead.interestedService ?? "",
          source: lead.source,
          preferredContactMethod: lead.preferredContactMethod,
          status: lead.status,
          message: lead.message,
          budget: lead.budget,
          dateNeeded: lead.dateNeeded,
          tags: lead.tags ?? [],
          notes: lead.notes ?? [],
          internalNotes: lead.internalNotes ?? [],
          appointmentIds: [],
          estimateIds: [],
          fileIds: [],
          syncMetadata: {
            sourceSystem: lead.source === "Lead Form" ? "Lead Form" : "Manual",
            externalLinks: [],
            syncStatus: "Not Synced",
            pendingSyncTargets: [],
            pendingExport: false,
            dirtyFields: [],
            possibleDuplicateIds: [],
            syncHistory: ["Lead saved"],
          },
          createdAt: now,
          updatedAt: now,
          archived: false,
        },
        ...value.leads,
      ],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Lead added",
          detail: lead.name,
          occurredAt: "Just now",
          tone: "info",
          type: "lead.created",
          relatedRecordType: "lead",
          relatedRecordId: id,
          deepLinkRoute: "lead-detail",
        },
        ...value.activity,
      ],
    }));
    setNotice("Lead saved.");
    return id;
  };

  const convertLeadToCustomer = (leadId: string) => {
    const lead = workspace.leads.find((item) => item.id === leadId);
    if (!lead) return undefined;
    const customerId = createCustomer({
      name: lead.name,
      businessName: lead.businessName,
      primaryContactName: lead.name,
      phone: lead.phone ?? "",
      alternatePhone: "",
      email: lead.email ?? "",
      website: "",
      billingAddress: lead.address ?? "",
      jobSiteAddress: lead.address ?? "",
      customerType: lead.businessName ? "Business" : "Person",
      preferredContactMethod:
        (lead.preferredContactMethod as Customer["preferredContactMethod"]) ??
        "No preference",
      status: "New",
      notes: [...(lead.notes ?? []), lead.message].filter(Boolean) as string[],
    });
    updateWorkspace((value) => ({
      ...value,
      leads: value.leads.map((item) =>
        item.id === leadId
          ? {
              ...item,
              status: "Converted to Customer",
              convertedCustomerId: customerId,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Lead converted to customer",
          detail: lead.name,
          occurredAt: "Just now",
          tone: "success",
          type: "lead.converted",
          relatedRecordType: "customer",
          relatedRecordId: customerId,
          deepLinkRoute: "customer-detail",
        },
        ...value.activity,
      ],
    }));
    setSelectedCustomerId(customerId);
    setNotice("Lead converted to customer.");
    return customerId;
  };

  const openSchedule: AppStateValue["openSchedule"] = (context = {}) => {
    setScheduleContext(context);
    setCurrentScreen("calendar");
  };

  const scheduleEvent: AppStateValue["scheduleEvent"] = (event) => {
    const id = `${currentBusinessId}-event-${Date.now()}`;
    const now = new Date().toISOString();
    updateWorkspace((value) => ({
      ...value,
      calendarEvents: [
        {
          ...event,
          id,
          businessProfileId: currentBusinessId,
          createdAt: now,
          updatedAt: now,
          archived: false,
        },
        ...value.calendarEvents,
      ],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Appointment scheduled",
          detail: `${event.title} · ${event.startDate}`,
          occurredAt: "Just now",
          tone: "success",
          type: "calendar.created",
          relatedRecordType: "calendar_event",
          relatedRecordId: id,
          deepLinkRoute: "calendar",
        },
        ...value.activity,
      ],
    }));
    setNotice("Appointment scheduled.");
    return id;
  };

  const completeMockImport: AppStateValue["completeMockImport"] = (
    recordType,
    fileName,
  ) => {
    const now = new Date().toISOString();
    const importId = `${currentBusinessId}-import-${Date.now()}`;
    updateWorkspace((value) => ({
      ...value,
      importHistory: [
        {
          id: importId,
          businessProfileId: currentBusinessId,
          recordType,
          fileName,
          status: "Imported",
          importedCount: 3,
          duplicateCount: 1,
          createdAt: now,
        },
        ...value.importHistory,
      ],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: `${recordType} import reviewed`,
          detail: `${fileName} · 3 ready, 1 possible duplicate`,
          occurredAt: "Just now",
          tone: "info",
          type: "import.completed",
          relatedRecordType: "import_history",
          relatedRecordId: importId,
          deepLinkRoute: "sync-center",
        },
        ...value.activity,
      ],
    }));
    setNotice(
      "Import completed in mock mode. Possible duplicates remain in review.",
    );
  };

  const recordExport: AppStateValue["recordExport"] = (
    exportType,
    format,
    markExported,
  ) => {
    const exportId = `${currentBusinessId}-export-${Date.now()}`;
    updateWorkspace((value) => ({
      ...value,
      exportHistory: [
        {
          id: exportId,
          businessProfileId: currentBusinessId,
          exportType,
          format,
          recordCount: exportType.includes("Item")
            ? value.itemBank.length
            : value.customers.length,
          status: markExported ? "Exported" : "Needs Export",
          createdAt: new Date().toISOString(),
        },
        ...value.exportHistory,
      ],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: `${exportType} export prepared`,
          detail: `${format} · ${markExported ? "marked exported" : "kept as needs export"}`,
          occurredAt: "Just now",
          tone: "info",
          type: "export.prepared",
          relatedRecordType: "export_history",
          relatedRecordId: exportId,
          deepLinkRoute: "sync-center",
        },
        ...value.activity,
      ],
    }));
    setNotice(
      markExported
        ? "Export prepared and records marked as exported."
        : "Export prepared. Records still show Needs Export.",
    );
  };

  const updateSuggestion: AppStateValue["updateSuggestion"] = (
    suggestionId,
    status,
  ) => {
    updateWorkspace((value) => ({
      ...value,
      suggestions: value.suggestions.map((item) =>
        item.id === suggestionId
          ? {
              ...item,
              status,
              dismissedAt:
                status === "Dismissed"
                  ? new Date().toISOString()
                  : item.dismissedAt,
              snoozedUntil:
                status === "Snoozed"
                  ? new Date(Date.now() + 86400000).toISOString()
                  : item.snoozedUntil,
            }
          : item,
      ),
    }));
  };

  const openActivity: AppStateValue["openActivity"] = (activityId) => {
    const activity = workspace.activity.find((item) => item.id === activityId);
    if (!activity) return;
    const target = resolveActivityTarget(activity);
    const recordId = activity.relatedRecordId;
    if (target === "estimate-detail" && recordId) openEstimate(recordId);
    else if (target === "money" && activity.relatedRecordType === "invoice" && recordId)
      openInvoice(recordId);
    else if (target === "customer-detail" && recordId) openCustomer(recordId);
    else if (target === "lead-detail" && recordId) openLead(recordId);
    else if (target === "help-request-detail" && recordId)
      openHelpRequestDetail(recordId);
    else if (target === "workshop-library" && recordId)
      openWorkshopItem(recordId);
    else if (target === "file-vault" && recordId) openFile(recordId);
    else if (target === "calendar") openSchedule();
    else setCurrentScreen(target);
    setNotice(
      recordId
        ? `Opened the related ${activity.relatedRecordType?.replaceAll("_", " ") ?? "record"} from Recent Activity.`
        : `Opened the closest section for “${activity.label}.” The exact record is not linked yet.`,
    );
  };

  const openTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCurrentScreen("template-detail");
  };
  const openDocumentStyleEditor = (templateId?: string) => {
    setSelectedTemplateId(templateId);
    setCurrentScreen("document-style-editor");
  };

  const openAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setCurrentScreen("asset-detail");
  };

  const openWorkshopItem = (itemId: string) => {
    setSelectedWorkshopItemId(itemId);
    setCurrentScreen("workshop-library");
  };

  const openFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setCurrentScreen("file-vault");
  };

  const toggleAssetPin = (assetId: string) => {
    updateWorkspace((value) => ({
      ...value,
      businessAssets: value.businessAssets.map((item) =>
        item.id === assetId
          ? {
              ...item,
              pinned: !item.pinned,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    }));
    setNotice("My Business Kit pins updated.");
  };

  const archiveBusinessAsset = (assetId: string) => {
    updateWorkspace((value) => ({
      ...value,
      businessAssets: value.businessAssets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              archived: true,
              pinned: false,
              updatedAt: new Date().toISOString(),
            }
          : asset,
      ),
    }));
    setSelectedAssetId(undefined);
    setCurrentScreen("my-business-kit");
    setNotice("Business asset archived.");
  };

  const addCustomerNote = (customerId: string, note: string) => {
    if (!note.trim()) return;
    updateWorkspace((value) => ({
      ...value,
      customers: value.customers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              notes: [note.trim(), ...customer.notes],
              updatedAt: new Date().toISOString(),
              lastActivity: "Just now",
            }
          : customer,
      ),
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Customer note added",
          detail: note.trim(),
          occurredAt: "Just now",
          tone: "info",
          type: "customer.note",
          relatedRecordType: "customer",
          relatedRecordId: customerId,
          deepLinkRoute: "customer-detail",
        },
        ...value.activity,
      ],
    }));
    setNotice("Customer note saved.");
  };

  const addLeadNote = (leadId: string, note: string) => {
    if (!note.trim()) return;
    updateWorkspace((value) => ({
      ...value,
      leads: value.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              notes: [note.trim(), ...(lead.notes ?? [])],
              updatedAt: new Date().toISOString(),
            }
          : lead,
      ),
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Lead note added",
          detail: note.trim(),
          occurredAt: "Just now",
          tone: "info",
          type: "lead.note",
          relatedRecordType: "lead",
          relatedRecordId: leadId,
          deepLinkRoute: "lead-detail",
        },
        ...value.activity,
      ],
    }));
    setNotice("Lead note saved.");
  };

  const archiveLead = (leadId: string) => {
    updateWorkspace((value) => ({
      ...value,
      leads: value.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: "Archived",
              archived: true,
              updatedAt: new Date().toISOString(),
            }
          : lead,
      ),
    }));
    setNotice("Lead archived for this business.");
    setCurrentScreen("customers");
  };

  const addFileMetadata: AppStateValue["addFileMetadata"] = (file) => {
    const id = makeId(`${currentBusinessId}-file`);
    const now = new Date().toISOString();
    updateWorkspace((value) => ({
      ...value,
      files: [
        {
          id,
          businessId: currentBusinessId,
          name: file.name.trim() || "untitled-file.mock",
          type: file.type ?? "application/octet-stream",
          customerId: file.customerId,
          leadId: file.leadId,
          projectId: file.projectId,
          helpRequestId: file.helpRequestId,
          workshopItemId: file.workshopItemId,
          qrCodeId: file.qrCodeId,
          source: file.source ?? "Upload",
          dataUrl: file.dataUrl,
          generatedContent: file.generatedContent,
          metadataOnly:
            file.metadataOnly ?? (!file.dataUrl && !file.generatedContent),
          url: file.url,
          pinned: false,
          archived: false,
          createdAt: now,
          visibility: "Internal",
        },
        ...value.files,
      ],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "File metadata saved",
          detail: `${file.name} · prototype metadata only`,
          occurredAt: "Just now",
          tone: "info",
          type: "file.created",
          relatedRecordType: "file",
          relatedRecordId: id,
          deepLinkRoute: "file-vault",
        },
        ...value.activity,
      ],
    }));
    setSelectedFileId(id);
    setNotice(
      "File metadata saved in prototype mode. Live file storage is not connected.",
    );
    return id;
  };

  const archiveFile = (fileId: string) => {
    updateWorkspace((value) => ({
      ...value,
      files: value.files.map((file) =>
        file.id === fileId ? { ...file, archived: true } : file,
      ),
    }));
    setSelectedFileId(undefined);
    setNotice("File archived in this prototype workspace.");
  };

  const pinFileToBusinessKit = (fileId: string) => {
    updateWorkspace((value) => {
      const file = value.files.find((item) => item.id === fileId);
      if (!file) return value;
      const existing = value.businessAssets.find((asset) =>
        asset.fileIds.includes(fileId),
      );
      return {
        ...value,
        files: value.files.map((item) =>
          item.id === fileId ? { ...item, pinned: true } : item,
        ),
        businessAssets: existing
          ? value.businessAssets.map((asset) =>
              asset.id === existing.id ? { ...asset, pinned: true } : asset,
            )
          : [
              {
                id: `${currentBusinessId}-asset-${Date.now()}`,
                businessProfileId: currentBusinessId,
                assetType: "file",
                title: file.name,
                description: "Pinned from File Vault",
                fileIds: [fileId],
                tags: ["File Vault"],
                status: "Ready",
                pinned: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                archived: false,
              },
              ...value.businessAssets,
            ],
      };
    });
    setNotice("File pinned to My Business Kit.");
  };

  const recordIntegrationAction = (provider: string, action: string) => {
    updateWorkspace((value) => ({
      ...value,
      integrations: value.integrations.map((integration) =>
        integration.provider === provider
          ? {
              ...integration,
              status:
                integration.status === "Mock Connected"
                  ? integration.status
                  : "Needs Review",
              detail: `${action} requires an approved ${provider} connection. No live account was changed.`,
            }
          : integration,
      ),
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: `${provider} connection reviewed`,
          detail: `${action} prepared; credentials are still required`,
          occurredAt: "Just now",
          tone: "warning",
          type: "integration.reviewed",
          relatedRecordType: "sync_record",
          deepLinkRoute: "sync-center",
        },
        ...value.activity,
      ],
    }));
    setNotice(
      `${provider}: ${action} needs a real account connection. Nothing was synced or sent.`,
    );
  };

  const toggleSetupTask = (taskId: string) => {
    updateWorkspace((value) => ({
      ...value,
      setupTasks: value.setupTasks.map((task) =>
        task.id === taskId ? { ...task, complete: !task.complete } : task,
      ),
    }));
    setNotice("Business setup checklist updated for this profile.");
  };

  const completeGuidedWizard: AppStateValue["completeGuidedWizard"] = (
    builderId,
    sourceTool,
    answers,
  ) => {
    const sessionId = `${currentBusinessId}-wizard-${Date.now()}`;
    const now = new Date().toISOString();
    updateWorkspace((value) => ({
      ...value,
      guidedWizardSessions: [
        {
          id: sessionId,
          businessProfileId: currentBusinessId,
          builderId,
          sourceTool,
          startedAt: now,
          updatedAt: now,
          completedAt: now,
          status: "Converted to Builder Draft",
          answers,
          createdFrom: "Walk Me Through It",
        },
        ...value.guidedWizardSessions,
      ],
    }));
    setGuidedDraft({ builderId, answers, sessionId });
    setCurrentScreen(
      builderId === "estimate-builder"
        ? "estimate-builder"
        : builderId === "invoice-builder"
          ? "invoice-builder"
          : "create-builder",
    );
  };

  const openCreateTask: AppStateValue["openCreateTask"] = (
    task,
    options = {},
  ) => {
    setSelectedCreateTask(task);
    setGuidedDraft(undefined);
    setSelectedWorkshopItemId(options.workshopItemId);
    setSelectedQrId(options.qrCodeId);
    setQrBuilderPrefill(options.qrBuilderPrefill);
    setCurrentScreen("create-mode");
  };

  const openGuidedBuilder = (task: string) => {
    setSelectedCreateTask(task);
    setCurrentScreen("create-wizard");
  };

  const openHelpRequest = (service?: string) => {
    setSelectedHelpService(service);
    setCurrentScreen("help-request");
  };

  const openHelpRequestDetail = (requestId: string) => {
    setSelectedHelpRequestId(requestId);
    setCurrentScreen("help-request-detail");
  };

  const openHelpGuide = (guideKey: string) => {
    setSelectedGuideKey(guideKey);
    setCurrentScreen("help-guide");
  };

  const createQrCode: AppStateValue["createQrCode"] = (record) => {
    const now = new Date().toISOString();
    const qrCodeId = record.id ?? selectedQrId ?? makeId("qr");
    let workshopItemId =
      record.workshopItemId ?? selectedWorkshopItemId ?? makeId("creation");
    const readyStatus = record.status === "Draft" ? "Draft" : "Ready";
    const payload = record.payload ?? record.url ?? "";
    const builderData: BuilderData =
      record.builderData ??
      ({
        qrType: record.type,
        destination: record.url ?? payload,
        qrName: record.name,
        shortLabel: record.label ?? "",
      } satisfies BuilderData);
    const previewData: BuilderData =
      record.previewData ??
      ({
        qrType: record.type,
        destination: record.url ?? payload,
        qrName: record.name,
        shortLabel: record.label ?? "",
      } satisfies BuilderData);
    updateWorkspace((value) => {
      const existingQr = value.qrCodes.find((item) => item.id === qrCodeId);
      const linkedWorkshop =
        value.workshopItems.find((item) => item.id === workshopItemId) ??
        value.workshopItems.find((item) => item.qrCodeIds.includes(qrCodeId));
      if (linkedWorkshop) workshopItemId = linkedWorkshop.id;
      const qrRecord: QRCodeRecord = {
        ...existingQr,
        ...record,
        id: qrCodeId,
        businessId: currentBusinessId,
        name: record.name || "Untitled QR Draft",
        type: record.type || "Custom URL",
        status: readyStatus,
        payloadType: record.payloadType ?? (record.type === "Contact Card" ? "vcard" : "url"),
        payload,
        url: record.url,
        scans: existingQr?.scans ?? record.scans ?? 0,
        fileAssetIds: existingQr?.fileAssetIds ?? record.fileAssetIds ?? [],
        createdAt: existingQr?.createdAt ?? now,
        updatedAt: now,
        createdFrom: record.createdFrom ?? existingQr?.createdFrom ?? "Manual Builder",
        workshopItemId,
      };
      const workshop = linkedWorkshop
        ? normalizeWorkshopItem({
            ...linkedWorkshop,
            title: qrRecord.name,
            description: qrRecord.label ?? qrRecord.url ?? qrRecord.payload ?? "QR code draft",
            status: readyStatus,
            updatedAt: now,
            lastUsedAt: "Just now",
            builderId: "qr-code-builder",
            sourceTool: "Create QR Code",
            builderData,
            previewData,
            qrCodeIds: Array.from(new Set([qrCodeId, ...linkedWorkshop.qrCodeIds])),
            tags: Array.from(new Set([qrRecord.type, ...linkedWorkshop.tags])),
            exportFormats: ["PNG", "SVG", "PDF Sign"],
            version: (linkedWorkshop.version ?? 1) + 1,
            activityHistory: [
              {
                id: `activity-${Date.now()}`,
                label: readyStatus === "Draft" ? "Updated draft" : "Created QR code",
                occurredAt: "Just now",
              },
              ...linkedWorkshop.activityHistory,
            ],
          })
        : createWorkshopItemFromBuilder({
            id: workshopItemId,
            businessProfileId: currentBusinessId,
            builderId: "qr-code-builder",
            sourceTool: "Create QR Code",
            itemType: "qr_code",
            title: qrRecord.name,
            description: qrRecord.label ?? qrRecord.url ?? qrRecord.payload ?? "QR code draft",
            status: readyStatus,
            createdFrom:
              record.createdFrom === "Guided Wizard"
                ? "Guided Wizard"
                : "Manual Builder",
            builderData,
            previewData,
            tags: [qrRecord.type, "QR Code"],
            exportFormats: ["PNG", "SVG", "PDF Sign"],
            qrCodeIds: [qrCodeId],
            activityLabel: readyStatus === "Draft" ? "Saved draft" : "Created QR code",
          });
      return {
        ...value,
        qrCodes: existingQr
          ? value.qrCodes.map((item) => (item.id === qrCodeId ? qrRecord : item))
          : [qrRecord, ...value.qrCodes],
        workshopItems: linkedWorkshop
          ? value.workshopItems.map((item) =>
              item.id === workshopItemId ? workshop : item,
            )
          : [workshop, ...value.workshopItems],
        activity: [
          {
            id: `${Date.now()}`,
            businessId: currentBusinessId,
            label:
              readyStatus === "Draft" ? "QR code draft saved" : "QR code created",
            detail: `${qrRecord.name} was saved to ${currentBusiness.name}.`,
            occurredAt: "Just now",
            tone: readyStatus === "Draft" ? "info" : "success",
            type: readyStatus === "Draft" ? "qr.draft" : "qr.created",
            relatedRecordType: "workshop_item",
            relatedRecordId: workshopItemId,
            deepLinkRoute: "workshop-library",
          },
          ...value.activity,
        ],
      };
    });
    setSelectedQrId(qrCodeId);
    setSelectedWorkshopItemId(workshopItemId);
    setNotice(
      record.status === "Draft"
        ? "Draft saved to My Creations."
        : "Saved to My Creations.",
    );
    return { qrCodeId, workshopItemId };
  };

  const saveWorkshopItem: AppStateValue["saveWorkshopItem"] = (item) => {
    const now = new Date().toISOString();
    let id = item.id ?? selectedWorkshopItemId ?? makeId("creation");
    updateWorkspace((value) => {
      const existing = value.workshopItems.find((candidate) => candidate.id === id);
      if (!existing && item.id) id = item.id;
      const definition =
        item.builderId || item.sourceTool
          ? getBuilderDefinitionForItem({
              builderId: item.builderId,
              sourceTool: item.sourceTool,
              itemType: item.itemType,
            })
          : getBuilderDefinitionForItem(item);
      const builderId = item.builderId ?? definition?.builderId ?? "custom-template";
      const sourceTool =
        item.sourceTool ?? definition?.sourceTool ?? item.itemType.replaceAll("_", " ");
      const activityLabel = existing ? "Updated draft" : item.status === "Draft" ? "Saved draft" : "Created item";
      const savedItem = existing
        ? normalizeWorkshopItem({
            ...existing,
            ...item,
            id,
            businessProfileId: currentBusinessId,
            builderId,
            sourceTool,
            updatedAt: now,
            lastUsedAt: "Just now",
            builderData: item.builderData ?? existing.builderData ?? {},
            previewData: item.previewData ?? existing.previewData ?? {},
            fileAssetIds: item.fileAssetIds ?? existing.fileAssetIds,
            qrCodeIds: item.qrCodeIds ?? existing.qrCodeIds,
            socialPostIds: item.socialPostIds ?? existing.socialPostIds,
            linkedCustomerIds: item.linkedCustomerIds ?? existing.linkedCustomerIds,
            linkedLeadIds: item.linkedLeadIds ?? existing.linkedLeadIds,
            linkedProjectIds: item.linkedProjectIds ?? existing.linkedProjectIds,
            linkedEstimateIds: item.linkedEstimateIds ?? existing.linkedEstimateIds,
            linkedInvoiceIds: item.linkedInvoiceIds ?? existing.linkedInvoiceIds,
            exportHistory: item.exportHistory ?? existing.exportHistory,
            version: (existing.version ?? 1) + 1,
            activityHistory: [
              {
                id: `activity-${Date.now()}`,
                label: activityLabel,
                occurredAt: "Just now",
              },
              ...existing.activityHistory,
            ],
          })
        : createWorkshopItemFromBuilder({
            id,
            businessProfileId: currentBusinessId,
            builderId,
            sourceTool,
            itemType: item.itemType,
            title: item.title,
            description: item.description,
            status: item.status,
            createdFrom: item.createdFrom,
            builderData: item.builderData ?? {},
            previewData: item.previewData ?? item.builderData ?? {},
            tags: item.tags,
            exportFormats: item.exportFormats,
            fileAssetIds: item.fileAssetIds,
            qrCodeIds: item.qrCodeIds,
            socialPostIds: item.socialPostIds,
            linkedCustomerIds: item.linkedCustomerIds,
            linkedLeadIds: item.linkedLeadIds,
            linkedProjectIds: item.linkedProjectIds,
            linkedEstimateIds: item.linkedEstimateIds,
            linkedInvoiceIds: item.linkedInvoiceIds,
            activityLabel,
          });
      return {
        ...value,
        workshopItems: existing
          ? value.workshopItems.map((candidate) =>
              candidate.id === id ? savedItem : candidate,
            )
          : [savedItem, ...value.workshopItems],
        activity: [
          {
            id: `${Date.now()}`,
            businessId: currentBusinessId,
            label:
              item.status === "Draft"
                ? "Workshop draft saved"
                : "Workshop item created",
            detail: `${item.title} was saved to My Creations.`,
            occurredAt: "Just now",
            tone: item.status === "Draft" ? "info" : "success",
            type: "workshop.saved",
            relatedRecordType: "workshop_item",
            relatedRecordId: id,
            deepLinkRoute: "workshop-library",
          },
          ...value.activity,
        ],
      };
    });
    setSelectedWorkshopItemId(id);
    setNotice("Draft saved to My Creations.");
    return id;
  };

  const duplicateWorkshopItem: AppStateValue["duplicateWorkshopItem"] = (
    itemId,
    openCopy = false,
  ) => {
    const newId = makeId("creation");
    const source = workspace.workshopItems.find((item) => item.id === itemId);
    if (!source) {
      setNotice("This creation could not be found.");
      return undefined;
    }
    const copiedItem = duplicateWorkshopItemPayload(source, newId);
    updateWorkspace((value) => {
      return {
        ...value,
        workshopItems: [copiedItem, ...value.workshopItems],
      };
    });
    if (openCopy) {
      setSelectedWorkshopItemId(newId);
      const definition = getBuilderDefinitionForItem(copiedItem);
      if (definition) {
        setSelectedCreateTask(definition.createTask);
        setCurrentScreen("create-builder");
      }
    }
    setNotice("A new draft copy was added to My Creations.");
    return newId;
  };

  const archiveWorkshopItem: AppStateValue["archiveWorkshopItem"] = (
    itemId,
  ) => {
    updateWorkspace((value) => ({
      ...value,
      workshopItems: value.workshopItems.map((item) =>
        item.id === itemId
          ? {
              ...normalizeWorkshopItem(item),
              archived: true,
              status: "Archived",
              updatedAt: new Date().toISOString(),
              activityHistory: [
                {
                  id: `activity-${Date.now()}`,
                  label: "Archived item",
                  occurredAt: "Just now",
                },
                ...item.activityHistory,
              ],
            }
          : item,
      ),
    }));
    setNotice("Creation archived.");
  };

  const saveWorkshopItemAsTemplate: AppStateValue["saveWorkshopItemAsTemplate"] =
    (itemId) => {
      updateWorkspace((value) => {
        const item = value.workshopItems.find(
          (candidate) => candidate.id === itemId,
        );
        if (!item) return value;
        const templateName = `${item.title} Template`;
        const templateItem = stripOneTimeDataForTemplate(item);
        return {
          ...value,
          workshopItems: [templateItem, ...value.workshopItems],
          templates: [
            {
              id: `template-${Date.now()}`,
              businessId: currentBusinessId,
              name: templateName,
              type: item.itemType.replaceAll("_", " "),
            },
            ...value.templates,
          ],
        };
      });
      setNotice("Saved as a template for this business.");
    };

  const exportWorkshopItem: AppStateValue["exportWorkshopItem"] = (
    itemId,
    format,
  ) => {
    const fileId = makeId("file");
    updateWorkspace((value) => {
      const item = value.workshopItems.find(
        (candidate) => candidate.id === itemId,
      );
      if (!item) return value;
      const normalizedItem = normalizeWorkshopItem(item);
      const extension = /pdf/i.test(format)
        ? "pdf"
        : /jpg/i.test(format)
          ? "jpg"
          : "png";
      const fileName = `${item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}.${extension}`;
      return {
        ...value,
        files: [
          {
            id: fileId,
            businessId: currentBusinessId,
            name: fileName,
            type:
              extension === "pdf"
                ? "application/pdf"
                : `image/${extension === "jpg" ? "jpeg" : extension}`,
            workshopItemId: itemId,
            qrCodeId: normalizedItem.qrCodeIds[0],
            source: "Workshop Export",
            metadataOnly: true,
            visibility: "Internal",
          },
          ...value.files,
        ],
        workshopItems: value.workshopItems.map((candidate) =>
          candidate.id === itemId
            ? {
                ...normalizeWorkshopItem(candidate),
                status: "Downloaded",
                updatedAt: new Date().toISOString(),
                fileAssetIds: [fileId, ...normalizeWorkshopItem(candidate).fileAssetIds],
                exportHistory: [
                  {
                    id: `export-${Date.now()}`,
                    format,
                    fileId,
                    label: format,
                    createdAt: new Date().toISOString(),
                  },
                  ...(normalizeWorkshopItem(candidate).exportHistory ?? []),
                ],
                activityHistory: [
                  {
                    id: `activity-${Date.now()}`,
                    label: `Downloaded export: ${format}`,
                    occurredAt: "Just now",
                  },
                  ...candidate.activityHistory,
                ],
              }
            : candidate,
        ),
      };
    });
    setNotice("Export saved to File Vault and linked to this creation.");
  };

  const recordWorkshopAction: AppStateValue["recordWorkshopAction"] = (
    itemId,
    action,
  ) => {
    updateWorkspace((value) => ({
      ...value,
      workshopItems: value.workshopItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: item.status,
              updatedAt: new Date().toISOString(),
              lastUsedAt: "Just now",
              activityHistory: [
                {
                  id: `activity-${Date.now()}`,
                  label: action,
                  occurredAt: "Just now",
                },
                ...item.activityHistory,
              ],
            }
          : item,
      ),
    }));
    setNotice(
      /Post|Send|Email|Social/i.test(action)
        ? `${action} prepared in mock mode. Connect the required account before anything is sent or posted.`
        : `${action} recorded in My Creations.`,
    );
  };

  const saveEstimateFromBuilder: AppStateValue["saveEstimateFromBuilder"] = (
    estimate,
    customer,
    status,
  ) => {
    const existingCustomer = workspace.customers.find(
      (item) =>
        item.id === estimate.customerId ||
        (customer.email && item.email === customer.email),
    );
    const customerId =
      existingCustomer?.id ?? `${currentBusinessId}-customer-${Date.now()}`;
    const nextCustomer: Customer | undefined =
      existingCustomer || !customer.name.trim()
        ? undefined
        : {
            id: customerId,
            businessId: currentBusinessId,
            name: customer.name,
            businessName: customer.businessName,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            billingAddress: customer.billingAddress,
            jobSiteAddress: customer.jobSiteAddress,
            status: "Active customer",
            tags: [],
            lastActivity: "Just now",
            notes: [],
          };
    const now = new Date().toISOString();
    const priorSavedEstimate = workspace.estimates.find(
      (item) => item.id === estimate.id,
    );
    const baseEstimate: Estimate = {
      ...estimate,
      versions: priorSavedEstimate?.versions ?? estimate.versions,
      businessId: currentBusinessId,
      businessProfileId: currentBusinessId,
      customerId,
      status,
      updatedAt: now,
      approvalToken:
        estimate.approvalToken || `${currentBusinessId}-${Date.now()}`,
    };
    const version = createEstimateVersion(
      baseEstimate,
      status,
      status === "Sent"
        ? "Sent for customer approval"
        : "Draft saved from Estimate Builder",
    );
    const savedEstimate: Estimate = {
      ...baseEstimate,
      currentVersionId: version.id,
      versions: [version, ...baseEstimate.versions],
    };
    updateWorkspace((value) => ({
      ...value,
      customers: nextCustomer
        ? [...value.customers, nextCustomer]
        : value.customers,
      estimates: value.estimates.some((item) => item.id === savedEstimate.id)
        ? value.estimates.map((item) =>
            item.id === savedEstimate.id ? savedEstimate : item,
          )
        : [savedEstimate, ...value.estimates],
      documentNumberSettings: priorSavedEstimate
        ? value.documentNumberSettings
        : {
            ...value.documentNumberSettings,
            nextEstimateNumber:
              value.documentNumberSettings.nextEstimateNumber + 1,
          },
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label:
            status === "Sent"
              ? `Estimate ${savedEstimate.number} sent for approval`
              : `Estimate ${savedEstimate.number} draft saved`,
          detail: `${savedEstimate.projectName} · $${savedEstimate.total.toLocaleString()}`,
          occurredAt: "Just now",
          tone: status === "Sent" ? "success" : "info",
          type: status === "Sent" ? "estimate.sent" : "estimate.draft",
          relatedRecordType: "estimate",
          relatedRecordId: savedEstimate.id,
          deepLinkRoute: "estimate-detail",
        },
        ...value.activity,
      ],
    }));
    setSelectedEstimateId(savedEstimate.id);
    setNotice(
      status === "Sent"
        ? "Estimate sent for approval in mock mode. The protected version was saved."
        : "Estimate draft saved.",
    );
    return savedEstimate.id;
  };

  const saveEstimateAsTemplate: AppStateValue["saveEstimateAsTemplate"] = (
    estimate,
    templateName,
  ) => {
    updateWorkspace((value) => ({
      ...value,
      templates: [
        {
          id: `template-${Date.now()}`,
          businessId: currentBusinessId,
          name: templateName,
          type: "Estimate",
        },
        ...value.templates,
      ],
    }));
    setNotice(`${templateName} saved to this business’s Templates.`);
  };

  const saveInvoiceFromBuilder: AppStateValue["saveInvoiceFromBuilder"] = (
    invoice,
  ) => {
    const existing = workspace.invoices.some((item) => item.id === invoice.id);
    const saved = {
      ...invoice,
      businessId: currentBusinessId,
      balanceDue: Math.max(0, invoice.total - invoice.amountPaid),
    };
    updateWorkspace((value) => ({
      ...value,
      invoices: existing
        ? value.invoices.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...value.invoices],
      documentNumberSettings: existing
        ? value.documentNumberSettings
        : {
            ...value.documentNumberSettings,
            nextInvoiceNumber:
              value.documentNumberSettings.nextInvoiceNumber + 1,
          },
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: `Invoice ${saved.number} ${saved.status === "Sent" ? "sent" : "saved"}`,
          detail: `${saved.title ?? "Invoice"} · $${saved.total.toLocaleString()}`,
          occurredAt: "Just now",
          tone: saved.status === "Sent" ? "success" : "info",
          type: "invoice.saved",
          relatedRecordType: "invoice",
          relatedRecordId: saved.id,
          deepLinkRoute: "money",
        },
        ...value.activity,
      ],
    }));
    setNotice(
      saved.status === "Sent"
        ? "Invoice sent in mock mode."
        : "Invoice draft saved.",
    );
    return saved.id;
  };

  const saveDocumentTemplate: AppStateValue["saveDocumentTemplate"] = (
    template,
  ) => {
    updateWorkspace((value) => ({
      ...value,
      documentTemplates: value.documentTemplates.some(
        (item) => item.templateId === template.templateId,
      )
        ? value.documentTemplates.map((item) =>
            item.templateId === template.templateId
              ? {
                  ...template,
                  businessProfileId: currentBusinessId,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          )
        : [
            {
              ...template,
              businessProfileId: currentBusinessId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...value.documentTemplates,
          ],
    }));
    setNotice(`${template.templateName} saved to My Business Kit.`);
  };

  const saveDocumentStyle: AppStateValue["saveDocumentStyle"] = (style) => {
    updateWorkspace((value) => ({
      ...value,
      documentStyles: value.documentStyles.some((item) => item.id === style.id)
        ? value.documentStyles.map((item) =>
            item.id === style.id
              ? {
                  ...style,
                  businessProfileId: currentBusinessId,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          )
        : [
            {
              ...style,
              businessProfileId: currentBusinessId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...value.documentStyles,
          ],
    }));
    setNotice(
      `${style.templateName} saved to this business’s document styles.`,
    );
  };

  const saveItemBankItem: AppStateValue["saveItemBankItem"] = (item) => {
    updateWorkspace((value) => ({
      ...value,
      itemBank: value.itemBank.some((entry) => entry.id === item.id)
        ? value.itemBank.map((entry) =>
            entry.id === item.id
              ? { ...item, businessProfileId: currentBusinessId }
              : entry,
          )
        : [
            { ...item, businessProfileId: currentBusinessId },
            ...value.itemBank,
          ],
    }));
    setNotice(`${item.name} saved to this business’s Item & Service Bank.`);
  };

  const deleteItemBankItem = (itemId: string) => {
    updateWorkspace((value) => ({
      ...value,
      itemBank: value.itemBank.filter((item) => item.id !== itemId),
      businessHomeKit: {
        ...value.businessHomeKit,
        itemBankIds: value.businessHomeKit.itemBankIds.filter(
          (id) => id !== itemId,
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
    setNotice(
      "Item removed from this business’s Item & Service Bank. Existing documents keep their saved snapshots.",
    );
  };

  const updateBusinessKitCategories = (categories: string[]) => {
    updateWorkspace((value) => ({
      ...value,
      businessHomeKit: {
        ...value.businessHomeKit,
        categories,
        updatedAt: new Date().toISOString(),
      },
    }));
    setNotice("Business Kit categories updated.");
  };

  const saveGlobalLibraryItem = (item: GlobalLibraryItem) => {
    const now = new Date().toISOString();
    updateWorkspace((value) => {
      const duplicateName = [
        ...value.itemBank.map((entry) => entry.name),
        ...value.templates.map((entry) => entry.name),
        ...value.businessAssets.map((entry) => entry.title),
      ].some((name) => name.toLowerCase() === item.title.toLowerCase());
      const title = duplicateName ? `${item.title} Copy` : item.title;
      const itemTypes = [
        "item",
        "service",
        "product",
        "material",
        "labor",
        "fee",
        "discount",
        "deposit",
      ];
      if (itemTypes.includes(item.libraryType))
        return {
          ...value,
          itemBank: [
            {
              id: `${currentBusinessId}-global-${item.id}-${Date.now()}`,
              businessProfileId: currentBusinessId,
              name: title,
              description: item.description,
              customerDescription:
                item.customerVisibleDescription ?? item.description,
              category: item.category,
              unit: item.defaultUnit ?? "each",
              defaultQuantity: item.defaultQuantity ?? 1,
              defaultRate: item.defaultRate ?? 0,
              taxable: item.taxableDefault ?? false,
              lastUsed: "Not used yet",
              source: "Starter Kit",
            },
            ...value.itemBank,
          ],
        };
      if (item.libraryType === "message_template")
        return {
          ...value,
          messageTemplates: [
            {
              id: `${currentBusinessId}-${item.id}-${Date.now()}`,
              businessProfileId: currentBusinessId,
              name: title,
              type: "Global starter",
              message: item.description,
            },
            ...value.messageTemplates,
          ],
        };
      if (item.libraryType === "qr_starter")
        return {
          ...value,
          qrCodes: [
            {
              id: `${currentBusinessId}-${item.id}-${Date.now()}`,
              businessId: currentBusinessId,
              name: title,
              type: "Starter",
              url: "",
              scans: 0,
              status: "Draft",
            },
            ...value.qrCodes,
          ],
        };
      if (item.libraryType === "lead_form")
        return {
          ...value,
          leadForms: [
            {
              id: `${currentBusinessId}-${item.id}-${Date.now()}`,
              businessId: currentBusinessId,
              name: title,
              publicPath: `/forms/${currentBusinessId}/${item.id}`,
              submissions: 0,
            },
            ...value.leadForms,
          ],
        };
      if (item.libraryType === "category")
        return {
          ...value,
          businessHomeKit: {
            ...value.businessHomeKit,
            categories: value.businessHomeKit.categories.includes(title)
              ? value.businessHomeKit.categories
              : [...value.businessHomeKit.categories, title],
            updatedAt: now,
          },
        };
      if (
        ["term", "footer", "payment_instruction", "approval_preset"].includes(
          item.libraryType,
        )
      )
        return {
          ...value,
          businessAssets: [
            {
              id: `${currentBusinessId}-${item.id}-${Date.now()}`,
              businessProfileId: currentBusinessId,
              assetType: item.libraryType,
              title,
              description: item.description,
              fileIds: [],
              tags: item.industryTags,
              status: "Ready",
              pinned: false,
              createdAt: now,
              updatedAt: now,
              archived: false,
            },
            ...value.businessAssets,
          ],
        };
      return {
        ...value,
        templates: [
          {
            id: `${currentBusinessId}-${item.id}-${Date.now()}`,
            businessId: currentBusinessId,
            name: title,
            type: item.libraryType.replaceAll("_", " "),
          },
          ...value.templates,
        ],
      };
    });
    setNotice(
      `${item.title} saved to ${currentBusiness.name}. Existing items were not overwritten.`,
    );
  };

  const saveProject: AppStateValue["saveProject"] = (project) => {
    const id = `${currentBusinessId}-project-${Date.now()}`;
    const now = new Date().toISOString();
    updateWorkspace((value) => ({
      ...value,
      projects: [
        {
          ...project,
          id,
          businessId: currentBusinessId,
          fileIds: [],
          estimateIds: [],
          invoiceIds: [],
          changeOrderIds: [],
          progressInvoiceIds: [],
          lastActivity: "Just now",
          archived: false,
          createdAt: now,
          updatedAt: now,
        },
        ...value.projects,
      ],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Project created",
          detail: project.name,
          occurredAt: "Just now",
          tone: "success",
          type: "project.created",
          relatedRecordType: "project",
          relatedRecordId: id,
          deepLinkRoute: "customers",
        },
        ...value.activity,
      ],
    }));
    setNotice("Project saved.");
    return id;
  };

  const createInvoiceFromAcceptedEstimate: AppStateValue["createInvoiceFromAcceptedEstimate"] =
    (estimateId, label, amount, sourceLineItemIds = []) => {
      const estimate = workspace.estimates.find(
        (item) => item.id === estimateId,
      );
      if (!estimate) return false;
      const validation = validateInvoiceAgainstAcceptedScope({
        estimate,
        changeOrders: workspace.changeOrders,
        invoices: workspace.invoices,
        proposedAmount: amount,
        sourceLineItemIds,
      });
      if (!validation.valid) {
        setNotice(validation.message);
        return false;
      }
      const number = `#INV-${workspace.invoices.length + 1}`;
      updateWorkspace((value) => ({
        ...value,
        invoices: [
          {
            id: `${currentBusinessId}-invoice-${Date.now()}`,
            businessId: currentBusinessId,
            estimateId,
            sourceLineItemIds,
            number,
            customerId: estimate.customerId,
            status: "Draft",
            total: amount,
            amountPaid: 0,
            dueDate: new Date(Date.now() + 14 * 86400000)
              .toISOString()
              .slice(0, 10),
            payments: [],
          },
          ...value.invoices,
        ],
        activity: [
          {
            id: `${Date.now()}`,
            businessId: currentBusinessId,
            label: `${label} created from accepted estimate`,
            detail: `${number} · $${amount.toLocaleString()} within approved scope`,
            occurredAt: "Just now",
            tone: "info",
            type: "invoice.created",
          },
          ...value.activity,
        ],
      }));
      setNotice(
        `${label} created as ${number}. The accepted estimate remains locked.`,
      );
      return true;
    };

  const applyKit: AppStateValue["applyKit"] = (
    kit,
    selectedSections,
    duplicatePolicy = "Keep Both",
  ) => {
    if (
      workspace.templates.some(
        (item) => item.sourceKitId === kit.id && item.type === "Kit marker",
      )
    ) {
      setNotice(`${kit.name} is already applied to this business.`);
      return;
    }
    const selected = new Set(selectedSections);
    updateWorkspace((value) => ({
      ...value,
      templates: [
        ...(duplicatePolicy === "Replace Existing"
          ? value.templates.filter(
              (item) =>
                ![
                  ...kit.estimateTemplates,
                  ...kit.invoiceTemplates,
                  ...kit.progressChangeTemplates,
                ].some(
                  (name) => name.toLowerCase() === item.name.toLowerCase(),
                ),
            )
          : value.templates),
        ...buildKitTemplates(
          kit,
          selected,
          value.templates,
          currentBusinessId,
          duplicatePolicy,
        ),
        {
          id: `${currentBusinessId}-${kit.id}-marker`,
          businessId: currentBusinessId,
          name: `${kit.name} applied`,
          type: "Kit marker",
          sourceKitId: kit.id,
        },
      ],
      itemBank: selected.has("suggestedServices")
        ? [
            ...(duplicatePolicy === "Replace Existing"
              ? value.itemBank.filter(
                  (item) =>
                    !kit.suggestedServices.some(
                      (name) => name.toLowerCase() === item.name.toLowerCase(),
                    ),
                )
              : value.itemBank),
            ...kit.suggestedServices
              .filter(
                (name) =>
                  duplicatePolicy !== "Skip" ||
                  !value.itemBank.some(
                    (item) => item.name.toLowerCase() === name.toLowerCase(),
                  ),
              )
              .map((originalName, index) => {
                const duplicate = value.itemBank.some(
                  (item) =>
                    item.name.toLowerCase() === originalName.toLowerCase(),
                );
                const name =
                  duplicate &&
                  (duplicatePolicy === "Keep Both" ||
                    duplicatePolicy === "Rename New Item")
                    ? `${originalName} Copy`
                    : originalName;
                return {
                  id: `${currentBusinessId}-${kit.id}-bank-${index}`,
                  businessProfileId: currentBusinessId,
                  name,
                  description: `${name} starter from ${kit.name}.`,
                  customerDescription: name,
                  category: "Services",
                  unit: "each",
                  defaultQuantity: 1,
                  defaultRate: 0,
                  taxable: false,
                  lastUsed: "Not used yet",
                  source: "Starter Kit" as const,
                };
              }),
          ]
        : value.itemBank,
      businessAssets: selected.has("suggestedTerms")
        ? [
            ...value.businessAssets,
            ...kit.suggestedTerms
              .filter(
                (title) =>
                  !value.businessAssets.some(
                    (asset) =>
                      asset.title.toLowerCase() === title.toLowerCase(),
                  ),
              )
              .map((title, index) => ({
                id: `${currentBusinessId}-${kit.id}-term-${index}`,
                businessProfileId: currentBusinessId,
                assetType: "terms",
                title,
                description: title,
                fileIds: [],
                tags: ["starter kit", "terms"],
                status: "Ready",
                pinned: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                archived: false,
              })),
          ]
        : value.businessAssets,
      businessHomeKit: {
        ...value.businessHomeKit,
        itemBankIds: selected.has("suggestedServices")
          ? [
              ...value.businessHomeKit.itemBankIds,
              ...kit.suggestedServices
                .filter(
                  (name) =>
                    !value.itemBank.some(
                      (item) => item.name.toLowerCase() === name.toLowerCase(),
                    ),
                )
                .map(
                  (_, index) => `${currentBusinessId}-${kit.id}-bank-${index}`,
                ),
            ]
          : value.businessHomeKit.itemBankIds,
        categories:
          selected.has("suggestedServices") &&
          !value.businessHomeKit.categories.includes("Services")
            ? [...value.businessHomeKit.categories, "Services"]
            : value.businessHomeKit.categories,
        updatedAt: new Date().toISOString(),
      },
      leadForms: selected.has("leadForms")
        ? [
            ...value.leadForms,
            ...kit.leadForms
              .filter(
                (name) => !value.leadForms.some((item) => item.name === name),
              )
              .map((name, index) => ({
                id: `${currentBusinessId}-${kit.id}-form-${index}`,
                businessId: currentBusinessId,
                name,
                publicPath: `/forms/${currentBusinessId}/${kit.id}/${index}`,
                submissions: 0,
              })),
          ]
        : value.leadForms,
      qrCodes: selected.has("qrStarters")
        ? [
            ...value.qrCodes,
            ...kit.qrStarters
              .filter(
                (name) => !value.qrCodes.some((item) => item.name === name),
              )
              .map((name, index) => ({
                id: `${currentBusinessId}-${kit.id}-qr-${index}`,
                businessId: currentBusinessId,
                name,
                type: "Starter",
                url: "",
                scans: 0,
              })),
          ]
        : value.qrCodes,
      files: selected.has("suggestedFolders")
        ? [
            ...value.files,
            ...kit.suggestedFolders
              .filter((name) => !value.files.some((item) => item.name === name))
              .map((name, index) => ({
                id: `${currentBusinessId}-${kit.id}-folder-${index}`,
                businessId: currentBusinessId,
                name,
                type: "folder",
                visibility: "Internal" as const,
              })),
          ]
        : value.files,
      setupTasks: selected.has("setupChecklist")
        ? [
            ...value.setupTasks,
            ...kit.setupChecklist
              .filter(
                (label) =>
                  !value.setupTasks.some((item) => item.label === label),
              )
              .map((label, index) => ({
                id: `${currentBusinessId}-${kit.id}-setup-${index}`,
                businessId: currentBusinessId,
                label,
                complete: false,
              })),
          ]
        : value.setupTasks,
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: `${kit.name} applied`,
          detail:
            "Starter items were added. Existing records were not changed.",
          occurredAt: "Just now",
          tone: "success",
          type: "kit.applied",
        },
        ...value.activity,
      ],
    }));
    const selectedItemCount = selectedSections.reduce(
      (sum, key) =>
        sum +
        (Array.isArray(kit[key])
          ? (kit[key] as string[]).length
          : kit[key]
            ? 1
            : 0),
      0,
    );
    setNotice(
      `${kit.name} added ${selectedItemCount} selected starter items. Existing names were skipped; no records were overwritten.`,
    );
  };

  const createProtectedFollowUp = (
    kind: "revision" | "change-order" | "duplicate",
  ) => {
    const estimate = workspace.estimates.find(
      (item) => item.id === selectedEstimateId,
    );
    if (!estimate) return;
    const labels = {
      revision: "Revision created for reapproval",
      "change-order": "Change order created",
      duplicate: "New estimate copy created",
    };
    updateWorkspace((value) => {
      if (kind === "change-order") {
        return {
          ...value,
          changeOrders: [
            ...value.changeOrders,
            {
              id: `${Date.now()}`,
              businessId: currentBusinessId,
              number: `#CO-${estimate.number.replace("#", "")}-${value.changeOrders.length + 1}`,
              estimateId: estimate.id,
              reason: "New tracked change",
              amount: 0,
              status: "Draft",
            },
          ],
          activity: [
            {
              id: `${Date.now()}`,
              businessId: currentBusinessId,
              label: labels[kind],
              detail: `${estimate.number} remains locked`,
              occurredAt: "Just now",
              tone: "info",
              type: "change-order.created",
            },
            ...value.activity,
          ],
        };
      }
      const copy: Estimate = {
        ...estimate,
        id: `${estimate.id}-${kind}-${Date.now()}`,
        number: `#${1043 + value.estimates.length}`,
        status: "Draft",
        approvalToken: `${currentBusinessId}-${Date.now()}`,
        versions: [createEstimateVersion(estimate, "Draft", labels[kind])],
      };
      return {
        ...value,
        estimates: [...value.estimates, copy],
        activity: [
          {
            id: `${Date.now()}`,
            businessId: currentBusinessId,
            label: labels[kind],
            detail: `Protected ${estimate.number} was not changed`,
            occurredAt: "Just now",
            tone: "info",
            type: `estimate.${kind}`,
          },
          ...value.activity,
        ],
      };
    });
    setNotice(`${labels[kind]}. The accepted version stays locked.`);
  };

  const submitHelpRequest: AppStateValue["submitHelpRequest"] = (request) => {
    const requestId = `help-${Date.now()}`;
    const uploadedFiles = request.fileNames.map((name, index) => ({
      id: `${requestId}-file-${index + 1}`,
      businessId: currentBusinessId,
      name,
      type: name.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "application/octet-stream",
      helpRequestId: requestId,
      visibility: "Internal" as const,
    }));
    const now = new Date().toISOString();
    updateWorkspace((value) => ({
      ...value,
      helpRequests: [
        {
          ...request,
          id: requestId,
          businessId: currentBusinessId,
          status: "Request Received",
          uploadedFileIds: uploadedFiles.map((file) => file.id),
          quoteStatus: request.quoteStatus ?? "Waiting Review",
          timeline: request.timeline ?? [
            {
              id: `${requestId}-timeline-1`,
              helpRequestId: requestId,
              type: "submitted",
              title: "Request submitted",
              message: `${request.fileNames.length} file${request.fileNames.length === 1 ? "" : "s"} attached`,
              createdAt: now,
              createdBy: "User",
            },
          ],
          messages: request.messages ?? [
            {
              id: `${requestId}-message-1`,
              senderType: "System",
              message:
                "Start Here will review this request before any larger work begins.",
              createdAt: now,
            },
          ],
          updatedAt: now,
        },
        ...value.helpRequests,
      ],
      files: [...uploadedFiles, ...value.files],
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Help request submitted",
          detail: "Start Here will review it before any larger work or charge.",
          occurredAt: "Just now",
          tone: "info",
          type: "help.submitted",
          relatedRecordType: "help_request",
          relatedRecordId: requestId,
          deepLinkRoute: "help-request-detail",
        },
        ...value.activity,
      ],
    }));
    setNotice(
      "Request received. Start Here will review it before any larger work begins.",
    );
    setSelectedHelpRequestId(requestId);
    return requestId;
  };

  const handleHelpRequestAction = (
    requestId: string,
    action: string,
    detail?: string,
  ) => {
    const now = new Date().toISOString();
    updateWorkspace((value) => {
      const request = value.helpRequests.find((item) => item.id === requestId);
      if (!request) return value;
      const createsFile = /Upload|Save to File Vault|Download Final/i.test(
        action,
      );
      const fileId = `${requestId}-action-file-${Date.now()}`;
      const createsAsset = action === "Save to My Business Kit";
      const createsWorkshop = action === "Use in Create";
      const nextStatus =
        action === "Approve Quote"
          ? "In Progress"
          : action === "Decline Quote"
            ? "Canceled"
            : action === "Approve"
              ? "Completed"
              : action === "Request Revision"
                ? "Revision Requested"
                : request.status;
      const assetId = `${requestId}-asset-${Date.now()}`;
      const workshopId = `${requestId}-creation-${Date.now()}`;
      return {
        ...value,
        files: createsFile
          ? [
              {
                id: fileId,
                businessId: currentBusinessId,
                name: /Upload/i.test(action)
                  ? detail?.trim() || "additional-help-file.mock"
                  : `${request.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-final.mock`,
                type: "application/octet-stream",
                helpRequestId: requestId,
                visibility: "Internal",
              },
              ...value.files,
            ]
          : value.files,
        businessAssets: createsAsset
          ? [
              {
                id: assetId,
                businessProfileId: currentBusinessId,
                assetType: request.serviceKey?.includes("logo")
                  ? "logo"
                  : request.serviceKey?.includes("template")
                    ? "document_style"
                    : request.serviceKey?.includes("qr")
                      ? "qr_code"
                      : "file",
                title: `${request.type} final asset`,
                description: `Created from Help Request ${request.id}`,
                fileIds: request.finalFileIds ?? request.uploadedFileIds ?? [],
                tags: ["help request"],
                status: "Ready",
                pinned: false,
                createdAt: now,
                updatedAt: now,
                archived: false,
              },
              ...value.businessAssets,
            ]
          : value.businessAssets,
        workshopItems: createsWorkshop
          ? [
              {
                id: workshopId,
                businessProfileId: currentBusinessId,
                itemType: request.serviceKey?.includes("qr")
                  ? "qr_code"
                  : request.serviceKey?.includes("business_card")
                    ? "business_card"
                    : request.serviceKey?.includes("flyer")
                      ? "flyer"
                      : "custom_template",
                title: `${request.type} result`,
                description: `Created from Help Request ${request.id}`,
                status: "Ready",
                createdAt: now,
                updatedAt: now,
                createdFrom: "Help Request",
                fileAssetIds:
                  request.finalFileIds ?? request.uploadedFileIds ?? [],
                qrCodeIds: [],
                socialPostIds: [],
                tags: ["Help Request"],
                exportFormats: [],
                isTemplate: false,
                archived: false,
                activityHistory: [
                  {
                    id: `${workshopId}-activity`,
                    label: "Saved from Help Request",
                    occurredAt: "Just now",
                  },
                ],
              },
              ...value.workshopItems,
            ]
          : value.workshopItems,
        helpRequests: value.helpRequests.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status: nextStatus,
                fileNames: createsFile
                  ? [
                      ...item.fileNames,
                      /Upload/i.test(action)
                        ? detail?.trim() || "additional-help-file.mock"
                        : "final-work.mock",
                    ]
                  : item.fileNames,
                uploadedFileIds: createsFile
                  ? [...(item.uploadedFileIds ?? []), fileId]
                  : item.uploadedFileIds,
                resultingBusinessAssetIds: createsAsset
                  ? [...(item.resultingBusinessAssetIds ?? []), assetId]
                  : item.resultingBusinessAssetIds,
                resultingWorkshopItemIds: createsWorkshop
                  ? [...(item.resultingWorkshopItemIds ?? []), workshopId]
                  : item.resultingWorkshopItemIds,
                quoteStatus:
                  action === "Approve Quote"
                    ? "Approved"
                    : action === "Decline Quote"
                      ? "Rejected"
                      : item.quoteStatus,
                paymentStatus:
                  action === "Mark Payment Sent"
                    ? "Payment Marked Sent"
                    : item.paymentStatus,
                timeline: [
                  {
                    id: `${requestId}-timeline-${Date.now()}`,
                    helpRequestId: requestId,
                    type: action.toLowerCase().replaceAll(" ", "_"),
                    title: action,
                    message: detail?.trim() || undefined,
                    createdAt: now,
                    createdBy: "User",
                    fileIds: createsFile ? [fileId] : undefined,
                  },
                  ...(item.timeline ?? []),
                ],
                messages: /Question|Note|Reply|Info/i.test(action)
                  ? [
                      {
                        id: `${requestId}-message-${Date.now()}`,
                        senderType: "User",
                        message:
                          detail?.trim() ||
                          `${action} added from the request detail page.`,
                        createdAt: now,
                      },
                      ...(item.messages ?? []),
                    ]
                  : item.messages,
                updatedAt: now,
              }
            : item,
        ),
      };
    });
    setNotice(`${action} recorded for this help project.`);
  };

  const respondToEstimate: AppStateValue["respondToEstimate"] = (
    estimateId,
    action,
    note,
  ) => {
    const responseEstimate = workspace.estimates.find(
      (item) => item.id === estimateId,
    );
    const noteRequired =
      action === "reject"
        ? (responseEstimate?.approvalSettings?.requireRejectNote ?? true)
        : action === "request-changes"
          ? (responseEstimate?.approvalSettings?.requireChangeRequestNote ??
            true)
          : false;
    if (noteRequired && !note.trim()) return false;
    const status =
      action === "approve"
        ? "Accepted"
        : action === "reject"
          ? "Rejected"
          : "Changes Requested";
    updateWorkspace((value) => ({
      ...value,
      estimates: value.estimates.map((estimate) =>
        estimate.id === estimateId
          ? {
              ...estimate,
              status,
              versions: [
                createEstimateVersion(
                  estimate,
                  status,
                  `Customer ${status.toLowerCase()}`,
                  note.trim() || undefined,
                ),
                ...estimate.versions,
              ],
            }
          : estimate,
      ),
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: `Estimate ${status.toLowerCase()}`,
          detail: note || "Customer approved the protected version",
          occurredAt: "Just now",
          tone:
            action === "approve"
              ? "success"
              : action === "reject"
                ? "danger"
                : "warning",
          type: `estimate.${action}`,
        },
        ...value.activity,
      ],
    }));
    return true;
  };

  const recordPayment: AppStateValue["recordPayment"] = (
    invoiceId,
    amount,
    method,
  ) => {
    if (!(amount > 0)) return;
    updateWorkspace((value) => ({
      ...value,
      invoices: value.invoices.map((invoice) => {
        if (invoice.id !== invoiceId || invoice.status === "Paid")
          return invoice;
        const amountPaid = Math.min(invoice.total, invoice.amountPaid + amount);
        return {
          ...invoice,
          amountPaid,
          status: amountPaid >= invoice.total ? "Paid" : "Partially Paid",
          payments: [
            ...invoice.payments,
            {
              id: `payment-${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              amount,
              method,
              notes: "Mock payment record",
            },
          ],
        };
      }),
      activity: [
        {
          id: `${Date.now()}`,
          businessId: currentBusinessId,
          label: "Payment recorded",
          detail: `${method} payment saved in mock history`,
          occurredAt: "Just now",
          tone: "success",
          type: "payment.recorded",
          relatedRecordType: "invoice",
          relatedRecordId: invoiceId,
          deepLinkRoute: "money",
        },
        ...value.activity,
      ],
    }));
    setNotice(
      "Payment recorded in this mock workspace. No payment provider was charged.",
    );
  };

  const resetDemoData: AppStateValue["resetDemoData"] = () => {
    suppressNextStorageSaveRef.current = true;
    clearStoredAppState();
    setWorkspaces(
      JSON.parse(JSON.stringify(initialWorkspaces)) as Record<
        string,
        BusinessWorkspaceData
      >,
    );
    setCurrentBusinessId(businessProfiles[0].id);
    setSelectedEstimateId(undefined);
    setSelectedInvoiceId(undefined);
    setSelectedCustomerId(undefined);
    setSelectedLeadId(undefined);
    setSelectedTemplateId(undefined);
    setSelectedAssetId(undefined);
    setSelectedWorkshopItemId(undefined);
    setSelectedFileId(undefined);
    setSelectedQrId(undefined);
    setQrBuilderPrefill(undefined);
    setSelectedCreateTask(undefined);
    setSelectedHelpService(undefined);
    setSelectedHelpRequestId(undefined);
    setSelectedGuideKey(undefined);
    setScheduleContext(undefined);
    setGuidedDraft(undefined);
    setCurrentScreen("home");
    setNotice("Demo data reset.");
  };

  const value = useMemo<AppStateValue>(
    () => ({
      activeBusinessProfileId: currentBusinessId,
      currentBusinessId,
      currentBusiness,
      profiles: businessProfiles,
      workspace,
      currentScreen,
      selectedEstimateId,
      selectedInvoiceId,
      selectedCustomerId,
      selectedLeadId,
      selectedTemplateId,
      selectedAssetId,
      selectedWorkshopItemId,
      selectedFileId,
      selectedQrId,
      qrBuilderPrefill,
      selectedCreateTask,
      selectedHelpService,
      selectedHelpRequestId,
      selectedGuideKey,
      notice,
      unsavedWorkLabel,
      guidedDraft,
      scheduleContext,
      setCurrentScreen,
      switchBusiness,
      markUnsavedWork: (label: string, save?: () => void) => {
        setUnsavedWorkLabel(label);
        unsavedSaverRef.current = save;
      },
      clearUnsavedWork: () => {
        setUnsavedWorkLabel(undefined);
        unsavedSaverRef.current = undefined;
      },
      saveUnsavedWork: () => {
        unsavedSaverRef.current?.();
        setUnsavedWorkLabel(undefined);
        unsavedSaverRef.current = undefined;
      },
      openEstimate,
      openInvoice,
      openEstimateBuilder,
      openInvoiceBuilder,
      openCustomer,
      openLead,
      convertLeadToCustomer,
      openSchedule,
      scheduleEvent,
      completeMockImport,
      recordExport,
      updateSuggestion,
      openActivity,
      openTemplate,
      openDocumentStyleEditor,
      openAsset,
      openWorkshopItem,
      openFile,
      toggleAssetPin,
      archiveBusinessAsset,
      showNotice: setNotice,
      addCustomerNote,
      addLeadNote,
      archiveLead,
      addFileMetadata,
      archiveFile,
      pinFileToBusinessKit,
      recordIntegrationAction,
      toggleSetupTask,
      completeGuidedWizard,
      clearGuidedDraft: () => setGuidedDraft(undefined),
      createCustomer,
      createLead,
      openCreateTask,
      openGuidedBuilder,
      openHelpRequest,
      openHelpRequestDetail,
      openHelpGuide,
      createQrCode,
      saveWorkshopItem,
      duplicateWorkshopItem,
      archiveWorkshopItem,
      saveWorkshopItemAsTemplate,
      exportWorkshopItem,
      recordWorkshopAction,
      saveEstimateFromBuilder,
      saveEstimateAsTemplate,
      saveInvoiceFromBuilder,
      saveDocumentTemplate,
      saveDocumentStyle,
      saveItemBankItem,
      deleteItemBankItem,
      updateBusinessKitCategories,
      saveGlobalLibraryItem,
      saveProject,
      createInvoiceFromAcceptedEstimate,
      applyKit,
      createProtectedFollowUp,
      submitHelpRequest,
      handleHelpRequestAction,
      respondToEstimate,
      recordPayment,
      resetDemoData,
      clearNotice: () => setNotice(undefined),
    }),
    [
      currentBusinessId,
      currentBusiness,
      workspace,
      currentScreen,
      selectedEstimateId,
      selectedInvoiceId,
      selectedCustomerId,
      selectedLeadId,
      selectedTemplateId,
      selectedAssetId,
      selectedWorkshopItemId,
      selectedFileId,
      selectedQrId,
      qrBuilderPrefill,
      selectedCreateTask,
      selectedHelpService,
      selectedHelpRequestId,
      selectedGuideKey,
      notice,
      unsavedWorkLabel,
      guidedDraft,
      scheduleContext,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const state = useContext(AppStateContext);
  if (!state)
    throw new Error("useAppState must be used inside AppStateProvider");
  return state;
}
