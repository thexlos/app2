import { ArrowRight } from "lucide-react";
import {
  actionLayerAssets,
  statLayerAssets,
  type ReferenceActionTone,
  type ReferenceStatTone,
} from "./referenceLayerAssets";

function ReferenceLayers({
  border,
  texture,
}: {
  border: string;
  texture: string;
}) {
  return (
    <span className="reference-card__layers" aria-hidden="true">
      <span className="reference-card__surface" />
      <img className="reference-card__texture" src={texture} alt="" />
      <img className="reference-card__border" src={border} alt="" />
    </span>
  );
}

export function ReferenceDerivedStatCard({
  tone = "cyan",
  label = "Estimates",
  value = "12",
  trend = "↑ 3 today",
  state = "default",
}: {
  tone?: ReferenceStatTone;
  label?: string;
  value?: string;
  trend?: string;
  state?: "default" | "pressed" | "focus";
}) {
  const assets = statLayerAssets[tone];

  return (
    <button
      type="button"
      className={`reference-card reference-card--stat reference-tone-${tone} is-${state}`}
      aria-label={`${label}: ${value}`}
      data-reference-layer-card="stat"
      data-source-ratio="210/340"
    >
      <ReferenceLayers border={assets.border} texture={assets.texture} />
      <img className="reference-card__icon-cluster" src={assets.icon} alt="" />
      <span className="reference-card__live reference-stat__label">{label}</span>
      <strong className="reference-card__live reference-stat__value">{value}</strong>
      <span className="reference-card__live reference-stat__trend">{trend}</span>
    </button>
  );
}

export function ReferenceDerivedActionCard({
  tone = "cyan",
  firstLine = "Create",
  secondLine = "Estimate",
  state = "default",
}: {
  tone?: ReferenceActionTone;
  firstLine?: string;
  secondLine?: string;
  state?: "default" | "pressed" | "focus";
}) {
  const assets = actionLayerAssets[tone];

  return (
    <button
      type="button"
      className={`reference-card reference-card--action reference-tone-${tone} is-${state}`}
      aria-label={`${firstLine} ${secondLine}`}
      data-reference-layer-card="action"
      data-source-ratio="283/167"
    >
      <ReferenceLayers border={assets.border} texture={assets.texture} />
      <img className="reference-card__icon-cluster" src={assets.icon} alt="" />
      <span className="reference-card__live reference-action__label">
        <span>{firstLine}</span>
        <span>{secondLine}</span>
      </span>
      <ArrowRight className="reference-card__live reference-action__arrow" aria-hidden="true" />
    </button>
  );
}
