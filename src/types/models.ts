export type Id = string;
export type Tone = "success" | "warning" | "danger" | "info" | "neutral";
export type RecordStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Accepted"
  | "Rejected"
  | "Changes Requested"
  | "Revised"
  | "Expired"
  | "Converted to Invoice"
  | "Canceled"
  | "Partially Paid"
  | "Paid"
  | "Overdue";

export interface User {
  id: Id;
  name: string;
  email: string;
}

export interface BrandKit {
  logo?: string;
  primaryColor: string;
  accentColor: string;
  preferredFont: string;
  tagline?: string;
  defaultCallToAction: string;
}

export interface BusinessProfile {
  id: Id;
  name: string;
  shortName: string;
  industry: string;
  initials: string;
  ownerName: string;
  setupPercent: number;
  phone: string;
  email: string;
  brandKit: BrandKit;
  appliedKitIds: Id[];
}

export interface CustomerTag {
  id: Id;
  label: string;
  tone: Tone;
}
export interface Customer {
  id: Id;
  businessId: Id;
  name: string;
  businessName?: string;
  phone: string;
  email: string;
  address: string;
  billingAddress?: string;
  jobSiteAddress?: string;
  status: string;
  tags: CustomerTag[];
  leadSource?: string;
  lastActivity: string;
  notes: string[];
  history?: string[];
  balanceDue?: number;
  estimateCount?: number;
  invoiceCount?: number;
  filesCount?: number;
  customerType?: "Person" | "Business";
  primaryContactName?: string;
  alternatePhone?: string;
  website?: string;
  preferredContactMethod?: "Call" | "Text" | "Email" | "No preference";
  taxable?: boolean;
  paymentTerms?: string;
  sourceLeadId?: Id;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  internalNotes?: string[];
  projectIds?: Id[];
  appointmentIds?: Id[];
  fileIds?: Id[];
  syncMetadata?: SyncMetadata;
}

export interface Lead {
  id: Id;
  businessId: Id;
  name: string;
  serviceNeeded: string;
  source: string;
  status:
    | "New"
    | "Contacted"
    | "Appointment Scheduled"
    | "Estimate Needed"
    | "Estimate Sent"
    | "Won"
    | "Lost"
    | "Follow Up Later"
    | "Converted to Customer"
    | "Archived";
  businessName?: string;
  phone?: string;
  email?: string;
  address?: string;
  interestedService?: string;
  budget?: number;
  dateNeeded?: string;
  message?: string;
  preferredContactMethod?: string;
  tags?: CustomerTag[];
  notes?: string[];
  internalNotes?: string[];
  convertedCustomerId?: Id;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  appointmentIds?: Id[];
  estimateIds?: Id[];
  fileIds?: Id[];
  syncMetadata?: SyncMetadata;
}

