import { CheckCircle2, CircleHelp, Eye, Save, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import type {
  BuilderContract,
  BuilderFieldContract,
} from "../config/builderContracts";
import {
  getBuilderDefinitionForTask,
  getWorkshopItemTitle,
  normalizeWorkshopItem,
} from "../lib/workshopPayloads";
import { useAppState } from "../state/AppState";
import type { BuilderData, WorkshopItemType } from "../types/models";

type FormValues = Record<string, string | string[]>;
const builderItemTypes: Record<string, WorkshopItemType> = {
  "flyer-builder": "flyer",
  "social-post-builder": "social_post",
  "business-card-builder": "business_card",
  "send-promotion-builder": "promotion",
  "review-booster-builder": "review_booster",
  "lead-form-builder": "lead_form",
  "menu-price-sheet-builder": "menu_price_sheet",
  "sign-door-hanger-builder": "yard_sign",
  "event-promo-builder": "event_promo",
  "fix-something-flow": "custom_template",
  "canva-help-flow": "canva_help_item",
  "vistaprint-print-setup-flow": "vistaprint_print_setup",
};

function BuilderField({
  field,
  value,
  onChange,
}: {
  field: BuilderFieldContract;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}) {
  if (field.kind === "select")
    return (
      <div className="field">
        <label htmlFor={field.id}>{field.label}</label>
        <select
          id={field.id}
          className="select"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Choose an option</option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {field.helperText && (
          <small className="field-help">{field.helperText}</small>
        )}
      </div>
    );
  if (field.kind === "textarea")
    return (
      <div className="field">
        <label htmlFor={field.id}>{field.label}</label>
        <textarea
          id={field.id}
          className="textarea"
          value={String(value)}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {field.helperText && (
          <small className="field-help">{field.helperText}</small>
        )}
      </div>
    );
  if (field.kind === "checkboxes") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className="builder-check-field">
        <legend>{field.label}</legend>
        <div className="builder-check-grid">
          {field.options?.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option),
                  )
                }
              />{" "}
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  if (field.kind === "file")
    return (
      <div className="field">
        <label htmlFor={field.id}>{field.label}</label>
        <label className="builder-upload" htmlFor={field.id}>
          <span>{value ? String(value) : "Choose a file or screenshot"}</span>
          <strong>Browse</strong>
        </label>
        <input
          id={field.id}
          className="visually-hidden"
          type="file"
          onChange={(event) => onChange(event.target.files?.[0]?.name ?? "")}
        />
      </div>
    );
  return (
    <div className="field">
      <label htmlFor={field.id}>{field.label}</label>
      <input
        id={field.id}
        type={
          field.kind === "url" ? "url" : field.kind === "date" ? "date" : "text"
        }
        className="input"
        value={String(value)}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {field.helperText && (
        <small className="field-help">{field.helperText}</small>
      )}
    </div>
  );
}

function ContractPreview({
  contract,
  values,
}: {
  contract: BuilderContract;
  values: FormValues;
}) {
  const rows = buildToolPreviewRows(contract.builderId, values);
  return (
    <aside
      className={`contract-preview contract-preview--${contract.builderId}`}
    >
      <div className="contract-preview__head">
        <span>{contract.previewType}</span>
        <Eye size={20} />
      </div>
      <div className="contract-preview__canvas">
        <strong>{rows[0]?.value || contract.builderName}</strong>
        {rows.slice(1, 7).map((row) => (
          <p key={row.label}>
            <span className="muted small">{row.label}: </span>
            {row.value}
          </p>
        ))}
        {rows.length === 0 && <p>{contract.emptyStateCopy}</p>}
      </div>
      <small>Customer-facing preview · Internal settings stay hidden</small>
    </aside>
  );
}

function toData(values: FormValues): BuilderData {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value]),
  ) as BuilderData;
}

