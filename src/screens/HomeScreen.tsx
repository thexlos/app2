import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  FilePlus2,
  QrCode,
  ReceiptText,
  Star,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { BusinessSwitcher } from "../components/common/BusinessSwitcher";
import {
  HomeHeroAnalyticsVisual,
  type HeroAnalyticsMetric,
} from "../components/home/HomeHeroAnalyticsVisual";
import {
  PremiumHomeCardSections,
  type PremiumActionItem,
  type PremiumStatItem,
  type PremiumSuggestionItem,
} from "../components/home/premium";
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

type HomeStat = {
  label: HeroAnalyticsMetric["label"];
  value: number;
  trend: string;
  icon: typeof FilePlus2;
  tone: HeroAnalyticsMetric["tone"];
  action: () => void;
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
  const estimatesCount = workspace.estimates.length || waitingEstimates.length;
  const invoicesCount = workspace.invoices.length || unpaidInvoices.length;
  const customersCount = workspace.customers.length;
  const tasksCount =
    scheduledToday +
      pendingChangeOrders.length +
      activeSuggestions.length || scheduledEvents.length;
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

  const stats: HomeStat[] = [
    {
      label: "Estimates",
      value: estimatesCount,
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
      value: invoicesCount,
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
      value: customersCount,
      trend: "↑ 6 this week",
      icon: UserRoundPlus,
      tone: "purple",
      action: () => setCurrentScreen("customers"),
    },
    {
      label: "Tasks",
      value: tasksCount,
      trend: "↑ 2 due today",
      icon: ClipboardCheck,
      tone: "orange",
      action: () => openSchedule(),
    },
  ];
  const heroMetrics: HeroAnalyticsMetric[] = stats.map(({ label, value, tone }) => ({
    label,
    value,
    tone,
  }));
  const heroBadge = {
    value: `${tasksCount} active`,
    label: "current work",
  };

  const premiumStats: PremiumStatItem[] = stats.map(
    ({ label, value, trend, icon, tone, action }) => ({
      label,
      value,
      trend,
      icon,
      tone:
        tone === "blue"
          ? "cyan"
          : tone === "green"
            ? "green"
            : tone === "purple"
              ? "purple"
              : "orange",
      onClick: action,
    }),
  );

  const premiumActions: PremiumActionItem[] = quickActions.map(
    ({ label, icon, tone, action }) => ({
      label,
      icon,
      tone:
        tone === "blue"
          ? "cyan"
          : tone === "green"
            ? "green"
            : tone === "purple"
              ? "purple"
              : tone === "orange"
                ? "orange"
                : tone === "pink"
                  ? "pink"
                  : "blue",
      onClick: action,
    }),
  );

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

  const premiumSuggestions: PremiumSuggestionItem[] = suggestionCards.map(
    ({ id, title, subtitle, icon, tone, suggestion }) => ({
      id,
      title,
      subtitle,
      icon,
      tone: tone === "purple" ? "purple" : "cyan",
      onClick: () => openSuggestion(suggestion),
    }),
  );

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
          <HomeHeroAnalyticsVisual metrics={heroMetrics} badge={heroBadge} />
        </section>

        <PremiumHomeCardSections
          stats={premiumStats}
          actions={premiumActions}
          schedule={{
            month: "JUL",
            day: "13",
            weekday: "MON",
            title: nextScheduleEvent ? "Site Visit" : "No appointments today",
            detail: nextScheduleEvent
              ? "10:00 AM • 123 Main St"
              : "Your schedule is clear.",
            status: nextScheduleEvent ? "Upcoming" : "Available",
            extra:
              scheduledEvents.length > 1
                ? `${scheduledEvents.length - 1} more event`
                : undefined,
            onClick: () => openSchedule(),
          }}
          suggestions={premiumSuggestions}
          onSeeAllActions={() => setCurrentScreen("create")}
          onViewCalendar={() => openSchedule()}
        />
      </div>
    </section>
  );
}