export interface LeadForm {
  id: Id;
  businessId: Id;
  name: string;
  publicPath: string;
  submissions: number;
}
export interface EstimateLineItem {
  id: Id;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  visibleToCustomer: boolean;
  estimateId?: Id;
  sectionId?: Id;
  unit?: string;
  category?: string;
  taxable?: boolean;
  pdfVisible?: boolean;
  internalOnly?: boolean;
  internalCost?: number;
  markup?: number;
  profit?: number;
  supplier?: string;
  sku?: string;
  quickBooksItemId?: string;
  internalNotes?: string;
  materialOrLabor?: string;
  phase?: string;
  sortOrder?: number;
  sourceBankItemId?: Id;
  sourceItemSnapshot?: Record<string, unknown>;
}
export interface EstimateSection {
  id: Id;
  estimateId: Id;
  title: string;
  description?: string;
  sortOrder: number;
  lineItemIds: Id[];
  subtotal: number;
  customerVisible: boolean;
  pdfVisible: boolean;
  internalOnly: boolean;
  collapsed: boolean;
}
export interface EstimateTerms {
  paymentTerms: string;
  depositRequired: boolean;
  depositAmount?: number;
  depositPercent?: number;
  expirationText: string;
  changeOrderPolicy: string;
  cancellationPolicy?: string;
  customTerms?: string;
  customExpirationText?: string;
}
export interface ApprovalSettings {
  allowApprove: boolean;
  allowReject: boolean;
  allowRequestChanges: boolean;
  requireRejectNote: boolean;
  requireChangeRequestNote: boolean;
  requireTypedName: boolean;
  requireCheckbox: boolean;
  allowPdfDownload: boolean;
  showFullDocumentBeforeApproval: boolean;
  sendBusinessCopy?: boolean;
  requireSignature?: boolean;
  requireInitialsOnTerms?: boolean;
  allowPdfDownloadBeforeApproval?: boolean;
  allowPdfDownloadAfterApproval?: boolean;
  expireApprovalLinkOnExpirationDate?: boolean;
  lockAfterApproval?: boolean;
}
export interface EstimateVersion {
  id: Id;
  version: number;
  status: RecordStatus;
  createdAt: string;
  changedBy: string;
  total: number;
  changeSummary: string;
  customerNote?: string;
  snapshotPath?: string;
  clientViewSnapshot?: Record<string, unknown>;
  officialDocumentSnapshot?: string;
  customerAction?: "Approved" | "Rejected" | "Changes Requested";
  estimateId?: Id;
  versionNumber?: number;
  createdBy?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
  sectionsSnapshot?: EstimateSection[];
  termsSnapshot?: EstimateTerms;
  approvalSettingsSnapshot?: ApprovalSettings;
  approvedAt?: string;
  rejectedAt?: string;
  changesRequestedAt?: string;
}
export interface EstimateDeliverySettings {
  emailMessage: string;
  clientSummary: string;
  reviewButtonLabel: string;
  downloadButtonLabel: string;
  allowPdfDownload: boolean;
  allowReject: boolean;
  allowChanges: boolean;
  requireApprovalCheckbox: boolean;
  documentTitle: string;
  documentFooter: string;
  terms: string;
}
export interface Estimate {
  id: Id;
  businessId: Id;
  number: string;
  customerId: Id;
  projectName: string;
  status: RecordStatus;
  total: number;
  lineItems: EstimateLineItem[];
  versions: EstimateVersion[];
  internalNote?: string;
  approvalToken: string;
  deliverySettings?: EstimateDeliverySettings;
  businessProfileId?: Id;
  leadId?: Id;
  projectId?: Id;
  estimateNumber?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
  estimateDate?: string;
  expirationDate?: string;
  preparedBy?: string;
  salesRep?: string;
  jobLocation?: string;
  projectDescription?: string;
  customerMessage?: string;
  customerNotes?: string;
  internalNotes?: string;
  sections?: EstimateSection[];
  termsData?: EstimateTerms;
  numberedNotes?: string[];
  subtotal?: number;
  discount?: number;
  tax?: number;
  depositRequested?: number;
  visibleFields?: string[];
  internalFields?: string[];
  approvalSettings?: ApprovalSettings;
  currentVersionId?: Id;
  clientApprovalLink?: string;
  officialDocumentSnapshot?: string;
  activityHistory?: Array<{ id: Id; label: string; occurredAt: string }>;
  sourceTemplateId?: Id;
  sourceKitId?: Id;
  quickBooksSyncStatus?:
    "Not Synced" | "Ready After Acceptance" | "Mock Synced";
  exportedFileIds?: Id[];
  savedToWorkshopLibrary?: boolean;
  templateName?: string;
  syncMetadata?: SyncMetadata;
}

