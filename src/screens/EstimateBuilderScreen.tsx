import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ClipboardCopy,
  Copy,
  Download,
  Eye,
  FileCheck2,
  FilePlus2,
  FileText,
  FolderOpen,
  LockKeyhole,
  Plus,
  QrCode,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { createBlankEstimateSeed } from "../data/mock/estimateBuilderSeeds";
import { canEditEstimateInPlace } from "../lib/protectedRecords";
import { formatDocumentNumber } from "../lib/documentNumbering";
import { downloadEstimatePdf } from "../services/export/officialDocumentPdf";
import { useAppState } from "../state/AppState";
import type {
  Customer,
  DocumentStyleTemplate,
  DocumentTemplate,
  Estimate,
  EstimateLineItem,
  EstimateSection,
  ItemServiceBankItem,
} from "../types/models";

const steps = [
  "Customer",
  "Project",
  "Items",
  "Notes & Terms",
  "Preview & Send",
] as const;
type Step = (typeof steps)[number];
const reusableTemplateParts = [
  "Sections/categories",
  "Line items and saved item settings",
  "Custom columns and column order",
  "Visibility settings",
  "Notes",
  "Terms",
  "Document footer",
  "Approval settings",
  "Tax/discount settings",
  "Internal cost settings",
  "Customer view layout",
  "Official PDF layout",
  "Document style and branding",
  "QR/payment/review placeholders",
];

const money = (value: number) =>
  value.toLocaleString(undefined, { style: "currency", currency: "USD" });
const freshId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

function normalizeExistingEstimate(estimate: Estimate): Estimate {
  if (estimate.sections?.length) return estimate;
  const sectionId = `${estimate.id}-section-general`;
  const lineItems = estimate.lineItems.map((item, index) => ({
    ...item,
    sectionId,
    estimateId: estimate.id,
    pdfVisible: item.pdfVisible ?? true,
    internalOnly: item.internalOnly ?? false,
    sortOrder: index,
  }));
  return {
    ...estimate,
    title: estimate.title ?? "Service Estimate",
    estimateNumber: estimate.number,
    estimateDate:
      estimate.estimateDate ?? new Date().toISOString().slice(0, 10),
    sections: [
      {
        id: sectionId,
        estimateId: estimate.id,
        title: "PROJECT SERVICES",
        sortOrder: 0,
        lineItemIds: lineItems.map((item) => item.id),
        subtotal: lineItems.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0,
        ),
        customerVisible: true,
        pdfVisible: true,
        internalOnly: false,
        collapsed: false,
      },
    ],
    lineItems,
    subtotal: estimate.total,
    discount: 0,
    tax: 0,
    numberedNotes: [],
    approvalSettings: estimate.approvalSettings ?? {
      allowApprove: true,
      allowReject: true,
      allowRequestChanges: true,
      requireRejectNote: true,
      requireChangeRequestNote: true,
      requireTypedName: false,
      requireCheckbox: true,
      allowPdfDownload: true,
      showFullDocumentBeforeApproval: true,
    },
    termsData: estimate.termsData ?? {
      paymentTerms: "Balance due upon completion",
      depositRequired: false,
      expirationText: "Estimate expires in 30 days",
      changeOrderPolicy: "Change orders require written approval.",
    },
  };
}

function recalculate(
  estimate: Estimate,
  lineItems = estimate.lineItems,
  sections = estimate.sections ?? [],
): Estimate {
  const nextSections = sections.map((section) => ({
    ...section,
    lineItemIds: lineItems
      .filter((item) => item.sectionId === section.id)
      .map((item) => item.id),
    subtotal: lineItems
      .filter((item) => item.sectionId === section.id)
      .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
  }));
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const total = Math.max(
    0,
    subtotal - (estimate.discount ?? 0) + (estimate.tax ?? 0),
  );
  return {
    ...estimate,
    lineItems,
    sections: nextSections,
    subtotal,
    total,
    updatedAt: new Date().toISOString(),
  };
}

