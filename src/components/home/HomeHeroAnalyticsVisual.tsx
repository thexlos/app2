import {
  ClipboardCheck,
  FilePlusCorner,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import type { ComponentType, CSSProperties, SVGProps } from "react";
import heroPlatformBase from "../../assets/home/hero-3d-platform-base.webp";
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

const geometry = {
  viewBoxWidth: 420,
  viewBoxHeight: 210,
  barCenters: [70, 158, 246, 334],
  barBaseY: 172,
  chartTopY: 30,
  minHeight: 48,
  maxHeight: 122,
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
      geometry.minHeight +
      ratio * (geometry.maxHeight - geometry.minHeight);

    return {
      ...metric,
      index,
      height: Number(height.toFixed(2)),
    };
  });

  const totalValue = normalized.reduce((total, metric) => total + metric.value, 0);
  const resolvedBadge =
    totalValue > 0
      ? { value: `${totalValue} active`, label: "work items" }
      : badge;

  const linePoints = normalized.map((metric, index) => ({
    x: geometry.barCenters[index],
    y: Number((geometry.barBaseY - metric.height - 6).toFixed(2)),
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
      className="home-hero-analytics home-hero-analytics--upgrade-v2"
      role="img"
      aria-label={`Business activity analytics. ${accessibleSummary}. ${resolvedBadge.value} ${resolvedBadge.label}.`}
      data-testid="home-hero-analytics"
      data-layout-version="hero-upgrade-v2"
      data-metric-count={normalized.length}
      data-bar-count={normalized.length}
      data-categories={normalized.map((metric) => metric.label).join(",")}
      data-line-source="normalized-bar-top-points"
      data-value-source="current-home-stat-values"
      data-animation="platform-bars-line-callouts"
      data-reduced-motion-safe="true"
      data-badge-value={resolvedBadge.value}
      data-badge-label={resolvedBadge.label}
    >
      <img
        className="home-hero-analytics__platform-base"
        src={heroPlatformBase}
        alt=""
        aria-hidden="true"
      />

      <div className="home-hero-analytics__bars">
        {normalized.map((metric, index) => {
          const Icon = metricIcons[metric.label];

          return (
            <span
              key={metric.label}
              className={`home-hero-analytics__bar-stack home-tone-${metric.tone}`}
              data-category={metric.label}
              data-value={metric.value}
              data-height-px={metric.height}
              style={
                {
                  "--bar-height": `${metric.height}px`,
                  "--bar-index": index,
                  "--bar-delay": `${index * 90}ms`,
                  "--callout-delay": `${360 + index * 90}ms`,
                } as CSSProperties
              }
            >
              <span className="home-hero-analytics__callout">
                <Icon className="home-hero-analytics__callout-icon" />
                <span>
                  <em>{metric.label}</em>
                  <strong>{metric.value}</strong>
                  <small>current</small>
                </span>
              </span>
              <span className="home-hero-analytics__pin" aria-hidden="true" />
              <i className="home-hero-analytics__bar" aria-hidden="true">
                <span className="home-hero-analytics__bar-top" />
                <span className="home-hero-analytics__bar-front" />
                <span className="home-hero-analytics__bar-side" />
              </i>
            </span>
          );
        })}
      </div>

      <svg
        key={animationSignature}
        className="home-hero-analytics__line"
        viewBox={`0 0 ${geometry.viewBoxWidth} ${geometry.viewBoxHeight}`}
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroUpgradeLineGradient" x1="0" x2="1" y1="0" y2="0">
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
            r="4"
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