export interface InvoicePayment {
  id: Id;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
  syncMetadata?: SyncMetadata;
}
export interface Invoice {
  id: Id;
  businessId: Id;
  number: string;
  customerId: Id;
  status: RecordStatus;
  total: number;
  amountPaid: number;
  dueDate: string;
  payments: InvoicePayment[];
  estimateId?: Id;
  sourceLineItemIds?: Id[];
  projectId?: Id;
  title?: string;
  invoiceType?:
    | "standard"
    | "deposit"
    | "progress"
    | "final_balance"
    | "selected_items"
    | "custom_amount"
    | "adjustment";
  billingMethod?: string;
  invoiceDate?: string;
  lineItems?: EstimateLineItem[];
  sections?: EstimateSection[];
  subtotal?: number;
  discount?: number;
  tax?: number;
  balanceDue?: number;
  paymentTerms?: string;
  paymentMethods?: string[];
  paymentInstructions?: string;
  notes?: string;
  footer?: string;
  syncMetadata?: SyncMetadata;
}
export interface ProgressInvoice {
  id: Id;
  businessId: Id;
  number: string;
  estimateId: Id;
  label: string;
  percent: number;
  amount: number;
  status: RecordStatus;
}
export interface ChangeOrder {
  id: Id;
  businessId: Id;
  number: string;
  estimateId: Id;
  reason: string;
  amount: number;
  status: RecordStatus;
  lineItems?: EstimateLineItem[];
  approvedAt?: string;
}
export interface ProjectJob {
  id: Id;
  businessId: Id;
  customerId: Id;
  name: string;
  status: string;
  fileIds: Id[];
  leadId?: Id;
  projectType?: string;
  jobLocation?: string;
  description?: string;
  startDate?: string;
  targetCompletionDate?: string;
  notes?: string[];
  internalNotes?: string[];
  estimateIds?: Id[];
  invoiceIds?: Id[];
  changeOrderIds?: Id[];
  progressInvoiceIds?: Id[];
  lastActivity?: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  syncMetadata?: SyncMetadata;
}
export interface QRCodeRecord {
  id: Id;
  businessId: Id;
  name: string;
  type: string;
  url?: string;
  scans: number;
  label?: string;
  status?: "Draft" | "Ready" | "Created";
  payloadType?: "url" | "vcard" | "text";
  payload?: string;
  svg?: string;
  dataUrl?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  size?: number;
  margin?: number;
  createdAt?: string;
  updatedAt?: string;
  createdFrom?: "Manual Builder" | "Guided Wizard" | "Quick Link" | "Help Request";
  workshopItemId?: Id;
  fileAssetIds?: Id[];
}
export interface Promo {
  id: Id;
  businessId: Id;
  name: string;
  audience: string;
  status: string;
}
export interface SocialPost {
  id: Id;
  businessId: Id;
  title: string;
  destination: string[];
  status: "Draft" | "Ready" | "Marked as posted";
}
export interface FlyerDesign {
  id: Id;
  businessId: Id;
  name: string;
  status: string;
  hasQrCode: boolean;
}
export interface BusinessCardDesign {
  id: Id;
  businessId: Id;
  name: string;
  status: string;
}
export interface Template {
  id: Id;
  businessId: Id;
  name: string;
  type: string;
  sourceKitId?: Id;
}
export interface FileAsset {
  id: Id;
  businessId: Id;
  name: string;
  type: string;
  projectId?: Id;
  customerId?: Id;
  leadId?: Id;
  helpRequestId?: Id;
  workshopItemId?: Id;
  qrCodeId?: Id;
  source?: "QR Generator" | "Workshop Export" | "Upload" | "Help Request" | string;
  dataUrl?: string;
  generatedContent?: string;
  metadataOnly?: boolean;
  url?: string;
  pinned?: boolean;
  archived?: boolean;
  createdAt?: string;
  visibility: "Internal" | "Customer";
}

export type ItemBankSource =
  | "Manual"
  | "Starter Kit"
  | "My Business Kit"
  | "Previous Estimate"
  | "Previous Invoice"
  | "QuickBooks Placeholder"
  | "Duplicate"
  | "Start Here Setup";
export interface ItemServiceBankItem {
  id: Id;
  businessProfileId: Id;
  name: string;
  description: string;
  customerDescription: string;
  category: string;
  unit: string;
  defaultQuantity: number;
  defaultRate: number;
  internalCost?: number;
  markup?: number;
  taxable: boolean;
  internalNotes?: string;
  quickBooksItemId?: string;
  lastUsed: string;
  source: ItemBankSource;
  syncMetadata?: SyncMetadata;
}
export type DocumentType =
  | "Estimate"
  | "Invoice"
  | "Progress Invoice"
  | "Change Order"
  | "Receipt"
  | "Statement"
  | "Approval Page"
  | "Email Message";
