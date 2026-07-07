import { CheckCircle2, CircleHelp, Eye, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import type {
  BuilderContract,
  BuilderFieldContract,
} from "../config/builderContracts";
import { useAppState } from "../state/AppState";
import type { WorkshopItemType } from "../types/models";

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
  const strings = Object.values(values).flat().filter(Boolean).slice(0, 5);
  return (
    <aside
      className={`contract-preview contract-preview--${contract.builderId}`}
    >
      <div className="contract-preview__head">
        <span>{contract.previewType}</span>
        <Eye size={20} />
      </div>
      <div className="contract-preview__canvas">
        <strong>{strings[0] || contract.builderName}</strong>
        {strings.slice(1).map((value, index) => (
          <p key={`${value}-${index}`}>{value}</p>
        ))}
        {strings.length === 0 && <p>{contract.emptyStateCopy}</p>}
      </div>
      <small>Customer-facing preview · Internal settings stay hidden</small>
    </aside>
  );
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
    guidedDraft,
    clearGuidedDraft,
  } = useAppState();
  const guidedAnswers =
    guidedDraft?.builderId === contract.builderId
      ? guidedDraft.answers
      : undefined;
  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        contract.simpleModeFields.map((field) => [
          field.id,
          guidedAnswers?.[field.id] ??
            contract.sampleMockData[field.id] ??
            (field.kind === "checkboxes" ? [] : ""),
        ]),
      ),
    [contract, guidedAnswers],
  );
  const [values, setValues] = useState<FormValues>(initialValues);
  const [created, setCreated] = useState(false);
  const [message, setMessage] = useState("");
  const [savedItemId, setSavedItemId] = useState("");
  const missing = contract.requiredFields.filter((id) => {
    const value = values[id];
    return Array.isArray(value)
      ? value.length === 0
      : !String(value ?? "").trim();
  });

  const runAction = (action: string) => {
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
      exportWorkshopItem(savedItemId, action);
      return;
    }
    if (/Save|Check|Preview|Copy|Prepare|Walk Me/i.test(action)) {
      if (!savedItemId) {
        const preferredTitle = [
          "headline",
          "title",
          "formTitle",
          "eventTitle",
          "caption",
        ]
          .map((key) => values[key])
          .find((value) => typeof value === "string" && value.trim());
        const savedId = saveWorkshopItem({
          itemType: builderItemTypes[contract.builderId] ?? "custom_template",
          title: String(preferredTitle || contract.builderName),
          description: contract.purpose,
          status: /Save Draft/i.test(action)
            ? "Draft"
            : contract.builderId === "fix-something-flow"
              ? "Needs Review"
              : "Ready",
          createdFrom: guidedAnswers ? "Guided Wizard" : "Manual Builder",
          tags: [contract.builderName, "Workshop"],
          exportFormats: contract.afterCreatedActions.filter((item) =>
            /Download|PDF|PNG|JPG/i.test(item),
          ),
        });
        setSavedItemId(savedId);
        if (guidedAnswers) clearGuidedDraft();
      }
      setCreated(true);
      setMessage(
        `Saved to My Creations. ${action} completed in mock mode; no external service was used.`,
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
        <span className="simple-mode-label">Simple Mode</span>
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
            onClick={() => runAction(action)}
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
      {created && contract.afterCreatedActions.length > 0 && (
        <section className="section">
          <h2 className="section-heading">What do you want to do next?</h2>
          <div className="builder-next-actions">
            {contract.afterCreatedActions.map((action) => (
              <button key={action} onClick={() => runAction(action)}>
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
