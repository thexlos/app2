import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Brush,
  CheckCircle2,
  FileCheck2,
  FilePlus2,
  HelpCircle,
  Lightbulb,
  Megaphone,
  QrCode,
  ReceiptText,
  Send,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";
import { BusinessSwitcher } from "../components/common/BusinessSwitcher";

const activityIcon = (type: string) => {
  if (type.includes("estimate")) return FileCheck2;
  if (type.includes("invoice")) return ReceiptText;
  if (type.includes("promo")) return Megaphone;
  if (type.includes("qr")) return QrCode;
  return CheckCircle2;
};

export function HomeScreen() {
  const {
    currentBusiness,
    workspace,
    setCurrentScreen,
    openEstimate,
    openInvoice,
    openEstimateBuilder,
    openInvoiceBuilder,
    openCreateTask,
    openHelpRequest,
    updateSuggestion,
    openActivity,
  } = useAppState();
  const attentionEstimate = workspace.estimates.find(
    (item) => item.status === "Changes Requested",
  );
  const quickActions = [
    {
      label: "Create Estimate",
      icon: FilePlus2,
      action: () => openEstimateBuilder(),
    },
    {
      label: "Create Invoice",
      icon: WalletCards,
      action: () => openInvoiceBuilder(),
    },
    {
      label: "Add Customer",
      icon: UsersRound,
      action: () => setCurrentScreen("add-customer"),
    },
    {
      label: "Create Post",
      icon: Megaphone,
      action: () => openCreateTask("Create Post"),
    },
    {
      label: "Create QR Code",
      icon: QrCode,
      action: () => openCreateTask("Create QR Code"),
    },
    {
      label: "Make a Flyer",
      icon: Brush,
      action: () => openCreateTask("Make a Flyer"),
    },
    {
      label: "Send Promotion",
      icon: Send,
      action: () => openCreateTask("Send Promotion"),
    },
    {
      label: "Request Help",
      icon: HelpCircle,
      action: () => openHelpRequest(),
    },
  ];

  return (
    <section className="screen">
      <BusinessSwitcher />
      <div className="home-greeting">
        <div>
          <h1 className="page-title">
            Good morning, {currentBusiness.ownerName}.
          </h1>
          <p className="page-subtitle">What do you want to do today?</p>
        </div>
        <button
          className="setup-ring"
          aria-label={`Business setup ${currentBusiness.setupPercent}% complete`}
          onClick={() => setCurrentScreen("setup")}
        >
          <strong>{currentBusiness.setupPercent}%</strong>
          <span>set up</span>
        </button>
      </div>

      <div className="card card--soft panel setup-card">
        <div>
          <strong>
            Your business is {currentBusiness.setupPercent}% ready
          </strong>
          <p className="section-copy">
            Finish a few steps so your documents and tools fill in
            automatically.
          </p>
        </div>
        <Button variant="primary" onClick={() => setCurrentScreen("setup")}>
          Continue setup <ArrowRight size={18} />
        </Button>
      </div>

      <div className="summary-strip" aria-label="Today at a glance">
        {workspace.dashboardMetrics.map((metric) => (
          <div key={metric.id}>
            <strong className={`${metric.tone}-text`}>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      {attentionEstimate && (
        <button
          className="alert alert--warning attention-alert"
          onClick={() => openEstimate(attentionEstimate.id)}
        >
          <AlertTriangle size={23} />
          <span className="grow">
            <strong>Estimate {attentionEstimate.number} needs changes</strong>
            <span>Customer notes are saved with the version.</span>
          </span>
          <ArrowRight size={19} />
        </button>
      )}

      <section className="section">
        <div className="between">
          <div>
            <h2 className="section-heading">Quick actions</h2>
            <p className="section-copy">Start the most common jobs.</p>
          </div>
          <Button variant="ghost" onClick={() => setCurrentScreen("create")}>
            View all
          </Button>
        </div>
        <div className="quick-actions">
          {quickActions.map(({ label, icon: Icon, action }) => (
            <button key={label} onClick={action}>
              <span className="icon-box">
                <Icon size={21} />
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        className="kit-banner"
        onClick={() => setCurrentScreen("my-business-kit")}
      >
        <span className="icon-box">
          <BookOpenCheck size={22} />
        </span>
        <span className="grow">
          <strong>My Business Kit</strong>
          <small>
            Your saved brand, items, document templates, and creations for{" "}
            {currentBusiness.name}.
          </small>
        </span>
        <ArrowRight size={19} />
      </button>

      <section className="section">
        <h2 className="section-heading">Smart suggestions</h2>
        <p className="section-copy">
          Simple next steps based on this business’s mock activity.
        </p>
        <div className="list">
          {workspace.suggestions
            .filter(
              (suggestion) =>
                !suggestion.status || suggestion.status === "Active",
            )
            .map((suggestion) => (
              <div className="list-row" key={suggestion.id}>
                <span className="icon-box icon-box--warning">
                  <Lightbulb size={20} />
                </span>
                <span className="grow">
                  <strong>{suggestion.message}</strong>
                  <span
                    className="muted small"
                    style={{ display: "block", marginTop: 5 }}
                  >
                    Dismiss anytime or open the related area.
                  </span>
                </span>
                <span className="suggestion-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (
                        suggestion.relatedRecordType === "estimate" &&
                        suggestion.relatedRecordId
                      )
                        openEstimate(suggestion.relatedRecordId);
                      else if (
                        suggestion.relatedRecordType === "invoice" &&
                        suggestion.relatedRecordId
                      )
                        openInvoice(suggestion.relatedRecordId);
                      else
                        setCurrentScreen(
                          suggestion.relatedRecordType === "business_profile"
                            ? "my-business-kit"
                            : "create",
                        );
                      updateSuggestion(suggestion.id, "Completed");
                    }}
                  >
                    {suggestion.actionLabel}
                  </Button>
                  <button
                    onClick={() => updateSuggestion(suggestion.id, "Snoozed")}
                  >
                    Later
                  </button>
                  <button
                    onClick={() => updateSuggestion(suggestion.id, "Dismissed")}
                  >
                    Dismiss
                  </button>
                </span>
              </div>
            ))}
        </div>
      </section>

      <section className="section">
        <div className="between">
          <div>
            <h2 className="section-heading">Recent activity</h2>
            <p className="section-copy">
              Important actions stay saved for reference.
            </p>
          </div>
        </div>
        <div className="list">
          {workspace.activity.slice(0, 5).map((item) => {
            const Icon = activityIcon(item.type);
            return (
              <button
                className="list-row activity-row"
                key={item.id}
                onClick={() => openActivity(item.id)}
              >
                <span className={`icon-box icon-box--${item.tone}`}>
                  <Icon size={20} />
                </span>
                <span className="grow">
                  <strong className="truncate" style={{ display: "block" }}>
                    {item.label}
                  </strong>
                  <span
                    className="muted small truncate"
                    style={{ display: "block" }}
                  >
                    {item.detail}
                  </span>
                </span>
                <span style={{ display: "grid", justifyItems: "end", gap: 6 }}>
                  <StatusBadge tone={item.tone}>
                    {item.tone === "success"
                      ? "Done"
                      : item.tone === "warning"
                        ? "Review"
                        : "Saved"}
                  </StatusBadge>
                  <small className="muted">{item.occurredAt}</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <Button
        className="section"
        variant="outline"
        wide
        onClick={() => setCurrentScreen("calendar")}
      >
        View Calendar &amp; Schedule
      </Button>
    </section>
  );
}
