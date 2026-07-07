import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  Eye,
  Hammer,
  MessageCircle,
  WandSparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { useAppState } from "../state/AppState";
import { getBuilderContract } from "../config/builderContracts";
import { QRCodeBuilderScreen } from "./QRCodeBuilderScreen";
import { ContractBuilderScreen } from "./ContractBuilderScreen";
import { getGuidedBuilderFields } from "../config/builderFieldConfigs";

export function CreateModeScreen() {
  const {
    selectedCreateTask = "Workshop Project",
    setCurrentScreen,
    openHelpRequest,
  } = useAppState();
  const choices = [
    {
      title: "Do It Myself",
      detail: `Open the ${selectedCreateTask.toLowerCase()} builder with the essential fields ready.`,
      icon: Hammer,
      action: () => setCurrentScreen("create-builder"),
    },
    {
      title: "Walk Me Through It",
      detail: "Use a short guided wizard with one decision at a time.",
      icon: MessageCircle,
      action: () => setCurrentScreen("create-wizard"),
    },
    {
      title: "Have Start Here Help",
      detail: "Open a support request with this task already selected.",
      icon: CircleHelp,
      action: () => openHelpRequest(selectedCreateTask),
    },
  ];
  return (
    <section className="screen screen--detail">
      <DetailHeader title={selectedCreateTask} backTo="create" />
      <div className="section">
        <h1 className="page-title">How do you want to handle this?</h1>
        <p className="page-subtitle">
          Help is optional. Choose the path that fits you.
        </p>
      </div>
      <div className="mode-choice-list section">
        {choices.map(({ title, detail, icon: Icon, action }) => (
          <button key={title} onClick={action}>
            <span className="icon-box">
              <Icon size={23} />
            </span>
            <span className="grow">
              <strong>{title}</strong>
              <small>{detail}</small>
            </span>
            <ChevronRight size={20} />
          </button>
        ))}
      </div>
    </section>
  );
}

export function CreateBuilderScreen() {
  const { selectedCreateTask = "Workshop Project" } = useAppState();
  const contract = getBuilderContract(selectedCreateTask);
  if (contract?.builderId === "qr-code-builder") return <QRCodeBuilderScreen />;
  if (contract) return <ContractBuilderScreen contract={contract} />;
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Choose a Workshop Tool" backTo="create" />
      <div className="section">
        <h1 className="page-title">Choose what you want to make</h1>
        <p className="page-subtitle">
          Each Workshop tool has its own fields, preview, validation, and next
          actions.
        </p>
      </div>
    </section>
  );
}

