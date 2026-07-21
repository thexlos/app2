import { ArrowRight } from "lucide-react";
import {
  completeActionBases,
  completeStatBases,
  type CompleteActionTone,
  type CompleteStatTone,
} from "./completeBaseAssets";

export function CompleteBaseStatCard({
  tone = "cyan",
  label = "Estimates",
  value = "12",
  trend = "↑ 3 today",
  state = "default",
}: {
  tone?: CompleteStatTone;
  label?: string;
  value?: string;
  trend?: string;
  state?: "default" | "pressed" | "focus";
}) {
  return (
    <button
      type="button"
      className={`complete-base-card complete-base-card--stat complete-base-tone-${tone} is-${state}`}
      aria-label={`${label}: ${value}`}
      data-complete-base-card="stat"
      data-core-size="210x340"
      data-base-size="270x400"
    >
      <img
        className="complete-base-card__artwork"
        src={completeStatBases[tone]}
        alt=""
        aria-hidden="true"
      />
      <span className="complete-base-card__live complete-base-stat__label">
        {label}
      </span>
      <strong className={`complete-base-card__live complete-base-stat__value${value.length >= 3 ? " is-long" : ""}`}>
        {value}
      </strong>
      <span className={`complete-base-card__live complete-base-stat__trend${trend.length >= 12 ? " is-long" : ""}`}>
        {trend}
      </span>
    </button>
  );
}

function actionLabelClass(firstLine: string, secondLine: string) {
  const length = `${firstLine}${secondLine}`.length;
  return [
    "complete-base-card__live",
    "complete-base-action__label",
    secondLine.trim() ? "is-two-line" : "is-single-line",
    length >= 12 ? "is-long" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function CompleteBaseActionCard({
  tone = "cyan",
  firstLine = "Create",
  secondLine = "Estimate",
  state = "default",
}: {
  tone?: CompleteActionTone;
  firstLine?: string;
  secondLine?: string;
  state?: "default" | "pressed" | "focus";
}) {
  return (
    <button
      type="button"
      className={`complete-base-card complete-base-card--action complete-base-tone-${tone} is-${state}`}
      aria-label={`${firstLine} ${secondLine}`.trim()}
      data-complete-base-card="action"
      data-core-size="283x167"
      data-base-size="343x227"
    >
      <img
        className="complete-base-card__artwork"
        src={completeActionBases[tone]}
        alt=""
        aria-hidden="true"
      />
      <span className={actionLabelClass(firstLine, secondLine)}>
        <span>{firstLine}</span>
        {secondLine.trim() ? <span>{secondLine}</span> : null}
      </span>
      <ArrowRight
        className="complete-base-card__live complete-base-action__arrow"
        aria-hidden="true"
      />
    </button>
  );
}
