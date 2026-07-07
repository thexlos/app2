import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  FolderOpen,
  HelpCircle,
  LockKeyhole,
  MessageSquareText,
  Upload,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { guideResources, monthlySupportPlans } from "../config/helpCatalog";
import { useAppState } from "../state/AppState";
import type { HelpRequest } from "../types/models";

const actionsFor = (request: HelpRequest) => {
  if (request.status === "Quote Sent")
    return ["View Quote", "Approve Quote", "Ask Question", "Decline Quote"];
  if (request.status === "Waiting for Payment")
    return ["View Payment Instructions", "Mark Payment Sent"];
  if (request.status === "In Progress")
    return ["Add Note", "Upload More Files"];
  if (
    request.status === "Needs Your Info" ||
    request.status === "Needs Customer Info"
  )
    return ["Add Requested Info", "Upload Files", "Reply"];
  if (request.status === "Ready for Review")
    return ["Preview Final Files", "Approve", "Request Revision"];
  if (request.status === "Completed")
    return [
      "Download Final Files",
      "Save to My Business Kit",
      "Save to File Vault",
      "Use in Create",
      "Request Another Change",
    ];
  return ["View Request", "Upload More Files", "Add Note"];
};

export function HelpRequestDetailScreen() {
  const {
    workspace,
    selectedHelpRequestId,
    setCurrentScreen,
    openHelpRequest,
    handleHelpRequestAction,
  } = useAppState();
  const [message, setMessage] = useState("");
  const request = workspace.helpRequests.find(
    (item) => item.id === selectedHelpRequestId,
  );
  if (!request)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Help request" backTo="help" />
        <p>Request not found for this business.</p>
      </section>
    );
  const timeline = request.timeline ?? [
    {
      id: `${request.id}-submitted`,
      helpRequestId: request.id,
      type: "submitted",
      title: "Request submitted",
      createdAt: request.updatedAt ?? "2026-07-06T12:00:00.000Z",
      createdBy: "User",
    },
  ];
  return (
    <section className="screen screen--detail">
      <DetailHeader title={request.type} backTo="help" />
      <div className="help-request-detail-hero section">
        <div>
          <StatusBadge tone={statusTone(request.status)}>
            {request.status}
          </StatusBadge>
          <h1>{request.type}</h1>
          <p>{request.description}</p>
        </div>
        <span className="icon-box">
          <HelpCircle size={24} />
        </span>
      </div>
      {message && (
        <div className="alert alert--success section">
          <CheckCircle2 size={20} />
          <strong>{message}</strong>
        </div>
      )}
      <div className="help-detail-columns section">
        <section className="card panel">
          <h2>Request details</h2>
          <dl className="help-detail-list">
            <div>
              <dt>Service</dt>
              <dd>{request.type}</dd>
            </div>
            <div>
              <dt>Starting price</dt>
              <dd>{request.selectedServicePriceText ?? "Review first"}</dd>
            </div>
            <div>
              <dt>Files</dt>
              <dd>{request.fileNames.length}</dd>
            </div>
            <div>
              <dt>Quote</dt>
              <dd>{request.quoteStatus ?? "Waiting Review"}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>{request.paymentStatus ?? "Not required yet"}</dd>
            </div>
            <div>
              <dt>Related record</dt>
              <dd>
                {request.attachedProjectId ??
                  request.attachedCustomerId ??
                  request.attachedEstimateId ??
                  "Not linked"}
              </dd>
            </div>
            <div>
              <dt>Final files</dt>
              <dd>{request.finalFileIds?.length ?? 0}</dd>
            </div>
          </dl>
          {request.serviceAnswers && (
            <div className="help-answers">
              <h3>Your answers</h3>
              {Object.entries(request.serviceAnswers).map(([key, value]) => (
                <div key={key}>
                  <strong>{key.replaceAll(/([A-Z])/g, " $1")}</strong>
                  <span>{Array.isArray(value) ? value.join(", ") : value}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="card panel">
          <h2>Files</h2>
          {request.fileNames.length ? (
            request.fileNames.map((file) => (
              <div className="help-file-row" key={file}>
                <FileText size={18} />
                <span>{file}</span>
                <Button variant="ghost">Open</Button>
              </div>
            ))
          ) : (
            <div className="help-empty">
              <FolderOpen />
              <p>No files uploaded yet.</p>
            </div>
          )}
          <Button
            variant="outline"
            icon={<Upload size={17} />}
            onClick={() =>
              setMessage(
                "Upload is ready. New files will be saved to this request and File Vault.",
              )
            }
          >
            Upload More Files
          </Button>
        </section>
      </div>
      {request.quoteStatus === "Quote Sent" && (
        <section className="help-quote-card section">
          <div>
            <span>Start Here quote</span>
            <strong>
              {request.quoteAmount ? `$${request.quoteAmount}` : "Quote ready"}
            </strong>
            <p>The included work and turnaround are saved with this request.</p>
          </div>
          <Button variant="primary">View Quote</Button>
        </section>
      )}
      <section className="section">
        <h2 className="section-heading">Next actions</h2>
        <div className="help-next-actions">
          {actionsFor(request).map((action) => (
            <Button
              key={action}
              variant={
                action === "Approve" || action === "Approve Quote"
                  ? "primary"
                  : "outline"
              }
              onClick={() => {
                if (action === "Request Another Change") {
                  openHelpRequest(request.serviceKey);
                  return;
                }
                handleHelpRequestAction(request.id, action);
                if (action === "Use in Create")
                  setCurrentScreen("workshop-library");
                else if (action === "Save to File Vault")
                  setCurrentScreen("file-vault");
                else if (action === "Save to My Business Kit")
                  setCurrentScreen("my-business-kit");
                else setMessage(`${action} recorded for this help project.`);
              }}
            >
              {action}
            </Button>
          ))}
        </div>
      </section>
      <section className="section">
        <h2 className="section-heading">Timeline</h2>
        <div className="help-timeline">
          {timeline.map((item) => (
            <div key={item.id}>
              <span>
                <Clock3 size={16} />
              </span>
              <div>
                <strong>{item.title}</strong>
                {item.message && <p>{item.message}</p>}
                <small>
                  {new Date(item.createdAt).toLocaleString()} · {item.createdBy}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <h2 className="section-heading">Messages</h2>
        <div className="card panel">
          {request.messages?.map((item) => (
            <div className="help-message" key={item.id}>
              <MessageSquareText size={18} />
              <div>
                <strong>{item.senderType}</strong>
                <p>{item.message}</p>
              </div>
            </div>
          )) ?? <p className="muted">Messages will appear here.</p>}
          <Button
            variant="outline"
            onClick={() =>
              setMessage("Message composer opened for this request.")
            }
          >
            Add Note or Question
          </Button>
        </div>
      </section>
    </section>
  );
}

export function MonthlySupportScreen() {
  const { openHelpRequest, submitHelpRequest, openHelpRequestDetail } =
    useAppState();
  const [compare, setCompare] = useState(false);
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Monthly Support" backTo="help" />
      <div className="section">
        <h1 className="page-title">Keep Start Here available.</h1>
        <p className="page-subtitle">
          Ongoing help for small fixes, setup questions, reusable materials, and
          business tools.
        </p>
      </div>
      <div className="support-plan-grid section">
        {monthlySupportPlans.map((plan) => (
          <article className="support-plan" key={plan.id}>
            <div>
              <h2>{plan.title}</h2>
              <strong>
                ${plan.monthlyPrice}
                <span>/month</span>
              </strong>
              <p>{plan.shortDescription}</p>
            </div>
            <div>
              <small>Best for</small>
              <p>{plan.bestFor}</p>
            </div>
            <ul>
              {plan.includedServices.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  {item}
                </li>
              ))}
            </ul>
            {compare && (
              <div className="support-not-included">
                <strong>Not included</strong>
                {plan.notIncluded.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            )}
            <Button
              variant="primary"
              wide
              onClick={() => {
                const id = submitHelpRequest({
                  type: plan.title,
                  serviceKey: "monthly_support",
                  serviceLevel: "Monthly Support",
                  description: `Request ${plan.title} at $${plan.monthlyPrice}/month`,
                  fileNames: [],
                  selectedServicePriceText: `$${plan.monthlyPrice}/month`,
                  serviceAnswers: { plan: plan.title },
                });
                openHelpRequestDetail(id);
              }}
            >
              Request This Plan
            </Button>
            <Button
              variant="outline"
              wide
              onClick={() => openHelpRequest("general")}
            >
              Ask a Question
            </Button>
          </article>
        ))}
      </div>
      <Button
        className="section"
        variant="neutral"
        wide
        onClick={() => setCompare(!compare)}
      >
        {compare ? "Hide Comparison" : "Compare Plans"}
      </Button>
    </section>
  );
}

export function HelpGuideScreen() {
  const {
    selectedGuideKey,
    setCurrentScreen,
    openEstimateBuilder,
    openHelpRequest,
    openCreateTask,
  } = useAppState();
  const guide =
    guideResources.find((item) => item.guideKey === selectedGuideKey) ??
    guideResources[0];
  const run = (action: string) => {
    if (action === "Create Estimate") return openEstimateBuilder();
    if (action.includes("QR Code")) return openCreateTask("Create QR Code");
    if (action.includes("My Business Kit"))
      return setCurrentScreen("my-business-kit");
    if (action.includes("Business Kit"))
      return setCurrentScreen("business-kits");
    if (action.includes("File Vault")) return setCurrentScreen("file-vault");
    if (action.includes("Money") || action.includes("Invoice"))
      return setCurrentScreen("money");
    if (action.includes("Customer")) return setCurrentScreen("customers");
    if (action.includes("Setup")) return setCurrentScreen("setup");
    return setCurrentScreen("create");
  };
  return (
    <section className="screen screen--detail">
      <DetailHeader title={guide.title} backTo="help" />
      <div className="guide-detail-hero section">
        <BookOpenIcon />
        <h1>{guide.title}</h1>
        <p>{guide.shortDescription}</p>
      </div>
      <div className="guide-section-list section">
        {guide.sections.map((section) => (
          <section key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.checklist && (
              <ol>
                {section.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </div>
      <section className="section">
        <h2 className="section-heading">Related actions</h2>
        <div className="help-next-actions">
          {guide.relatedActions.map((action) => (
            <Button key={action} variant="outline" onClick={() => run(action)}>
              {action}
              <ArrowRight size={16} />
            </Button>
          ))}
        </div>
        <Button
          className="section"
          variant="primary"
          wide
          onClick={() =>
            openHelpRequest(guide.relatedHelpServiceKey ?? "general")
          }
        >
          Request Start Here Help
        </Button>
      </section>
    </section>
  );
}

function BookOpenIcon() {
  return (
    <span className="icon-box">
      <FileText size={24} />
    </span>
  );
}
