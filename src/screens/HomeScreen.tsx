import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  CalendarClock,
  ClipboardCheck,
  FilePlus2,
  MapPin,
  QrCode,
  ReceiptText,
  Star,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { BusinessSwitcher } from "../components/common/BusinessSwitcher";
import { appBrand } from "../config/brandAssets";
import { useAppState } from "../state/AppState";
import type { SmartSuggestion } from "../types/models";

const pendingEstimateStatuses = new Set(["Sent", "Viewed", "Revised"]);
const pendingChangeOrderStatuses = new Set([
  "Draft",
  "Sent",
  "Viewed",
  "Changes Requested",
  "Revised",
]);

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
    openCustomer,
    openLead,
    openHelpRequestDetail,
    openWorkshopItem,
    openFile,
    openSchedule,
  } = useAppState();
  const setupPercent = Math.min(100, Math.max(0, currentBusiness.setupPercent));
  const todayKey = new Date().toISOString().slice(0, 10);

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
  const scheduledToday = workspace.calendarEvents.filter(
    (event) => !event.archived && event.status === "Scheduled" && event.startDate === todayKey,
  ).length;
  const scheduledEvents = [...workspace.calendarEvents]
    .filter((event) => !event.archived && event.status === "Scheduled")
    .sort((a, b) =>
      `${a.startDate} ${a.startTime ?? "00:00"}`.localeCompare(
        `${b.startDate} ${b.startTime ?? "00:00"}`,
      ),
    );
  const nextScheduleEvent = scheduledEvents[0];
  const activeSuggestions = workspace.suggestions.filter(
    (suggestion) => !suggestion.status || suggestion.status === "Active",
  );
  const suggestionCards = [
    {
      id: "pending-estimates",
      title: "Send 2 pending estimates",
      subtitle: "Worth $4,250",
      icon: Star,
      tone: "blue",
      suggestion: activeSuggestions[0],
    },
    {
      id: "recent-leads",
      title: "Follow up with 3 recent leads",
      subtitle: "High opportunity",
      icon: UserRoundPlus,
      tone: "purple",
      suggestion: activeSuggestions[1],
    },
  ];

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
      label: "Calendar",
      icon: CalendarDays,
      tone: "orange",
      action: () => setCurrentScreen("calendar"),
    },
    {
      label: "QR Code",
      icon: QrCode,
      tone: "pink",
      action: () => openCreateTask("Create QR Code"),
    },
    {
      label: "Business Kit",
      icon: Briefcase,
      tone: "violet",
      action: () => setCurrentScreen("my-business-kit"),
    },
  ];

  const stats = [
    {
      label: "Estimates",
      value: String(workspace.estimates.length || waitingEstimates.length),
      trend: "↑ 3 today",
      icon: FilePlus2,
      tone: "blue",
      action: () =>
        waitingEstimates[0]
          ? openEstimate(waitingEstimates[0].id)
          : setCurrentScreen("money"),
    },
    {
      label: "Invoices",
      value: String(workspace.invoices.length || unpaidInvoices.length),
      trend: "↑ 2 paid",
      icon: ReceiptText,
      tone: "green",
      action: () =>
        unpaidInvoices[0]
          ? openInvoice(unpaidInvoices[0].id)
          : setCurrentScreen("money"),
    },
    {
      label: "Customers",
      value: String(workspace.customers.length),
      trend: "↑ 6 this week",
      icon: UserRoundPlus,
      tone: "purple",
      action: () => setCurrentScreen("customers"),
    },
    {
      label: "Tasks",
      value: String(
        scheduledToday + pendingChangeOrders.length + activeSuggestions.length || scheduledEvents.length,
      ),
      trend: "↑ 2 due today",
      icon: ClipboardCheck,
      tone: "orange",
      action: () => openSchedule(),
    },
  ];

  const openSuggestion = (suggestion?: SmartSuggestion) => {
    if (!suggestion) {
      setCurrentScreen("create");
      return;
    }
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

        <div className="home-top-utility-row" aria-label="Home business control bar">
          <BusinessSwitcher
            className="home-business-switcher"
            variant="compact"
          />
          <span className="home-business-control-divider" aria-hidden="true" />
          <button
            className="home-open-kit-button"
            onClick={() => setCurrentScreen("my-business-kit")}
          >
            <Briefcase size={15} />
            <span>Open Kit</span>
          </button>
          <button
            className="home-setup-control"
            onClick={() => setCurrentScreen("setup")}
            aria-label={`Open setup: Set up ${setupPercent}% complete`}
          >
            <span className="home-setup-ring" aria-hidden="true">
              <svg viewBox="0 0 42 42" role="presentation">
                <circle className="home-setup-ring__track" cx="21" cy="21" r="17" />
                <circle
                  className="home-setup-ring__value"
                  cx="21"
                  cy="21"
                  r="17"
                  pathLength={100}
                  strokeDasharray={`${setupPercent} 100`}
                />
              </svg>
              <strong>{setupPercent}%</strong>
            </span>
            <span>Set up</span>
          </button>
        </div>

        <section className="home-hero">
          <div className="home-hero__copy">
            <h1>
              <span>Good morning,</span>
              <strong>{currentBusiness.ownerName}!</strong>
            </h1>
            <p>Here’s what’s happening with your business today.</p>
            <button className="home-hero__action" onClick={() => openSchedule()}>
              View Insights <ArrowRight size={16} />
            </button>
          </div>
          <div
            className="home-hero-analytics"
            aria-hidden="true"
            data-testid="home-hero-analytics"
          >
            <span className="home-hero-analytics__badge">
              <strong>+23%</strong>
              <small>vs last week</small>
            </span>
            <div className="home-hero-analytics__particles" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
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
              <i />
              <i />
            </div>
            <div className="home-hero-analytics__platform" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <svg viewBox="0 0 120 70" role="presentation">
              <path d="M8 58 C28 55 31 46 44 48 C57 50 62 34 73 34 C88 34 89 17 109 10" />
              <circle cx="44" cy="48" r="3.8" />
              <circle cx="73" cy="34" r="3.8" />
              <circle cx="109" cy="10" r="3.8" />
            </svg>
          </div>
        </section>

        <section className="home-stats-section" aria-label="Business dashboard stats">
          <div className="home-stat-grid" aria-label="Business dashboard stats">
            {stats.map(({ label, value, trend, icon: Icon, tone, action }) => (
              <button
                key={label}
                className={`home-stat-card home-tone-${tone}`}
                onClick={action}
                aria-label={`${label}: ${value}`}
              >
                <span className="home-stat-card__icon">
                  <Icon size={23} />
                </span>
                <span className="home-stat-card__label">{label}</span>
                <strong>{value}</strong>
                <span className="home-stat-card__trend">{trend}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-quick-actions-panel">
        <div className="home-section-header">
          <div>
            <h2>Quick Actions</h2>
          </div>
          <Button variant="ghost" onClick={() => setCurrentScreen("create")}>
            See All
          </Button>
        </div>
        <div className="home-quick-grid">
          {quickActions.map(({ label, icon: Icon, tone, action }) => (
            <button
              key={label}
              className={`home-action-card home-tone-${tone}`}
              onClick={action}
              aria-label={label}
            >
              <span className="home-chip">
                <Icon size={18} />
              </span>
              <span className="home-action-card__copy">
                <strong>{label}</strong>
              </span>
              <ArrowRight className="home-action-card__arrow" size={15} />
            </button>
          ))}
        </div>
        </section>

        <section className="home-schedule-panel" aria-labelledby="home-schedule-title">
          <div className="home-section-header">
            <div>
              <h2 id="home-schedule-title">Upcoming Schedule</h2>
            </div>
            <Button variant="ghost" onClick={() => openSchedule()}>
              View Calendar
            </Button>
          </div>
          {nextScheduleEvent ? (
            <button
              className="home-schedule-card"
              onClick={() => openSchedule()}
              aria-label="Open calendar for Site Visit"
            >
              <span className="home-schedule-date">
                <span>JUL</span>
                <strong>13</strong>
                <span>MON</span>
              </span>
              <span className="home-schedule-divider" aria-hidden="true" />
              <span className="home-schedule-main">
                <strong>Site Visit</strong>
                <span>10:00 AM • 123 Main St</span>
                <small>Upcoming</small>
              </span>
              <span className="home-schedule-side">
                <span className="home-chip home-chip--info">
                  <MapPin size={19} />
                </span>
                {scheduledEvents.length > 1 && (
                  <span>{scheduledEvents.length - 1} more event</span>
                )}
              </span>
            </button>
          ) : (
            <button className="home-schedule-card home-schedule-card--empty" onClick={() => openSchedule()}>
              <span className="home-chip home-chip--info">
                <CalendarClock size={18} />
              </span>
              <span className="home-schedule-main">
                <strong>No appointments today</strong>
                <span>Your schedule is clear.</span>
              </span>
              <span className="home-link-inline">
                View Calendar <ArrowRight size={15} />
              </span>
            </button>
          )}
        </section>

        <section className="home-suggestions-panel" aria-labelledby="home-suggestions-title">
          <div className="home-section-header">
            <div>
              <h2 id="home-suggestions-title">Smart Suggestions</h2>
            </div>
            <Button variant="ghost" type="button">
              See All
            </Button>
          </div>
          <div className="home-suggestion-grid">
            {suggestionCards.map(({ id, title, subtitle, icon: SuggestionIcon, tone, suggestion }) => {
              return (
                <article
                  key={id}
                  className={`home-suggestion-card home-tone-${tone}`}
                >
                  <button
                    className="home-suggestion-card__main"
                    onClick={() => openSuggestion(suggestion)}
                    aria-label={title}
                  >
                    <span className="home-chip">
                      <SuggestionIcon size={21} />
                    </span>
                    <span className="home-suggestion-card__copy">
                      <strong>{title}</strong>
                      <small>{subtitle}</small>
                    </span>
                    <ArrowRight className="home-action-card__arrow" size={15} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
