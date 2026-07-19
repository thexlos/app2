import {
  ClipboardCheck,
  FilePlusCorner,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import type { ComponentType, CSSProperties, SVGProps } from "react";
import compactPlatformBase from "../../assets/home/hero-3d-platform-compact.webp";
import type {
  HeroAnalyticsMetric,
  HomeHeroAnalyticsVisualProps,
} from "./heroAnalyticsTypes";

export type { HeroAnalyticsMetric } from "./heroAnalyticsTypes";

const orderedLabels: HeroAnalyticsMetric["label"][] = [
  "Estimates",
  "Invoices",
  "Customers",
  "Tasks",
];

const fallbackTones: Record<
  HeroAnalyticsMetric["label"],
  HeroAnalyticsMetric["tone"]
> = {
  Estimates: "blue",
  Invoices: "purple",
  Customers: "blue",
  Tasks: "green",
};

const metricIcons: Record<
  HeroAnalyticsMetric["label"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  Estimates: FilePlusCorner,
  Invoices: ReceiptText,
  Customers: UsersRound,
  Tasks: ClipboardCheck,
};

const compactGeometry = {
  viewBoxWidth: 240,
  viewBoxHeight: 180,
  barCenters: [28, 72, 116, 160],
  barBaseY: 158,
  minHeight: 52,
  maxHeight: 102,
  calloutLeftPercent: [1.7, 20, 38.3, 56.7],
} as const;

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return (
    `M ${points[0].x} ${points[0].y} ` +
    points
      .slice(1)
      .map((point, index) => {
        const previous = points[index];
        const controlX = Number(((previous.x + point.x) / 2).toFixed(2));
        return `C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
      })
      .join(" ")
  );
}

export function HomeHeroAnalyticsVisual({
  metrics,
  badge,
}: HomeHeroAnalyticsVisualProps) {
  const orderedMetrics = orderedLabels.map((label) => {
    const metric = metrics.find((candidate) => candidate.label === label);
    return {
      label,
      value: Math.max(0, Number(metric?.value ?? 0)),
      tone: metric?.tone ?? fallbackTones[label],
    };
  });

  const maxValue = Math.max(...orderedMetrics.map((metric) => metric.value), 1);
  const normalized = orderedMetrics.map((metric, index) => {
    const ratio = metric.value / maxValue;
    const height =
      compactGeometry.minHeight +
      ratio * (compactGeometry.maxHeight - compactGeometry.minHeight);

    const barTopY = compactGeometry.barBaseY - height;
    const stackLeftPercent =
      (compactGeometry.barCenters[index] / compactGeometry.viewBoxWidth) * 100;
    const barHeightPercent =
      (height / compactGeometry.viewBoxHeight) * 100;
    const barTopPercent =
      (barTopY / compactGeometry.viewBoxHeight) * 100;

    return {
      ...metric,
      index,
      height: Number(height.toFixed(2)),
      barTopY: Number(barTopY.toFixed(2)),
      stackLeftPercent: Number(stackLeftPercent.toFixed(3)),
      barHeightPercent: Number(barHeightPercent.toFixed(3)),
      barTopPercent: Number(barTopPercent.toFixed(3)),
      calloutLeftPercent: compactGeometry.calloutLeftPercent[index],
    };
  });

  const totalValue = normalized.reduce((total, metric) => total + metric.value, 0);
  const resolvedBadge =
    totalValue > 0
      ? { value: `${totalValue} active`, label: "work items" }
      : badge;

  const linePoints = normalized.map((metric, index) => ({
    x: compactGeometry.barCenters[index],
    y: Number((metric.barTopY - 4).toFixed(2)),
  }));
  const linePath = buildSmoothPath(linePoints);
  const animationSignature = normalized
    .map((metric) => `${metric.label}:${metric.value}:${metric.height}`)
    .join("|");

  const accessibleSummary = normalized
    .map((metric) => `${metric.label} ${metric.value}`)
    .join(", ");

  return (
    <div
      className="home-hero-analytics home-hero-analytics--compact-v21"
      role="img"
      aria-label={`Business activity analytics. ${accessibleSummary}. ${resolvedBadge.value} ${resolvedBadge.label}.`}
      data-testid="home-hero-analytics"
      data-layout-version="hero-compact-v2.1"
      data-metric-count={normalized.length}
      data-bar-count={normalized.length}
      data-categories={normalized.map((metric) => metric.label).join(",")}
      data-line-source="compact-normalized-bar-top-points"
      data-value-source="current-home-stat-values"
      data-animation="compact-platform-bars-line-callouts"
      data-reduced-motion-safe="true"
      data-badge-value={resolvedBadge.value}
      data-badge-label={resolvedBadge.label}
      data-line-points={linePoints
        .map((point) => `${point.x}:${point.y}`)
        .join("|")}
    >
      <img
        className="home-hero-analytics__platform-base"
        src={compactPlatformBase}
        alt=""
        aria-hidden="true"
      />

      <div className="home-hero-analytics__callouts">
        {normalized.map((metric, index) => {
          const Icon = metricIcons[metric.label];

          return (
            <span
              key={metric.label}
              className={`home-hero-analytics__callout home-tone-${metric.tone}`}
              data-category={metric.label}
              data-value={metric.value}
              style={
                {
                  "--callout-left": `${metric.calloutLeftPercent}%`,
                  "--bar-top-percent": `${metric.barTopPercent}%`,
                  "--callout-delay": `${340 + index * 85}ms`,
                } as CSSProperties
              }
            >
              <Icon className="home-hero-analytics__callout-icon" />
              <span>
                <em>{metric.label}</em>
                <strong>{metric.value}</strong>
                <small>current</small>
              </span>
              <i className="home-hero-analytics__pin" aria-hidden="true" />
            </span>
          );
        })}
      </div>

      <div className="home-hero-analytics__bars">
        {normalized.map((metric, index) => (
          <span
            key={metric.label}
            className={`home-hero-analytics__bar-stack home-tone-${metric.tone}`}
            data-category={metric.label}
            data-value={metric.value}
            data-height-percent={metric.barHeightPercent}
            style={
              {
                "--stack-left": `${metric.stackLeftPercent}%`,
                "--bar-height-percent": `${metric.barHeightPercent}%`,
                "--bar-delay": `${index * 85}ms`,
              } as CSSProperties
            }
          >
            <i className="home-hero-analytics__bar" aria-hidden="true">
              <span className="home-hero-analytics__bar-top" />
              <span className="home-hero-analytics__bar-front" />
              <span className="home-hero-analytics__bar-side" />
            </i>
          </span>
        ))}
      </div>

      <svg
        key={animationSignature}
        className="home-hero-analytics__line"
        viewBox={`0 0 ${compactGeometry.viewBoxWidth} ${compactGeometry.viewBoxHeight}`}
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroCompactLineGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="52%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <path
          className="home-hero-analytics__line-glow"
          d={linePath}
          pathLength={1}
        />
        <path
          className="home-hero-analytics__line-path"
          d={linePath}
          pathLength={1}
        />
        {linePoints.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            className="home-hero-analytics__line-point"
            cx={point.x}
            cy={point.y}
            r="3.6"
          />
        ))}
      </svg>

      <span className="home-hero-analytics__badge">
        <strong>{resolvedBadge.value}</strong>
        <small>{resolvedBadge.label}</small>
        {badge.comparison ? <em>{badge.comparison}</em> : null}
      </span>
    </div>
  );
}
