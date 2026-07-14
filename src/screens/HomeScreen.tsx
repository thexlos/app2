import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  FileCheck2,
  FilePlus2,
  FolderOpen,
  Lightbulb,
  QrCode,
  ReceiptText,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { BusinessSwitcher } from "../components/common/BusinessSwitcher";
import { StatusBadge } from "../components/common/StatusBadge";
import { appBrand } from "../config/brandAssets";
import { useAppState } from "../state/AppState";
import type { ActivityLogItem, SmartSuggestion } from "../types/models";
import businessKitIllustration from "../assets/home/business_kit_illustration.png";

const pendingEstimateStatuses = new Set(["Sent", "Viewed", "Revised"]);
const pendingChangeOrderStatuses = new Set([
  "Draft",
  "Sent",
  "Viewed",
  "Changes Requested",
  "Revised",
]);

const activityIcon = (type: string) => {
  if (type.includes("estimate")) return FileCheck2;
  if (type.includes("invoice")) return ReceiptText;
  if (type.includes("qr")) return QrCode;
  return CheckCircle2;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatItemType = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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
    updateSuggestion,
    openActivity,
    openCustomer,
    openLead,
    openHelpRequestDetail,
    openWorkshopItem,
    openFile,
    openSchedule,
  } = useAppState();
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const setupPercent = Math.min(100, Math.max(0, currentBusiness.setupPercent));
  const setupComplete = setupPercent >= 100;
  const todayKey = new Date().toISOString().slice(0, 10);

  const attentionEstimate = workspace.estimates.find(
    (item) => item.status === "Changes Requested",
  );
  const waitingEstimates = workspace.estimates.filter((estimate) =>
    pendingEstimateStatuses.has(estimate.status),
  );
  const pendingChangeOrders = workspace.changeOrders.filter((changeOrder) =>
    pendingChangeOrderStatuses.has(changeOrder.status),
  );
  const unpaidInvoices = workspace.invoices.filter(
    (invoice) =>
      invoice.status !== "Paid" &&
      (invoice.balanceDue ?? invoice.total - invoice.amountPaid) > 0,
  );
  const outstandingMetric = workspace.dashboardMetrics.find((metric) =>
    metric.label.toLowerCase().includes("outstanding"),
  );
  const outstandingTotal = unpaidInvoices.reduce(
    (sum, invoice) => sum + (invoice.balanceDue ?? invoice.total - invoice.amountPaid),
    0,
  );
  const scheduledToday = workspace.calendarEvents.filter(
    (event) => !event.archived && event.status === "Scheduled" && event.startDate === todayKey,
  ).length;
  const activeSuggestions = workspace.suggestions.filter(
    (suggestion) => !suggestion.status || suggestion.status === "Active",
  );

  const quickActions = [
    {
      label: "Create Estimate",
      icon: FilePlus2,
      tone: "blue",
      action: () => openEstimateBuilder(),
    },
    {
      label: "Create Invoice",
      icon: ReceiptText,
      tone: "purple",
      action: () => openInvoiceBuilder(),
    },
    {
      label: "Add Customer",
      icon: UserRoundPlus,
      tone: "green",
      action: () => setCurrentScreen("add-customer"),
    },
    {
      label: "Calendar & Schedule",
      icon: CalendarDays,
      tone: "orange",
      action: () => setCurrentScreen("calendar"),
    },
    {
      label: "Create QR Code",
      icon: QrCode,
      tone: "pink",
      action: () => openCreateTask("Create QR Code"),
    },
    {
      label: "My Creations",
      icon: FolderOpen,
      tone: "cyan",
      action: () => setCurrentScreen("workshop-library"),
    },
    {
      label: "File Vault",
      icon: FileCheck2,
      tone: "indigo",
      action: () => setCurrentScreen("file-vault"),
    },
    {
      label: "Business Kit",
      icon: CheckCircle2,
      tone: "violet",
      action: () => setCurrentScreen("my-business-kit"),
    },
  ];

  const stats = [
    {
      label: "Estimates waiting",
      value: String(waitingEstimates.length),
      icon: FilePlus2,
      tone: "blue",
      action: () =>
        waitingEstimates[0]
          ? openEstimate(waitingEstimates[0].id)
          : setCurrentScreen("money"),
    },
    {
      label: "Change order pending",
      value: String(pendingChangeOrders.length),
      icon: AlertTriangle,
      tone: "orange",
      action: () =>
        pendingChangeOrders[0]
          ? openEstimate(pendingChangeOrders[0].estimateId)
          : setCurrentScreen("money"),
    },
    {
      label: "Unpaid invoices",
      value: String(unpaidInvoices.length),
      icon: ReceiptText,
      tone: "purple",
      action: () =>
        unpaidInvoices[0]
          ? openInvoice(unpaidInvoices[0].id)
          : setCurrentScreen("money"),
    },
    {
      label: "Outstanding",
      value: outstandingMetric?.value ?? formatCurrency(outstandingTotal),
      icon: CircleDollarSign,
      tone: "green",
      action: () => setCurrentScreen("money"),
    },
  ];

  const recentCreations = useMemo(() => {
    const workshopCards = workspace.workshopItems
      .filter((item) => !item.archived && !item.trashed)
      .slice(0, 1)
      .map((item) => ({
        id: item.id,
        title: item.title,
        meta: `${formatItemType(item.itemType)} · ${item.lastUsedAt ?? item.status}`,
        icon: item.itemType === "qr_code" ? QrCode : FolderOpen,
        tone: "blue",
        action: () => openWorkshopItem(item.id),
      }));
    const estimateCards = workspace.estimates.slice(0, 1).map((estimate) => ({
      id: estimate.id,
      title: `Estimate ${estimate.number}`,
      meta: estimate.updatedAt ? "Recently updated" : estimate.status,
      icon: FilePlus2,
      tone: "purple",
      action: () => openEstimate(estimate.id),
    }));
    const invoiceCards = workspace.invoices.slice(0, 1).map((invoice) => ({
      id: invoice.id,
      title: `Invoice ${invoice.number}`,
      meta: invoice.dueDate ? `Due ${invoice.dueDate}` : invoice.status,
      icon: ReceiptText,
      tone: "green",
      action: () => openInvoice(invoice.id),
    }));
    return [...workshopCards, ...estimateCards, ...invoiceCards].slice(0, 3);
  }, [openEstimate, openInvoice, openWorkshopItem, workspace.estimates, workspace.invoices, workspace.workshopItems]);

  const completeSuggestion = (suggestion: SmartSuggestion) => {
    if (suggestion.relatedRecordType === "estimate" && suggestion.relatedRecordId)
      openEstimate(suggestion.relatedRecordId);
    else if (suggestion.relatedRecordType === "invoice" && suggestion.relatedRecordId)
      openInvoice(suggestion.relatedRecordId);
    else if (suggestion.relatedRecordType === "customer" && suggestion.relatedRecordId)
      openCustomer(suggestion.relatedRecordId);
    else if (suggestion.relatedRecordType === "lead" && suggestion.relatedRecordId)
      openLead(suggestion.relatedRecordId);
    else if (
      suggestion.relatedRecordType === "help_request" &&
      suggestion.relatedRecordId
    )
      openHelpRequestDetail(suggestion.relatedRecordId);
    else if (
      suggestion.relatedRecordType === "workshop_item" &&
      suggestion.relatedRecordId
    )
      openWorkshopItem(suggestion.relatedRecordId);
    else if (suggestion.relatedRecordType === "file" && suggestion.relatedRecordId)
      openFile(suggestion.relatedRecordId);
    else if (suggestion.relatedRecordType === "calendar_event") openSchedule();
    else if (
      suggestion.relatedRecordType?.includes("sync") ||
      suggestion.relatedRecordType?.includes("import") ||
      suggestion.relatedRecordType?.includes("export")
    )
      setCurrentScreen("sync-center");
    else
      setCurrentScreen(
        suggestion.relatedRecordType === "business_profile"
          ? "my-business-kit"
          : "create",
      );
    updateSuggestion(suggestion.id, "Completed");
  };

  return (
    <section className="screen home-screen home-shell">
      <div className="home-content">
        <header className="home-app-header" aria-label="ArmaDesk home">
        <div className="home-brand">
          <img src={appBrand.headerLogoMark} alt="" className="home-brand__logo" />
          <div>
            <strong>{appBrand.productName}</strong>
          </div>
        </div>
        <div className="home-header-actions">
          <button className="home-icon-button" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button className="home-icon-button" aria-label="Profile">
            <UserRound size={20} />
          </button>
        </div>
        </header>

        <div className="home-top-utility-row" aria-label="Home business shortcuts">
          <BusinessSwitcher
            className="home-business-switcher"
            variant="compact"
          />
          <button
            className="home-open-kit-button"
            onClick={() => setCurrentScreen("my-business-kit")}
          >
            <Briefcase size={15} />
            <span>Open Kit</span>
          </button>
          <button
            className={`home-setup-chip${setupComplete ? " home-setup-chip--complete" : ""}`}
            onClick={() => setCurrentScreen("setup")}
            aria-label={
              setupComplete
                ? "Open setup: Setup Complete"
                : `Open setup: Set Up ${setupPercent}% complete`
            }
          >
            {setupComplete ? (
              <>
                <span>Setup Complete</span>
                <CheckCircle2 size={13} />
              </>
            ) : (
              <span>Set Up · {setupPercent}%</span>
            )}
          </button>
        </div>

        <section className={`home-hero${setupComplete ? " home-hero--ready" : ""}`}>
          <div className="home-hero__copy">
            <span className="home-hero__eyebrow">
              {setupComplete ? "Business ready" : "Business Command Desk"}
            </span>
            <h1>Good morning, {currentBusiness.ownerName}</h1>
            <p>
              {setupComplete
                ? "Your workspace is ready. Let’s keep today moving."
                : "Create, store, send, and manage today’s work from one place."}
            </p>
            <button className="home-hero__action" onClick={() => openSchedule()}>
              Review Today <ArrowRight size={14} />
            </button>
          </div>
          <div
            className="home-hero-analytics"
            aria-hidden="true"
            data-testid="home-hero-analytics"
          >
            <span className="home-hero-analytics__badge">
              +{Math.max(1, scheduledToday + waitingEstimates.length)}
            </span>
            <div className="home-hero-analytics__grid">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="home-hero-analytics__bars">
              <i />
              <i />
              <i />
              <i />
            </div>
            <svg viewBox="0 0 120 70" role="presentation">
              <path d="M8 52 L34 42 L55 45 L76 24 L106 12" />
              <circle cx="34" cy="42" r="3.5" />
              <circle cx="76" cy="24" r="3.5" />
              <circle cx="106" cy="12" r="3.5" />
            </svg>
            {setupComplete && (
              <div className="home-hero-analytics__mini">
                <span>{waitingEstimates.length} approvals</span>
                <span>{scheduledToday} today</span>
                <span>{unpaidInvoices.length} unpaid</span>
              </div>
            )}
          </div>
        </section>

        <section className="home-stat-grid" aria-label="Business dashboard stats">
        {stats.map(({ label, value, icon: Icon, tone, action }) => (
          <button
            key={label}
            className={`home-stat-card home-tone-${tone}`}
            onClick={action}
          >
            <span className="home-chip">
              <Icon size={18} />
            </span>
            <strong>{value}</strong>
            <span>{label}</span>
          </button>
        ))}
        </section>

        {attentionEstimate && (
        <button
          className="home-attention-strip"
          onClick={() => openEstimate(attentionEstimate.id)}
        >
          <span className="home-chip home-chip--warning">
            <AlertTriangle size={19} />
          </span>
          <span className="grow">
            <strong>Needs attention</strong>
            <span>Estimate {attentionEstimate.number} needs changes.</span>
          </span>
          <span className="home-link-inline">
            Review now <ArrowRight size={16} />
          </span>
        </button>
        )}

        <section className="home-panel">
        <div className="home-section-header">
          <div>
            <h2>Quick actions</h2>
            <p>Start the most common jobs.</p>
          </div>
          <Button variant="ghost" onClick={() => setCurrentScreen("create")}>
            View all
          </Button>
        </div>
        <div className="home-quick-grid">
          {quickActions.map(({ label, icon: Icon, tone, action }) => (
            <button
              key={label}
              className={`home-action-card home-tone-${tone}`}
              onClick={action}
            >
              <span className="home-chip">
                <Icon size={20} />
              </span>
              <strong>{label}</strong>
            </button>
          ))}
        </div>
        </section>

        <button
        className="home-kit-promo"
        onClick={() => setCurrentScreen("my-business-kit")}
      >
        <img src={businessKitIllustration} alt="" />
        <span className="grow">
          <strong>My Business Kit</strong>
          <span>Your brand, templates, and creations—all in one place.</span>
        </span>
        <span className="home-kit-promo__button">
          Manage Kit <ArrowRight size={16} />
        </span>
        </button>

        <div className="home-collapse-grid">
        <CollapsedHomeSection
          title="Smart suggestions"
          subtitle="Actionable next steps for your business."
          count={activeSuggestions.length}
          icon={Lightbulb}
          open={suggestionsOpen}
          onToggle={() => setSuggestionsOpen((value) => !value)}
        >
          <div className="home-list">
            {activeSuggestions.slice(0, 3).map((suggestion) => (
              <div className="home-list-row" key={suggestion.id}>
                <span className="home-chip home-chip--warning">
                  <Lightbulb size={18} />
                </span>
                <span className="grow">
                  <strong>{suggestion.message}</strong>
                  <small>Dismiss anytime or open the related area.</small>
                </span>
                <span className="home-row-actions">
                  <Button variant="ghost" onClick={() => completeSuggestion(suggestion)}>
                    {suggestion.actionLabel}
                  </Button>
                  <button onClick={() => updateSuggestion(suggestion.id, "Snoozed")}>
                    Later
                  </button>
                  <button onClick={() => updateSuggestion(suggestion.id, "Dismissed")}>
                    Dismiss
                  </button>
                </span>
              </div>
            ))}
          </div>
        </CollapsedHomeSection>

        <CollapsedHomeSection
          title="Recent activity"
          subtitle="Latest updates and saved actions."
          count={workspace.activity.length}
          icon={Activity}
          open={activityOpen}
          onToggle={() => setActivityOpen((value) => !value)}
        >
          <div className="home-list">
            {workspace.activity.slice(0, 5).map((item) => (
              <RecentActivityRow
                key={item.id}
                item={item}
                onOpen={() => openActivity(item.id)}
              />
            ))}
          </div>
        </CollapsedHomeSection>
        </div>

        {recentCreations.length > 0 && (
        <section className="home-panel home-recent-creations">
          <div className="home-section-header home-section-header--inline">
            <h2>Recent creations</h2>
            <Button variant="ghost" onClick={() => setCurrentScreen("workshop-library")}>
              View all
            </Button>
          </div>
          <div className="home-creations-row">
            {recentCreations.map(({ id, title, meta, icon: Icon, tone, action }) => (
              <button
                key={id}
                className={`home-creation-card home-tone-${tone}`}
                onClick={action}
              >
                <span className="home-chip">
                  <Icon size={18} />
                </span>
                <strong>{title}</strong>
                <span>{meta}</span>
              </button>
            ))}
            <button
              className="home-creation-card home-creation-card--more"
              onClick={() => setCurrentScreen("workshop-library")}
            >
              <span className="home-chip">
                <ChevronDown size={18} />
              </span>
              <strong>More</strong>
              <span>Open My Creations</span>
            </button>
          </div>
        </section>
        )}
      </div>
    </section>
  );
}