export interface DocumentColumnSetting {
  key: string;
  label: string;
  visible: boolean;
  sortOrder: number;
  visibleToCustomer?: boolean;
  internalOnly?: boolean;
  columnType?:
    | "text"
    | "number"
    | "money"
    | "percent"
    | "date"
    | "checkbox"
    | "select"
    | "formula";
}
export interface DocumentColumn {
  id: Id;
  businessProfileId: Id;
  documentType: "estimate" | "invoice";
  templateId?: Id;
  columnKey: string;
  columnLabel: string;
  columnType:
    | "text"
    | "number"
    | "money"
    | "percent"
    | "date"
    | "checkbox"
    | "select"
    | "formula";
  appliesTo:
    "lineItem" | "section" | "totals" | "document" | "customer" | "project";
  sortOrder: number;
  visibleInBuilder: boolean;
  visibleToCustomer: boolean;
  visibleOnPdf: boolean;
  internalOnly: boolean;
  required: boolean;
  includedInCustomerTotal: boolean;
  includedInInternalCost: boolean;
  includedInProfitCalculation: boolean;
  formula?: string;
  defaultValue?: string;
  lockedSystemColumn: boolean;
}
export interface DocumentTemplate {
  templateId: Id;
  businessProfileId: Id;
  documentType: DocumentType;
  templateName: string;
  layoutStyle: "Professional" | "Compact" | "Detailed" | "Custom";
  headerSettings: Record<string, boolean | string>;
  businessInfoSettings: Record<string, boolean>;
  customerInfoSettings: Record<string, boolean>;
  projectInfoSettings: Record<string, boolean>;
  lineItemSettings: Record<string, boolean>;
  sectionSettings: Record<string, boolean>;
  notesSettings: Record<string, boolean>;
  termsSettings: Record<string, boolean>;
  totalsSettings: Record<string, boolean>;
  paymentSettings: Record<string, boolean>;
  qrCodeSettings: Record<string, boolean>;
  signatureSettings: Record<string, boolean>;
  footerSettings: Record<string, boolean | string>;
  visibleFields: string[];
  hiddenFields: string[];
  columnSettings: DocumentColumnSetting[];
  defaultText: Record<string, string>;
  branding: { primaryColor: string; accentColor: string; font: string };
  createdAt: string;
  updatedAt: string;
  documentStyleId?: Id;
  isDefault?: boolean;
  lastUsedAt?: string;
  useCount?: number;
  archived?: boolean;
}

export interface StyleBlock {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "bold";
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  alignment?: "left" | "center" | "right";
  lineHeight?: number;
  showBorder?: boolean;
  showBackground?: boolean;
}

export interface PageStyleBlock extends StyleBlock {
  documentWidth?: string;
}

export interface HeaderStyleBlock extends StyleBlock {
  businessNameFontSize?: number;
  businessNameColor?: string;
  documentTitleFontSize?: number;
  documentTitleColor?: string;
  logoSize?: number;
  logoPosition?: "left" | "center" | "right";
}

export interface InfoBlockStyle extends StyleBlock {
  titleTextColor?: string;
  bodyTextColor?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
}

export interface TableStyleBlock extends StyleBlock {
  headerRowBackgroundColor?: string;
  headerRowTextColor?: string;
  bodyRowBackgroundColor?: string;
  bodyRowTextColor?: string;
  alternatingRowBackgroundColor?: string;
  useAlternatingRows?: boolean;
  rowLineColor?: string;
  columnLineColor?: string;
  tableBorderColor?: string;
  tableBorderWidth?: number;
  spacing?: number;
}

export interface ColumnStyleBlock {
  columnKey: string;
  columnLabel: string;
  width?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  bodyTextColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "bold";
  alignment?: "left" | "center" | "right";
  borderColor?: string;
  visibleInBuilder: boolean;
  visibleToCustomer: boolean;
  visibleOnPdf: boolean;
  internalOnly: boolean;
}

export interface RowStyleBlock extends StyleBlock {
  standardRowBackgroundColor?: string;
  alternatingRowBackgroundColor?: string;
  rowTextColor?: string;
  rowLineColor?: string;
  rowPadding?: number;
  rowSpacing?: number;
  useAlternatingRows?: boolean;
}

export interface TotalsStyleBlock extends StyleBlock {
  labelColor?: string;
  amountColor?: string;
  finalTotalFontSize?: number;
  finalTotalFontWeight?: "normal" | "medium" | "bold";
  secondaryTextColor?: string;
  balanceDueColor?: string;
  amountPaidColor?: string;
}

export interface NotesTermsStyleBlock extends StyleBlock {
  headingColor?: string;
  bodyTextColor?: string;
  headingFontSize?: number;
  bodyFontSize?: number;
  numberedNoteColor?: string;
  spacing?: number;
}

export interface QrStyleBlock extends StyleBlock {
  labelColor?: string;
  labelFontSize?: number;
  qrSize?: number;
}

