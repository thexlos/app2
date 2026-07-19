import { PremiumIconWell, PremiumShellLayers } from "./PremiumShellLayers";
import type { PremiumStatItem } from "./premiumTypes";

export function PremiumStatCard({
  label,
  value,
  trend,
  icon: Icon,
  tone,
  onClick,
}: PremiumStatItem) {
  return (
    <button
      type="button"
      className={`premium-card premium-card--stat premium-tone-${tone}`}
      onClick={onClick}
      aria-label={`${label}: ${value}`}
    >
      <PremiumShellLayers />
      <span className="premium-card__content premium-stat__content">
        <PremiumIconWell tone={tone} className="premium-stat__icon">
          <Icon aria-hidden="true" />
        </PremiumIconWell>
        <span className="premium-stat__label">{label}</span>
        <strong className="premium-stat__value">{value}</strong>
        <span className="premium-stat__trend">{trend}</span>
      </span>
    </button>
  );
}
