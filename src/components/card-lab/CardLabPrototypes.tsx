import { ArrowRight } from "lucide-react";
import {
  PremiumCreateEstimateIcon,
  PremiumEstimateDocumentIcon,
} from "./PremiumCardIcons";
import {
  InlineGlassFrame,
  InlineIconWell,
  type CardLabTone,
} from "./InlineGlassFrame";

export function CardLabStatCard({
  tone = "cyan",
  state = "default",
  compact = false,
}: {
  tone?: CardLabTone;
  state?: "default" | "pressed" | "focus";
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={`card-lab-card card-lab-stat card-lab-tone-${tone} is-${state}${
        compact ? " is-compact" : ""
      }`}
      aria-label="Estimates: 12"
      data-card-version="v1.3"
      data-scale-mode="container"
    >
      <InlineGlassFrame tone={tone} variant="stat" />
      <span className="card-lab-card__content card-lab-stat__content">
        <span className="card-lab-icon-well card-lab-stat__icon">
          <InlineIconWell tone={tone} />
          <PremiumEstimateDocumentIcon tone={tone} />
        </span>
        <span className="card-lab-stat__label">Estimates</span>
        <strong className="card-lab-stat__value">12</strong>
        <span className="card-lab-stat__trend">↑ 3 today</span>
      </span>
    </button>
  );
}

export function CardLabActionCard({
  tone = "cyan",
  state = "default",
}: {
  tone?: CardLabTone;
  state?: "default" | "pressed" | "focus";
}) {
  return (
    <button
      type="button"
      className={`card-lab-card card-lab-action card-lab-tone-${tone} is-${state}`}
      aria-label="Create Estimate"
      data-card-version="v1.3"
      data-scale-mode="container"
    >
      <InlineGlassFrame tone={tone} variant="action" />
      <span className="card-lab-card__content card-lab-action__content">
        <span className="card-lab-icon-well card-lab-action__icon">
          <InlineIconWell tone={tone} />
          <PremiumCreateEstimateIcon tone={tone} />
        </span>
        <span className="card-lab-action__label" aria-hidden="true">
          <span>Create</span>
          <span>Estimate</span>
        </span>
        <ArrowRight className="card-lab-action__arrow" aria-hidden="true" />
      </span>
    </button>
  );
}
