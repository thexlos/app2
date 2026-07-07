import { useState } from "react";
import type {
  ColumnStyleBlock,
  DocumentStyleTemplate,
  InfoBlockStyle,
  NotesTermsStyleBlock,
  StyleBlock,
} from "../../types/models";

const fonts = [
  "System Default",
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Courier New",
];

const tabs = [
  "Overall",
  "Header",
  "Info Blocks",
  "Table",
  "Columns",
  "Rows",
  "Totals",
  "Notes & Terms",
  "Footer",
  "QR / Signature",
] as const;
type Tab = (typeof tabs)[number];

type StyleKey =
  | "pageStyle"
  | "headerStyle"
  | "businessInfoStyle"
  | "customerInfoStyle"
  | "projectInfoStyle"
  | "documentMetaStyle"
  | "tableStyle"
  | "rowStyle"
  | "sectionRowStyle"
  | "totalsBoxStyle"
  | "notesStyle"
  | "termsStyle"
  | "paymentInstructionsStyle"
  | "changeOrderPolicyStyle"
  | "footerStyle"
  | "qrBlockStyle"
  | "signatureStyle";

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="style-control-field">
      <span>{label}</span>
      <span className="style-color-control">
        <input
          type="color"
          value={value ?? "#ffffff"}
          onChange={(event) => onChange(event.target.value)}
        />
        <code>{value ?? "#ffffff"}</code>
      </span>
    </label>
  );
}