function toFormValue(
  value: BuilderData[string] | string | string[] | undefined,
  fallback: string | string[],
) {
  if (Array.isArray(value)) return value.map(String);
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function readText(values: FormValues, key: string) {
  const value = values[key];
  return Array.isArray(value) ? value.join(", ") : String(value ?? "").trim();
}

function previewRow(label: string, value: string) {
  return value ? { label, value } : undefined;
}

function buildToolPreviewRows(builderId: string, values: FormValues) {
  const rowsByBuilder: Record<string, Array<{ label: string; value: string } | undefined>> = {
    "social-post-builder": [
      previewRow("Platform", readText(values, "platform")),
      previewRow("Post type", readText(values, "postType")),
      previewRow("Caption", readText(values, "caption")),
      previewRow("Link", readText(values, "link")),
      previewRow("Hashtags", readText(values, "hashtags")),
      previewRow("Media", readText(values, "media")),
    ],
    "flyer-builder": [
      previewRow("Headline", readText(values, "headline")),
      previewRow("Message", readText(values, "message")),
      previewRow("Offer", readText(values, "offer")),
      previewRow("Date/time", [readText(values, "date"), readText(values, "time")].filter(Boolean).join(" ")),
      previewRow("Phone/website", [readText(values, "phone"), readText(values, "website")].filter(Boolean).join(" • ")),
      previewRow("CTA", readText(values, "cta")),
      previewRow("QR label", readText(values, "qrCode")),
    ],
    "business-card-builder": [
      previewRow("Card type", readText(values, "cardType")),
      previewRow("Information", readText(values, "information")),
      previewRow("QR option", readText(values, "qrOption")),
      previewRow("Destination", readText(values, "destination")),
      previewRow("Sides", readText(values, "sides")),
    ],
    "send-promotion-builder": [
      previewRow("Recipient group", readText(values, "audience")),
      previewRow("Title", readText(values, "title")),
      previewRow("Message", readText(values, "message")),
      previewRow("Offer/link", [readText(values, "offer"), readText(values, "link")].filter(Boolean).join(" • ")),
      previewRow("Expiration", readText(values, "expiration")),
    ],
    "review-booster-builder": [
      previewRow("Review link", readText(values, "reviewLink")),
      previewRow("Message", readText(values, "reviewMessage")),
      previewRow("QR", "QR placeholder can be added after save"),
    ],
    "lead-form-builder": [
      previewRow("Form title", readText(values, "formTitle")),
      previewRow("Fields requested", readText(values, "fields")),
      previewRow("Confirmation", readText(values, "thankYou")),
    ],
    "menu-price-sheet-builder": [
      previewRow("Title", readText(values, "title")),
      previewRow("Categories", readText(values, "categories")),
      previewRow("Items/services", readText(values, "items")),
      previewRow("Prices", readText(values, "prices")),
    ],
    "sign-door-hanger-builder": [
      previewRow("Sign type", readText(values, "signType")),
      previewRow("Headline", readText(values, "headline")),
      previewRow("CTA", readText(values, "cta")),
      previewRow("Phone/QR", [readText(values, "phone"), readText(values, "qrCode")].filter(Boolean).join(" • ")),
      previewRow("Print note", "Print-safe check happens before export"),
    ],
    "event-promo-builder": [
      previewRow("Event", readText(values, "eventTitle")),
      previewRow("Date/time", [readText(values, "date"), readText(values, "time")].filter(Boolean).join(" ")),
      previewRow("Location", readText(values, "location")),
      previewRow("Offer/CTA", [readText(values, "price"), readText(values, "contact")].filter(Boolean).join(" • ")),
    ],
    "fix-something-flow": [
      previewRow("Uploaded file", readText(values, "file")),
      previewRow("Issue", readText(values, "fixType")),
      previewRow("Notes", readText(values, "notes")),
    ],
    "canva-help-flow": [
      previewRow("Canva link", readText(values, "canvaLink")),
      previewRow("Screenshot", readText(values, "screenshot")),
      previewRow("Requested changes", readText(values, "helpType")),
      previewRow("Notes", readText(values, "notes")),
    ],
    "vistaprint-print-setup-flow": [
      previewRow("Product type", readText(values, "printItem")),
      previewRow("Uploaded file", readText(values, "file")),
      previewRow("Print issue", readText(values, "issue")),
      previewRow("Notes", readText(values, "notes")),
    ],
  };
  return (rowsByBuilder[builderId] ?? []).filter(Boolean) as Array<{
    label: string;
    value: string;
  }>;
}

export function ContractBuilderScreen({
  contract,
}: {
  contract: BuilderContract;
}) {
  const {
    openHelpRequest,
    openCreateTask,
    saveWorkshopItem,
    exportWorkshopItem,
    recordWorkshopAction,
    saveRecoveryDraft,
    clearRecoveryDraftForBuilder,
    selectedRecoveryDraftId,
    recoveryDrafts,
    guidedDraft,
    clearGuidedDraft,
    selectedWorkshopItemId,
    selectedCreateTask,
    workspace,
  } = useAppState();
  const selectedWorkshopItem = selectedWorkshopItemId
    ? workspace.workshopItems.find((item) => item.id === selectedWorkshopItemId)
    : undefined;
  const savedItem =
    selectedWorkshopItem &&
    (selectedWorkshopItem.builderId === contract.builderId ||
      !selectedWorkshopItem.builderId)
      ? normalizeWorkshopItem(selectedWorkshopItem)
      : undefined;
  const guidedAnswers =
    guidedDraft?.builderId === contract.builderId
      ? guidedDraft.answers
      : undefined;
  const recoveryDraft =
    selectedRecoveryDraftId
      ? recoveryDrafts.find(
          (draft) =>
            draft.id === selectedRecoveryDraftId &&
            draft.builderId === contract.builderId,
        )
      : undefined;
  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        contract.simpleModeFields.map((field) => [
          field.id,
          toFormValue(
            recoveryDraft?.builderData[field.id] ??
              savedItem?.builderData?.[field.id] ??
              guidedAnswers?.[field.id],
            field.kind === "checkboxes" ? [] : "",
          ),
        ]),
      ),
    [contract, guidedAnswers, recoveryDraft, savedItem],
  );
  const [values, setValues] = useState<FormValues>(initialValues);
  const [created, setCreated] = useState(false);
  const [message, setMessage] = useState("");
  const [savedItemId, setSavedItemId] = useState(savedItem?.id ?? "");
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [pendingExport, setPendingExport] = useState<{
    itemId: string;
    action: string;
  }>();
  useEffect(() => {
    setValues(initialValues);
    setSavedItemId(savedItem?.id ?? "");
    setHasUserEdited(false);
  }, [initialValues, savedItem?.id]);

  useEffect(() => {
    if (!hasUserEdited) return;
    const timeout = window.setTimeout(() => {
      saveRecoveryDraft({
        builderId: contract.builderId,
        sourceTool: selectedCreateTask ?? contract.builderName,
        selectedCreateTask: selectedCreateTask ?? contract.builderName,
        selectedWorkshopItemId: savedItemId || savedItem?.id,
        builderData: toData(values),
      });
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [
    contract.builderId,
    contract.builderName,
    hasUserEdited,
    savedItem?.id,
    savedItemId,
    selectedCreateTask,
    values,
  ]);

  const loadExample = () => {
    setValues(
      Object.fromEntries(
        contract.simpleModeFields.map((field) => [
          field.id,
          toFormValue(
            contract.sampleMockData[field.id],
            field.kind === "checkboxes" ? [] : "",
          ),
        ]),
      ),
    );
    setCreated(false);
    setHasUserEdited(true);
    setMessage(
      "Example content loaded. Replace it with this business's real details before saving.",
    );
  };
  const missing = contract.requiredFields.filter((id) => {
    const value = values[id];
    return Array.isArray(value)
      ? value.length === 0
      : !String(value ?? "").trim();
  });

  const saveCurrentDraft = (status: "Draft" | "Ready" | "Needs Review") => {
    const definition =
      getBuilderDefinitionForTask(selectedCreateTask ?? contract.builderName) ??
      getBuilderDefinitionForTask(contract.builderName);
    const builderData = toData(values);
    const title = getWorkshopItemTitle(
      contract.builderId,
      builderData,
      contract.builderName,
    );
    const savedId = saveWorkshopItem({
      id: savedItemId || savedItem?.id,
      builderId: contract.builderId,
      sourceTool:
        definition?.sourceTool ?? selectedCreateTask ?? contract.builderName,
      itemType:
        definition?.itemType ??
        builderItemTypes[contract.builderId] ??
        "custom_template",
      title,
      description: contract.purpose,
      status,
      createdFrom: guidedAnswers ? "Guided Wizard" : "Manual Builder",
      builderData,
      previewData: Object.fromEntries(
        buildToolPreviewRows(contract.builderId, values).map((row) => [
          row.label,
          row.value,
        ]),
      ) as BuilderData,
      tags: [contract.builderName, "Workshop"],
      exportFormats: contract.afterCreatedActions.filter((item) =>
        /Download|PDF|PNG|JPG/i.test(item),
      ),
    });
    setSavedItemId(savedId);
    if (guidedAnswers) clearGuidedDraft();
    clearRecoveryDraftForBuilder(contract.builderId, savedItem?.id || savedId);
    return savedId;
  };

  const runAction = async (action: string) => {
    if (/Request|Start Here|Format It/i.test(action)) {
      openHelpRequest(contract.helpHandoffType);
      return;
    }
    if (/Create QR|Add QR/i.test(action)) {
      openCreateTask("Create QR Code");
      return;
    }
    if (/Make Flyer|Create Flyer/i.test(action)) {
      openCreateTask("Make a Flyer");
      return;
    }
    if (/Create Post|Post to Social/i.test(action)) {
      openCreateTask("Create Post");
      return;
    }
    if (/Create Lead Form/i.test(action)) {
      openCreateTask("Lead Forms");
      return;
    }
    if (/Download|PDF Print|PNG|JPG/i.test(action) && savedItemId) {
      setPendingExport({ itemId: savedItemId, action });
      setMessage(
        `${action} is prepared in mock mode. No File Vault copy was saved.`,
      );
      return;
    }
    if (/Preview/i.test(action)) {
      setCreated(false);
      setPendingExport(undefined);
      setMessage("Preview updated with the current unsaved fields.");
      return;
    }
    if (/Copy Caption/i.test(action)) {
      const caption = readText(values, "caption") || readText(values, "message");
      if (!caption) {
        setMessage("No caption text is available to copy yet.");
        return;
      }
      try {
        await navigator.clipboard?.writeText(caption);
        setMessage("Caption copied.");
      } catch {
        setMessage(`Copy this caption: ${caption}`);
      }
      return;
    }
    if (/Save|Check|Preview|Copy|Prepare|Walk Me/i.test(action)) {
      saveCurrentDraft(
        /Save Draft/i.test(action)
          ? "Draft"
          : contract.builderId === "fix-something-flow"
            ? "Needs Review"
            : "Ready",
      );
      setCreated(true);
      setPendingExport(undefined);
      setMessage(
        /Save Draft/i.test(action)
          ? "Draft saved to My Creations."
          : `Saved to My Creations. ${action} completed in mock mode; no external service was used.`,
      );
      return;
    }
    if (savedItemId) recordWorkshopAction(savedItemId, action);
    setMessage(`${action} is prepared as the next mock workflow step.`);
  };

  return (
    <section className="screen screen--detail">
      <DetailHeader title={contract.builderName} backTo="create-mode" />
      <div className="section builder-contract-intro">
        <h1 className="page-title">{contract.builderName}</h1>
        <p className="page-subtitle">{contract.purpose}</p>
        <div className="row wrap">
          <span className="simple-mode-label">Simple Mode</span>
          <button type="button" className="inline-link" onClick={loadExample}>
            <Sparkles size={16} /> Load Example
          </button>
        </div>
      </div>
      <div className="builder-layout section">
        <div className="stack">
          <section className="card panel stack">
            {contract.simpleModeFields.map((field) => (
              <BuilderField
                key={field.id}
                field={field}
                value={
                  values[field.id] ?? (field.kind === "checkboxes" ? [] : "")
                }
                onChange={(value) => {
                  setValues((current) => ({ ...current, [field.id]: value }));
                  setCreated(false);
                  setHasUserEdited(true);
                  setPendingExport(undefined);
                }}
              />
            ))}
          </section>
          <details className="contract-more-options card panel">
            <summary>More Options</summary>
            <div className="builder-check-grid">
              {contract.advancedFields.map((field) => (
                <label key={field}>
                  <input type="checkbox" /> {field}
                </label>
              ))}
            </div>
          </details>
        </div>
        <ContractPreview contract={contract} values={values} />
      </div>
      <section className="contract-actions section">
        {contract.primaryActions.map((action, index) => (
          <Button
            key={action}
            variant={
              index === 0 ? "primary" : index === 1 ? "outline" : "neutral"
            }
            icon={index === 0 ? <Save size={18} /> : <Sparkles size={18} />}
            disabled={index === 0 && missing.length > 0}
            onClick={() => void runAction(action)}
          >
            {action}
          </Button>
        ))}
      </section>
      {missing.length > 0 && (
        <p className="builder-validation">
          Complete the required fields before using the primary action.
        </p>
      )}
      {message && (
        <div className="alert alert--success section" aria-live="polite">
          <CheckCircle2 size={20} />
          <strong>{message}</strong>
        </div>
      )}
      {pendingExport && (
        <section className="card panel section stack" aria-live="polite">
          <div>
            <h2 className="section-heading">Save this export to File Vault?</h2>
            <p className="section-copy">
              My Creations keeps the editable project. File Vault only keeps a
              chosen file or export reference.
            </p>
          </div>
          <div className="row wrap">
            <Button
              variant="primary"
              onClick={() => {
                exportWorkshopItem(pendingExport.itemId, pendingExport.action);
                setPendingExport(undefined);
                setMessage("Saved a copy to File Vault.");
              }}
            >
              Save Copy to File Vault
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPendingExport(undefined);
                setMessage("No File Vault copy was saved.");
              }}
            >
              No thanks
            </Button>
          </div>
        </section>
      )}
      {created && contract.afterCreatedActions.length > 0 && (
        <section className="section">
          <h2 className="section-heading">What do you want to do next?</h2>
          <div className="builder-next-actions">
            {contract.afterCreatedActions.map((action) => (
              <button key={action} onClick={() => void runAction(action)}>
                {action}
              </button>
            ))}
          </div>
        </section>
      )}
      <button
        className="qr-help-link section"
        onClick={() => openHelpRequest(contract.helpHandoffType)}
      >
        <CircleHelp size={19} /> Need Start Here help?
      </button>
    </section>
  );
}