export function CreateWizardScreen() {
  const {
    selectedCreateTask = "Workshop Project",
    openHelpRequest,
    completeGuidedWizard,
    currentBusiness,
    workspace,
  } = useAppState();
  const contract = getBuilderContract(selectedCreateTask);
  const moneyMeta =
    selectedCreateTask === "Create Estimate"
      ? {
          builderId: "estimate-builder",
          builderName: "Estimate Builder",
          helpHandoffType: "Invoice / Estimate Template Setup",
        }
      : selectedCreateTask === "Create Invoice"
        ? {
            builderId: "invoice-builder",
            builderName: "Invoice Builder",
            helpHandoffType: "Invoice / Estimate Template Setup",
          }
        : undefined;
  const builderId = contract?.builderId ?? moneyMeta?.builderId ?? "";
  const builderName =
    contract?.builderName ?? moneyMeta?.builderName ?? "Builder";
  const helpHandoffType =
    contract?.helpHandoffType ??
    moneyMeta?.helpHandoffType ??
    selectedCreateTask;
  const fields = useMemo(() => getGuidedBuilderFields(builderId), [builderId]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  if (!builderId || fields.length === 0)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Guided Workshop" backTo="create-mode" />
        <div className="guided-step section">
          <h1>Choose a Workshop tool first</h1>
          <p>
            The guided questions come from each real builder’s field
            configuration.
          </p>
        </div>
      </section>
    );
  const current = fields[step];
  const value =
    answers[current.fieldKey] ??
    (current.inputType === "multiSelect" ? [] : (current.defaultValue ?? ""));
  const missing =
    current.required &&
    (Array.isArray(value) ? value.length === 0 : !String(value).trim());
  const setValue = (next: string | string[]) =>
    setAnswers((existing) => ({ ...existing, [current.fieldKey]: next }));
  const finish = () =>
    completeGuidedWizard(builderId, selectedCreateTask, answers);
  return (
    <section className="screen screen--detail">
      <DetailHeader
        title={`Guided ${builderName}`}
        backTo={moneyMeta ? "money" : "create-mode"}
      />
      <div className="wizard-progress section">
        <div style={{ width: `${((step + 1) / fields.length) * 100}%` }} />
      </div>
      <div className="guided-step">
        <span>
          Step {step + 1} of {fields.length}
        </span>
        <div className="icon-box">
          <WandSparkles size={24} />
        </div>
        <h1>{current.friendlyQuestion}</h1>
        <p>
          {current.helperText ??
            `This answer fills the real ${builderName} for ${currentBusiness.name}.`}
        </p>
        {current.inputType === "select" && (
          <select
            className="select"
            value={String(value)}
            onChange={(event) => setValue(event.target.value)}
          >
            <option value="">Choose an option</option>
            {current.options?.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        )}
        {current.inputType === "multiSelect" && (
          <div className="help-choice-grid">
            {current.options?.map((option) => {
              const selected = Array.isArray(value) ? value : [];
              return (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={(event) =>
                      setValue(
                        event.target.checked
                          ? [...selected, option]
                          : selected.filter((item) => item !== option),
                      )
                    }
                  />
                  {option}
                </label>
              );
            })}
          </div>
        )}
        {current.inputType === "textarea" && (
          <textarea
            className="textarea"
            value={String(value)}
            onChange={(event) => setValue(event.target.value)}
          />
        )}
        {current.inputType === "upload" && (
          <label className="builder-upload">
            <span>
              {value
                ? String(value)
                : "Choose a logo, photo, file, or screenshot"}
            </span>
            <strong>Browse</strong>
            <input
              className="visually-hidden"
              type="file"
              onChange={(event) =>
                setValue(event.target.files?.[0]?.name ?? "")
              }
            />
          </label>
        )}
        {current.inputType === "customerSelect" && (
          <select
            className="select"
            value={String(value)}
            onChange={(event) => setValue(event.target.value)}
          >
            <option value="">Choose a customer</option>
            {workspace.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        )}
        {![
          "select",
          "multiSelect",
          "textarea",
          "upload",
          "customerSelect",
        ].includes(current.inputType) && (
          <input
            className="input"
            type={
              current.inputType === "date"
                ? "date"
                : current.inputType === "number" ||
                    current.inputType === "money" ||
                    current.inputType === "percent"
                  ? "number"
                  : "text"
            }
            value={String(value)}
            onChange={(event) => setValue(event.target.value)}
          />
        )}
        {missing && (
          <div className="builder-validation">
            {current.validationMessage ??
              "Complete this step before continuing."}
          </div>
        )}
        <div className="modal-actions">
          {step < fields.length - 1 ? (
            <Button
              variant="primary"
              disabled={missing}
              onClick={() => setStep(step + 1)}
            >
              Next Step <ArrowRight size={18} />
            </Button>
          ) : (
            <Button variant="primary" disabled={missing} onClick={finish}>
              Open Filled Builder
            </Button>
          )}
          {step > 0 && (
            <Button variant="neutral" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => openHelpRequest(helpHandoffType)}
          >
            Have Start Here Help Instead
          </Button>
        </div>
        <div className="alert alert--info">
          <Eye size={20} />
          <div>
            <strong>Uses the real builder</strong>
            <div className="small">
              Your answers are saved as a guided session and mapped into
              editable builder fields.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
