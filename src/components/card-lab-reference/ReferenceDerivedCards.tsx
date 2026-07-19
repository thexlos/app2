import { ArrowRight } from "lucide-react";
import {
  actionLayerAssets,
  statLayerAssets,
  type ReferenceActionTone,
  type ReferenceStatTone,
} from "./referenceLayerAssets";

type RegisteredLayers = {
  surface: string;
  texture: string;
  border: string;
  well: string;
  glyph: string;
};

function FullCanvasReferenceLayers({
  assets,
}: {
  assets: RegisteredLayers;
}) {
  return (
    <span
      className="reference-card__layers"
      aria-hidden="true"
      data-registration="full-canvas-inset-zero"
    >
      <img className="reference-card__layer reference-card__surface" src={assets.surface} alt="" />
      <img className="reference-card__layer reference-card__texture" src={assets.texture} alt="" />
      <img className="reference-card__layer reference-card__border" src={assets.border} alt="" />
      <img className="reference-card__layer reference-card__icon-well" src={assets.well} alt="" />
      <img className="reference-card__layer reference-card__icon-glyph" src={assets.glyph} alt="" />
    </span>
  );
}

function trendClass(trend: string) {
  return trend.length >= 12 ? " is-long-trend" : "";
}

function valueClass(value: string) {
  return value.length >= 3 ? " is-long-value" : "";
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
      data-registration-version="v2.1"
    >
      <FullCanvasReferenceLayers assets={assets} />
      <span className="reference-card__live reference-stat__label">{label}</span>
      <strong className={`reference-card__live reference-stat__value${valueClass(value)}`}>
        {value}
      </strong>
      <span className={`reference-card__live reference-stat__trend${trendClass(trend)}`}>
        {trend}
      </span>
    </button>
  );
}

function actionLabelClass(firstLine: string, secondLine: string) {
  const combinedLength = `${firstLine}${secondLine}`.length;

  return [
    "reference-card__live",
    "reference-action__label",
    secondLine.trim() ? "is-two-line" : "is-single-line",
    combinedLength >= 12 ? "is-long-label" : "",
  ]
    .filter(Boolean)
    .join(" ");
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
      aria-label={`${firstLine} ${secondLine}`.trim()}
      data-reference-layer-card="action"
      data-source-ratio="283/167"
      data-registration-version="v2.1"
    >
      <FullCanvasReferenceLayers assets={assets} />
      <span className={actionLabelClass(firstLine, secondLine)}>
        <span>{firstLine}</span>
        {secondLine.trim() ? <span>{secondLine}</span> : null}
      </span>
      <ArrowRight
        className="reference-card__live reference-action__arrow"
        aria-hidden="true"
      />
    </button>
  );
}
