import { ArrowRight } from "lucide-react";
import { PremiumIconWell, PremiumShellLayers } from "./PremiumShellLayers";
import type { PremiumActionItem } from "./premiumTypes";

export function PremiumActionCard({
  label,
  icon: Icon,
  tone,
  onClick,
}: PremiumActionItem) {
  return (
    <button
      type="button"
      className={`premium-card premium-card--action premium-tone-${tone}`}
      onClick={onClick}
      aria-label={label}
    >
      <PremiumShellLayers />
      <span className="premium-card__content premium-action__content">
        <PremiumIconWell tone={tone} className="premium-action__icon">
          <Icon aria-hidden="true" />
        </PremiumIconWell>
        <strong className="premium-action__label">{label}</strong>
        <ArrowRight className="premium-action__arrow" aria-hidden="true" />
      </span>
    </button>
  );
}
