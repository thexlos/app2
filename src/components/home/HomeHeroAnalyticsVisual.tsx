import type { CSSProperties } from "react";

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

const particles = Array.from({ length: 28 }, (_, index) => index);

export function HomeHeroAnalyticsVisual({
  metrics,
  badge,
}: HomeHeroAnalyticsVisualProps) {
  const safeValues = metrics.map((metric) => Math.max(0, metric.value));
  const average =
    safeValues.length > 0
      ? safeValues.reduce((total, value) => total + value, 0) / safeValues.length
      : 0;
  const bars = [
    ...metrics,
    {
      label: "Tasks" as const,
      value: Math.round(average),
      tone: "blue" as const,
    },
  ];
  const maxValue = Math.max(...bars.map((metric) => metric.value), 1);
  const normalized = bars.map((metric) => {
    const height = 28 + (metric.value / maxValue) * 62;
    return {
      ...metric,
      height,
    };
  });
  const linePoints = normalized.map((metric, index) => {
    const x = 22 + index * 30;
    const y = 94 - metric.height * 0.72;
    return { x, y };
  });
  const linePath =
    linePoints.length > 0
      ? `M ${linePoints[0].x} ${linePoints[0].y} ` +
        linePoints
          .slice(1)
          .map((point, index) => {
            const previous = linePoints[index];
            const controlX = (previous.x + point.x) / 2;
            return `C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
          })
          .join(" ")
      : "";

  return (
    <div
      className="home-hero-analytics"
      aria-hidden="true"
      data-testid="home-hero-analytics"
      data-metric-count={metrics.length}
      data-badge-value={badge.value}
      data-badge-label={badge.label}
    >
      <span className="home-hero-analytics__badge">
        <strong>{badge.value}</strong>
        <small>{badge.label}</small>
      </span>
      <div className="home-hero-analytics__particles" aria-hidden="true">
        {particles.map((particle) => (
          <span key={particle} />
        ))}
      </div>
      <div className="home-hero-analytics__grid">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="home-hero-analytics__bars" aria-hidden="true">
        {normalized.map((metric, index) => (
          <i
            key={`${metric.label}-${index}`}
            className={`home-hero-analytics__bar home-tone-${metric.tone}`}
            style={
              {
                "--bar-height": `${metric.height}%`,
                "--bar-index": index,
            } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="home-hero-analytics__platform" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <svg viewBox="0 0 170 112" role="presentation">
        <defs>
          <linearGradient id="homeHeroLineGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <path d={linePath} />
        {linePoints.map((point, index) => (
          <circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r="3.7" />
        ))}
      </svg>
    </div>
  );
}
