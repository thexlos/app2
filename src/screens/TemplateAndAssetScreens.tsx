import {
  Archive,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Palette,
  Pin,
  QrCode,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/common/Button";
import { DocumentStyleAdvancedControls } from "../components/document-style/DocumentStyleAdvancedControls";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";
import type { ColumnStyleBlock, DocumentStyleTemplate } from "../types/models";

export function TemplateLibraryScreen() {
  const { workspace, openTemplate, setCurrentScreen } = useAppState();
  const [filter, setFilter] = useState("All");
  const templates = workspace.documentTemplates.filter(
    (item) =>
      !item.archived && (filter === "All" || item.documentType === filter),
  );
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Template Library" backTo="my-business-kit" />
      <div className="section">
        <h1 className="page-title">Templates &amp; Document Styles</h1>
        <p className="page-subtitle">
          Estimate and invoice templates stay separate. Each can keep its own
          columns, visibility, terms, footer, and style.
        </p>
      </div>
      <div className="customer-filters section">
        {["All", "Estimate", "Invoice", "Progress Invoice", "Change Order"].map(
          (item) => (
            <button
              className={filter === item ? "active" : ""}
              key={item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>
      <div className="template-library-list section">
        {templates.map((template) => (
          <button
            className="card panel"
            key={template.templateId}
            onClick={() => openTemplate(template.templateId)}
          >
            <span className="icon-box">
              <FileText />
            </span>
            <span className="grow">
              <strong>{template.templateName}</strong>
              <small>
                {template.documentType} · {template.layoutStyle} · Used{" "}
                {template.useCount ?? 0} times
              </small>
              <small>
                Includes sections, {template.columnSettings.length} columns,
                visibility, terms, footer, and document style
              </small>
            </span>
            {template.isDefault && (
              <StatusBadge tone="success">Default</StatusBadge>
            )}
          </button>
        ))}
      </div>
      <Button
        className="section"
        variant="outline"
        wide
        icon={<Palette size={18} />}
        onClick={() => setCurrentScreen("document-style-editor")}
      >
        Manage Document Styles
      </Button>
    </section>
  );
}

export function TemplateDetailScreen() {
  const {
    workspace,
    selectedTemplateId,
    saveDocumentTemplate,
    openEstimateBuilder,
    openInvoiceBuilder,
    setCurrentScreen,
  } = useAppState();
  const template = workspace.documentTemplates.find(
    (item) => item.templateId === selectedTemplateId,
  );
  const [preview, setPreview] = useState<"builder" | "customer" | "document">();
  const [rename, setRename] = useState(false);
  const [name, setName] = useState(template?.templateName ?? "");
  if (!template)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Template" backTo="template-library" />
        <p className="section">Template not found in this business.</p>
      </section>
    );
  const saveCopy = () =>
    saveDocumentTemplate({
      ...template,
      templateId: `${template.templateId}-copy-${Date.now()}`,
      templateName: `${template.templateName} Copy`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  const use = () =>
    template.documentType === "Invoice"
      ? openInvoiceBuilder()
      : openEstimateBuilder();
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Template details" backTo="template-library" />
      <div className="template-detail-hero section">
        <span className="icon-box">
          <FileText />
        </span>
        <div>
          <h1>{template.templateName}</h1>
          <p>
            {template.documentType} · {template.layoutStyle}
          </p>
        </div>
        {template.isDefault && (
          <StatusBadge tone="success">Default</StatusBadge>
        )}
      </div>
      <dl className="operation-summary section">
        <div>
          <dt>Last used</dt>
          <dd>{template.lastUsedAt ?? "Not yet"}</dd>
        </div>
        <div>
          <dt>Use count</dt>
          <dd>{template.useCount ?? 0}</dd>
        </div>
        <div>
          <dt>Visible columns</dt>
          <dd>
            {template.columnSettings.filter((item) => item.visible).length}
          </dd>
        </div>
        <div>
          <dt>Document style</dt>
          <dd>
            {workspace.documentStyles.find(
              (style) => style.id === template.documentStyleId,
            )?.templateName ?? "Business default"}
          </dd>
        </div>
      </dl>
      <section className="card panel section stack">
        <h2>What this template includes</h2>
        {[
          "Sections and item ordering",
          "Custom columns and visibility",
          "Notes, terms, and footer",
          "Customer view layout",
          "Official PDF layout",
          "Branding and document style",
          template.documentType === "Estimate"
            ? "Approval settings"
            : "Payment settings",
        ].map((item) => (
          <div className="row" key={item}>
            <Star size={16} color="var(--color-primary)" />
            <span>{item}</span>
          </div>
        ))}
      </section>
      <div className="contract-actions section">
        <Button variant="primary" onClick={use}>
          Use Template
        </Button>
        <Button variant="outline" icon={<Edit3 size={17} />} onClick={use}>
          Edit Template
        </Button>
        <Button
          variant="outline"
          icon={<Eye size={17} />}
          onClick={() => setPreview("builder")}
        >
          Preview Template
        </Button>
        <Button
          variant="outline"
          icon={<Palette size={17} />}
          onClick={() => setCurrentScreen("document-style-editor")}
        >
          Edit Style
        </Button>
        <Button
          variant="neutral"
          icon={<Edit3 size={17} />}
          onClick={() => setRename(true)}
        >
          Rename
        </Button>
        <Button variant="neutral" icon={<Copy size={17} />} onClick={saveCopy}>
          Duplicate
        </Button>
        <Button
          variant="neutral"
          onClick={() => saveDocumentTemplate({ ...template, isDefault: true })}
        >
          Set as Default
        </Button>
        <Button
          variant="ghost"
          icon={<Archive size={17} />}
          onClick={() => {
            saveDocumentTemplate({ ...template, archived: true });
            setCurrentScreen("template-library");
          }}
        >
          Archive
        </Button>
      </div>
      {preview && (
        <Modal title="Template Preview" onClose={() => setPreview(undefined)}>
          <div className="customer-filters">
            <button
              className={preview === "builder" ? "active" : ""}
              onClick={() => setPreview("builder")}
            >
              Builder
            </button>
            <button
              className={preview === "customer" ? "active" : ""}
              onClick={() => setPreview("customer")}
            >
              Customer View
            </button>
            <button
              className={preview === "document" ? "active" : ""}
              onClick={() => setPreview("document")}
            >
              Official Document
            </button>
          </div>
          <div className="template-preview">
            <strong>
              {preview === "builder"
                ? "Internal Builder Preview"
                : preview === "customer"
                  ? "Clean Customer Preview"
                  : "Official Downloadable Document"}
            </strong>
            <h2>{template.templateName}</h2>
            <p>
              {preview === "builder"
                ? "Internal costs, visibility controls, and admin fields may appear here."
                : "Only fields allowed by this template appear here."}
            </p>
            <div className="approval-total">
              <span>Sample total</span>
              <strong>$1,250.00</strong>
            </div>
          </div>
        </Modal>
      )}
      {rename && (
        <Modal title="Rename Template" onClose={() => setRename(false)}>
          <div className="field">
            <label>Template name</label>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                saveDocumentTemplate({ ...template, templateName: name });
                setRename(false);
              }}
            >
              Save Name
            </Button>
            <Button variant="ghost" onClick={() => setRename(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}

const presets: DocumentStyleTemplate["basePreset"][] = [
  "Clean",
  "Bold",
  "Modern",
  "Minimal",
  "Contractor",
  "Service Business",
  "Luxury",
  "Simple Black & White",
  "Color Header",
  "Classic Invoice",
];
export function DocumentStyleEditorScreen() {
  const {
    workspace,
    selectedTemplateId,
    currentBusiness,
    saveDocumentStyle,
    saveDocumentTemplate,
    setCurrentScreen,
  } = useAppState();
  const template =
    workspace.documentTemplates.find(
      (item) => item.templateId === selectedTemplateId,
    ) ?? workspace.documentTemplates[0];
  const source =
    workspace.documentStyles.find(
      (item) => item.id === template?.documentStyleId,
    ) ?? workspace.documentStyles[0];
  const editorColumns: ColumnStyleBlock[] | undefined =
    template?.columnSettings.map((column) => {
      const saved = source.columnStyles.find(
        (item) => item.columnKey === column.key,
      );
      const internalOnly = Boolean(
        column.internalOnly || ["internalCost", "profit"].includes(column.key),
      );
      return (
        saved ?? {
          columnKey: column.key,
          columnLabel: column.label,
          width: column.key === "description" ? "minmax(150px, 1fr)" : "88px",
          headerBackgroundColor:
            source.tableStyle.headerRowBackgroundColor ?? "#eef2ff",
          headerTextColor: source.tableStyle.headerRowTextColor ?? "#1e3a8a",
          bodyTextColor: source.tableStyle.bodyRowTextColor ?? "#111827",
          fontFamily: source.tableStyle.fontFamily ?? "Helvetica",
          fontSize: source.tableStyle.fontSize ?? 9,
          fontWeight: column.key === "total" ? "bold" : "normal",
          alignment: ["quantity", "rate", "total"].includes(column.key)
            ? "right"
            : "left",
          borderColor: source.tableStyle.columnLineColor ?? "#e2e8f0",
          visibleInBuilder: true,
          visibleToCustomer: internalOnly
            ? false
            : column.visibleToCustomer !== false,
          visibleOnPdf: internalOnly ? false : column.visible,
          internalOnly,
        }
      );
    });
  const [style, setStyle] = useState<DocumentStyleTemplate>({
    ...source,
    columnStyles: editorColumns ?? source.columnStyles,
    id: `${source.id}-edited-${Date.now()}`,
    templateName: `${source.templateName} Custom`,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const applyPreset = (preset: DocumentStyleTemplate["basePreset"]) => {
    const primary = currentBusiness.brandKit.primaryColor;
    const darkHeader = ["Bold", "Contractor"].includes(preset);
    const colorHeader = preset === "Color Header";
    const monochrome = preset === "Simple Black & White";
    const soft = preset === "Minimal" ? "#ffffff" : "#f8fafc";
    const headerBackground = colorHeader
      ? primary
      : darkHeader
        ? "#111827"
        : "#ffffff";
    const headerText = colorHeader || darkHeader ? "#ffffff" : "#111827";
    const tableBackground = monochrome
      ? "#111827"
      : preset === "Modern"
        ? primary
        : "#eef2ff";
    const tableText = monochrome || preset === "Modern" ? "#ffffff" : "#1e3a8a";
    setStyle((current) => ({
      ...current,
      basePreset: preset,
      headerStyle: {
        ...current.headerStyle,
        backgroundColor: headerBackground,
        textColor: headerText,
        businessNameColor: headerText,
        showBackground: headerBackground !== "#ffffff",
      },
      pageStyle: {
        ...current.pageStyle,
        fontFamily:
          preset === "Luxury"
            ? "Georgia"
            : preset === "Classic Invoice"
              ? "Times New Roman"
              : "Arial",
        backgroundColor: "#ffffff",
      },
      tableStyle: {
        ...current.tableStyle,
        headerRowBackgroundColor: tableBackground,
        headerRowTextColor: tableText,
        bodyRowBackgroundColor: "#ffffff",
        bodyRowTextColor: "#111827",
        alternatingRowBackgroundColor: soft,
      },
      tableHeaderStyle: {
        ...current.tableHeaderStyle,
        backgroundColor: tableBackground,
        textColor: tableText,
      },
      rowStyle: {
        ...current.rowStyle,
        standardRowBackgroundColor: "#ffffff",
        alternatingRowBackgroundColor: soft,
      },
      sectionRowStyle: {
        ...current.sectionRowStyle,
        backgroundColor: tableBackground,
        textColor: tableText,
      },
      totalsBoxStyle: {
        ...current.totalsBoxStyle,
        backgroundColor: monochrome ? "#f3f4f6" : "#eef2ff",
        borderColor: monochrome ? "#111827" : primary,
        amountColor: monochrome ? "#111827" : primary,
      },
      columnStyles: current.columnStyles.map((column) => ({
        ...column,
        headerBackgroundColor: tableBackground,
        headerTextColor: tableText,
      })),
    }));
  };
  const save = () => {
    saveDocumentStyle(style);
    if (template)
      saveDocumentTemplate({
        ...template,
        documentStyleId: style.id,
        columnSettings: template.columnSettings.map((column) => {
          const columnStyle = style.columnStyles.find(
            (item) => item.columnKey === column.key,
          );
          return columnStyle
            ? {
                ...column,
                label: columnStyle.columnLabel,
                visible: columnStyle.internalOnly
                  ? false
                  : columnStyle.visibleOnPdf,
                visibleToCustomer: columnStyle.internalOnly
                  ? false
                  : columnStyle.visibleToCustomer,
                internalOnly: columnStyle.internalOnly,
              }
            : column;
        }),
      });
    setCurrentScreen(
      selectedTemplateId ? "template-detail" : "template-library",
    );
  };
  const previewColumns = style.columnStyles
    .filter((column) => column.visibleOnPdf && !column.internalOnly)
    .slice(0, 3);
  const previewGrid = previewColumns
    .map((column) => column.width ?? "1fr")
    .join(" ");
  const weight = (value?: "normal" | "medium" | "bold") =>
    value === "medium" ? 500 : value;
  return (
    <section className="screen screen--detail">
      <DetailHeader
        title="Document Style Editor"
        backTo={selectedTemplateId ? "template-detail" : "template-library"}
      />
      <div className="section">
        <h1 className="page-title">Document Style</h1>
        <p className="page-subtitle">
          Simple presets first. Open section controls only when you need more
          detail.
        </p>
      </div>
      <section className="section">
        <h2 className="section-heading">Simple Style</h2>
        <div className="style-preset-grid">
          {presets.map((preset) => (
            <button
              className={style.basePreset === preset ? "active" : ""}
              key={preset}
              onClick={() => applyPreset(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </section>
      <section className="card panel section stack">
        <details>
          <summary>Advanced Style</summary>
          <DocumentStyleAdvancedControls style={style} onChange={setStyle} />
        </details>
      </section>
      <section
        className="document-style-live section"
        style={{
          width: style.pageStyle.documentWidth,
          maxWidth: "100%",
          marginInline: "auto",
          fontFamily: style.pageStyle.fontFamily,
          fontSize: style.pageStyle.fontSize,
          color: style.pageStyle.textColor,
          background: style.pageStyle.backgroundColor,
          padding: style.pageStyle.padding,
          borderColor: style.pageStyle.borderColor,
          borderWidth: style.pageStyle.borderWidth,
          borderStyle: "solid",
        }}
      >
        <header
          style={{
            background: style.headerStyle.backgroundColor,
            color: style.headerStyle.textColor,
            padding: style.headerStyle.padding,
            borderColor: style.headerStyle.borderColor,
            borderWidth: style.headerStyle.borderWidth,
            borderStyle: "solid",
            textAlign: style.headerStyle.alignment,
            flexDirection:
              style.headerStyle.logoPosition === "right"
                ? "row-reverse"
                : style.headerStyle.logoPosition === "center"
                  ? "column"
                  : "row",
          }}
        >
          <span
            className="document-style-live__logo"
            style={{
              width: Math.min(style.headerStyle.logoSize ?? 64, 96),
              height: Math.min(style.headerStyle.logoSize ?? 64, 96),
            }}
          >
            {currentBusiness.initials}
          </span>
          <div>
            <strong
              style={{
                display: "block",
                color: style.headerStyle.businessNameColor,
                fontSize: style.headerStyle.businessNameFontSize,
              }}
            >
              {currentBusiness.name}
            </strong>
            <small
              style={{
                display: "block",
                color: style.businessInfoStyle.bodyTextColor,
                background: style.businessInfoStyle.backgroundColor,
                borderColor: style.businessInfoStyle.borderColor,
                borderWidth: style.businessInfoStyle.borderWidth,
                borderStyle: "solid",
                padding: style.businessInfoStyle.padding,
                fontSize: style.businessInfoStyle.bodyFontSize,
              }}
            >
              Business contact information
            </small>
          </div>
          <div
            style={{
              color: style.documentMetaStyle.bodyTextColor,
              background: style.documentMetaStyle.backgroundColor,
              borderColor: style.documentMetaStyle.borderColor,
              borderWidth: style.documentMetaStyle.borderWidth,
              borderStyle: "solid",
              padding: style.documentMetaStyle.padding,
              textAlign: style.documentMetaStyle.alignment,
            }}
          >
            <span
              style={{
                display: "block",
                color: style.headerStyle.documentTitleColor,
                fontSize: style.headerStyle.documentTitleFontSize,
              }}
            >
              ESTIMATE / INVOICE
            </span>
            <small>#1001 · July 7, 2026</small>
          </div>
        </header>
        <div className="document-style-live__info">
          <div
            className="document-style-live__box"
            style={{
              color: style.customerInfoStyle.bodyTextColor,
              background: style.customerInfoStyle.backgroundColor,
              borderColor: style.customerInfoStyle.borderColor,
              borderWidth: style.customerInfoStyle.borderWidth,
              padding: style.customerInfoStyle.padding,
              textAlign: style.customerInfoStyle.alignment,
            }}
          >
            <strong
              style={{
                display: "block",
                color: style.customerInfoStyle.titleTextColor,
                fontSize: style.customerInfoStyle.titleFontSize,
              }}
            >
              CUSTOMER
            </strong>
            <span style={{ fontSize: style.customerInfoStyle.bodyFontSize }}>
              Sample Customer
            </span>
          </div>
          <div
            className="document-style-live__box"
            style={{
              color: style.projectInfoStyle.bodyTextColor,
              background: style.projectInfoStyle.backgroundColor,
              borderColor: style.projectInfoStyle.borderColor,
              borderWidth: style.projectInfoStyle.borderWidth,
              padding: style.projectInfoStyle.padding,
              textAlign: style.projectInfoStyle.alignment,
            }}
          >
            <strong
              style={{
                display: "block",
                color: style.projectInfoStyle.titleTextColor,
                fontSize: style.projectInfoStyle.titleFontSize,
              }}
            >
              PROJECT
            </strong>
            <span style={{ fontSize: style.projectInfoStyle.bodyFontSize }}>
              Sample Service Project
            </span>
          </div>
        </div>
        <div
          className="document-style-live__table"
          style={{
            borderColor: style.tableStyle.tableBorderColor,
            borderWidth: style.tableStyle.tableBorderWidth,
            fontFamily: style.tableStyle.fontFamily,
            fontSize: style.tableStyle.fontSize,
            gap: style.tableStyle.spacing,
          }}
        >
          <div
            className="document-style-live__table-row"
            style={{ gridTemplateColumns: previewGrid }}
          >
            {previewColumns.map((column) => (
              <span
                key={column.columnKey}
                style={{
                  color: column.headerTextColor,
                  background: column.headerBackgroundColor,
                  borderColor: column.borderColor,
                  textAlign: column.alignment,
                  fontFamily: column.fontFamily,
                  fontSize: column.fontSize,
                  fontWeight: weight(column.fontWeight),
                }}
              >
                {column.columnLabel}
              </span>
            ))}
          </div>
          {["Standard service", "Additional service"].map((label, index) => (
            <div
              className="document-style-live__table-row"
              key={label}
              style={{
                gridTemplateColumns: previewGrid,
                color: style.rowStyle.rowTextColor,
                background:
                  index % 2 && style.rowStyle.useAlternatingRows
                    ? style.rowStyle.alternatingRowBackgroundColor
                    : style.rowStyle.standardRowBackgroundColor,
                borderColor: style.rowStyle.rowLineColor,
                paddingBlock: style.rowStyle.rowSpacing,
              }}
            >
              {previewColumns.map((column, columnIndex) => (
                <span
                  key={column.columnKey}
                  style={{
                    color: column.bodyTextColor,
                    borderColor: column.borderColor,
                    textAlign: column.alignment,
                    fontFamily: column.fontFamily,
                    fontSize: column.fontSize,
                    fontWeight: weight(column.fontWeight),
                    padding: style.rowStyle.rowPadding,
                  }}
                >
                  {columnIndex === 0
                    ? label
                    : column.columnKey === "quantity"
                      ? "1"
                      : "$625.00"}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div
          className="document-style-live__totals"
          style={{
            color: style.totalsBoxStyle.labelColor,
            background: style.totalsBoxStyle.backgroundColor,
            borderColor: style.totalsBoxStyle.borderColor,
            borderWidth: style.totalsBoxStyle.borderWidth,
            padding: style.totalsBoxStyle.padding,
            textAlign: style.totalsBoxStyle.alignment,
          }}
        >
          <span>Subtotal</span>
          <span style={{ color: style.totalsBoxStyle.secondaryTextColor }}>
            $1,250.00
          </span>
          <strong>Total</strong>
          <strong
            style={{
              color: style.totalsBoxStyle.amountColor,
              fontSize: style.totalsBoxStyle.finalTotalFontSize,
              fontWeight: weight(style.totalsBoxStyle.finalTotalFontWeight),
            }}
          >
            $1,250.00
          </strong>
        </div>
        <div className="document-style-live__notes-row">
          <div
            className="document-style-live__box"
            style={{
              color: style.notesStyle.bodyTextColor,
              background: style.notesStyle.backgroundColor,
              borderColor: style.notesStyle.borderColor,
              borderWidth: style.notesStyle.borderWidth,
              padding: style.notesStyle.padding,
            }}
          >
            <strong
              style={{
                display: "block",
                color: style.notesStyle.headingColor,
                fontSize: style.notesStyle.headingFontSize,
              }}
            >
              NOTES
            </strong>
            <span style={{ fontSize: style.notesStyle.bodyFontSize }}>
              1. Sample customer-facing note.
            </span>
          </div>
          <div
            className="document-style-live__box"
            style={{
              color: style.termsStyle.bodyTextColor,
              background: style.termsStyle.backgroundColor,
              borderColor: style.termsStyle.borderColor,
              borderWidth: style.termsStyle.borderWidth,
              padding: style.termsStyle.padding,
            }}
          >
            <strong
              style={{
                display: "block",
                color: style.termsStyle.headingColor,
                fontSize: style.termsStyle.headingFontSize,
              }}
            >
              TERMS
            </strong>
            <span style={{ fontSize: style.termsStyle.bodyFontSize }}>
              Sample payment and approval terms.
            </span>
          </div>
        </div>
        <div className="document-style-live__qr-row">
          <div
            className="document-style-live__box"
            style={{
              color: style.qrBlockStyle.labelColor,
              background: style.qrBlockStyle.backgroundColor,
              borderColor: style.qrBlockStyle.borderColor,
              borderWidth: style.qrBlockStyle.borderWidth,
              padding: style.qrBlockStyle.padding,
              textAlign: style.qrBlockStyle.alignment,
            }}
          >
            <QrCode size={Math.min(style.qrBlockStyle.qrSize ?? 72, 92)} />
            <span style={{ fontSize: style.qrBlockStyle.labelFontSize }}>
              Scan for details
            </span>
          </div>
          <div
            className="document-style-live__box"
            style={{
              color: style.signatureStyle.labelColor,
              background: style.signatureStyle.backgroundColor,
              borderColor: style.signatureStyle.borderColor,
              borderWidth: style.signatureStyle.borderWidth,
              padding: style.signatureStyle.padding,
              fontSize: style.signatureStyle.signatureFontSize,
            }}
          >
            <div
              className="document-style-live__signature-line"
              style={{ borderColor: style.signatureStyle.lineColor }}
            />
            Customer signature
          </div>
        </div>
        <footer
          style={{
            color: style.footerStyle.textColor,
            background: style.footerStyle.backgroundColor,
            borderColor: style.footerStyle.borderColor,
            borderWidth: style.footerStyle.borderWidth,
            padding: style.footerStyle.padding,
            textAlign: style.footerStyle.alignment,
            fontFamily: style.footerStyle.fontFamily,
            fontSize: style.footerStyle.fontSize,
          }}
        >
          Thank you for your business.
        </footer>
      </section>
      <Button className="section" variant="primary" wide onClick={save}>
        Save Document Style
      </Button>
    </section>
  );
}

export function AssetDetailScreen() {
  const {
    workspace,
    selectedAssetId,
    currentBusiness,
    toggleAssetPin,
    archiveBusinessAsset,
    openCreateTask,
    openHelpRequest,
    setCurrentScreen,
  } = useAppState();
  const [feedback, setFeedback] = useState<string>();
  const asset = workspace.businessAssets.find(
    (item) => item.id === selectedAssetId,
  );
  const qr = asset?.qrCodeId
    ? workspace.qrCodes.find((item) => item.id === asset.qrCodeId)
    : undefined;
  if (!asset)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Business asset" backTo="my-business-kit" />
        <p className="section">Asset not found.</p>
      </section>
    );
  const isLogo = asset.assetType.includes("logo");
  const isQr = asset.assetType === "qr_code";
  const isCard = asset.assetType === "business_card";
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Business asset" backTo="my-business-kit" />
      <div className="asset-detail-hero section">
        <span className="asset-large-preview">
          {isQr ? (
            <QrCode size={54} />
          ) : isLogo ? (
            currentBusiness.initials
          ) : (
            <FileText size={48} />
          )}
        </span>
        <div>
          <h1>{asset.title}</h1>
          <p>
            {asset.assetType.replaceAll("_", " ")} · {asset.status}
          </p>
        </div>
      </div>
      <dl className="operation-summary section">
        <div>
          <dt>Last used</dt>
          <dd>{asset.lastUsedAt ?? "Not yet"}</dd>
        </div>
        <div>
          <dt>Files</dt>
          <dd>{asset.fileIds.length}</dd>
        </div>
        <div>
          <dt>Destination</dt>
          <dd>{qr?.url ?? asset.url ?? "Saved file"}</dd>
        </div>
        <div>
          <dt>Pinned</dt>
          <dd>{asset.pinned ? "Yes" : "No"}</dd>
        </div>
      </dl>
      {feedback && <div className="alert alert--info section">{feedback}</div>}
      <div className="contract-actions section">
        <Button
          variant="primary"
          icon={<Pin size={17} />}
          onClick={() => toggleAssetPin(asset.id)}
        >
          {asset.pinned ? "Unpin" : "Pin to My Business Kit"}
        </Button>
        <Button
          variant="outline"
          icon={<Download size={17} />}
          onClick={() =>
            setFeedback(
              "Mock download prepared. A live file export will be connected when storage is configured.",
            )
          }
        >
          Download
        </Button>
        {isLogo && (
          <>
            <Button
              variant="neutral"
              onClick={() => openCreateTask("Make a Flyer")}
            >
              Use in Flyer
            </Button>
            <Button
              variant="neutral"
              onClick={() => openCreateTask("Business Cards")}
            >
              Use in Business Card
            </Button>
            <Button
              variant="ghost"
              onClick={() => openHelpRequest("Logo cleanup")}
            >
              Request Cleanup
            </Button>
          </>
        )}
        {isQr && (
          <>
            <Button
              variant="neutral"
              onClick={() =>
                setFeedback(
                  qr?.url
                    ? `Test destination: ${qr.url}`
                    : "This QR code does not have a saved destination yet.",
                )
              }
            >
              Test Link
            </Button>
            <Button
              variant="neutral"
              onClick={() => {
                if (qr?.url && navigator.clipboard)
                  void navigator.clipboard.writeText(qr.url);
                setFeedback(
                  qr?.url
                    ? "Destination link copied."
                    : "No destination link to copy.",
                );
              }}
            >
              Copy Link
            </Button>
            <Button
              variant="neutral"
              onClick={() => openCreateTask("Create QR Code")}
            >
              Edit / Duplicate
            </Button>
            <Button
              variant="neutral"
              onClick={() => openCreateTask("Make a Flyer")}
            >
              Add to Flyer
            </Button>
            <Button
              variant="neutral"
              onClick={() => openCreateTask("Business Cards")}
            >
              Add to Business Card
            </Button>
          </>
        )}
        {isCard && (
          <>
            <Button
              variant="neutral"
              onClick={() =>
                setFeedback(
                  "Mock print PDF prepared. Live export is still a placeholder.",
                )
              }
            >
              Download PDF Print
            </Button>
            <Button
              variant="neutral"
              onClick={() => openHelpRequest("VistaPrint setup")}
            >
              Request VistaPrint Help
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          icon={<Archive size={17} />}
          onClick={() => archiveBusinessAsset(asset.id)}
        >
          Archive
        </Button>
      </div>
    </section>
  );
}
