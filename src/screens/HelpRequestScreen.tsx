import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  LockKeyhole,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { helpServices } from "../config/helpCatalog";
import { useAppState } from "../state/AppState";
import type { HelpServiceQuestion } from "../types/models";

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: HelpServiceQuestion;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}) {
  if (question.inputType === "multiSelect")
    return (
      <fieldset className="help-question">
        <legend>
          {question.questionText}
          {question.required && " *"}
        </legend>
        {question.helperText && <small>{question.helperText}</small>}
        <div className="help-choice-grid">
          {question.options?.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={Array.isArray(value) && value.includes(option)}
                onChange={(event) => {
                  const current = Array.isArray(value) ? value : [];
                  onChange(
                    event.target.checked
                      ? [...current, option]
                      : current.filter((item) => item !== option),
                  );
                }}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  if (question.inputType === "select")
    return (
      <div className="field">
        <label>
          {question.questionText}
          {question.required && " *"}
        </label>
        {question.helperText && <small>{question.helperText}</small>}
        <select
          className="select"
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Choose one</option>
          {question.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  if (question.inputType === "toggle")
    return (
      <label className="help-toggle">
        <input
          type="checkbox"
          checked={value === "Yes"}
          onChange={(event) => onChange(event.target.checked ? "Yes" : "No")}
        />
        {question.questionText}
      </label>
    );
  if (question.inputType === "textarea")
    return (
      <div className="field">
        <label>
          {question.questionText}
          {question.required && " *"}
        </label>
        {question.helperText && <small>{question.helperText}</small>}
        <textarea
          className="textarea"
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  return (
    <div className="field">
      <label>
        {question.questionText}
        {question.required && " *"}
      </label>
      {question.helperText && <small>{question.helperText}</small>}
      <input
        className="input"
        type={
          question.inputType === "date"
            ? "date"
            : question.inputType === "link"
              ? "url"
              : "text"
        }
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function HelpRequestScreen() {
  const {
    selectedHelpService,
    submitHelpRequest,
    openHelpRequestDetail,
    setCurrentScreen,
  } = useAppState();
  const service = useMemo(
    () => helpServices.find((item) => item.serviceKey === selectedHelpService),
    [selectedHelpService],
  );
  const [stage, setStage] = useState<"detail" | "form" | "submitted">(
    service ? "detail" : "form",
  );
  const [genericServiceKey, setGenericServiceKey] = useState(
    service?.serviceKey ?? "",
  );
  const activeService =
    service ??
    helpServices.find((item) => item.serviceKey === genericServiceKey);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [description, setDescription] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [submittedId, setSubmittedId] = useState<string>();
  const [error, setError] = useState("");
  useEffect(() => {
    setStage(service ? "detail" : "form");
    setGenericServiceKey(service?.serviceKey ?? "");
    setAnswers({});
    setError("");
  }, [service]);
  const submit = () => {
    const questions = activeService?.serviceQuestions ?? [];
    const missing = questions.find(
      (question) =>
        question.required &&
        (!answers[question.fieldKey] ||
          (Array.isArray(answers[question.fieldKey]) &&
            !(answers[question.fieldKey] as string[]).length)),
    );
    if (missing) {
      setError(`Please answer: ${missing.questionText}`);
      return;
    }
    if (!activeService && !description.trim()) {
      setError("Describe what you need help with.");
      return;
    }
    const id = submitHelpRequest({
      type: activeService?.title ?? "General Help",
      serviceKey: activeService?.serviceKey ?? "general",
      serviceLevel: "Start Here Service Request",
      description: description || `${activeService?.title} request`,
      fileNames,
      selectedServicePriceText: activeService?.startingPriceText,
      serviceAnswers: answers,
    });
    setSubmittedId(id);
    setStage("submitted");
  };
  if (stage === "detail" && activeService)
    return (
      <section className="screen screen--detail">
        <DetailHeader title={activeService.title} backTo="help" />
        <section className="help-service-detail section">
          <span className="icon-box">
            <Wrench size={24} />
          </span>
          <h1>{activeService.title}</h1>
          <p>{activeService.longDescription}</p>
          <div className="help-price-line">
            <strong>Starting {activeService.startingPriceText}</strong>
            <span>Final price is confirmed before larger work starts.</span>
          </div>
          <div className="help-detail-grid">
            <div>
              <h2>What to share</h2>
              {activeService.requiredUploads.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
            <div>
              <h2>What happens next</h2>
              {activeService.whatHappensNext.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary" onClick={() => setStage("form")}>
              Start Request <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" onClick={() => setCurrentScreen("help")}>
              Back
            </Button>
          </div>
        </section>
      </section>
    );
  if (stage === "submitted")
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Request submitted" backTo="help" />
        <div className="guided-step section">
          <span>Request submitted for review</span>
          <div className="icon-box icon-box--success">
            <CheckCircle2 size={23} />
          </div>
          <h1>Start Here will review this.</h1>
          <p>
            Your answers and files were saved with this request. If it needs a
            quote, you will see it before work starts.
          </p>
          <Button
            variant="primary"
            wide
            onClick={() => submittedId && openHelpRequestDetail(submittedId)}
          >
            View Request
          </Button>
          <Button variant="outline" wide onClick={() => setStage("form")}>
            Upload More Files
          </Button>
          <Button
            variant="neutral"
            wide
            onClick={() => setCurrentScreen("file-vault")}
          >
            Open File Vault
          </Button>
          <Button variant="ghost" wide onClick={() => setCurrentScreen("help")}>
            Back to Help
          </Button>
        </div>
      </section>
    );
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Start a Help Request" backTo="help" />
      <div className="section">
        <h1 className="page-title">
          {activeService?.title ?? "What do you need help with?"}
        </h1>
        <p className="page-subtitle">
          The questions below match this service. Upload files, screenshots, or
          share links—never passwords.
        </p>
      </div>
      <section className="card panel section help-request-form">
        {!service && (
          <div className="field">
            <label>Choose a service, optional</label>
            <select
              className="select"
              value={genericServiceKey}
              onChange={(event) => {
                setGenericServiceKey(event.target.value);
                setAnswers({});
              }}
            >
              <option value="">General / Other / Not sure</option>
              {helpServices.map((item) => (
                <option value={item.serviceKey} key={item.serviceKey}>
                  {item.title} · {item.startingPriceText}
                </option>
              ))}
            </select>
          </div>
        )}
        {activeService?.serviceQuestions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            value={answers[question.fieldKey]}
            onChange={(value) => {
              setAnswers((current) => ({
                ...current,
                [question.fieldKey]: value,
              }));
              setError("");
            }}
          />
        ))}
        <div className="upload-zone">
          <FileUp size={27} />
          <strong>Upload files or screenshots</strong>
          <span>
            {activeService?.acceptedFileTypes.join(", ") ??
              "Images, PDFs, screenshots, or notes"}
          </span>
          <label className="btn btn--outline">
            Choose files
            <input
              type="file"
              multiple
              hidden
              onChange={(event) =>
                setFileNames(
                  Array.from(event.target.files ?? []).map((file) => file.name),
                )
              }
            />
          </label>
          {fileNames.length > 0 && <small>{fileNames.join(", ")}</small>}
        </div>
        <div className="field">
          <label>Anything else Start Here should know?</label>
          <textarea
            className="textarea"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
            }}
            placeholder="Add context, project details, or the result you want."
          />
        </div>
        {activeService && (
          <div className="alert alert--info">
            <Wrench size={21} />
            <div>
              <strong>Starting {activeService.startingPriceText}</strong>
              <div className="small">
                Nothing larger begins until the work and price are clear.
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert--danger" role="alert">
            <strong>{error}</strong>
          </div>
        )}
        <Button variant="primary" wide onClick={submit}>
          Submit for Review <ArrowRight size={18} />
        </Button>
        <div className="helper-access">
          <LockKeyhole size={21} />
          <div>
            <strong>Helper Access</strong>
            <p>
              Use files, screenshots, share links, and project access inside
              ArmaDesk. Never share account passwords.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
