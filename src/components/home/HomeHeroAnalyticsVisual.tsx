import {
  ClipboardCheck,
  FilePlusCorner,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import type { ComponentType, CSSProperties, SVGProps } from "react";

export type HeroAnalyticsMetric = {
  label: "Estimates" | "Invoices" | "Customers" | "Tasks";
  value: number;
  tone: "blue" | "green" | "purple" | "orange";
};

type HomeHeroAnalyticsVisualProps = {
  metrics: HeroAnalyticsMetric[];
  badge: {
    value: string;
    label: string;
  };
};

const particles = Array.from({ length: 36 }, (_, index) => index);
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
      value: Math.max(0, metric?.value ?? 0),
      tone: metric?.tone ?? fallbackTones[label],
    };
  });
  const maxValue = Math.max(...orderedMetrics.map((metric) => metric.value), 1);
  const minVisibleBarPercent = 24;
  const maxVisibleBarPercent = 68;
  const normalized = orderedMetrics.map((metric, index) => {
    const height =
      minVisibleBarPercent +
      (metric.value / maxValue) *
        (maxVisibleBarPercent - minVisibleBarPercent);
    return {
      ...metric,
      index,
      height: Number(height.toFixed(2)),
    };
  });
  const totalValue = normalized.reduce((total, metric) => total + metric.value, 0);
  const chartBaseY = 94;
  const chartTopY = 16;
  const linePoints = normalized.map((metric, index) => {
    const x = Number((25 + index * 40).toFixed(2));
    const y = Number(
      (chartBaseY -
        (metric.height / 100) * (chartBaseY - chartTopY)).toFixed(2),
    );
    return { x, y };
  });
  const linePath = buildSmoothPath(linePoints);
  const resolvedBadge =
    totalValue > 0
      ? {
          value: `${totalValue} active`,
          label: "work items",
        }
      : badge;

  return (
    <div
      className="home-hero-analytics home-hero-analytics--phase2b"
      aria-hidden="true"
      data-testid="home-hero-analytics"
      data-metric-count={normalized.length}
      data-bar-count={normalized.length}
      data-categories={normalized.map((metric) => metric.label).join(",")}
      data-line-source="normalized-bar-top-points"
      data-value-source="current-home-stat-values"
      data-animation="bars-line-callouts"
      data-reduced-motion-safe="true"
      data-badge-value={resolvedBadge.value}
      data-badge-label={resolvedBadge.label}
      data-line-points={linePoints
        .map((point) => `${point.x}:${point.y}`)
        .join("|")}
    >
      <span className="home-hero-analytics__glow" />
      <span className="home-hero-analytics__badge">
        <strong>{resolvedBadge.value}</strong>
        <small>{resolvedBadge.label}</small>
      </span>
      <div className="home-hero-analytics__particles" aria-hidden="true">
        {particles.map((particle) => (
          <span key={particle} />
        ))}
      </div>
      <div className="home-hero-analytics__vertical-lines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="home-hero-analytics__grid">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="home-hero-analytics__axis" aria-hidden="true">
        <span>100</span>
        <span>50</span>
        <span>0</span>
      </div>
      <div className="home-hero-analytics__bars" aria-hidden="true">
        {normalized.map((metric, index) => (
          <span
            key={metric.label}
            className={`home-hero-analytics__bar-stack home-tone-${metric.tone}`}
            data-category={metric.label}
            data-value={metric.value}
            data-height-percent={metric.height}
            style={
              {
                "--bar-height": `${metric.height}%`,
                "--bar-index": index,
                "--bar-delay": `${index * 80}ms`,
                "--callout-delay": `${360 + index * 90}ms`,
              } as CSSProperties
            }
          >
            <span
              className="home-hero-analytics__callout"
              data-category={metric.label}
              data-value={metric.value}
            >
              {(() => {
                const Icon = metricIcons[metric.label];
                return <Icon className="home-hero-analytics__callout-icon" />;
              })()}
              <span>
                <em>{metric.label}</em>
                <strong>{metric.value}</strong>
                <small>current</small>
              </span>
            </span>
            <span className="home-hero-analytics__pin" />
            <i
              className={`home-hero-analytics__bar home-tone-${metric.tone}`}
              data-category={metric.label}
              data-value={metric.value}
            >
              <span className="home-hero-analytics__bar-top" />
              <span className="home-hero-analytics__bar-face" />
            </i>
          </span>
        ))}
      </div>
      <div className="home-hero-analytics__platform" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <svg
        className="home-hero-analytics__line"
        viewBox="0 0 170 112"
        role="presentation"
        data-line-source="normalized-bar-top-points"
      >
        <defs>
          <linearGradient id="homeHeroLineGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
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
            key={`${point.x}-${index}`}
            className="home-hero-analytics__line-point"
            cx={point.x}
            cy={point.y}
            r="3.7"
          />
        ))}
      </svg>
    </div>
  );
}
