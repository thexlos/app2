import {
  Check,
  Download,
  FileText,
  LockKeyhole,
  MessageSquareWarning,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { downloadEstimatePdf } from "../services/export/officialDocumentPdf";
import { useAppState } from "../state/AppState";

export function PublicApprovalPage({ token }: { token: string }) {
  const { workspace, currentBusiness, respondToEstimate } = useAppState();
  const estimate = useMemo(
    () => workspace.estimates.find((item) => item.approvalToken === token),
    [workspace.estimates, token],
  );
  const [action, setAction] = useState<
    "approve" | "reject" | "request-changes" | null
  >(null);
  const [note, setNote] = useState("");
  const [approvalName, setApprovalName] = useState("");
  const [approvalChecked, setApprovalChecked] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  if (!estimate)
    return (
      <main className="public-page">
        <section className="public-card">
          <h1>Link not available</h1>
          <p>
            This customer link is invalid or belongs to another business. Ask
            the business for a new secure link.
          </p>
        </section>
      </main>
    );
  const customer = workspace.customers.find(
    (item) => item.id === estimate.customerId,
  );
  const submit = () => {
    if (!action) return;
    if (
      action === "approve" &&
      (((estimate.approvalSettings?.requireTypedName ?? true) &&
        !approvalName.trim()) ||
        ((estimate.approvalSettings?.requireCheckbox ??
          estimate.deliverySettings?.requireApprovalCheckbox ??
          true) &&
          !approvalChecked))
    ) {
      setError(
        "Enter your name and confirm that you approve the estimate and terms.",
      );
      return;
    }
    const saved = respondToEstimate(estimate.id, action, note);
    if (!saved) {
      setError(
        "Please leave a note so the business knows why or what needs to change.",
      );
      return;
    }
    setComplete(true);
  };
  return (
    <main className="public-page">
      <section className="public-card approval-card">
        <header className="between">
          <div className="row">
            <div
              className="icon-box"
              style={{
                color: "white",
                background: currentBusiness.brandKit.primaryColor,
                fontWeight: 850,
              }}
            >
              {currentBusiness.initials}
            </div>
            <div>
              <strong>{currentBusiness.name}</strong>
              <div className="muted small">Secure customer approval</div>
            </div>
          </div>
          <ShieldCheck color="var(--color-success)" />
        </header>
        <div className="approval-heading">
          <StatusBadge tone={statusTone(estimate.status)}>
            {estimate.status}
          </StatusBadge>
          <h1>Estimate {estimate.number}</h1>
          <p>
            {estimate.projectName} · {customer?.name}
          </p>
        </div>
        <section className="approval-total">
          <span>Total estimate</span>
          <strong>
            $
            {estimate.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </strong>
          <small>
            Sent{" "}
            {new Date(estimate.versions[0]?.createdAt).toLocaleDateString()}
          </small>
        </section>
        <section className="approval-message">
          <strong>A message from {currentBusiness.name}</strong>
          <p>{estimate.deliverySettings?.emailMessage}</p>
        </section>
        <section className="approval-summary">
          <h2>Project summary</h2>
          <p>{estimate.deliverySettings?.clientSummary}</p>
          <ul>
            <li>
              {
                estimate.lineItems.filter((item) => item.visibleToCustomer)
                  .length
              }{" "}
              customer-visible line items
            </li>
            <li>
              Official terms and itemized details are in the full document
            </li>
          </ul>
        </section>
        <div className="approval-document-actions">
          <Button
            variant="primary"
            wide
            icon={<FileText size={18} />}
            onClick={() => {
              window.location.hash = `/document/${token}`;
            }}
          >
            {estimate.deliverySettings?.reviewButtonLabel ??
              "Review Full Document"}
          </Button>
          {(estimate.approvalSettings?.allowPdfDownload ??
            estimate.deliverySettings?.allowPdfDownload) && (
            <Button
              variant="outline"
              wide
              icon={<Download size={18} />}
              onClick={() =>
                downloadEstimatePdf(estimate, currentBusiness, customer)
              }
            >
              {estimate.deliverySettings?.downloadButtonLabel ?? "Download PDF"}
            </Button>
          )}
        </div>
        <div className="alert alert--info section">
          <LockKeyhole size={21} />
          <div>
            <strong>No account required</strong>
            <div className="small">
              Internal notes, costs, profit, supplier notes, and hidden fields
              are not shown.
            </div>
          </div>
        </div>
        {complete ? (
          <div className="alert alert--success section">
            <Check />
            <div>
              <strong>Thank you. Your response was saved.</strong>
              <div className="small">
                The exact approval view, official document version, response,
                notes, date, and version are preserved.
              </div>
            </div>
          </div>
        ) : estimate.status === "Accepted" ? (
          <div className="alert alert--success section">
            <Check />
            <div>
              <strong>This version was accepted.</strong>
              <div className="small">
                The approved view and official document are protected from
                silent edits.
              </div>
            </div>
          </div>
        ) : (
          <>
            <section className="section">
              <h2 className="section-heading">Your response</h2>
              <p className="section-copy">
                Approve, reject, or request changes.
              </p>
              <div className="public-actions">
                {(estimate.approvalSettings?.allowApprove ?? true) && (
                  <button
                    className={action === "approve" ? "selected" : ""}
                    onClick={() => {
                      setAction("approve");
                      setError("");
                    }}
                  >
                    <Check />
                    Approve
                  </button>
                )}
                {(estimate.approvalSettings?.allowRequestChanges ??
                  estimate.deliverySettings?.allowChanges) && (
                  <button
                    className={action === "request-changes" ? "selected" : ""}
                    onClick={() => {
                      setAction("request-changes");
                      setError("");
                    }}
                  >
                    <MessageSquareWarning />
                    Request Changes
                  </button>
                )}
                {(estimate.approvalSettings?.allowReject ??
                  estimate.deliverySettings?.allowReject) && (
                  <button
                    className={action === "reject" ? "selected danger" : ""}
                    onClick={() => {
                      setAction("reject");
                      setError("");
                    }}
                  >
                    <X />
                    Reject
                  </button>
                )}
              </div>
            </section>
            <div className="field section">
              <label htmlFor="customer-note">
                Notes for the business{" "}
                {action === "reject" || action === "request-changes"
                  ? "(required)"
                  : "(optional)"}
              </label>
              <textarea
                id="customer-note"
                className="textarea"
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  setError("");
                }}
                placeholder="Add a note, question, rejection reason, or requested change"
              />
            </div>
            {action === "approve" && (
              <div className="stack section">
                {(estimate.approvalSettings?.requireTypedName ?? true) && (
                  <div className="field">
                    <label htmlFor="approval-name">Your name</label>
                    <input
                      id="approval-name"
                      className="input"
                      value={approvalName}
                      onChange={(event) => {
                        setApprovalName(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                )}
                {(estimate.approvalSettings?.requireCheckbox ??
                  estimate.deliverySettings?.requireApprovalCheckbox) && (
                  <label className="row" style={{ alignItems: "flex-start" }}>
                    <input
                      type="checkbox"
                      style={{
                        width: 20,
                        height: 20,
                        accentColor: "var(--color-primary)",
                      }}
                      checked={approvalChecked}
                      onChange={(event) => {
                        setApprovalChecked(event.target.checked);
                        setError("");
                      }}
                    />
                    <span>
                      I approve this estimate and understand the terms.
                    </span>
                  </label>
                )}
              </div>
            )}
            {error && (
              <p
                role="alert"
                style={{ color: "var(--color-danger)", fontSize: ".85rem" }}
              >
                {error}
              </p>
            )}
            <Button
              className="section"
              variant="primary"
              wide
              disabled={!action}
              onClick={submit}
            >
              Submit Response
            </Button>
          </>
        )}
        <p className="muted small approval-contact">
          Questions? Contact {currentBusiness.name} at {currentBusiness.phone}.
        </p>
        <button
          className="btn btn--ghost btn--wide"
          onClick={() => {
            window.location.hash = "";
          }}
        >
          Return to app demo
        </button>
      </section>
    </main>
  );
}
