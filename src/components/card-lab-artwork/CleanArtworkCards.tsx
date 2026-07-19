import { ArrowRight } from "lucide-react";
import {
  cleanActionArtwork,
  cleanStatArtwork,
  type ActionTone,
  type StatTone,
} from "./cleanArtworkAssets";

type ArtworkSet = {
  border: string;
  texture: string;
  icon: string;
};

function ArtworkLayers({
  artwork,
}: {
  artwork: ArtworkSet;
}) {
  return (
    <>
      <span className="clean-art-card__surface" aria-hidden="true" />
      <span className="clean-art-card__padded-art" aria-hidden="true">
        <img
          className="clean-art-card__artwork-layer clean-art-card__artwork-layer--texture"
          src={artwork.texture}
          alt=""
        />
        <img
          className="clean-art-card__artwork-layer clean-art-card__artwork-layer--border"
          src={artwork.border}
          alt=""
        />
        <img
          className="clean-art-card__artwork-layer clean-art-card__artwork-layer--icon"
          src={artwork.icon}
          alt=""
        />
      </span>
    </>
  );
}

export function CleanArtworkStatCard({
  tone = "cyan",
  label = "Estimates",
  value = "12",
  trend = "↑ 3 today",
  state = "default",
}: {
  tone?: StatTone;
  label?: string;
  value?: string;
  trend?: string;
  state?: "default" | "pressed" | "focus";
}) {
  return (
    <button
      type="button"
      className={`clean-art-card clean-art-card--stat clean-tone-${tone} is-${state}`}
      aria-label={`${label}: ${value}`}
      data-clean-artwork-card="stat"
      data-core-size="210x340"
      data-artwork-size="250x380"
    >
      <ArtworkLayers artwork={cleanStatArtwork[tone]} />
      <span className="clean-art-card__live clean-stat__label">{label}</span>
      <strong className={`clean-art-card__live clean-stat__value${value.length >= 3 ? " is-long" : ""}`}>
        {value}
      </strong>
      <span className={`clean-art-card__live clean-stat__trend${trend.length >= 12 ? " is-long" : ""}`}>
        {trend}
      </span>
    </button>
  );
}

function actionLabelClasses(first: string, second: string) {
  const length = `${first}${second}`.length;
  return [
    "clean-art-card__live",
    "clean-action__label",
    second.trim() ? "is-two-line" : "is-single-line",
    length >= 12 ? "is-long" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function CleanArtworkActionCard({
  tone = "cyan",
  firstLine = "Create",
  secondLine = "Estimate",
  state = "default",
}: {
  tone?: ActionTone;
  firstLine?: string;
  secondLine?: string;
  state?: "default" | "pressed" | "focus";
}) {
  return (
    <button
      type="button"
      className={`clean-art-card clean-art-card--action clean-tone-${tone} is-${state}`}
      aria-label={`${firstLine} ${secondLine}`.trim()}
      data-clean-artwork-card="action"
      data-core-size="283x167"
      data-artwork-size="327x211"
    >
      <ArtworkLayers artwork={cleanActionArtwork[tone]} />
      <span className={actionLabelClasses(firstLine, secondLine)}>
        <span>{firstLine}</span>
        {secondLine.trim() ? <span>{secondLine}</span> : null}
      </span>
      <ArrowRight className="clean-art-card__live clean-action__arrow" aria-hidden="true" />
    </button>
  );
}