function CustomerApprovalPreview({
  estimate,
  customer,
  businessName,
  onClose,
  onDocument,
}: {
  estimate: Estimate;
  customer: CustomerForm;
  businessName: string;
  onClose: () => void;
  onDocument: () => void;
}) {
  return (
    <div className="estimate-preview-overlay">
      <div className="estimate-preview-shell estimate-client-preview">
        <div className="between">
          <div className="row">
            <div className="official-logo">
              {businessName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <strong>{businessName}</strong>
          </div>
          <button
            className="btn btn--ghost"
            onClick={onClose}
            aria-label="Close customer preview"
          >
            <X />
          </button>
        </div>
        <div className="estimate-preview-heading">
          <StatusBadge tone="info">Customer preview</StatusBadge>
          <h1>Estimate {estimate.number}</h1>
          <p>
            {estimate.projectName} · {customer.name || "Customer"}
          </p>
        </div>
        <div className="approval-total">
          <span>Total estimate</span>
          <strong>{money(estimate.total)}</strong>
          <small>{estimate.estimateDate}</small>
        </div>
        <div className="approval-message">
          <strong>A message from {businessName}</strong>
          <p>{estimate.customerMessage}</p>
        </div>
        <div className="approval-document-actions">
          <Button
            variant="primary"
            wide
            icon={<FileText size={18} />}
            onClick={onDocument}
          >
            Review Full Document
          </Button>
          {estimate.approvalSettings?.allowPdfDownload && (
            <Button
              variant="outline"
              wide
              icon={<Download size={18} />}
              onClick={onDocument}
            >
              Download PDF
            </Button>
          )}
        </div>
        <div className="public-actions">
          <button disabled title="Preview only — available on the customer link">
            <Check />
            Approve
          </button>
          {estimate.approvalSettings?.allowRequestChanges && (
            <button disabled title="Preview only — available on the customer link">
              <FileCheck2 />
              Request Changes
            </button>
          )}
          {estimate.approvalSettings?.allowReject && (
            <button disabled title="Preview only — available on the customer link">
              <X />
              Reject
            </button>
          )}
        </div>
        <div className="field">
          <label>Notes for the business</label>
          <textarea
            className="textarea"
            disabled
            placeholder="Customer note, rejection reason, or requested change"
          />
        </div>
        <p className="muted small">
          Preview only. The customer will not need an account.
        </p>
      </div>
    </div>
  );
}

function OfficialEstimatePreview({
  estimate,
  customer,
  businessName,
  phone,
  email,
  template,
  documentStyle,
  onClose,
}: {
  estimate: Estimate;
  customer: CustomerForm;
  businessName: string;
  phone: string;
  email: string;
  template: DocumentTemplate;
  documentStyle: DocumentStyleTemplate;
  onClose: () => void;
}) {
  const visibleSections = (estimate.sections ?? []).filter(
    (section) => section.pdfVisible && !section.internalOnly,
  );
  const columns = template.columnSettings
    .filter((column) => {
      const style = documentStyle.columnStyles.find(
        (item) => item.columnKey === column.key,
      );
      return (
        column.visible &&
        !column.internalOnly &&
        !style?.internalOnly &&
        style?.visibleOnPdf !== false
      );
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const columnStyle = (key: string) =>
    documentStyle.columnStyles.find((item) => item.columnKey === key);
  const grid = columns
    .map(
      (column) =>
        columnStyle(column.key)?.width ??
        (column.key === "description"
          ? "minmax(110px, 1fr)"
          : "minmax(54px, auto)"),
    )
    .join(" ");
  const value = (item: EstimateLineItem, key: string) =>
    key === "description"
      ? item.name
      : key === "quantity"
        ? item.quantity
        : key === "unit"
          ? (item.unit ?? "")
          : key === "rate"
            ? money(item.unitPrice)
            : key === "total"
              ? money(item.quantity * item.unitPrice)
              : key === "category"
                ? (item.category ?? "")
                : key === "taxable"
                  ? item.taxable
                    ? "Yes"
                    : "No"
                  : key === "notes"
                    ? (item.description ?? "")
                    : "";
  return (
    <div className="estimate-preview-overlay estimate-preview-overlay--document">
      <div className="estimate-document-wrap">
        <div className="document-actions">
          <Button
            variant="ghost"
            icon={<ArrowLeft size={18} />}
            onClick={onClose}
          >
            Back to Builder
          </Button>
          <StatusBadge tone="info">Official Document Preview</StatusBadge>
        </div>
        <article
          className="estimate-paper"
          style={{
            fontFamily: documentStyle.pageStyle.fontFamily,
            fontSize: documentStyle.pageStyle.fontSize,
            color: documentStyle.pageStyle.textColor,
            backgroundColor: documentStyle.pageStyle.backgroundColor,
            padding: documentStyle.pageStyle.padding,
            width: documentStyle.pageStyle.documentWidth,
            maxWidth: "100%",
            borderColor: documentStyle.pageStyle.borderColor,
            borderWidth: documentStyle.pageStyle.borderWidth,
            borderStyle: "solid",
          }}
        >
          {template.headerSettings.showDocumentTitle !== false && (
            <header
              style={{
                color: documentStyle.headerStyle.textColor,
                backgroundColor: documentStyle.headerStyle.showBackground
                  ? documentStyle.headerStyle.backgroundColor
                  : undefined,
                padding: documentStyle.headerStyle.padding,
                textAlign: documentStyle.headerStyle.alignment,
                borderColor: documentStyle.headerStyle.borderColor,
                borderWidth: documentStyle.headerStyle.borderWidth,
                borderStyle: "solid",
                flexDirection:
                  documentStyle.headerStyle.logoPosition === "right"
                    ? "row-reverse"
                    : documentStyle.headerStyle.logoPosition === "center"
                      ? "column"
                      : "row",
              }}
            >
              <span
                className="estimate-paper__logo"
                style={{
                  width: documentStyle.headerStyle.logoSize,
                  height: documentStyle.headerStyle.logoSize,
                }}
              >
                {businessName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 3)}
              </span>
              <div>
                <h1
                  style={{
                    color: documentStyle.headerStyle.businessNameColor,
                    fontSize: documentStyle.headerStyle.businessNameFontSize,
                  }}
                >
                  {businessName}
                </h1>
                <p
                  style={{
                    color: documentStyle.businessInfoStyle.bodyTextColor,
                    backgroundColor:
                      documentStyle.businessInfoStyle.backgroundColor,
                    borderColor: documentStyle.businessInfoStyle.borderColor,
                    borderWidth: documentStyle.businessInfoStyle.borderWidth,
                    borderStyle: "solid",
                    padding: documentStyle.businessInfoStyle.padding,
                    fontSize: documentStyle.businessInfoStyle.bodyFontSize,
                    textAlign: documentStyle.businessInfoStyle.alignment,
                  }}
                >
                  {template.businessInfoSettings.phone && phone}
                  {template.businessInfoSettings.phone &&
                    template.businessInfoSettings.email && <br />}
                  {template.businessInfoSettings.email && email}
                </p>
              </div>
              <div
                className="estimate-paper__title"
                style={{
                  color: documentStyle.documentTitleStyle.textColor,
                  backgroundColor:
                    documentStyle.documentMetaStyle.backgroundColor,
                  borderColor: documentStyle.documentMetaStyle.borderColor,
                  borderWidth: documentStyle.documentMetaStyle.borderWidth,
                  borderStyle: "solid",
                  padding: documentStyle.documentMetaStyle.padding,
                  textAlign: documentStyle.documentTitleStyle.alignment,
                  fontSize: documentStyle.headerStyle.documentTitleFontSize,
                }}
              >
                <strong
                  style={{
                    color:
                      documentStyle.headerStyle.documentTitleColor ??
                      documentStyle.documentTitleStyle.textColor,
                  }}
                >
                  {estimate.title ?? "Estimate"}
                </strong>
                <span>Estimate #{estimate.number}</span>
                <span>{estimate.estimateDate}</span>
              </div>
            </header>
          )}
          <div className="estimate-paper__parties">
            <div
              style={{
                borderColor: documentStyle.customerInfoStyle.borderColor,
                borderWidth: documentStyle.customerInfoStyle.borderWidth,
                padding: documentStyle.customerInfoStyle.padding,
                color: documentStyle.customerInfoStyle.bodyTextColor,
                backgroundColor:
                  documentStyle.customerInfoStyle.backgroundColor,
                textAlign: documentStyle.customerInfoStyle.alignment,
              }}
            >
              <span
                style={{
                  color: documentStyle.customerInfoStyle.titleTextColor,
                  fontSize: documentStyle.customerInfoStyle.titleFontSize,
                }}
              >
                Name / Address
              </span>
              <strong>{customer.businessName || customer.name}</strong>
              {template.customerInfoSettings.address && (
                <p>{customer.billingAddress}</p>
              )}
            </div>
            <div
              style={{
                borderColor: documentStyle.projectInfoStyle.borderColor,
                borderWidth: documentStyle.projectInfoStyle.borderWidth,
                padding: documentStyle.projectInfoStyle.padding,
                color: documentStyle.projectInfoStyle.bodyTextColor,
                backgroundColor: documentStyle.projectInfoStyle.backgroundColor,
                textAlign: documentStyle.projectInfoStyle.alignment,
              }}
            >
              <span
                style={{
                  color: documentStyle.projectInfoStyle.titleTextColor,
                  fontSize: documentStyle.projectInfoStyle.titleFontSize,
                }}
              >
                Project
              </span>
              <strong>{estimate.projectName}</strong>
              {template.projectInfoSettings.jobLocation && (
                <p>{estimate.jobLocation}</p>
              )}
            </div>
          </div>
          <section className="estimate-paper__items">
            <div
              className="estimate-paper__head"
              style={{
                gridTemplateColumns: grid,
                color: documentStyle.tableHeaderStyle.textColor,
                backgroundColor:
                  documentStyle.tableStyle.headerRowBackgroundColor ??
                  documentStyle.tableHeaderStyle.backgroundColor,
                fontSize: documentStyle.tableHeaderStyle.fontSize,
                borderColor: documentStyle.tableStyle.tableBorderColor,
                borderWidth: documentStyle.tableStyle.tableBorderWidth,
                fontFamily: documentStyle.tableStyle.fontFamily,
              }}
            >
              {columns.map((column) => (
                <span
                  key={column.key}
                  style={{
                    color:
                      columnStyle(column.key)?.headerTextColor ??
                      documentStyle.tableStyle.headerRowTextColor,
                    backgroundColor:
                      columnStyle(column.key)?.headerBackgroundColor ??
                      documentStyle.tableStyle.headerRowBackgroundColor,
                    borderColor:
                      columnStyle(column.key)?.borderColor ??
                      documentStyle.tableStyle.columnLineColor,
                    textAlign: columnStyle(column.key)?.alignment,
                    fontFamily: columnStyle(column.key)?.fontFamily,
                    fontSize: columnStyle(column.key)?.fontSize,
                    fontWeight:
                      columnStyle(column.key)?.fontWeight === "medium"
                        ? 500
                        : columnStyle(column.key)?.fontWeight,
                  }}
                >
                  {columnStyle(column.key)?.columnLabel ?? column.label}
                </span>
              ))}
            </div>
            {visibleSections.map((section) => (
              <div className="estimate-paper__section" key={section.id}>
                <h2
                  style={{
                    color:
                      documentStyle.sectionRowStyle.textColor ??
                      documentStyle.sectionHeaderStyle.textColor,
                    backgroundColor:
                      documentStyle.sectionRowStyle.backgroundColor ??
                      documentStyle.sectionHeaderStyle.backgroundColor,
                    padding:
                      documentStyle.sectionRowStyle.padding ??
                      documentStyle.sectionHeaderStyle.padding,
                    fontSize: documentStyle.sectionRowStyle.fontSize,
                    fontWeight:
                      documentStyle.sectionRowStyle.fontWeight === "medium"
                        ? 500
                        : documentStyle.sectionRowStyle.fontWeight,
                    borderColor: documentStyle.sectionRowStyle.borderColor,
                    borderStyle: "solid",
                  }}
                >
                  {section.title}
                </h2>
                {estimate.lineItems
                  .filter(
                    (item) =>
                      item.sectionId === section.id &&
                      item.pdfVisible !== false &&
                      !item.internalOnly,
                  )
                  .map((item, rowIndex) => (
                    <div
                      className="estimate-paper__row"
                      style={{
                        gridTemplateColumns: grid,
                        color:
                          documentStyle.rowStyle.rowTextColor ??
                          documentStyle.tableRowStyle.textColor,
                        backgroundColor:
                          rowIndex % 2 &&
                          documentStyle.rowStyle.useAlternatingRows
                            ? documentStyle.rowStyle
                                .alternatingRowBackgroundColor
                            : documentStyle.rowStyle.standardRowBackgroundColor,
                        fontSize:
                          documentStyle.tableStyle.fontSize ??
                          documentStyle.tableRowStyle.fontSize,
                        borderColor:
                          documentStyle.rowStyle.rowLineColor ??
                          documentStyle.tableRowStyle.borderColor,
                        paddingBlock: documentStyle.rowStyle.rowSpacing,
                      }}
                      key={item.id}
                    >
                      {columns.map((column) => (
                        <span
                          key={column.key}
                          style={{
                            color: columnStyle(column.key)?.bodyTextColor,
                            fontFamily: columnStyle(column.key)?.fontFamily,
                            fontSize: columnStyle(column.key)?.fontSize,
                            fontWeight:
                              columnStyle(column.key)?.fontWeight === "medium"
                                ? 500
                                : columnStyle(column.key)?.fontWeight,
                            textAlign: columnStyle(column.key)?.alignment,
                            borderColor:
                              columnStyle(column.key)?.borderColor ??
                              documentStyle.tableStyle.columnLineColor,
                            padding: documentStyle.rowStyle.rowPadding,
                          }}
                        >
                          {value(item, column.key)}
                        </span>
                      ))}
                    </div>
                  ))}
              </div>
            ))}
          </section>
          {template.notesSettings.showNotes && (
            <div
              className="estimate-paper__notes"
              style={{
                color: documentStyle.notesStyle.textColor,
                fontSize: documentStyle.notesStyle.bodyFontSize,
                backgroundColor: documentStyle.notesStyle.backgroundColor,
                borderColor: documentStyle.notesStyle.borderColor,
                borderWidth: documentStyle.notesStyle.borderWidth,
                borderStyle: "solid",
                padding: documentStyle.notesStyle.padding,
              }}
            >
              <h2
                style={{
                  color: documentStyle.notesStyle.headingColor,
                  fontSize: documentStyle.notesStyle.headingFontSize,
                }}
              >
                NOTES
              </h2>
              {estimate.numberedNotes?.map((note, index) => (
                <p key={`${note}-${index}`}>
                  <span
                    style={{
                      color: documentStyle.notesStyle.numberedNoteColor,
                    }}
                  >
                    {index + 1}.
                  </span>{" "}
                  {note}
                </p>
              ))}
            </div>
          )}
          <div
            className="estimate-paper__grand-total"
            style={{
              color:
                documentStyle.totalsBoxStyle.labelColor ??
                documentStyle.totalsBoxStyle.textColor,
              backgroundColor: documentStyle.totalsBoxStyle.backgroundColor,
              borderColor: documentStyle.totalsBoxStyle.borderColor,
              padding: documentStyle.totalsBoxStyle.padding,
              borderWidth: documentStyle.totalsBoxStyle.borderWidth,
              borderStyle: "solid",
              textAlign: documentStyle.totalsBoxStyle.alignment,
            }}
          >
            <span>Total</span>
            <strong
              style={{
                color: documentStyle.totalsBoxStyle.amountColor,
                fontSize: documentStyle.totalsBoxStyle.finalTotalFontSize,
                fontWeight:
                  documentStyle.totalsBoxStyle.finalTotalFontWeight === "medium"
                    ? 500
                    : documentStyle.totalsBoxStyle.finalTotalFontWeight,
              }}
            >
              {money(estimate.total)}
            </strong>
          </div>
          {template.termsSettings.showTerms && (
            <div
              style={{
                color: documentStyle.termsStyle.bodyTextColor,
                fontSize: documentStyle.termsStyle.bodyFontSize,
                backgroundColor: documentStyle.termsStyle.backgroundColor,
                borderColor: documentStyle.termsStyle.borderColor,
                borderWidth: documentStyle.termsStyle.borderWidth,
                borderStyle: "solid",
                padding: documentStyle.termsStyle.padding,
              }}
            >
              {estimate.termsData?.paymentTerms} ·{" "}
              {estimate.termsData?.changeOrderPolicy}
            </div>
          )}
          {(template.qrCodeSettings.showQrCode ||
            template.signatureSettings.showApprovalArea) && (
            <div className="estimate-paper__approval-blocks">
              {template.qrCodeSettings.showQrCode && (
                <div
                  style={{
                    color: documentStyle.qrBlockStyle.labelColor,
                    backgroundColor: documentStyle.qrBlockStyle.backgroundColor,
                    borderColor: documentStyle.qrBlockStyle.borderColor,
                    borderWidth: documentStyle.qrBlockStyle.borderWidth,
                    borderStyle: "solid",
                    padding: documentStyle.qrBlockStyle.padding,
                    textAlign: documentStyle.qrBlockStyle.alignment,
                    fontSize: documentStyle.qrBlockStyle.labelFontSize,
                  }}
                >
                  <QrCode size={documentStyle.qrBlockStyle.qrSize ?? 84} />
                  <span>Scan for details</span>
                </div>
              )}
              {template.signatureSettings.showApprovalArea && (
                <div
                  style={{
                    color: documentStyle.signatureStyle.labelColor,
                    backgroundColor:
                      documentStyle.signatureStyle.backgroundColor,
                    borderColor: documentStyle.signatureStyle.borderColor,
                    borderWidth: documentStyle.signatureStyle.borderWidth,
                    borderStyle: "solid",
                    padding: documentStyle.signatureStyle.padding,
                    fontSize: documentStyle.signatureStyle.signatureFontSize,
                  }}
                >
                  <span
                    className="estimate-paper__signature-line"
                    style={{
                      borderColor: documentStyle.signatureStyle.lineColor,
                    }}
                  />
                  Customer approval / signature
                </div>
              )}
            </div>
          )}
          <footer
            style={{
              color: documentStyle.footerStyle.textColor,
              fontSize: documentStyle.footerStyle.fontSize,
              fontFamily: documentStyle.footerStyle.fontFamily,
              backgroundColor: documentStyle.footerStyle.backgroundColor,
              borderColor: documentStyle.footerStyle.borderColor,
              borderWidth: documentStyle.footerStyle.borderWidth,
              borderStyle: "solid",
              padding: documentStyle.footerStyle.padding,
              textAlign: documentStyle.footerStyle.alignment,
            }}
          >
            {String(
              template.footerSettings.footerText ??
                "Thank you for your business.",
            )}
          </footer>
        </article>
      </div>
    </div>
  );
}

interface CustomerForm {
  customerId: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  billingAddress: string;
  jobSiteAddress: string;
  internalNote: string;
}

export function EstimateBuilderScreen() {
  const {
    currentBusiness,
    currentBusinessId,
    workspace,
    selectedEstimateId,
    selectedCustomerId,
    selectedLeadId,
    setCurrentScreen,
    saveEstimateFromBuilder,
    saveEstimateAsTemplate,
    saveDocumentTemplate,
    saveDocumentStyle,
    saveItemBankItem,
    saveProject,
    createProtectedFollowUp,
    markUnsavedWork,
    clearUnsavedWork,
    openDocumentStyleEditor,
    openGuidedBuilder,
    guidedDraft,
  } = useAppState();
  const autoEstimateNumber = formatDocumentNumber(
    workspace.documentNumberSettings,
    "estimate",
  );
  const seed = useMemo(
    () => createBlankEstimateSeed(currentBusinessId, autoEstimateNumber),
    [currentBusinessId, autoEstimateNumber],
  );
  const selectedEstimate = selectedEstimateId
    ? workspace.estimates.find((item) => item.id === selectedEstimateId)
    : undefined;
  const selectedCustomer = workspace.customers.find(
    (item) =>
      item.id ===
      (selectedCustomerId ??
        (guidedDraft?.builderId === "estimate-builder"
          ? String(guidedDraft.answers.customerId ?? "")
          : undefined) ??
        selectedEstimate?.customerId),
  );
  const selectedLead = workspace.leads.find(
    (item) => item.id === selectedLeadId,
  );
  const initialEstimate = useMemo(
    () =>
      selectedEstimate
        ? normalizeExistingEstimate(selectedEstimate)
        : guidedDraft?.builderId === "estimate-builder"
          ? {
              ...seed.estimate,
              customerNotes: String(guidedDraft.answers.notes ?? ""),
              sections: guidedDraft.answers.categories
                ? [
                    {
                      ...seed.estimate.sections![0],
                      title: String(guidedDraft.answers.categories),
                    },
                  ]
                : seed.estimate.sections,
            }
          : selectedLead
            ? { ...seed.estimate, leadId: selectedLead.id }
            : seed.estimate,
    [selectedEstimate, seed.estimate, guidedDraft, selectedLead],
  );
  const initialCustomer = useMemo<CustomerForm>(
    () =>
      selectedCustomer
        ? {
            customerId: selectedCustomer.id,
            name: selectedCustomer.name,
            businessName: selectedCustomer.businessName ?? "",
            phone: selectedCustomer.phone,
            email: selectedCustomer.email,
            billingAddress:
              selectedCustomer.billingAddress ?? selectedCustomer.address,
            jobSiteAddress:
              selectedCustomer.jobSiteAddress ?? selectedCustomer.address,
            internalNote: selectedCustomer.notes[0] ?? "",
          }
        : selectedLead
          ? {
              customerId: "",
              name: selectedLead.name,
              businessName: selectedLead.businessName ?? "",
              phone: selectedLead.phone ?? "",
              email: selectedLead.email ?? "",
              billingAddress: selectedLead.address ?? "",
              jobSiteAddress: selectedLead.address ?? "",
              internalNote: `Started from lead · ${selectedLead.serviceNeeded}`,
            }
          : seed.customer,
    [selectedCustomer, selectedLead, seed.customer],
  );
  const [estimate, setEstimate] = useState<Estimate>(initialEstimate);
  const [customer, setCustomer] = useState<CustomerForm>(initialCustomer);
  const [step, setStep] = useState<Step>("Customer");
  const [preview, setPreview] = useState<"customer" | "document" | null>(null);
  const [showLock, setShowLock] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateName, setTemplateName] = useState(
    "Professional Project Estimate",
  );
  const [templateParts, setTemplateParts] = useState(reusableTemplateParts);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatus, setProjectStatus] = useState("Draft");
  const [projectType, setProjectType] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectTargetDate, setProjectTargetDate] = useState("");
  const [projectInternalNotes, setProjectInternalNotes] = useState("");
  const [itemBankSectionId, setItemBankSectionId] = useState<string>();
  const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplate>(
    () =>
      structuredClone(
        workspace.documentTemplates.find(
          (template) => template.documentType === "Estimate",
        )!,
      ),
  );
  const [documentStyle, setDocumentStyle] = useState<DocumentStyleTemplate>(
    () =>
      structuredClone(
        workspace.documentStyles.find(
          (style) => style.isDefault && style.documentType === "estimate",
        ) ?? workspace.documentStyles[0],
      ),
  );
  const locked = !canEditEstimateInPlace(estimate);
  const stepIndex = steps.indexOf(step);
  const sections = estimate.sections ?? [];
  const internalCost = estimate.lineItems.reduce(
    (sum, item) => sum + item.quantity * (item.internalCost ?? 0),
    0,
  );
  const estimatedProfit = estimate.total - internalCost;
  const marginPercent =
    estimate.total > 0 ? (estimatedProfit / estimate.total) * 100 : 0;
  const markupPercent =
    internalCost > 0 ? (estimatedProfit / internalCost) * 100 : 0;
  const customerProjects = workspace.projects.filter(
    (project) =>
      project.customerId === customer.customerId &&
      project.name.toLowerCase().includes(projectSearch.toLowerCase()),
  );

  const safeChange = (updater: () => void) => {
    if (locked) {
      setShowLock(true);
      return;
    }
    updater();
    setSaved(false);
  };
  const setEstimateField = <K extends keyof Estimate>(
    key: K,
    value: Estimate[K],
  ) =>
    safeChange(() =>
      setEstimate((current) => recalculate({ ...current, [key]: value })),
    );
  const updateCustomer = (patch: Partial<CustomerForm>) =>
    safeChange(() => setCustomer((current) => ({ ...current, ...patch })));
  const chooseCustomer = (id: string) => {
    const match = workspace.customers.find((item) => item.id === id);
    if (!match) {
      updateCustomer({
        customerId: "",
        name: "",
        businessName: "",
        phone: "",
        email: "",
        billingAddress: "",
        jobSiteAddress: "",
        internalNote: "",
      });
      return;
    }
    updateCustomer({
      customerId: match.id,
      name: match.name,
      businessName: match.businessName ?? "",
      phone: match.phone,
      email: match.email,
      billingAddress: match.billingAddress ?? match.address,
      jobSiteAddress: match.jobSiteAddress ?? match.address,
      internalNote: match.notes[0] ?? "",
    });
    setEstimate((current) => ({ ...current, customerId: match.id }));
  };
  const startFromLead = (leadId: string) => {
    const lead = workspace.leads.find((item) => item.id === leadId);
    if (lead) {
      updateCustomer({
        customerId: "",
        name: lead.name,
        businessName: "",
        internalNote: `Started from lead · ${lead.serviceNeeded}`,
      });
      setEstimate((current) => ({ ...current, leadId }));
    }
  };
  const chooseProject = (projectId: string) => {
    const project = workspace.projects.find((item) => item.id === projectId);
    if (!project) return;
    safeChange(() =>
      setEstimate((current) => ({
        ...current,
        projectId: project.id,
        projectName: project.name,
        jobLocation: project.jobLocation ?? customer.jobSiteAddress,
        projectDescription: project.description ?? current.projectDescription,
      })),
    );
  };
  const updateSection = (id: string, patch: Partial<EstimateSection>) =>
    safeChange(() =>
      setEstimate((current) =>
        recalculate(
          current,
          current.lineItems,
          (current.sections ?? []).map((section) =>
            section.id === id ? { ...section, ...patch } : section,
          ),
        ),
      ),
    );
  const addSection = () =>
    safeChange(() =>
      setEstimate((current) => {
        const newSection: EstimateSection = {
          id: freshId(`${current.id}-section`),
          estimateId: current.id,
          title: "NEW SECTION",
          sortOrder: current.sections?.length ?? 0,
          lineItemIds: [],
          subtotal: 0,
          customerVisible: true,
          pdfVisible: true,
          internalOnly: false,
          collapsed: false,
        };
        return recalculate(current, current.lineItems, [
          ...(current.sections ?? []),
          newSection,
        ]);
      }),
    );
  const duplicateSection = (section: EstimateSection) =>
    safeChange(() =>
      setEstimate((current) => {
        const newSectionId = freshId(`${current.id}-section`);
        const copiedItems = current.lineItems
          .filter((item) => item.sectionId === section.id)
          .map((item, index) => ({
            ...item,
            id: freshId(`${newSectionId}-item`),
            sectionId: newSectionId,
            sortOrder: index,
          }));
        const copy = {
          ...section,
          id: newSectionId,
          title: `${section.title} COPY`,
          sortOrder: current.sections?.length ?? 0,
          lineItemIds: copiedItems.map((item) => item.id),
          collapsed: false,
        };
        return recalculate(
          current,
          [...current.lineItems, ...copiedItems],
          [...(current.sections ?? []), copy],
        );
      }),
    );
  const deleteSection = (sectionId: string) =>
    safeChange(() =>
      setEstimate((current) =>
        recalculate(
          current,
          current.lineItems.filter((item) => item.sectionId !== sectionId),
          (current.sections ?? []).filter(
            (section) => section.id !== sectionId,
          ),
        ),
      ),
    );
  const moveSection = (sectionId: string, direction: -1 | 1) =>
    safeChange(() =>
      setEstimate((current) => {
        const list = [...(current.sections ?? [])];
        const index = list.findIndex((section) => section.id === sectionId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= list.length) return current;
        [list[index], list[target]] = [list[target], list[index]];
        return recalculate(
          current,
          current.lineItems,
          list.map((section, sortOrder) => ({ ...section, sortOrder })),
        );
      }),
    );
  const addItem = (sectionId: string, optional = false) =>
    safeChange(() =>
      setEstimate((current) => {
        const item: EstimateLineItem = {
          id: freshId(`${sectionId}-item`),
          estimateId: current.id,
          sectionId,
          name: optional ? "Optional add-on" : "New item",
          quantity: 1,
          unitPrice: 0,
          visibleToCustomer: true,
          pdfVisible: true,
          internalOnly: false,
          taxable: false,
          sortOrder: current.lineItems.filter(
            (entry) => entry.sectionId === sectionId,
          ).length,
        };
        return recalculate(current, [...current.lineItems, item]);
      }),
    );
  const addBankItem = (bankItem: ItemServiceBankItem) => {
    if (!itemBankSectionId) return;
    safeChange(() =>
      setEstimate((current) => {
        const item: EstimateLineItem = {
          id: freshId(`${itemBankSectionId}-item`),
          estimateId: current.id,
          sectionId: itemBankSectionId,
          name: bankItem.customerDescription || bankItem.name,
          description: bankItem.description,
          quantity: bankItem.defaultQuantity,
          unitPrice: bankItem.defaultRate,
          unit: bankItem.unit,
          category: bankItem.category,
          taxable: bankItem.taxable,
          visibleToCustomer: true,
          pdfVisible: true,
          internalOnly: false,
          internalCost: bankItem.internalCost,
          markup: bankItem.markup,
          internalNotes: bankItem.internalNotes,
          sourceBankItemId: bankItem.id,
          sourceItemSnapshot: structuredClone(bankItem) as unknown as Record<
            string,
            unknown
          >,
          sortOrder: current.lineItems.filter(
            (entry) => entry.sectionId === itemBankSectionId,
          ).length,
        };
        return recalculate(current, [...current.lineItems, item]);
      }),
    );
    setItemBankSectionId(undefined);
    setMessage(
      `${bankItem.name} was copied into this estimate. Future bank changes will not alter this document.`,
    );
  };
  const updateDocumentColumn = (
    key: string,
    patch: Partial<DocumentTemplate["columnSettings"][number]>,
  ) =>
    setDocumentTemplate((current) => ({
      ...current,
      columnSettings: current.columnSettings.map((column) =>
        column.key === key ? { ...column, ...patch } : column,
      ),
      updatedAt: new Date().toISOString(),
    }));
  const moveDocumentColumn = (key: string, direction: -1 | 1) =>
    setDocumentTemplate((current) => {
      const list = [...current.columnSettings].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      const index = list.findIndex((column) => column.key === key);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= list.length) return current;
      [list[index], list[target]] = [list[target], list[index]];
      return {
        ...current,
        columnSettings: list.map((column, sortOrder) => ({
          ...column,
          sortOrder,
        })),
        updatedAt: new Date().toISOString(),
      };
    });
  const addCustomDocumentColumn = () =>
    setDocumentTemplate((current) => ({
      ...current,
      columnSettings: [
        ...current.columnSettings,
        {
          key: `custom-${Date.now()}`,
          label: "Custom Column",
          visible: true,
          visibleToCustomer: true,
          internalOnly: false,
          columnType: "text",
          sortOrder: current.columnSettings.length,
        },
      ],
      updatedAt: new Date().toISOString(),
    }));
  const deleteCustomDocumentColumn = (key: string) =>
    setDocumentTemplate((current) => ({
      ...current,
      columnSettings: current.columnSettings.filter(
        (column) => column.key !== key,
      ),
    }));
  const updateItem = (itemId: string, patch: Partial<EstimateLineItem>) =>
    safeChange(() =>
      setEstimate((current) =>
        recalculate(
          current,
          current.lineItems.map((item) =>
            item.id === itemId ? { ...item, ...patch } : item,
          ),
        ),
      ),
    );
  const duplicateItem = (item: EstimateLineItem) =>
    safeChange(() =>
      setEstimate((current) =>
        recalculate(current, [
          ...current.lineItems,
          {
            ...item,
            id: freshId(`${item.sectionId}-item`),
            name: `${item.name} copy`,
          },
        ]),
      ),
    );
  const deleteItem = (itemId: string) =>
    safeChange(() =>
      setEstimate((current) =>
        recalculate(
          current,
          current.lineItems.filter((item) => item.id !== itemId),
        ),
      ),
    );
  const addNumberedNote = () =>
    setEstimateField("numberedNotes", [
      ...(estimate.numberedNotes ?? []),
      "New document note",
    ]);
  const updateNote = (index: number, value: string) =>
    setEstimateField(
      "numberedNotes",
      (estimate.numberedNotes ?? []).map((note, noteIndex) =>
        noteIndex === index ? value : note,
      ),
    );
  const deleteNote = (index: number) =>
    setEstimateField(
      "numberedNotes",
      (estimate.numberedNotes ?? []).filter(
        (_, noteIndex) => noteIndex !== index,
      ),
    );
  const moveNote = (index: number, direction: -1 | 1) =>
    setEstimateField(
      "numberedNotes",
      (() => {
        const notes = [...(estimate.numberedNotes ?? [])];
        const target = index + direction;
        if (target < 0 || target >= notes.length) return notes;
        [notes[index], notes[target]] = [notes[target], notes[index]];
        return notes;
      })(),
    );
  const save = (status: "Draft" | "Sent") => {
    if (locked) {
      setShowLock(true);
      return;
    }
    if (
      status === "Sent" &&
      (!customer.name.trim() || !customer.email.trim())
    ) {
      setStep("Customer");
      setMessage(
        "Choose a customer with an email before sending this estimate.",
      );
      return;
    }
    const id = saveEstimateFromBuilder(
      { ...estimate, customerId: customer.customerId, status },
      {
        name: customer.name,
        businessName: customer.businessName,
        phone: customer.phone,
        email: customer.email,
        address: customer.billingAddress,
        billingAddress: customer.billingAddress,
        jobSiteAddress: customer.jobSiteAddress,
      },
      status,
    );
    setEstimate((current) => ({ ...current, id, status }));
    setSaved(true);
    clearUnsavedWork();
    setMessage(
      status === "Sent"
        ? "Sent for approval in mock mode. The exact version is protected."
        : "Draft saved.",
    );
  };
  useEffect(() => {
    if (!saved)
      markUnsavedWork(`Unsaved estimate ${estimate.number}`, () =>
        save("Draft"),
      );
    return () => undefined;
  }, [saved, estimate, customer]);
  const goNext = () =>
    setStep(steps[Math.min(steps.length - 1, stepIndex + 1)]);
  const goBack = () => setStep(steps[Math.max(0, stepIndex - 1)]);

  return (
    <section
      className={`screen estimate-builder-screen${step === "Items" ? " estimate-builder-screen--items" : ""}`}
    >
      <header className="estimate-builder-header">
        <button
          className="btn btn--ghost"
          aria-label="Back to Money"
          onClick={() => setCurrentScreen("money")}
        >
          <ArrowLeft />
        </button>
        <div className="grow">
          <h1>Create Estimate</h1>
          <StatusBadge tone={statusTone(estimate.status)}>
            {estimate.status}
          </StatusBadge>
        </div>
        <Button
          variant="ghost"
          icon={<Save size={18} />}
          onClick={() => save("Draft")}
        >
          Save
        </Button>
      </header>
      <section className="estimate-business-context">
        <div className="official-logo">{currentBusiness.initials}</div>
        <div>
          <strong>{currentBusiness.name}</strong>
          <p>
            Estimate will use this business profile, brand kit, terms, and
            templates.
          </p>
        </div>
      </section>
      <Button
        className="section"
        variant="ghost"
        onClick={() => openGuidedBuilder("Create Estimate")}
      >
        Walk Me Through It
      </Button>
      <nav className="estimate-steps" aria-label="Estimate builder steps">
        {steps.map((value, index) => (
          <button
            key={value}
            className={
              step === value
                ? "estimate-step estimate-step--active"
                : "estimate-step"
            }
            onClick={() => setStep(value)}
          >
            <span>{index + 1}</span>
            {value}
          </button>
        ))}
      </nav>
      {message && (
        <div className="alert alert--info section" role="status">
          <FileCheck2 size={20} />
          <strong>{message}</strong>
        </div>
      )}

      <div className="estimate-builder-layout section">
        <div className="estimate-builder-main">
          {step === "Customer" && (
            <section className="estimate-step-panel">
              <div className="estimate-panel-title">
                <div className="icon-box">
                  <UserPlus size={21} />
                </div>
                <div>
                  <h2>Who is this estimate for?</h2>
                  <p>
                    Select a customer, add someone new, or start from a lead.
                  </p>
                </div>
              </div>
              <div className="field">
                <label htmlFor="estimate-customer">
                  Select existing customer
                </label>
                <select
                  id="estimate-customer"
                  className="select"
                  value={customer.customerId}
                  onChange={(event) => chooseCustomer(event.target.value)}
                >
                  <option value="">Add new customer</option>
                  {workspace.customers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="estimate-lead">Start from lead</label>
                <select
                  id="estimate-lead"
                  className="select"
                  value={estimate.leadId ?? ""}
                  onChange={(event) => startFromLead(event.target.value)}
                >
                  <option value="">Choose a lead</option>
                  {workspace.leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} · {lead.serviceNeeded}
                    </option>
                  ))}
                </select>
                {estimate.leadId && (
                  <small className="field-help">Started from lead</small>
                )}
              </div>
              <div className="estimate-field-grid">
                <div className="field">
                  <label>Customer name</label>
                  <input
                    className="input"
                    value={customer.name}
                    onChange={(event) =>
                      updateCustomer({ name: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Business name, optional</label>
                  <input
                    className="input"
                    value={customer.businessName}
                    onChange={(event) =>
                      updateCustomer({ businessName: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input
                    className="input"
                    value={customer.phone}
                    onChange={(event) =>
                      updateCustomer({ phone: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    value={customer.email}
                    onChange={(event) =>
                      updateCustomer({ email: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Billing address</label>
                  <textarea
                    className="textarea textarea--small"
                    value={customer.billingAddress}
                    onChange={(event) =>
                      updateCustomer({ billingAddress: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Job site address</label>
                  <textarea
                    className="textarea textarea--small"
                    value={customer.jobSiteAddress}
                    onChange={(event) =>
                      updateCustomer({ jobSiteAddress: event.target.value })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label>Customer notes — internal only</label>
                <textarea
                  className="textarea"
                  value={customer.internalNote}
                  onChange={(event) =>
                    updateCustomer({ internalNote: event.target.value })
                  }
                />
              </div>
              {!customer.name && (
                <div className="alert alert--warning">
                  <UserPlus size={20} />
                  <span>
                    Choose a customer before sending this estimate. You can
                    still save a draft.
                  </span>
                </div>
              )}
            </section>
          )}

          {step === "Project" && (
            <section className="estimate-step-panel">
              <div className="estimate-panel-title">
                <div className="icon-box">
                  <FileText size={21} />
                </div>
                <div>
                  <h2>Project details</h2>
                  <p>
                    Choose an existing project or create a new one for this
                    customer.
                  </p>
                </div>
              </div>
              {!customer.customerId ? (
                <div className="alert alert--info">
                  <UserPlus size={20} />
                  <span>Choose a customer first to see their projects.</span>
                </div>
              ) : (
                <div className="project-picker">
                  <div className="field">
                    <label>Search customer projects</label>
                    <input
                      className="input"
                      value={projectSearch}
                      onChange={(event) => setProjectSearch(event.target.value)}
                      placeholder="Search projects for this customer"
                    />
                  </div>
                  {customerProjects.length ? (
                    <div className="project-choice-list">
                      {customerProjects.map((project) => (
                        <article
                          key={project.id}
                          className={
                            estimate.projectId === project.id
                              ? "project-choice project-choice--selected"
                              : "project-choice"
                          }
                        >
                          <div>
                            <strong>{project.name}</strong>
                            <span>
                              {project.status} ·{" "}
                              {project.lastActivity ?? "Saved project"}
                            </span>
                            <small>
                              {project.estimateIds?.length ?? 0} estimates ·{" "}
                              {project.invoiceIds?.length ?? 0} invoices
                            </small>
                          </div>
                          <Button
                            variant={
                              estimate.projectId === project.id
                                ? "primary"
                                : "outline"
                            }
                            onClick={() => chooseProject(project.id)}
                          >
                            {estimate.projectId === project.id
                              ? "Selected"
                              : "Select Project"}
                          </Button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert--neutral">
                      <FolderOpen size={20} />
                      <span>
                        No projects yet for this customer. Create a new project
                        to keep estimates, invoices, files, and notes together.
                      </span>
                    </div>
                  )}
                  <div className="row" style={{ flexWrap: "wrap" }}>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEstimateField("projectId", undefined);
                        setEstimateField("projectName", "");
                      }}
                    >
                      Create New Project
                    </Button>
                    {customerProjects[0] && (
                      <Button
                        variant="neutral"
                        onClick={() => {
                          chooseProject(customerProjects[0].id);
                          setEstimateField("projectId", undefined);
                          setEstimateField(
                            "projectName",
                            `${customerProjects[0].name} Copy`,
                          );
                        }}
                      >
                        Duplicate Similar Project
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <div className="estimate-field-grid">
                <div className="field">
                  <label>Estimate title</label>
                  <input
                    className="input"
                    value={estimate.title ?? ""}
                    onChange={(event) =>
                      setEstimateField("title", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Project name</label>
                  <input
                    className="input"
                    value={estimate.projectName}
                    onChange={(event) =>
                      setEstimateField("projectName", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Estimate number</label>
                  <input
                    className="input"
                    value={estimate.number}
                    onChange={(event) => {
                      setEstimateField("number", event.target.value);
                    }}
                  />
                  <small className="field-help">
                    Auto-generated from this business profile. You can edit it
                    if needed.
                  </small>
                </div>
                <div className="field">
                  <label>Estimate date</label>
                  <input
                    className="input"
                    type="date"
                    value={estimate.estimateDate ?? ""}
                    onChange={(event) =>
                      setEstimateField("estimateDate", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Expiration date, optional</label>
                  <input
                    className="input"
                    type="date"
                    value={estimate.expirationDate ?? ""}
                    onChange={(event) =>
                      setEstimateField("expirationDate", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Job location, optional</label>
                  <input
                    className="input"
                    value={estimate.jobLocation ?? ""}
                    onChange={(event) =>
                      setEstimateField("jobLocation", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Prepared by, optional</label>
                  <input
                    className="input"
                    value={estimate.preparedBy ?? ""}
                    onChange={(event) =>
                      setEstimateField("preparedBy", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Sales rep, optional</label>
                  <input
                    className="input"
                    value={estimate.salesRep ?? ""}
                    onChange={(event) =>
                      setEstimateField("salesRep", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label>Project description, optional</label>
                <textarea
                  className="textarea"
                  value={estimate.projectDescription ?? ""}
                  onChange={(event) =>
                    setEstimateField("projectDescription", event.target.value)
                  }
                />
              </div>
              <details>
                <summary>More Project Details</summary>
                <div className="estimate-field-grid">
                  <div className="field">
                    <label>Project status</label>
                    <select
                      className="select"
                      value={projectStatus}
                      onChange={(event) => setProjectStatus(event.target.value)}
                    >
                      {[
                        "Active",
                        "Past",
                        "Completed",
                        "Draft",
                        "Waiting Approval",
                        "In Progress",
                        "Archived",
                      ].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Project type / category</label>
                    <input
                      className="input"
                      value={projectType}
                      onChange={(event) => setProjectType(event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Start date</label>
                    <input
                      className="input"
                      type="date"
                      value={projectStartDate}
                      onChange={(event) =>
                        setProjectStartDate(event.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Target completion</label>
                    <input
                      className="input"
                      type="date"
                      value={projectTargetDate}
                      onChange={(event) =>
                        setProjectTargetDate(event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Internal project notes</label>
                  <textarea
                    className="textarea textarea--small"
                    value={projectInternalNotes}
                    onChange={(event) =>
                      setProjectInternalNotes(event.target.value)
                    }
                  />
                </div>
                {!estimate.projectId &&
                  estimate.projectName &&
                  customer.customerId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const projectId = saveProject({
                          customerId: customer.customerId,
                          name: estimate.projectName,
                          status: projectStatus,
                          projectType,
                          jobLocation: estimate.jobLocation,
                          description: estimate.projectDescription,
                          startDate: projectStartDate || undefined,
                          targetCompletionDate: projectTargetDate || undefined,
                          notes: [],
                          internalNotes: projectInternalNotes
                            ? [projectInternalNotes]
                            : [],
                        });
                        setEstimateField("projectId", projectId);
                      }}
                    >
                      Save New Project
                    </Button>
                  )}
              </details>
            </section>
          )}

          {step === "Items" && (
            <div className="estimate-items-step">
              <div className="between">
                <div>
                  <h2 className="section-heading">Sections &amp; items</h2>
                  <p className="section-copy">
                    Build the estimate by room, phase, or service category.
                  </p>
                </div>
                <Button
                  variant="primary"
                  icon={<Plus size={18} />}
                  onClick={addSection}
                >
                  Add Section
                </Button>
              </div>
              {sections.map((section, sectionIndex) => (
                <section className="estimate-section-card" key={section.id}>
                  <header>
                    <button
                      className="estimate-collapse"
                      onClick={() =>
                        updateSection(section.id, {
                          collapsed: !section.collapsed,
                        })
                      }
                      aria-label={`${section.collapsed ? "Expand" : "Collapse"} ${section.title}`}
                    >
                      <ChevronDown
                        className={section.collapsed ? "rotated" : ""}
                      />
                    </button>
                    <div className="grow">
                      <input
                        aria-label="Section title"
                        value={section.title}
                        onChange={(event) =>
                          updateSection(section.id, {
                            title: event.target.value,
                          })
                        }
                      />
                      <strong>{money(section.subtotal)}</strong>
                    </div>
                  </header>
                  {!section.collapsed && (
                    <>
                      <div className="section-visibility">
                        <label>
                          <input
                            type="checkbox"
                            checked={section.customerVisible}
                            onChange={(event) =>
                              updateSection(section.id, {
                                customerVisible: event.target.checked,
                              })
                            }
                          />{" "}
                          Customer
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={section.pdfVisible}
                            onChange={(event) =>
                              updateSection(section.id, {
                                pdfVisible: event.target.checked,
                              })
                            }
                          />{" "}
                          PDF
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={section.internalOnly}
                            onChange={(event) =>
                              updateSection(section.id, {
                                internalOnly: event.target.checked,
                              })
                            }
                          />{" "}
                          Internal only
                        </label>
                      </div>
                      <div className="estimate-item-list">
                        {estimate.lineItems
                          .filter((item) => item.sectionId === section.id)
                          .map((item) => (
                            <article
                              className="estimate-item-card"
                              key={item.id}
                            >
                              <div className="field">
                                <label>Description</label>
                                <input
                                  className="input"
                                  value={item.name}
                                  onChange={(event) =>
                                    updateItem(item.id, {
                                      name: event.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="estimate-item-numbers">
                                <div className="field">
                                  <label>Qty</label>
                                  <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    step=".01"
                                    value={item.quantity}
                                    onChange={(event) =>
                                      updateItem(item.id, {
                                        quantity: Number(event.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div className="field">
                                  <label>Rate</label>
                                  <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    step=".01"
                                    value={item.unitPrice}
                                    onChange={(event) =>
                                      updateItem(item.id, {
                                        unitPrice: Number(event.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <span>Total</span>
                                  <strong>
                                    {money(item.quantity * item.unitPrice)}
                                  </strong>
                                </div>
                              </div>
                              <div className="estimate-item-actions">
                                <button
                                  onClick={() =>
                                    saveItemBankItem({
                                      id: `${currentBusinessId}-estimate-item-${Date.now()}`,
                                      businessProfileId: currentBusinessId,
                                      name: item.name || "New item",
                                      description:
                                        item.description ?? item.name,
                                      customerDescription:
                                        item.description ?? item.name,
                                      category: item.category ?? section.title,
                                      unit: item.unit ?? "each",
                                      defaultQuantity: item.quantity || 1,
                                      defaultRate: item.unitPrice,
                                      internalCost: item.internalCost,
                                      markup: item.markup,
                                      taxable: item.taxable ?? false,
                                      internalNotes: item.internalNotes,
                                      lastUsed: "Just now",
                                      source: "Manual",
                                    })
                                  }
                                >
                                  <Save size={15} /> Save to Item Bank
                                </button>
                                <button onClick={() => duplicateItem(item)}>
                                  <Copy size={15} /> Duplicate
                                </button>
                                <button
                                  onClick={() =>
                                    updateItem(item.id, {
                                      visibleToCustomer:
                                        !item.visibleToCustomer,
                                    })
                                  }
                                >
                                  {item.visibleToCustomer ? (
                                    <Eye size={15} />
                                  ) : (
                                    <X size={15} />
                                  )}
                                  {item.visibleToCustomer
                                    ? "Visible"
                                    : "Hidden"}
                                </button>
                                <button onClick={() => deleteItem(item.id)}>
                                  <Trash2 size={15} /> Delete
                                </button>
                              </div>
                              <details>
                                <summary>More Options</summary>
                                <div className="estimate-item-advanced">
                                  <div className="field">
                                    <label>Unit</label>
                                    <input
                                      className="input"
                                      value={item.unit ?? ""}
                                      onChange={(event) =>
                                        updateItem(item.id, {
                                          unit: event.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="field">
                                    <label>Internal cost</label>
                                    <input
                                      className="input"
                                      type="number"
                                      value={item.internalCost ?? ""}
                                      onChange={(event) =>
                                        updateItem(item.id, {
                                          internalCost: Number(
                                            event.target.value,
                                          ),
                                          internalOnly: true,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="field">
                                    <label>Supplier</label>
                                    <input
                                      className="input"
                                      value={item.supplier ?? ""}
                                      onChange={(event) =>
                                        updateItem(item.id, {
                                          supplier: event.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="field">
                                    <label>SKU / item code</label>
                                    <input
                                      className="input"
                                      value={item.sku ?? ""}
                                      onChange={(event) =>
                                        updateItem(item.id, {
                                          sku: event.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={item.pdfVisible !== false}
                                      onChange={(event) =>
                                        updateItem(item.id, {
                                          pdfVisible: event.target.checked,
                                        })
                                      }
                                    />{" "}
                                    Show on PDF
                                  </label>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={item.taxable ?? false}
                                      onChange={(event) =>
                                        updateItem(item.id, {
                                          taxable: event.target.checked,
                                        })
                                      }
                                    />{" "}
                                    Taxable
                                  </label>
                                  <p>
                                    QuickBooks item mapping placeholder · Profit
                                    and markup stay internal.
                                  </p>
                                </div>
                              </details>
                            </article>
                          ))}
                      </div>
                      <div className="estimate-add-item">
                        <Button
                          variant="outline"
                          icon={<Plus size={16} />}
                          onClick={() => addItem(section.id)}
                        >
                          Add Item
                        </Button>
                        <details>
                          <summary>More add options</summary>
                          <div>
                            <button
                              onClick={() => setItemBankSectionId(section.id)}
                            >
                              Add from Item Bank
                            </button>
                            <button
                              onClick={() => setItemBankSectionId(section.id)}
                            >
                              Add recent item
                            </button>
                            <button
                              onClick={() => setItemBankSectionId(section.id)}
                            >
                              Add from this category
                            </button>
                            <button
                              onClick={() => setCurrentScreen("global-library")}
                            >
                              Search Global Library
                            </button>
                            <button
                              onClick={() => setCurrentScreen("sync-center")}
                            >
                              QuickBooks items — placeholder
                            </button>
                            <button onClick={() => addItem(section.id)}>
                              Create new item here
                            </button>
                            <button onClick={() => addItem(section.id, true)}>
                              Add optional add-on
                            </button>
                          </div>
                        </details>
                      </div>
                      <div className="estimate-section-actions">
                        <button onClick={() => duplicateSection(section)}>
                          <Copy size={15} /> Duplicate Section
                        </button>
                        <button
                          disabled={sectionIndex === 0}
                          onClick={() => moveSection(section.id, -1)}
                        >
                          <ArrowUp size={15} /> Move
                        </button>
                        <button
                          disabled={sectionIndex === sections.length - 1}
                          onClick={() => moveSection(section.id, 1)}
                        >
                          <ArrowDown size={15} /> Move
                        </button>
                        <button onClick={() => deleteSection(section.id)}>
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </section>
              ))}
              <section className="estimate-adjustments">
                <div>
                  <span>Subtotal</span>
                  <strong>{money(estimate.subtotal ?? 0)}</strong>
                </div>
                <label>
                  <span>Discount</span>
                  <input
                    type="number"
                    value={estimate.discount ?? 0}
                    onChange={(event) =>
                      setEstimateField("discount", Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  <span>Tax</span>
                  <input
                    type="number"
                    value={estimate.tax ?? 0}
                    onChange={(event) =>
                      setEstimateField("tax", Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  <span>Deposit requested</span>
                  <input
                    type="number"
                    value={estimate.depositRequested ?? 0}
                    onChange={(event) =>
                      setEstimateField(
                        "depositRequested",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>
                <div className="estimate-adjustments__total">
                  <span>Final total</span>
                  <strong>{money(estimate.total)}</strong>
                </div>
              </section>
              <details className="internal-summary">
                <summary>
                  <LockKeyhole size={17} /> Internal Summary{" "}
                  <span>Business only</span>
                </summary>
                <div>
                  <div>
                    <span>Customer total</span>
                    <strong>{money(estimate.total)}</strong>
                  </div>
                  <div>
                    <span>Internal cost</span>
                    <strong>{money(internalCost)}</strong>
                  </div>
                  <div>
                    <span>Estimated profit</span>
                    <strong>{money(estimatedProfit)}</strong>
                  </div>
                  <div>
                    <span>Margin</span>
                    <strong>{marginPercent.toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span>Markup</span>
                    <strong>{markupPercent.toFixed(1)}%</strong>
                  </div>
                </div>
                <p>
                  Never shown on the customer view, approval link, or official
                  PDF.
                </p>
              </details>
            </div>
          )}

          {step === "Notes & Terms" && (
            <section className="estimate-step-panel">
              <div className="estimate-panel-title">
                <div className="icon-box">
                  <FileCheck2 size={21} />
                </div>
                <div>
                  <h2>Notes, terms &amp; approval</h2>
                  <p>
                    Keep customer-facing and internal information clearly
                    separated.
                  </p>
                </div>
              </div>
              <div className="field">
                <label>Customer message</label>
                <textarea
                  className="textarea"
                  value={estimate.customerMessage ?? ""}
                  onChange={(event) =>
                    setEstimateField("customerMessage", event.target.value)
                  }
                />
              </div>
              <div className="field">
                <label>Customer notes — visible</label>
                <textarea
                  className="textarea"
                  value={estimate.customerNotes ?? ""}
                  onChange={(event) =>
                    setEstimateField("customerNotes", event.target.value)
                  }
                />
              </div>
              <div className="field field--internal">
                <label>
                  <LockKeyhole size={16} /> Internal notes — never shown to
                  customer
                </label>
                <textarea
                  className="textarea"
                  value={estimate.internalNotes ?? ""}
                  onChange={(event) =>
                    setEstimateField("internalNotes", event.target.value)
                  }
                />
              </div>
              <div className="estimate-field-grid">
                <div className="field">
                  <label>Payment terms</label>
                  <select
                    className="select"
                    value={estimate.termsData?.paymentTerms}
                    onChange={(event) =>
                      setEstimateField("termsData", {
                        ...estimate.termsData!,
                        paymentTerms: event.target.value,
                      })
                    }
                  >
                    <option>Due on receipt</option>
                    <option>Deposit required</option>
                    <option>Balance due upon completion</option>
                    <option>Net 7</option>
                    <option>Net 14</option>
                    <option>Net 30</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div className="field">
                  <label>Expiration</label>
                  <select
                    className="select"
                    value={estimate.termsData?.expirationText}
                    onChange={(event) =>
                      setEstimateField("termsData", {
                        ...estimate.termsData!,
                        expirationText: event.target.value,
                      })
                    }
                  >
                    <option>No expiration</option>
                    <option>Estimate expires in 7 days</option>
                    <option>Estimate expires in 14 days</option>
                    <option>Estimate expires in 30 days</option>
                    <option>Custom date</option>
                    <option>Custom text</option>
                  </select>
                </div>
              </div>
              {estimate.termsData?.paymentTerms === "Custom" && (
                <div className="field">
                  <label>Custom payment terms</label>
                  <textarea
                    className="textarea textarea--small"
                    value={estimate.termsData.customTerms ?? ""}
                    placeholder="Example: 50% deposit required to schedule. Remaining balance due upon completion."
                    onChange={(event) =>
                      setEstimateField("termsData", {
                        ...estimate.termsData!,
                        customTerms: event.target.value,
                      })
                    }
                  />
                </div>
              )}
              {estimate.termsData?.expirationText === "Custom date" && (
                <div className="field">
                  <label>Custom expiration date</label>
                  <input
                    className="input"
                    type="date"
                    value={estimate.expirationDate ?? ""}
                    onChange={(event) =>
                      setEstimateField("expirationDate", event.target.value)
                    }
                  />
                </div>
              )}
              {estimate.termsData?.expirationText === "Custom text" && (
                <div className="field">
                  <label>Custom expiration text</label>
                  <textarea
                    className="textarea textarea--small"
                    value={estimate.termsData.customExpirationText ?? ""}
                    placeholder="Example: Estimate valid for 45 days unless material pricing changes."
                    onChange={(event) =>
                      setEstimateField("termsData", {
                        ...estimate.termsData!,
                        customExpirationText: event.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div className="field">
                <label>Change order policy</label>
                <textarea
                  className="textarea textarea--small"
                  value={estimate.termsData?.changeOrderPolicy}
                  onChange={(event) =>
                    setEstimateField("termsData", {
                      ...estimate.termsData!,
                      changeOrderPolicy: event.target.value,
                    })
                  }
                />
              </div>
              <div>
                <div className="between">
                  <div>
                    <h3>Official document notes</h3>
                    <p className="section-copy">
                      Numbered clearly on the official document.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    icon={<Plus size={16} />}
                    onClick={addNumberedNote}
                  >
                    Add Note
                  </Button>
                </div>
                <div className="numbered-note-list">
                  {estimate.numberedNotes?.map((note, index) => (
                    <div key={`${index}-${note.slice(0, 8)}`}>
                      <span>{index + 1}</span>
                      <textarea
                        className="textarea textarea--small"
                        value={note}
                        onChange={(event) =>
                          updateNote(index, event.target.value)
                        }
                      />
                      <span className="note-order-actions">
                        <button
                          disabled={index === 0}
                          onClick={() => moveNote(index, -1)}
                          aria-label={`Move note ${index + 1} up`}
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          disabled={
                            index === (estimate.numberedNotes?.length ?? 0) - 1
                          }
                          onClick={() => moveNote(index, 1)}
                          aria-label={`Move note ${index + 1} down`}
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          onClick={() => deleteNote(index)}
                          aria-label={`Delete note ${index + 1}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <section className="document-footer-settings">
                <div className="between">
                  <div>
                    <h3>Document Footer</h3>
                    <p className="section-copy">
                      Reusable wording kept separate from notes.
                    </p>
                  </div>
                  <StatusBadge tone="info">Customer / PDF</StatusBadge>
                </div>
                <div className="field">
                  <label>Footer text</label>
                  <textarea
                    className="textarea textarea--small"
                    value={estimate.deliverySettings?.documentFooter ?? ""}
                    placeholder="Balance due upon completion. Change orders require written customer approval."
                    onChange={(event) =>
                      setEstimateField("deliverySettings", {
                        ...estimate.deliverySettings!,
                        documentFooter: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="help-choice-grid">
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(
                        documentTemplate.footerSettings.showFooter,
                      )}
                      onChange={(event) =>
                        setDocumentTemplate((current) => ({
                          ...current,
                          footerSettings: {
                            ...current.footerSettings,
                            showFooter: event.target.checked,
                          },
                        }))
                      }
                    />{" "}
                    Show on official PDF
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={documentTemplate.visibleFields.includes(
                        "footer",
                      )}
                      onChange={(event) =>
                        setDocumentTemplate((current) => ({
                          ...current,
                          visibleFields: event.target.checked
                            ? [
                                ...current.visibleFields.filter(
                                  (field) => field !== "footer",
                                ),
                                "footer",
                              ]
                            : current.visibleFields.filter(
                                (field) => field !== "footer",
                              ),
                        }))
                      }
                    />{" "}
                    Show in customer view
                  </label>
                </div>
                <div className="modal-actions">
                  <Button
                    variant="outline"
                    onClick={() =>
                      saveDocumentTemplate({
                        ...documentTemplate,
                        footerSettings: {
                          ...documentTemplate.footerSettings,
                          footerText:
                            estimate.deliverySettings?.documentFooter ?? "",
                        },
                      })
                    }
                  >
                    Save Footer as Default
                  </Button>
                  <Button
                    variant="neutral"
                    onClick={() =>
                      setEstimateField("deliverySettings", {
                        ...(estimate.deliverySettings ?? {
                          emailMessage: "",
                          clientSummary: "",
                          reviewButtonLabel: "Review and Approve",
                          downloadButtonLabel: "Download PDF",
                          allowPdfDownload: true,
                          allowReject: true,
                          allowChanges: true,
                          requireApprovalCheckbox: true,
                          documentTitle: "ESTIMATE",
                          documentFooter: "",
                          terms: "",
                        }),
                        documentFooter: String(
                          documentTemplate.footerSettings.footerText ?? "",
                        ),
                      })
                    }
                  >
                    Use Saved Footer
                  </Button>
                </div>
              </section>
              <details className="approval-settings" open>
                <summary>Approval Settings</summary>
                <div>
                  {Object.entries({
                    allowApprove: "Allow customer to approve",
                    allowReject: "Allow customer to reject",
                    allowRequestChanges: "Allow customer to request changes",
                    requireRejectNote: "Require note when rejecting",
                    requireChangeRequestNote:
                      "Require note when requesting changes",
                    requireTypedName: "Require typed name when approving",
                    requireCheckbox: "Require approval checkbox",
                    allowPdfDownload: "Allow PDF download",
                    showFullDocumentBeforeApproval:
                      "Show full document before approval",
                    sendBusinessCopy:
                      "Send copy to business email — placeholder",
                  }).map(([key, label]) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={Boolean(
                          estimate.approvalSettings?.[
                            key as keyof typeof estimate.approvalSettings
                          ],
                        )}
                        onChange={(event) =>
                          setEstimateField("approvalSettings", {
                            ...estimate.approvalSettings!,
                            [key]: event.target.checked,
                          })
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </details>
            </section>
          )}

          {step === "Preview & Send" && (
            <section className="estimate-preview-step">
              <div className="estimate-preview-summary">
                <div className="between">
                  <div>
                    <h2>Builder Summary</h2>
                    <p>Review the internal draft before sending.</p>
                  </div>
                  <StatusBadge tone={statusTone(estimate.status)}>
                    {estimate.status}
                  </StatusBadge>
                </div>
                <dl>
                  <div>
                    <dt>Customer</dt>
                    <dd>{customer.name || "Not selected"}</dd>
                  </div>
                  <div>
                    <dt>Project</dt>
                    <dd>{estimate.projectName}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{money(estimate.total)}</dd>
                  </div>
                  <div>
                    <dt>Sections</dt>
                    <dd>{sections.length}</dd>
                  </div>
                  <div>
                    <dt>Items</dt>
                    <dd>{estimate.lineItems.length}</dd>
                  </div>
                  <div>
                    <dt>Internal fields</dt>
                    <dd>
                      {estimate.lineItems.some(
                        (item) => item.internalCost || item.internalNotes,
                      ) || estimate.internalNotes
                        ? "Present"
                        : "None"}
                    </dd>
                  </div>
                </dl>
              </div>
              <details className="document-template-settings">
                <summary>Official Document Template Settings</summary>
                <div className="document-template-settings__body">
                  <div className="field">
                    <label>Document template</label>
                    <select
                      className="select"
                      value={documentTemplate.templateId}
                      onChange={(event) => {
                        const selected = workspace.documentTemplates.find(
                          (template) =>
                            template.templateId === event.target.value,
                        );
                        if (selected)
                          setDocumentTemplate(structuredClone(selected));
                      }}
                    >
                      {workspace.documentTemplates
                        .filter(
                          (template) => template.documentType === "Estimate",
                        )
                        .map((template) => (
                          <option
                            key={template.templateId}
                            value={template.templateId}
                          >
                            {template.templateName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="document-style-presets">
                    <strong>Simple Style</strong>
                    <p>
                      Choose a clean preset first. Advanced controls stay
                      optional.
                    </p>
                    <div>
                      {workspace.documentStyles
                        .filter(
                          (style) =>
                            style.documentType === "estimate" &&
                            !style.archived,
                        )
                        .map((style) => (
                          <button
                            key={style.id}
                            className={
                              documentStyle.id === style.id
                                ? "document-style-preset document-style-preset--active"
                                : "document-style-preset"
                            }
                            onClick={() => {
                              setDocumentStyle(structuredClone(style));
                              setDocumentTemplate((current) => ({
                                ...current,
                                documentStyleId: style.id,
                              }));
                            }}
                          >
                            <span
                              style={{
                                background: style.headerStyle.backgroundColor,
                              }}
                            />
                            <strong>{style.templateName}</strong>
                            <small>{style.basePreset}</small>
                          </button>
                        ))}
                    </div>
                  </div>
                  <details className="advanced-style-editor">
                    <summary>Advanced Style</summary>
                    <div className="document-style-controls">
                      <div className="field">
                        <label>Page font</label>
                        <select
                          className="select"
                          value={documentStyle.pageStyle.fontFamily}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              pageStyle: {
                                ...current.pageStyle,
                                fontFamily: event.target.value,
                              },
                            }))
                          }
                        >
                          {[
                            "System Default",
                            "Arial",
                            "Helvetica",
                            "Georgia",
                            "Times New Roman",
                            "Verdana",
                            "Courier New",
                          ].map((font) => (
                            <option key={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label>Page text color</label>
                        <input
                          className="input"
                          type="color"
                          value={documentStyle.pageStyle.textColor}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              pageStyle: {
                                ...current.pageStyle,
                                textColor: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Page background</label>
                        <input
                          className="input"
                          type="color"
                          value={documentStyle.pageStyle.backgroundColor}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              pageStyle: {
                                ...current.pageStyle,
                                backgroundColor: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Header background</label>
                        <input
                          className="input"
                          type="color"
                          value={documentStyle.headerStyle.backgroundColor}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              headerStyle: {
                                ...current.headerStyle,
                                backgroundColor: event.target.value,
                                showBackground: true,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Table header color</label>
                        <input
                          className="input"
                          type="color"
                          value={documentStyle.tableHeaderStyle.backgroundColor}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              tableHeaderStyle: {
                                ...current.tableHeaderStyle,
                                backgroundColor: event.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Border thickness</label>
                        <input
                          className="input"
                          type="number"
                          min="0"
                          max="5"
                          value={documentStyle.tableStyle.borderWidth}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              tableStyle: {
                                ...current.tableStyle,
                                borderWidth: Number(event.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Page padding</label>
                        <input
                          className="input"
                          type="number"
                          min="12"
                          max="60"
                          value={documentStyle.pageStyle.padding}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              pageStyle: {
                                ...current.pageStyle,
                                padding: Number(event.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Logo/header alignment</label>
                        <select
                          className="select"
                          value={documentStyle.headerStyle.alignment}
                          onChange={(event) =>
                            setDocumentStyle((current) => ({
                              ...current,
                              headerStyle: {
                                ...current.headerStyle,
                                alignment: event.target.value as
                                  "left" | "center" | "right",
                              },
                            }))
                          }
                        >
                          <option>left</option>
                          <option>center</option>
                          <option>right</option>
                        </select>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => saveDocumentStyle(documentStyle)}
                    >
                      Save Document Style
                    </Button>
                  </details>
                  <div className="estimate-field-grid">
                    <label>
                      <input
                        type="checkbox"
                        checked={documentTemplate.notesSettings.showNotes}
                        onChange={(event) =>
                          setDocumentTemplate((current) => ({
                            ...current,
                            notesSettings: {
                              ...current.notesSettings,
                              showNotes: event.target.checked,
                            },
                          }))
                        }
                      />{" "}
                      Show document notes
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={documentTemplate.termsSettings.showTerms}
                        onChange={(event) =>
                          setDocumentTemplate((current) => ({
                            ...current,
                            termsSettings: {
                              ...current.termsSettings,
                              showTerms: event.target.checked,
                            },
                          }))
                        }
                      />{" "}
                      Show terms
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={documentTemplate.customerInfoSettings.address}
                        onChange={(event) =>
                          setDocumentTemplate((current) => ({
                            ...current,
                            customerInfoSettings: {
                              ...current.customerInfoSettings,
                              address: event.target.checked,
                            },
                          }))
                        }
                      />{" "}
                      Show customer address
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          documentTemplate.projectInfoSettings.jobLocation
                        }
                        onChange={(event) =>
                          setDocumentTemplate((current) => ({
                            ...current,
                            projectInfoSettings: {
                              ...current.projectInfoSettings,
                              jobLocation: event.target.checked,
                            },
                          }))
                        }
                      />{" "}
                      Show job location
                    </label>
                  </div>
                  <div className="document-column-list">
                    <div className="between">
                      <strong>Manage Columns</strong>
                      <Button
                        variant="outline"
                        onClick={addCustomDocumentColumn}
                      >
                        Add Custom Column
                      </Button>
                    </div>
                    {[...documentTemplate.columnSettings]
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((column, index, columns) => (
                        <div key={column.key}>
                          <label>
                            <input
                              type="checkbox"
                              checked={column.visible}
                              disabled={["internalCost", "profit"].includes(
                                column.key,
                              )}
                              onChange={(event) =>
                                updateDocumentColumn(column.key, {
                                  visible: event.target.checked,
                                })
                              }
                            />
                            <input
                              className="input"
                              value={column.label}
                              onChange={(event) =>
                                updateDocumentColumn(column.key, {
                                  label: event.target.value,
                                })
                              }
                              aria-label={`${column.label} label`}
                            />
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={
                                column.visibleToCustomer ?? column.visible
                              }
                              disabled={column.internalOnly}
                              onChange={(event) =>
                                updateDocumentColumn(column.key, {
                                  visibleToCustomer: event.target.checked,
                                })
                              }
                            />{" "}
                            Customer
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={Boolean(column.internalOnly)}
                              onChange={(event) =>
                                updateDocumentColumn(column.key, {
                                  internalOnly: event.target.checked,
                                  visible: event.target.checked
                                    ? false
                                    : column.visible,
                                  visibleToCustomer: event.target.checked
                                    ? false
                                    : column.visibleToCustomer,
                                })
                              }
                            />{" "}
                            Internal only
                          </label>
                          <select
                            className="select"
                            value={column.columnType ?? "text"}
                            onChange={(event) =>
                              updateDocumentColumn(column.key, {
                                columnType: event.target
                                  .value as typeof column.columnType,
                              })
                            }
                          >
                            <option>text</option>
                            <option>number</option>
                            <option>money</option>
                            <option>percent</option>
                            <option>date</option>
                            <option>checkbox</option>
                            <option>select</option>
                            <option>formula</option>
                          </select>
                          <button
                            disabled={index === 0}
                            onClick={() => moveDocumentColumn(column.key, -1)}
                            aria-label={`Move ${column.label} up`}
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            disabled={index === columns.length - 1}
                            onClick={() => moveDocumentColumn(column.key, 1)}
                            aria-label={`Move ${column.label} down`}
                          >
                            <ArrowDown size={15} />
                          </button>
                          {column.key.startsWith("custom-") && (
                            <button
                              onClick={() =>
                                deleteCustomDocumentColumn(column.key)
                              }
                              aria-label={`Delete ${column.label}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                  <div className="alert alert--info">
                    <LockKeyhole size={18} />
                    <span>
                      Internal cost and profit remain hidden from the customer
                      view and official PDF.
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => saveDocumentTemplate(documentTemplate)}
                  >
                    Save Document Template
                  </Button>
                  <Button
                    variant="neutral"
                    onClick={() =>
                      openDocumentStyleEditor(documentTemplate.templateId)
                    }
                  >
                    Open Full Style Editor
                  </Button>
                </div>
              </details>
              <div className="estimate-preview-options">
                <article>
                  <div className="icon-box">
                    <Eye size={22} />
                  </div>
                  <h2>Customer Approval View Preview</h2>
                  <p>This is what your customer sees first.</p>
                  <Button
                    variant="primary"
                    wide
                    onClick={() => setPreview("customer")}
                  >
                    Preview Customer View
                  </Button>
                </article>
                <article>
                  <div className="icon-box">
                    <FileText size={22} />
                  </div>
                  <h2>Official Document Preview</h2>
                  <p>This is the PDF/document your customer can download.</p>
                  <Button
                    variant="outline"
                    wide
                    onClick={() => setPreview("document")}
                  >
                    Preview Official Document
                  </Button>
                </article>
              </div>
              <section className="estimate-send-options">
                <h2>Send options</h2>
                <div>
                  <Button
                    variant="neutral"
                    icon={<Save size={18} />}
                    onClick={() => save("Draft")}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Send size={18} />}
                    onClick={() => save("Sent")}
                  >
                    Send for Approval
                  </Button>
                  <Button
                    variant="outline"
                    icon={<Download size={18} />}
                    onClick={() =>
                      downloadEstimatePdf(
                        estimate,
                        currentBusiness,
                        {
                          id: customer.customerId,
                          businessId: currentBusinessId,
                          name: customer.name,
                          businessName: customer.businessName,
                          phone: customer.phone,
                          email: customer.email,
                          address: customer.billingAddress,
                          billingAddress: customer.billingAddress,
                          jobSiteAddress: customer.jobSiteAddress,
                          status: "Customer",
                          tags: [],
                          lastActivity: "Now",
                          notes: [],
                        },
                        documentTemplate,
                        documentStyle,
                      )
                    }
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="neutral"
                    icon={<ClipboardCopy size={18} />}
                    onClick={() =>
                      setMessage(
                        "Mock approval link copied. No external message was sent.",
                      )
                    }
                  >
                    Copy Approval Link
                  </Button>
                  <Button
                    variant="neutral"
                    icon={<FilePlus2 size={18} />}
                    onClick={() => setShowTemplate(true)}
                  >
                    Save as Template
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentScreen("money")}
                  >
                    Back to Money
                  </Button>
                </div>
                {workspace.integrations.some(
                  (item) =>
                    item.provider === "QuickBooks" &&
                    item.status === "Mock Connected",
                ) && (
                  <div className="alert alert--info">
                    <ShieldCheck size={20} />
                    <div>
                      <strong>QuickBooks placeholder</strong>
                      <div className="small">
                        Sync after accepted · Do not send drafts by default.
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </section>
          )}

          <div className="estimate-step-footer">
            <Button
              variant="neutral"
              disabled={stepIndex === 0}
              onClick={goBack}
            >
              <ArrowLeft size={17} />
              Back
            </Button>
            {stepIndex < steps.length - 1 ? (
              <Button variant="primary" onClick={goNext}>
                Continue
                <ArrowRight size={17} />
              </Button>
            ) : (
              <Button variant="primary" onClick={() => save("Sent")}>
                <Send size={17} />
                Send for Approval
              </Button>
            )}
          </div>
        </div>
        <aside className="estimate-total-summary">
          <span>Estimate total</span>
          <strong>{money(estimate.total)}</strong>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{money(estimate.subtotal ?? 0)}</dd>
            </div>
            <div>
              <dt>Discount</dt>
              <dd>-{money(estimate.discount ?? 0)}</dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>{money(estimate.tax ?? 0)}</dd>
            </div>
            <div>
              <dt>Internal cost</dt>
              <dd>{money(internalCost)}</dd>
            </div>
            <div>
              <dt>Profit</dt>
              <dd>{money(estimatedProfit)}</dd>
            </div>
          </dl>
          <Button
            variant="primary"
            wide
            onClick={() => setStep("Preview & Send")}
          >
            Preview &amp; Send
          </Button>
          <small>
            {sections.length} sections · {estimate.lineItems.length} items
          </small>
        </aside>
      </div>
      {step === "Items" && (
        <div className="estimate-sticky-total">
          <div>
            <span>Total</span>
            <strong>{money(estimate.total)}</strong>
          </div>
          <Button variant="neutral" onClick={() => save("Draft")}>
            Save Draft
          </Button>
          <Button variant="primary" onClick={() => setStep("Preview & Send")}>
            Preview
          </Button>
        </div>
      )}
      {preview === "customer" && (
        <CustomerApprovalPreview
          estimate={estimate}
          customer={customer}
          businessName={currentBusiness.name}
          onClose={() => setPreview(null)}
          onDocument={() => setPreview("document")}
        />
      )}
      {preview === "document" && (
        <OfficialEstimatePreview
          estimate={estimate}
          customer={customer}
          businessName={currentBusiness.name}
          phone={currentBusiness.phone}
          email={currentBusiness.email}
          template={documentTemplate}
          documentStyle={documentStyle}
          onClose={() => setPreview(null)}
        />
      )}
      {itemBankSectionId && (
        <Modal
          title="Add from Item & Service Bank"
          onClose={() => setItemBankSectionId(undefined)}
        >
          <p>
            Choose a saved item for {currentBusiness.name}. A snapshot will be
            copied into this estimate.
          </p>
          <div className="item-bank-picker">
            {workspace.itemBank.map((item) => (
              <button key={item.id} onClick={() => addBankItem(item)}>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.category} · {item.unit}
                  </small>
                </span>
                <b>{money(item.defaultRate)}</b>
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            onClick={() => setItemBankSectionId(undefined)}
          >
            Cancel
          </Button>
        </Modal>
      )}
      {showTemplate && (
        <Modal
          title="Save as Estimate Template"
          onClose={() => setShowTemplate(false)}
        >
          <p>
            We selected the reusable parts for you. Customer and
            project-specific details are left out by default.
          </p>
          <div className="field">
            <label>Template name</label>
            <input
              className="input"
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
            />
          </div>
          <fieldset className="help-question">
            <legend>What should be saved?</legend>
            <div className="template-parts-list">
              {reusableTemplateParts.map((part) => (
                <label key={part}>
                  <input
                    type="checkbox"
                    checked={templateParts.includes(part)}
                    onChange={(event) =>
                      setTemplateParts((current) =>
                        event.target.checked
                          ? [...current, part]
                          : current.filter((item) => item !== part),
                      )
                    }
                  />
                  {part}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="alert alert--info">
            <LockKeyhole size={18} />
            <span>
              Customer name, contact details, project/job information, document
              number, dates, private job notes, approval link, history, and
              one-time files are excluded.
            </span>
          </div>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                saveEstimateAsTemplate(estimate, templateName);
                saveDocumentTemplate({
                  ...documentTemplate,
                  templateId: `${currentBusiness.id}-estimate-template-${Date.now()}`,
                  templateName,
                  documentType: "Estimate",
                  documentStyleId: templateParts.includes(
                    "Document style and branding",
                  )
                    ? documentStyle.id
                    : undefined,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  isDefault: false,
                  useCount: 0,
                });
                setShowTemplate(false);
              }}
            >
              Save Template
            </Button>
            <Button variant="ghost" onClick={() => setShowTemplate(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      {showLock && (
        <Modal
          title="This estimate was already accepted."
          onClose={() => setShowLock(false)}
        >
          <p>
            To protect both sides, the accepted version will stay locked. Choose
            how you want to handle the change.
          </p>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                createProtectedFollowUp("revision");
                setShowLock(false);
              }}
            >
              Create Revision
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                createProtectedFollowUp("change-order");
                setShowLock(false);
              }}
            >
              Create Change Order
            </Button>
            <Button
              variant="neutral"
              onClick={() => {
                createProtectedFollowUp("duplicate");
                setShowLock(false);
              }}
            >
              Duplicate as New
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowLock(false);
                setCurrentScreen("estimate-detail");
              }}
            >
              View Accepted Version
            </Button>
            <Button variant="ghost" onClick={() => setShowLock(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