function CollapsedHomeSection({
  title,
  subtitle,
  count,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  icon: typeof Activity;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className={`home-collapsible${open ? " home-collapsible--open" : ""}`}>
      <button className="home-collapsible__summary" onClick={onToggle}>
        <span className="home-chip">
          <Icon size={19} />
        </span>
        <span className="grow">
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </span>
        <span className="home-count-badge">{count}</span>
        <ArrowRight className="home-collapse-arrow" size={18} />
      </button>
      {open && <div className="home-collapsible__content">{children}</div>}
    </section>
  );
}

function RecentActivityRow({
  item,
  onOpen,
}: {
  item: ActivityLogItem;
  onOpen: () => void;
}) {
  const Icon = activityIcon(item.type);
  return (
    <button className="home-list-row home-activity-row" onClick={onOpen}>
      <span className={`home-chip home-chip--${item.tone}`}>
        <Icon size={18} />
      </span>
      <span className="grow">
        <strong>{item.label}</strong>
        <small>{item.detail}</small>
      </span>
      <span className="home-activity-meta">
        <StatusBadge tone={item.tone}>
          {item.tone === "success"
            ? "Done"
            : item.tone === "warning"
              ? "Review"
              : "Saved"}
        </StatusBadge>
        <small>{item.occurredAt}</small>
      </span>
    </button>
  );
}
