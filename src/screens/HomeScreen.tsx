import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FilePlus2,
  MapPin,
  QrCode,
  ReceiptText,
  Sparkles,
  Star,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { BusinessSwitcher } from "../components/common/BusinessSwitcher";
import { appBrand } from "../config/brandAssets";
import { useAppState } from "../state/AppState";
import type { CalendarEvent, SmartSuggestion } from "../types/models";

const pendingEstimateStatuses = new Set(["Sent", "Viewed", "Revised"]);
const pendingChangeOrderStatuses = new Set([
  "Draft",
  "Sent",
  "Viewed",
  "Changes Requested",
  "Revised",
]);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatScheduleDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(year, month - 1, day);
  return {
    month: value.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(day).padStart(2, "0"),
    weekday: value.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
  };
};

const formatScheduleTime = (event: CalendarEvent) => {
  if (event.allDay) return "All day";
  if (!event.startTime) return "Time not set";
  return event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
};

const suggestionIcon = (suggestion: SmartSuggestion) => {
  if (suggestion.relatedRecordType === "estimate") return FilePlus2;
  if (suggestion.relatedRecordType === "invoice") return ReceiptText;
  if (suggestion.relatedRecordType === "customer" || suggestion.relatedRecordType === "lead")
    return UserRoundPlus;
  if (suggestion.relatedRecordType === "calendar_event") return CalendarClock;
  if (suggestion.suggestionType?.includes("approval")) return Star;
  return Sparkles;
};

const suggestionTone = (suggestion: SmartSuggestion, index: number) => {
  if (suggestion.priority === "Urgent") return "pink";
  if (suggestion.priority === "High") return index % 2 === 0 ? "blue" : "purple";
  if (suggestion.priority === "Medium") return "orange";
  return "cyan";
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
    updateSuggestion,
    openCustomer,
    openLead,
    openHelpRequestDetail,
    openWorkshopItem,
    openFile,
    openSchedule,
  } = useAppState();
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const setupPercent = Math.min(100, Math.max(0, currentBusiness.setupPercent));
  const setupComplete = setupPercent >= 100;
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
  const scheduledEvents = [...workspace.calendarEvents]
    .filter((event) => !event.archived && event.status === "Scheduled")
    .sort((a, b) =>
      `${a.startDate} ${a.startTime ?? "00:00"}`.localeCompare(
        `${b.startDate} ${b.startTime ?? "00:00"}`,
      ),
    );
  const nextScheduleEvent = scheduledEvents[0];
  const nextScheduleDate = nextScheduleEvent
    ? formatScheduleDate(nextScheduleEvent.startDate)
    : undefined;
  const activeSuggestions = workspace.suggestions.filter(
    (suggestion) => !suggestion.status || suggestion.status === "Active",
  );
  const visibleSuggestions = activeSuggestions.slice(0, suggestionsOpen ? activeSuggestions.length : 2);

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
      value: String(waitingEstimates.length),
      hint: "Ready for review",
      icon: FilePlus2,
      tone: "blue",
      action: () =>
        waitingEstimates[0]
          ? openEstimate(waitingEstimates[0].id)
          : setCurrentScreen("money"),
    },
    {
      label: "Changes",
      value: String(pendingChangeOrders.length),
      hint: "Needs approval",
      icon: AlertTriangle,
      tone: "orange",
      action: () =>
        pendingChangeOrders[0]
          ? openEstimate(pendingChangeOrders[0].estimateId)
          : setCurrentScreen("money"),
    },
    {
      label: "Invoices",
      value: String(unpaidInvoices.length),
      hint: "Balance due",
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
      hint: "Open total",
      icon: CircleDollarSign,
      tone: "green",
      action: () => setCurrentScreen("money"),
    },
  ];

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

        <section className="home-stats-section" aria-label="Business dashboard stats">
          <div className="home-stat-grid" aria-label="Business dashboard stats">
            {stats.map(({ label, value, hint, icon: Icon, tone, action }) => (
              <button
                key={label}
                className={`home-stat-card home-tone-${tone}`}
                onClick={action}
                aria-label={`${label}: ${value}`}
              >
                <span className="home-stat-card__topline">
                  <span className="home-chip">
                    <Icon size={17} />
                  </span>
                  <span className="home-stat-card__spark" aria-hidden="true" />
                </span>
                <span className="home-stat-card__label">{label}</span>
                <strong>{value}</strong>
                <span className="home-stat-card__hint">{hint}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-quick-actions-panel">
        <div className="home-section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Jump into the work you use most.</p>
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
          {nextScheduleEvent && nextScheduleDate ? (
            <button
              className="home-schedule-card"
              onClick={() => openSchedule()}
              aria-label={`Open calendar for ${nextScheduleEvent.title}`}
            >
              <span className="home-schedule-date">
                <span>{nextScheduleDate.month}</span>
                <strong>{nextScheduleDate.day}</strong>
                <span>{nextScheduleDate.weekday}</span>
              </span>
              <span className="home-schedule-divider" aria-hidden="true" />
              <span className="home-schedule-main">
                <strong>{nextScheduleEvent.title}</strong>
                <span>
                  {formatScheduleTime(nextScheduleEvent)}
                  {nextScheduleEvent.location ? ` · ${nextScheduleEvent.location}` : ""}
                </span>
                <small>{nextScheduleEvent.eventType}</small>
              </span>
              <span className="home-schedule-side">
                <span className="home-chip home-chip--info">
                  {nextScheduleEvent.location ? <MapPin size={18} /> : <CalendarClock size={18} />}
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
            <Button variant="ghost" onClick={() => setSuggestionsOpen((value) => !value)}>
              {suggestionsOpen ? "Show Less" : "See All"}
            </Button>
          </div>
          <div className="home-suggestion-grid">
            {visibleSuggestions.map((suggestion, index) => {
              const SuggestionIcon = suggestionIcon(suggestion);
              const title = suggestion.title ?? suggestion.message;
              const tone = suggestionTone(suggestion, index);
              return (
                <article
                  key={suggestion.id}
                  className={`home-suggestion-card home-tone-${tone}`}
                >
                  <button
                    className="home-suggestion-card__main"
                    onClick={() => completeSuggestion(suggestion)}
                    aria-label={`${suggestion.actionLabel}: ${title}`}
                  >
                    <span className="home-chip">
                      <SuggestionIcon size={18} />
                    </span>
                    <span className="home-suggestion-card__copy">
                      <strong>{title}</strong>
                      <small>{suggestion.message}</small>
                    </span>
                    <ArrowRight className="home-action-card__arrow" size={15} />
                  </button>
                  <span className="home-suggestion-card__actions">
                    <button onClick={() => completeSuggestion(suggestion)}>
                      {suggestion.actionLabel}
                    </button>
                    <button onClick={() => updateSuggestion(suggestion.id, "Snoozed")}>
                      Later
                    </button>
                    <button onClick={() => updateSuggestion(suggestion.id, "Dismissed")}>
                      Dismiss
                    </button>
                  </span>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