export interface SignatureStyleBlock extends StyleBlock {
  lineColor?: string;
  labelColor?: string;
  signatureFontSize?: number;
}
export interface DocumentStyleTemplate {
  id: Id;
  businessProfileId: Id;
  templateName: string;
  documentType:
    | "estimate"
    | "invoice"
    | "progress_invoice"
    | "change_order"
    | "receipt"
    | "statement";
  basePreset:
    | "Clean"
    | "Bold"
    | "Modern"
    | "Minimal"
    | "Contractor"
    | "Service Business"
    | "Luxury"
    | "Simple Black & White"
    | "Color Header"
    | "Classic Invoice";
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  pageStyle: PageStyleBlock;
  headerStyle: HeaderStyleBlock;
  businessInfoStyle: InfoBlockStyle;
  customerInfoStyle: InfoBlockStyle;
  projectInfoStyle: InfoBlockStyle;
  documentTitleStyle: StyleBlock;
  documentMetaStyle: InfoBlockStyle;
  sectionHeaderStyle: StyleBlock;
  tableStyle: TableStyleBlock;
  columnStyles: ColumnStyleBlock[];
  rowStyle: RowStyleBlock;
  sectionRowStyle: StyleBlock;
  tableHeaderStyle: StyleBlock;
  tableRowStyle: StyleBlock;
  notesStyle: NotesTermsStyleBlock;
  termsStyle: NotesTermsStyleBlock;
  paymentInstructionsStyle: NotesTermsStyleBlock;
  changeOrderPolicyStyle: NotesTermsStyleBlock;
  approvalSignatureStyle: StyleBlock;
  footerStyle: StyleBlock;
  totalsBoxStyle: TotalsStyleBlock;
  qrBlockStyle: QrStyleBlock;
  signatureStyle: SignatureStyleBlock;
  lockedSystemStyle: boolean;
  archived: boolean;
}

export interface DocumentNumberSettings {
  businessProfileId: Id;
  estimatePrefix: string;
  invoicePrefix: string;
  changeOrderPrefix: string;
  progressInvoicePrefix: string;
  nextEstimateNumber: number;
  nextInvoiceNumber: number;
  nextChangeOrderNumber: number;
  nextProgressInvoiceNumber: number;
  useYearInNumber: boolean;
  useCustomerCode: boolean;
  resetYearly: boolean;
  allowManualOverride: boolean;
  numberPadding: number;
}

export type GlobalLibraryType =
  | "category"
  | "item"
  | "service"
  | "product"
  | "material"
  | "labor"
  | "fee"
  | "discount"
  | "deposit"
  | "estimate_template"
  | "invoice_template"
  | "progress_invoice_template"
  | "change_order_template"
  | "document_template"
  | "note"
  | "term"
  | "footer"
  | "message_template"
  | "qr_starter"
  | "lead_form"
  | "customer_tag"
  | "payment_instruction"
  | "approval_preset";