function NumberControl({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="style-control-field">
      <span>{label}</span>
      <input
        className="input"
        type="number"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function TextControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="style-control-field">
      <span>{label}</span>
      <input
        className="input"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="style-control-field">
      <span>{label}</span>
      <select
        className="select"
        value={value ?? options[0]}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ToggleControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="style-toggle-control">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export function DocumentStyleAdvancedControls({
  style,
  onChange,
}: {
  style: DocumentStyleTemplate;
  onChange: (style: DocumentStyleTemplate) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Overall");
  const [infoKey, setInfoKey] = useState<
    | "businessInfoStyle"
    | "customerInfoStyle"
    | "projectInfoStyle"
    | "documentMetaStyle"
  >("customerInfoStyle");
  const [notesKey, setNotesKey] = useState<
    | "notesStyle"
    | "termsStyle"
    | "paymentInstructionsStyle"
    | "changeOrderPolicyStyle"
  >("notesStyle");
  const [selectedColumnKey, setSelectedColumnKey] = useState(
    style.columnStyles[0]?.columnKey ?? "description",
  );

  const updateBlock = (key: StyleKey, changes: Partial<StyleBlock>) =>
    onChange({
      ...style,
      [key]: { ...style[key], ...changes },
      updatedAt: new Date().toISOString(),
    });
  const updateColumn = (changes: Partial<ColumnStyleBlock>) =>
    onChange({
      ...style,
      columnStyles: style.columnStyles.map((column) =>
        column.columnKey === selectedColumnKey
          ? { ...column, ...changes }
          : column,
      ),
      updatedAt: new Date().toISOString(),
    });
  const column =
    style.columnStyles.find((item) => item.columnKey === selectedColumnKey) ??
    style.columnStyles[0];
  const infoBlock = style[infoKey] as InfoBlockStyle;
  const notesBlock = style[notesKey] as NotesTermsStyleBlock;

  const commonBoxControls = (key: StyleKey, block: StyleBlock) => (
    <div className="document-style-controls">
      <ColorControl
        label="Box background color"
        value={block.backgroundColor}
        onChange={(value) =>
          updateBlock(key, { backgroundColor: value, showBackground: true })
        }
      />
      <ColorControl
        label="Box text color"
        value={block.textColor}
        onChange={(value) => updateBlock(key, { textColor: value })}
      />
      <ColorControl
        label="Box border color"
        value={block.borderColor}
        onChange={(value) => updateBlock(key, { borderColor: value })}
      />
      <NumberControl
        label="Border thickness"
        value={block.borderWidth}
        max={8}
        onChange={(value) =>
          updateBlock(key, { borderWidth: value, showBorder: value > 0 })
        }
      />
      <NumberControl
        label="Padding"
        value={block.padding}
        max={60}
        onChange={(value) => updateBlock(key, { padding: value })}
      />
      <SelectControl
        label="Alignment"
        value={block.alignment}
        options={["left", "center", "right"]}
        onChange={(value) =>
          updateBlock(key, {
            alignment: value as StyleBlock["alignment"],
          })
        }
      />
    </div>
  );

  return (
    <>
      <div className="style-editor-tabs" aria-label="Document style section">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overall" && (
        <div className="document-style-controls">
          <ColorControl
            label="Page background color"
            value={style.pageStyle.backgroundColor}
            onChange={(value) =>
              updateBlock("pageStyle", { backgroundColor: value })
            }
          />
          <ColorControl
            label="Page text color"
            value={style.pageStyle.textColor}
            onChange={(value) => updateBlock("pageStyle", { textColor: value })}
          />
          <SelectControl
            label="Default font family"
            value={style.pageStyle.fontFamily}
            options={fonts}
            onChange={(value) =>
              updateBlock("pageStyle", { fontFamily: value })
            }
          />
          <NumberControl
            label="Default font size"
            value={style.pageStyle.fontSize}
            min={7}
            max={32}
            onChange={(value) => updateBlock("pageStyle", { fontSize: value })}
          />
          <NumberControl
            label="Page padding"
            value={style.pageStyle.padding}
            max={80}
            onChange={(value) => updateBlock("pageStyle", { padding: value })}
          />
          <TextControl
            label="Document width"
            value={style.pageStyle.documentWidth}
            onChange={(value) =>
              onChange({
                ...style,
                pageStyle: { ...style.pageStyle, documentWidth: value },
              })
            }
          />
          <ColorControl
            label="Page border color"
            value={style.pageStyle.borderColor}
            onChange={(value) =>
              updateBlock("pageStyle", { borderColor: value })
            }
          />
          <NumberControl
            label="Page border thickness"
            value={style.pageStyle.borderWidth}
            max={8}
            onChange={(value) =>
              updateBlock("pageStyle", {
                borderWidth: value,
                showBorder: value > 0,
              })
            }
          />
        </div>
      )}

      {activeTab === "Header" && (
        <div className="document-style-controls">
          <ColorControl
            label="Header background color"
            value={style.headerStyle.backgroundColor}
            onChange={(value) =>
              updateBlock("headerStyle", {
                backgroundColor: value,
                showBackground: true,
              })
            }
          />
          <ColorControl
            label="Header text color"
            value={style.headerStyle.textColor}
            onChange={(value) =>
              updateBlock("headerStyle", { textColor: value })
            }
          />
          <SelectControl
            label="Header font family"
            value={style.headerStyle.fontFamily}
            options={fonts}
            onChange={(value) =>
              updateBlock("headerStyle", { fontFamily: value })
            }
          />
          <NumberControl
            label="Header font size"
            value={style.headerStyle.fontSize}
            min={7}
            max={36}
            onChange={(value) =>
              updateBlock("headerStyle", { fontSize: value })
            }
          />
          <NumberControl
            label="Business name font size"
            value={style.headerStyle.businessNameFontSize}
            min={8}
            max={48}
            onChange={(value) =>
              onChange({
                ...style,
                headerStyle: {
                  ...style.headerStyle,
                  businessNameFontSize: value,
                },
              })
            }
          />
          <ColorControl
            label="Business name color"
            value={style.headerStyle.businessNameColor}
            onChange={(value) =>
              onChange({
                ...style,
                headerStyle: { ...style.headerStyle, businessNameColor: value },
              })
            }
          />
          <NumberControl
            label="Document title font size"
            value={style.headerStyle.documentTitleFontSize}
            min={8}
            max={48}
            onChange={(value) =>
              onChange({
                ...style,
                headerStyle: {
                  ...style.headerStyle,
                  documentTitleFontSize: value,
                },
              })
            }
          />
          <ColorControl
            label="Document title color"
            value={style.headerStyle.documentTitleColor}
            onChange={(value) =>
              onChange({
                ...style,
                headerStyle: {
                  ...style.headerStyle,
                  documentTitleColor: value,
                },
              })
            }
          />
          <NumberControl
            label="Logo size"
            value={style.headerStyle.logoSize}
            min={24}
            max={180}
            onChange={(value) =>
              onChange({
                ...style,
                headerStyle: { ...style.headerStyle, logoSize: value },
              })
            }
          />
          <SelectControl
            label="Logo position"
            value={style.headerStyle.logoPosition}
            options={["left", "center", "right"]}
            onChange={(value) =>
              onChange({
                ...style,
                headerStyle: {
                  ...style.headerStyle,
                  logoPosition: value as "left" | "center" | "right",
                },
              })
            }
          />
          <ColorControl
            label="Header border color"
            value={style.headerStyle.borderColor}
            onChange={(value) =>
              updateBlock("headerStyle", { borderColor: value })
            }
          />
          <NumberControl
            label="Header border thickness"
            value={style.headerStyle.borderWidth}
            max={8}
            onChange={(value) =>
              updateBlock("headerStyle", {
                borderWidth: value,
                showBorder: value > 0,
              })
            }
          />
          <SelectControl
            label="Header alignment"
            value={style.headerStyle.alignment}
            options={["left", "center", "right"]}
            onChange={(value) =>
              updateBlock("headerStyle", {
                alignment: value as StyleBlock["alignment"],
              })
            }
          />
        </div>
      )}

      {activeTab === "Info Blocks" && (
        <div className="style-subsection-stack">
          <div className="style-segmented-control">
            {[
              ["businessInfoStyle", "Business"],
              ["customerInfoStyle", "Customer"],
              ["projectInfoStyle", "Project / Job"],
              ["documentMetaStyle", "Number / Date"],
            ].map(([key, label]) => (
              <button
                className={infoKey === key ? "active" : ""}
                key={key}
                onClick={() => setInfoKey(key as typeof infoKey)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="style-apply-all"
            onClick={() =>
              onChange({
                ...style,
                businessInfoStyle: { ...infoBlock },
                customerInfoStyle: { ...infoBlock },
                projectInfoStyle: { ...infoBlock },
                documentMetaStyle: { ...infoBlock },
              })
            }
          >
            Apply this block style to all info boxes
          </button>
          <div className="document-style-controls">
            <ColorControl
              label="Box background color"
              value={infoBlock.backgroundColor}
              onChange={(value) =>
                updateBlock(infoKey, {
                  backgroundColor: value,
                  showBackground: true,
                })
              }
            />
            <ColorControl
              label="Box border color"
              value={infoBlock.borderColor}
              onChange={(value) => updateBlock(infoKey, { borderColor: value })}
            />
            <NumberControl
              label="Box border thickness"
              value={infoBlock.borderWidth}
              max={8}
              onChange={(value) =>
                updateBlock(infoKey, {
                  borderWidth: value,
                  showBorder: value > 0,
                })
              }
            />
            <ColorControl
              label="Box title text color"
              value={infoBlock.titleTextColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  [infoKey]: { ...infoBlock, titleTextColor: value },
                })
              }
            />
            <ColorControl
              label="Box body text color"
              value={infoBlock.bodyTextColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  [infoKey]: { ...infoBlock, bodyTextColor: value },
                })
              }
            />
            <NumberControl
              label="Box title font size"
              value={infoBlock.titleFontSize}
              min={7}
              max={28}
              onChange={(value) =>
                onChange({
                  ...style,
                  [infoKey]: { ...infoBlock, titleFontSize: value },
                })
              }
            />
            <NumberControl
              label="Box body font size"
              value={infoBlock.bodyFontSize}
              min={7}
              max={28}
              onChange={(value) =>
                onChange({
                  ...style,
                  [infoKey]: { ...infoBlock, bodyFontSize: value },
                })
              }
            />
            <NumberControl
              label="Padding"
              value={infoBlock.padding}
              max={60}
              onChange={(value) => updateBlock(infoKey, { padding: value })}
            />
            <SelectControl
              label="Alignment"
              value={infoBlock.alignment}
              options={["left", "center", "right"]}
              onChange={(value) =>
                updateBlock(infoKey, {
                  alignment: value as StyleBlock["alignment"],
                })
              }
            />
          </div>
        </div>
      )}

      {activeTab === "Table" && (
        <div className="document-style-controls">
          <ColorControl
            label="Table border color"
            value={style.tableStyle.tableBorderColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: {
                  ...style.tableStyle,
                  tableBorderColor: value,
                  borderColor: value,
                },
              })
            }
          />
          <NumberControl
            label="Table border thickness"
            value={style.tableStyle.tableBorderWidth}
            max={8}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: {
                  ...style.tableStyle,
                  tableBorderWidth: value,
                  borderWidth: value,
                },
              })
            }
          />
          <ColorControl
            label="Row line color"
            value={style.tableStyle.rowLineColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: { ...style.tableStyle, rowLineColor: value },
              })
            }
          />
          <ColorControl
            label="Column line color"
            value={style.tableStyle.columnLineColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: { ...style.tableStyle, columnLineColor: value },
              })
            }
          />
          <ColorControl
            label="Header row background color"
            value={style.tableStyle.headerRowBackgroundColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: {
                  ...style.tableStyle,
                  headerRowBackgroundColor: value,
                },
                tableHeaderStyle: {
                  ...style.tableHeaderStyle,
                  backgroundColor: value,
                },
              })
            }
          />
          <ColorControl
            label="Header row text color"
            value={style.tableStyle.headerRowTextColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: { ...style.tableStyle, headerRowTextColor: value },
                tableHeaderStyle: {
                  ...style.tableHeaderStyle,
                  textColor: value,
                },
              })
            }
          />
          <ColorControl
            label="Body row background color"
            value={style.tableStyle.bodyRowBackgroundColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: {
                  ...style.tableStyle,
                  bodyRowBackgroundColor: value,
                },
              })
            }
          />
          <ColorControl
            label="Body row text color"
            value={style.tableStyle.bodyRowTextColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: { ...style.tableStyle, bodyRowTextColor: value },
                tableRowStyle: { ...style.tableRowStyle, textColor: value },
              })
            }
          />
          <ColorControl
            label="Alternating row color"
            value={style.tableStyle.alternatingRowBackgroundColor}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: {
                  ...style.tableStyle,
                  alternatingRowBackgroundColor: value,
                },
              })
            }
          />
          <ToggleControl
            label="Use alternating row colors"
            checked={style.tableStyle.useAlternatingRows}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: { ...style.tableStyle, useAlternatingRows: value },
                rowStyle: { ...style.rowStyle, useAlternatingRows: value },
              })
            }
          />
          <SelectControl
            label="Table font family"
            value={style.tableStyle.fontFamily}
            options={fonts}
            onChange={(value) =>
              updateBlock("tableStyle", { fontFamily: value })
            }
          />
          <NumberControl
            label="Table font size"
            value={style.tableStyle.fontSize}
            min={7}
            max={28}
            onChange={(value) => updateBlock("tableStyle", { fontSize: value })}
          />
          <NumberControl
            label="Table padding"
            value={style.tableStyle.padding}
            max={40}
            onChange={(value) => updateBlock("tableStyle", { padding: value })}
          />
          <NumberControl
            label="Table spacing"
            value={style.tableStyle.spacing}
            max={30}
            onChange={(value) =>
              onChange({
                ...style,
                tableStyle: { ...style.tableStyle, spacing: value },
              })
            }
          />
        </div>
      )}

      {activeTab === "Columns" && column && (
        <div className="style-subsection-stack">
          <div className="column-style-list">
            {style.columnStyles.map((item) => (
              <button
                className={selectedColumnKey === item.columnKey ? "active" : ""}
                key={item.columnKey}
                onClick={() => setSelectedColumnKey(item.columnKey)}
              >
                {item.columnLabel}
              </button>
            ))}
          </div>
          <div className="document-style-controls">
            <TextControl
              label="Column header label"
              value={column.columnLabel}
              onChange={(value) => updateColumn({ columnLabel: value })}
            />
            <TextControl
              label="Column width"
              value={column.width}
              onChange={(value) => updateColumn({ width: value })}
            />
            <ColorControl
              label="Header background color"
              value={column.headerBackgroundColor}
              onChange={(value) =>
                updateColumn({ headerBackgroundColor: value })
              }
            />
            <ColorControl
              label="Header text color"
              value={column.headerTextColor}
              onChange={(value) => updateColumn({ headerTextColor: value })}
            />
            <ColorControl
              label="Body text color"
              value={column.bodyTextColor}
              onChange={(value) => updateColumn({ bodyTextColor: value })}
            />
            <SelectControl
              label="Font family"
              value={column.fontFamily}
              options={fonts}
              onChange={(value) => updateColumn({ fontFamily: value })}
            />
            <NumberControl
              label="Body font size"
              value={column.fontSize}
              min={7}
              max={28}
              onChange={(value) => updateColumn({ fontSize: value })}
            />
            <SelectControl
              label="Font weight"
              value={column.fontWeight}
              options={["normal", "medium", "bold"]}
              onChange={(value) =>
                updateColumn({
                  fontWeight: value as ColumnStyleBlock["fontWeight"],
                })
              }
            />
            <SelectControl
              label="Alignment"
              value={column.alignment}
              options={["left", "center", "right"]}
              onChange={(value) =>
                updateColumn({
                  alignment: value as ColumnStyleBlock["alignment"],
                })
              }
            />
            <ColorControl
              label="Column border color"
              value={column.borderColor}
              onChange={(value) => updateColumn({ borderColor: value })}
            />
            <ToggleControl
              label="Show in Builder"
              checked={column.visibleInBuilder}
              onChange={(value) => updateColumn({ visibleInBuilder: value })}
            />
            <ToggleControl
              label="Show on Customer View"
              checked={column.visibleToCustomer}
              onChange={(value) =>
                updateColumn({
                  visibleToCustomer: column.internalOnly ? false : value,
                })
              }
            />
            <ToggleControl
              label="Show on PDF"
              checked={column.visibleOnPdf}
              onChange={(value) =>
                updateColumn({
                  visibleOnPdf: column.internalOnly ? false : value,
                })
              }
            />
            <ToggleControl
              label="Internal only"
              checked={column.internalOnly}
              onChange={(value) =>
                updateColumn({
                  internalOnly: value,
                  visibleToCustomer: value ? false : column.visibleToCustomer,
                  visibleOnPdf: value ? false : column.visibleOnPdf,
                })
              }
            />
          </div>
        </div>
      )}

      {activeTab === "Rows" && (
        <div className="style-subsection-stack">
          <h3>Standard item rows</h3>
          <div className="document-style-controls">
            <ColorControl
              label="Standard row background color"
              value={style.rowStyle.standardRowBackgroundColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  rowStyle: {
                    ...style.rowStyle,
                    standardRowBackgroundColor: value,
                  },
                })
              }
            />
            <ColorControl
              label="Alternating row background color"
              value={style.rowStyle.alternatingRowBackgroundColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  rowStyle: {
                    ...style.rowStyle,
                    alternatingRowBackgroundColor: value,
                  },
                })
              }
            />
            <ColorControl
              label="Row text color"
              value={style.rowStyle.rowTextColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  rowStyle: { ...style.rowStyle, rowTextColor: value },
                })
              }
            />
            <ColorControl
              label="Row border / line color"
              value={style.rowStyle.rowLineColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  rowStyle: { ...style.rowStyle, rowLineColor: value },
                })
              }
            />
            <NumberControl
              label="Row padding"
              value={style.rowStyle.rowPadding}
              max={40}
              onChange={(value) =>
                onChange({
                  ...style,
                  rowStyle: { ...style.rowStyle, rowPadding: value },
                })
              }
            />
            <NumberControl
              label="Row spacing"
              value={style.rowStyle.rowSpacing}
              max={30}
              onChange={(value) =>
                onChange({
                  ...style,
                  rowStyle: { ...style.rowStyle, rowSpacing: value },
                })
              }
            />
            <ToggleControl
              label="Use alternating rows"
              checked={style.rowStyle.useAlternatingRows}
              onChange={(value) =>
                onChange({
                  ...style,
                  rowStyle: { ...style.rowStyle, useAlternatingRows: value },
                  tableStyle: {
                    ...style.tableStyle,
                    useAlternatingRows: value,
                  },
                })
              }
            />
          </div>
          <h3>Section rows</h3>
          {commonBoxControls("sectionRowStyle", style.sectionRowStyle)}
          <div className="document-style-controls">
            <NumberControl
              label="Section row font size"
              value={style.sectionRowStyle.fontSize}
              min={7}
              max={32}
              onChange={(value) =>
                updateBlock("sectionRowStyle", { fontSize: value })
              }
            />
            <SelectControl
              label="Section row font weight"
              value={style.sectionRowStyle.fontWeight}
              options={["normal", "medium", "bold"]}
              onChange={(value) =>
                updateBlock("sectionRowStyle", {
                  fontWeight: value as StyleBlock["fontWeight"],
                })
              }
            />
          </div>
        </div>
      )}

      {activeTab === "Totals" && (
        <div className="document-style-controls">
          <ColorControl
            label="Totals box background color"
            value={style.totalsBoxStyle.backgroundColor}
            onChange={(value) =>
              updateBlock("totalsBoxStyle", {
                backgroundColor: value,
                showBackground: true,
              })
            }
          />
          <ColorControl
            label="Totals box border color"
            value={style.totalsBoxStyle.borderColor}
            onChange={(value) =>
              updateBlock("totalsBoxStyle", { borderColor: value })
            }
          />
          <NumberControl
            label="Totals box border thickness"
            value={style.totalsBoxStyle.borderWidth}
            max={8}
            onChange={(value) =>
              updateBlock("totalsBoxStyle", {
                borderWidth: value,
                showBorder: value > 0,
              })
            }
          />
          <ColorControl
            label="Totals label color"
            value={style.totalsBoxStyle.labelColor}
            onChange={(value) =>
              onChange({
                ...style,
                totalsBoxStyle: { ...style.totalsBoxStyle, labelColor: value },
              })
            }
          />
          <ColorControl
            label="Totals amount color"
            value={style.totalsBoxStyle.amountColor}
            onChange={(value) =>
              onChange({
                ...style,
                totalsBoxStyle: { ...style.totalsBoxStyle, amountColor: value },
              })
            }
          />
          <NumberControl
            label="Final total font size"
            value={style.totalsBoxStyle.finalTotalFontSize}
            min={10}
            max={40}
            onChange={(value) =>
              onChange({
                ...style,
                totalsBoxStyle: {
                  ...style.totalsBoxStyle,
                  finalTotalFontSize: value,
                },
              })
            }
          />
          <SelectControl
            label="Final total font weight"
            value={style.totalsBoxStyle.finalTotalFontWeight}
            options={["normal", "medium", "bold"]}
            onChange={(value) =>
              onChange({
                ...style,
                totalsBoxStyle: {
                  ...style.totalsBoxStyle,
                  finalTotalFontWeight: value as "normal" | "medium" | "bold",
                },
              })
            }
          />
          <ColorControl
            label="Subtotal / tax / discount color"
            value={style.totalsBoxStyle.secondaryTextColor}
            onChange={(value) =>
              onChange({
                ...style,
                totalsBoxStyle: {
                  ...style.totalsBoxStyle,
                  secondaryTextColor: value,
                },
              })
            }
          />
          <ColorControl
            label="Balance due color"
            value={style.totalsBoxStyle.balanceDueColor}
            onChange={(value) =>
              onChange({
                ...style,
                totalsBoxStyle: {
                  ...style.totalsBoxStyle,
                  balanceDueColor: value,
                },
              })
            }
          />
          <ColorControl
            label="Amount paid color"
            value={style.totalsBoxStyle.amountPaidColor}
            onChange={(value) =>
              onChange({
                ...style,
                totalsBoxStyle: {
                  ...style.totalsBoxStyle,
                  amountPaidColor: value,
                },
              })
            }
          />
          <NumberControl
            label="Padding"
            value={style.totalsBoxStyle.padding}
            max={60}
            onChange={(value) =>
              updateBlock("totalsBoxStyle", { padding: value })
            }
          />
          <SelectControl
            label="Alignment"
            value={style.totalsBoxStyle.alignment}
            options={["left", "center", "right"]}
            onChange={(value) =>
              updateBlock("totalsBoxStyle", {
                alignment: value as StyleBlock["alignment"],
              })
            }
          />
        </div>
      )}

      {activeTab === "Notes & Terms" && (
        <div className="style-subsection-stack">
          <div className="style-segmented-control">
            {[
              ["notesStyle", "Notes"],
              ["termsStyle", "Terms"],
              ["paymentInstructionsStyle", "Payment"],
              ["changeOrderPolicyStyle", "Change Order Policy"],
            ].map(([key, label]) => (
              <button
                className={notesKey === key ? "active" : ""}
                key={key}
                onClick={() => setNotesKey(key as typeof notesKey)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="document-style-controls">
            <ColorControl
              label="Box background color"
              value={notesBlock.backgroundColor}
              onChange={(value) =>
                updateBlock(notesKey, {
                  backgroundColor: value,
                  showBackground: true,
                })
              }
            />
            <ColorControl
              label="Box border color"
              value={notesBlock.borderColor}
              onChange={(value) =>
                updateBlock(notesKey, { borderColor: value })
              }
            />
            <NumberControl
              label="Box border thickness"
              value={notesBlock.borderWidth}
              max={8}
              onChange={(value) =>
                updateBlock(notesKey, {
                  borderWidth: value,
                  showBorder: value > 0,
                })
              }
            />
            <ColorControl
              label="Heading color"
              value={notesBlock.headingColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  [notesKey]: { ...notesBlock, headingColor: value },
                })
              }
            />
            <ColorControl
              label="Body text color"
              value={notesBlock.bodyTextColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  [notesKey]: { ...notesBlock, bodyTextColor: value },
                })
              }
            />
            <NumberControl
              label="Heading font size"
              value={notesBlock.headingFontSize}
              min={7}
              max={30}
              onChange={(value) =>
                onChange({
                  ...style,
                  [notesKey]: { ...notesBlock, headingFontSize: value },
                })
              }
            />
            <NumberControl
              label="Body font size"
              value={notesBlock.bodyFontSize}
              min={7}
              max={28}
              onChange={(value) =>
                onChange({
                  ...style,
                  [notesKey]: { ...notesBlock, bodyFontSize: value },
                })
              }
            />
            <ColorControl
              label="Numbered note color"
              value={notesBlock.numberedNoteColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  [notesKey]: { ...notesBlock, numberedNoteColor: value },
                })
              }
            />
            <NumberControl
              label="Padding"
              value={notesBlock.padding}
              max={60}
              onChange={(value) => updateBlock(notesKey, { padding: value })}
            />
            <NumberControl
              label="Spacing"
              value={notesBlock.spacing}
              max={30}
              onChange={(value) =>
                onChange({
                  ...style,
                  [notesKey]: { ...notesBlock, spacing: value },
                })
              }
            />
          </div>
        </div>
      )}

      {activeTab === "Footer" && (
        <div className="style-subsection-stack">
          {commonBoxControls("footerStyle", style.footerStyle)}
          <div className="document-style-controls">
            <SelectControl
              label="Footer font family"
              value={style.footerStyle.fontFamily}
              options={fonts}
              onChange={(value) =>
                updateBlock("footerStyle", { fontFamily: value })
              }
            />
            <NumberControl
              label="Footer font size"
              value={style.footerStyle.fontSize}
              min={7}
              max={28}
              onChange={(value) =>
                updateBlock("footerStyle", { fontSize: value })
              }
            />
          </div>
        </div>
      )}

      {activeTab === "QR / Signature" && (
        <div className="style-subsection-stack">
          <h3>QR block</h3>
          <div className="document-style-controls">
            <ColorControl
              label="QR block background color"
              value={style.qrBlockStyle.backgroundColor}
              onChange={(value) =>
                updateBlock("qrBlockStyle", {
                  backgroundColor: value,
                  showBackground: true,
                })
              }
            />
            <ColorControl
              label="QR block border color"
              value={style.qrBlockStyle.borderColor}
              onChange={(value) =>
                updateBlock("qrBlockStyle", { borderColor: value })
              }
            />
            <ColorControl
              label="QR label color"
              value={style.qrBlockStyle.labelColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  qrBlockStyle: { ...style.qrBlockStyle, labelColor: value },
                })
              }
            />
            <NumberControl
              label="QR label font size"
              value={style.qrBlockStyle.labelFontSize}
              min={7}
              max={28}
              onChange={(value) =>
                onChange({
                  ...style,
                  qrBlockStyle: { ...style.qrBlockStyle, labelFontSize: value },
                })
              }
            />
            <NumberControl
              label="QR size"
              value={style.qrBlockStyle.qrSize}
              min={40}
              max={240}
              onChange={(value) =>
                onChange({
                  ...style,
                  qrBlockStyle: { ...style.qrBlockStyle, qrSize: value },
                })
              }
            />
          </div>
          <h3>Signature block</h3>
          <div className="document-style-controls">
            <ColorControl
              label="Signature block background color"
              value={style.signatureStyle.backgroundColor}
              onChange={(value) =>
                updateBlock("signatureStyle", {
                  backgroundColor: value,
                  showBackground: true,
                })
              }
            />
            <ColorControl
              label="Signature block border color"
              value={style.signatureStyle.borderColor}
              onChange={(value) =>
                updateBlock("signatureStyle", { borderColor: value })
              }
            />
            <ColorControl
              label="Signature line color"
              value={style.signatureStyle.lineColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  signatureStyle: { ...style.signatureStyle, lineColor: value },
                })
              }
            />
            <ColorControl
              label="Signature label color"
              value={style.signatureStyle.labelColor}
              onChange={(value) =>
                onChange({
                  ...style,
                  signatureStyle: {
                    ...style.signatureStyle,
                    labelColor: value,
                  },
                })
              }
            />
            <NumberControl
              label="Signature font size"
              value={style.signatureStyle.signatureFontSize}
              min={7}
              max={28}
              onChange={(value) =>
                onChange({
                  ...style,
                  signatureStyle: {
                    ...style.signatureStyle,
                    signatureFontSize: value,
                  },
                })
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
