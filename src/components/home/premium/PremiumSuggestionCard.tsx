import { ArrowRight } from "lucide-react";
import { PremiumIconWell, PremiumShellLayers } from "./PremiumShellLayers";
import type { PremiumSuggestionItem } from "./premiumTypes";

export function PremiumSuggestionCard({
  title,
  subtitle,
  icon: Icon,
  tone,
  onClick,
}: PremiumSuggestionItem) {
  return (
    <article className={`premium-card premium-card--suggestion premium-tone-${tone}`}>
      <button
        type="button"
        className="premium-suggestion__button"
        onClick={onClick}
        aria-label={title}
      >
        <PremiumShellLayers />
        <span className="premium-card__content premium-suggestion__content">
          <PremiumIconWell tone={tone} className="premium-suggestion__icon">
            <Icon aria-hidden="true" />
          </PremiumIconWell>
          <span className="premium-suggestion__copy">
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </span>
          <ArrowRight className="premium-suggestion__arrow" aria-hidden="true" />
        </span>
      </button>
    </article>
  );
}