export interface GlobalLibraryItem {
  id: Id;
  libraryType: GlobalLibraryType;
  title: string;
  description: string;
  industryTags: string[];
  keywords: string[];
  category: string;
  itemType?: string;
  defaultUnit?: string;
  defaultQuantity?: number;
  defaultRate?: number;
  taxableDefault?: boolean;
  customerVisibleDescription?: string;
  internalNotes?: string;
  recommendedFor: string[];
  relatedTemplateIds: Id[];
  createdAt: string;
  updatedAt: string;
}
export interface IndustryStarterKit {
  id: Id;
  industryKey: string;
  industryName: string;
  description: string;
  includedCategoryIds: Id[];
  includedItemIds: Id[];
  includedEstimateTemplateIds: Id[];
  includedInvoiceTemplateIds: Id[];
  includedProgressInvoiceTemplateIds: Id[];
  includedChangeOrderTemplateIds: Id[];
  includedDocumentTemplateIds: Id[];
  includedNoteIds: Id[];
  includedTermIds: Id[];
  includedFooterIds: Id[];
  includedMessageTemplateIds: Id[];
  includedQrStarterIds: Id[];
  includedLeadFormIds: Id[];
  includedCustomerTagIds: Id[];
  includedPaymentInstructionIds: Id[];
  includedApprovalPresetIds: Id[];
  recommendedSetupSteps: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessAsset {
  id: Id;
  businessProfileId: Id;
  assetType: string;
  title: string;
  description?: string;
  fileIds: Id[];
  previewImageId?: Id;
  url?: string;
  qrCodeId?: Id;
  relatedTemplateId?: Id;
  relatedWorkshopItemId?: Id;
  tags: string[];
  status: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  archived: boolean;
}
export interface MessageTemplateRecord {
  id: Id;
  businessProfileId: Id;
  name: string;
  type: string;
  message: string;
}
export interface PrintReorderItem {
  id: Id;
  businessProfileId: Id;
  name: string;
  itemType: string;
  lastVersion: string;
  fileAssetIds: Id[];
  printSize?: string;
  vendorNotes?: string;
  vistaPrintNotes?: string;
  canvaLink?: string;
  reorderNotes?: string;
}
export interface BusinessHomeKit {
  id: Id;
  businessProfileId: Id;
  itemBankIds: Id[];
  categories: string[];
  documentTemplateIds: Id[];
  estimateTemplateIds: Id[];
  invoiceTemplateIds: Id[];
  progressTemplateIds: Id[];
  changeOrderTemplateIds: Id[];
  workshopItemIds: Id[];
  printItemIds: Id[];
  messageTemplateIds: Id[];
  updatedAt: string;
}

export type WorkshopItemType =
  | "flyer"
  | "qr_code"
  | "social_post"
  | "business_card"
  | "promotion"
  | "lead_form"
  | "review_booster"
  | "menu_price_sheet"
  | "yard_sign"
  | "door_hanger"
  | "event_promo"
  | "canva_help_item"
  | "vistaprint_print_setup"
  | "customer_message"
  | "estimate_template"
  | "invoice_template"
  | "custom_template";
export type WorkshopItemStatus =
  | "Draft"
  | "Ready"
  | "Sent"
  | "Posted"
  | "Downloaded"
  | "Needs Review"
  | "In Help Request"
  | "Approved"
  | "Archived";
export type WorkshopCreatedFrom =
  | "Blank"
  | "Business Kit"
  | "Template"
  | "Duplicate"
  | "Uploaded File"
  | "Help Request"
  | "Customer"
  | "Lead"
  | "Project"
  | "Guided Wizard"
  | "Manual Builder"
  | "QR Generator";
export type BuilderDataValue = string | string[] | number | boolean | null;
export type BuilderData = Record<string, BuilderDataValue>;
export interface WorkshopActivity {
  id: Id;
  label: string;
  occurredAt: string;
}
export interface RecoveryDraft {
  id: Id;
  businessProfileId: Id;
  builderId: string;
  sourceTool: string;
  selectedCreateTask: string;
  selectedWorkshopItemId?: Id;
  builderData: BuilderData;
  updatedAt: string;
  status: "Recoverable Draft";
}
export interface WorkshopItem {
  id: Id;
  businessProfileId: Id;
  itemType: WorkshopItemType;
  title: string;
  description: string;
  status: WorkshopItemStatus;
  builderId?: string;
  sourceTool?: string;
  builderData?: BuilderData;
  previewData?: BuilderData;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  lastOpenedAt?: string;
  createdFrom: WorkshopCreatedFrom;
  sourceKitId?: Id;
  sourceTemplateId?: Id;
  relatedCustomerId?: Id;
  relatedProjectId?: Id;
  relatedCampaignId?: Id;
  linkedCustomerIds?: Id[];
  linkedLeadIds?: Id[];
  linkedProjectIds?: Id[];
  linkedEstimateIds?: Id[];
  linkedInvoiceIds?: Id[];
  fileAssetIds: Id[];
  qrCodeIds: Id[];
  socialPostIds: Id[];
  leadFormId?: Id;
  tags: string[];
  previewImage?: string;
  exportFormats: string[];
  exportHistory?: Array<{
    id: Id;
    format: string;
    fileId?: Id;
    createdAt: string;
    label?: string;
  }>;
  version?: number;
  templateSourceItemId?: Id;
  isTemplate: boolean;
  archived: boolean;
  activityHistory: WorkshopActivity[];
}

export interface BusinessKit {
  id: Id;
  name: string;
  industry: string;
  description: string;
  recommendedFor: string[];
  accent: string;
  estimateTemplates: string[];
  invoiceTemplates: string[];
  progressChangeTemplates: string[];
  leadForms: string[];
  qrStarters: string[];
  flyerPostTemplates: string[];
  businessCardTemplate: string;
  reviewBoosterTools: string[];
  customerTags: string[];
  messageTemplates: string[];
  setupChecklist: string[];
  suggestedServices: string[];
  suggestedTerms: string[];
  suggestedFolders: string[];
}

export type HelpStatus =
  | "Request Received"
  | "Needs Review"
  | "Quote Sent"
  | "Waiting for Approval"
  | "Waiting for Payment"
  | "In Progress"
  | "Needs Customer Info"
  | "Needs Your Info"
  | "Ready for Review"
  | "Revision Requested"
  | "Approved"
  | "Completed"
  | "Canceled";
export interface HelpRequestTimelineItem {
  id: Id;
  helpRequestId: Id;
  type: string;
  title: string;
  message?: string;
  fileIds?: Id[];
  createdAt: string;
  createdBy: string;
}
export interface HelpRequest {
  id: Id;
  businessId: Id;
  type: string;
  serviceLevel: string;
  description: string;
  status: HelpStatus;
  fileNames: string[];
  serviceKey?: string;
  selectedServicePriceText?: string;
  uploadedFileIds?: Id[];
  serviceAnswers?: Record<string, string | string[]>;
  timeline?: HelpRequestTimelineItem[];
  messages?: Array<{
    id: Id;
    senderType: "User" | "Start Here" | "System";
    message: string;
    createdAt: string;
  }>;
  finalFileIds?: Id[];
  quoteStatus?:
    | "Not Needed"
    | "Waiting Review"
    | "Quote Sent"
    | "Approved"
    | "Rejected"
    | "Expired";
  quoteAmount?: number;
  paymentStatus?: string;
  updatedAt?: string;
  attachedCustomerId?: Id;
  attachedLeadId?: Id;
  attachedProjectId?: Id;
  attachedEstimateId?: Id;
  attachedInvoiceId?: Id;
  resultingBusinessAssetIds?: Id[];
  resultingWorkshopItemIds?: Id[];
}
export interface HelpQuote {
  id: Id;
  helpRequestId: Id;
  amount: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
}
export interface HelpServiceQuestion {
  id: Id;
  serviceKey: string;
  questionText: string;
  helperText?: string;
  fieldKey: string;
  inputType:
    | "text"
    | "textarea"
    | "select"
    | "multiSelect"
    | "fileUpload"
    | "link"
    | "date"
    | "toggle"
    | "checkbox";
  options?: string[];
  required: boolean;
  sortOrder: number;
}
export interface HelpService {
  id: Id;
  serviceKey: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  startingPriceText: string;
  estimatedRangeText?: string;
  category: string;
  requiredUploads: string[];
  acceptedFileTypes: string[];
  serviceQuestions: HelpServiceQuestion[];
  whatHappensNext: string[];
  relatedAppAreas: string[];
  active: boolean;
  sortOrder: number;
}
export interface MonthlySupportPlan {
  id: Id;
  planKey: string;
  title: string;
  monthlyPrice: number;
  shortDescription: string;
  includedServices: string[];
  bestFor: string;
  limits: string[];
  notIncluded: string[];
  active: boolean;
  sortOrder: number;
}
export interface GuideResource {
  id: Id;
  guideKey: string;
  title: string;
  shortDescription: string;
  sections: Array<{
    id: Id;
    title: string;
    body: string;
    checklist?: string[];
  }>;
  relatedActions: string[];
  relatedHelpServiceKey?: string;
  createdAt: string;
  updatedAt: string;
}
export type IntegrationProvider =
  | "QuickBooks"
  | "Facebook Page"
  | "Instagram Business"
  | "Google Business Profile"
  | "Canva"
  | "Payment Links"
  | "Google Drive"
  | "Google Contacts"
  | "Google Sheets"
  | "Excel / CSV"
  | "Email / SMS"
  | "Website / Lead Forms"
  | "VistaPrint Prep";
export interface IntegrationConnection {
  id: Id;
  businessId: Id;
  provider: IntegrationProvider;
  status: "Not Connected" | "Mock Connected" | "Needs Review";
  mockMode: true;
  detail: string;
}
export interface QuickBooksSyncRecord {
  id: Id;
  businessId: Id;
  recordType: string;
  recordId: Id;
  status: string;
  occurredAt: string;
}
export interface ActivityLogItem {
  id: Id;
  businessId: Id;
  label: string;
  detail: string;
  occurredAt: string;
  tone: Tone;
  type: string;
  relatedRecordType?: string;
  relatedRecordId?: Id;
  deepLinkRoute?: string;
  highlightTargetId?: Id;
}
export interface Notification {
  id: Id;
  businessId: Id;
  message: string;
  read: boolean;
}
export interface SetupTask {
  id: Id;
  businessId: Id;
  label: string;
  complete: boolean;
  optional?: boolean;
}
export interface DashboardMetric {
  id: Id;
  label: string;
  value: string;
  tone: Tone;
}
export interface SmartSuggestion {
  id: Id;
  businessId: Id;
  message: string;
  actionLabel: string;
  suggestionType?: string;
  title?: string;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  relatedRecordType?: string;
  relatedRecordId?: Id;
  actions?: string[];
  status?: "Active" | "Dismissed" | "Snoozed" | "Completed";
  createdAt?: string;
  dismissedAt?: string;
  snoozedUntil?: string;
}

export type SyncStatus =
  | "Not Synced"
  | "Imported"
  | "Synced"
  | "Needs Sync"
  | "Ready to Export"
  | "Conflict"
  | "Possible Duplicate"
  | "Sync Failed"
  | "Exported"
  | "Keep In App Only";
export interface SyncMetadata {
  sourceSystem:
    | "Start Here Helper"
    | "QuickBooks"
    | "Excel"
    | "CSV"
    | "Google Contacts"
    | "Google Sheets"
    | "Lead Form"
    | "Manual"
    | "Other";
  sourceRecordId?: string;
  sourceImportedAt?: string;
  externalLinks: Array<{
    systemName: string;
    externalRecordId: string;
    syncDirection: "Import Only" | "Export Only" | "Two Way" | "Manual Review";
    syncStatus: SyncStatus;
  }>;
  lastSyncedAt?: string;
  syncStatus: SyncStatus;
  pendingSyncTargets: string[];
  pendingExport: boolean;
  lastExportedAt?: string;
  dirtyFields: string[];
  conflictStatus?: string;
  possibleDuplicateIds: Id[];
  syncHistory: string[];
}
export interface CalendarEvent {
  id: Id;
  businessProfileId: Id;
  title: string;
  eventType:
    | "Appointment"
    | "Site Visit"
    | "Estimate Call"
    | "Job / Project"
    | "Follow-Up"
    | "Payment Reminder"
    | "Review Request"
    | "Class / Event"
    | "Delivery / Pickup"
    | "Custom";
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  allDay: boolean;
  location?: string;
  notes?: string;
  status: "Scheduled" | "Completed" | "Canceled" | "No Show" | "Rescheduled";
  relatedCustomerId?: Id;
  relatedLeadId?: Id;
  relatedProjectId?: Id;
  relatedEstimateId?: Id;
  relatedInvoiceId?: Id;
  relatedHelpRequestId?: Id;
  createdFrom:
    | "Manual"
    | "Lead"
    | "Customer"
    | "Project"
    | "Estimate"
    | "Invoice"
    | "Smart Suggestion"
    | "Imported"
    | "QuickBooks placeholder"
    | "Google Calendar placeholder";
  reminders: string[];
  syncMetadata?: SyncMetadata;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
export interface ImportHistoryRecord {
  id: Id;
  businessProfileId: Id;
  recordType: string;
  fileName: string;
  status: "Preview" | "Needs Review" | "Imported";
  importedCount: number;
  duplicateCount: number;
  createdAt: string;
}
export interface ExportHistoryRecord {
  id: Id;
  businessProfileId: Id;
  exportType: string;
  format: "CSV" | "Excel";
  recordCount: number;
  status: "Needs Export" | "Exported";
  createdAt: string;
}
export interface GuidedWizardSession {
  id: Id;
  businessProfileId: Id;
  builderId: string;
  sourceTool: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  status:
    "In Progress" | "Completed" | "Abandoned" | "Converted to Builder Draft";
  answers: Record<string, string | string[]>;
  mappedBuilderDraftId?: Id;
  createdFrom:
    | "Walk Me Through It"
    | "Smart Suggestion"
    | "Help Prompt"
    | "Customer Action"
    | "Lead Action";
}

export interface BusinessWorkspaceData {
  dashboardMetrics: DashboardMetric[];
  customers: Customer[];
  leads: Lead[];
  leadForms: LeadForm[];
  estimates: Estimate[];
  invoices: Invoice[];
  progressInvoices: ProgressInvoice[];
  changeOrders: ChangeOrder[];
  qrCodes: QRCodeRecord[];
  promos: Promo[];
  socialPosts: SocialPost[];
  flyers: FlyerDesign[];
  businessCards: BusinessCardDesign[];
  templates: Template[];
  files: FileAsset[];
  workshopItems: WorkshopItem[];
  businessHomeKit: BusinessHomeKit;
  itemBank: ItemServiceBankItem[];
  documentTemplates: DocumentTemplate[];
  messageTemplates: MessageTemplateRecord[];
  printReorderItems: PrintReorderItem[];
  documentNumberSettings: DocumentNumberSettings;
  documentStyles: DocumentStyleTemplate[];
  businessAssets: BusinessAsset[];
  projects: ProjectJob[];
  helpRequests: HelpRequest[];
  integrations: IntegrationConnection[];
  activity: ActivityLogItem[];
  setupTasks: SetupTask[];
  suggestions: SmartSuggestion[];
  calendarEvents: CalendarEvent[];
  importHistory: ImportHistoryRecord[];
  exportHistory: ExportHistoryRecord[];
  guidedWizardSessions: GuidedWizardSession[];
}
