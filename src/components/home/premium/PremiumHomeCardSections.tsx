import { PremiumActionCard } from "./PremiumActionCard";
import { PremiumScheduleCard } from "./PremiumScheduleCard";
import { PremiumStatCard } from "./PremiumStatCard";
import { PremiumSuggestionCard } from "./PremiumSuggestionCard";
import type {
  PremiumActionItem,
  PremiumScheduleItem,
  PremiumStatItem,
  PremiumSuggestionItem,
} from "./premiumTypes";

function PremiumSectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className="premium-section-header">
      <h2>{title}</h2>
      <button type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
}

export function PremiumHomeCardSections({
  stats,
  actions,
  schedule,
  suggestions,
  onSeeAllActions,
  onViewCalendar,
  onSeeAllSuggestions,
}: {
  stats: PremiumStatItem[];
  actions: PremiumActionItem[];
  schedule: PremiumScheduleItem;
  suggestions: PremiumSuggestionItem[];
  onSeeAllActions: () => void;
  onViewCalendar: () => void;
  onSeeAllSuggestions?: () => void;
}) {
  return (
    <>
      <section className="premium-stats-section" aria-label="Business dashboard stats">
        <div className="premium-stat-grid">
          {stats.map((item) => (
            <PremiumStatCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="premium-quick-section">
        <PremiumSectionHeader
          title="Quick Actions"
          actionLabel="See All"
          onAction={onSeeAllActions}
        />
        <div className="premium-action-grid">
          {actions.map((item) => (
            <PremiumActionCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="premium-schedule-section">
        <PremiumSectionHeader
          title="Upcoming Schedule"
          actionLabel="View Calendar"
          onAction={onViewCalendar}
        />
        <PremiumScheduleCard {...schedule} />
      </section>

      <section className="premium-suggestions-section">
        <PremiumSectionHeader
          title="Smart Suggestions"
          actionLabel="See All"
          onAction={onSeeAllSuggestions}
        />
        <div className="premium-suggestion-grid">
          {suggestions.map((item) => (
            <PremiumSuggestionCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
