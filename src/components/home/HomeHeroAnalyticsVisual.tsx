import type { CSSProperties } from "react";
import platformShell from "../../assets/home/shells/hero/platform-shell.svg";
import badgeShell from "../../assets/home/shells/hero/badge-shell.svg";
import barEstimates from "../../assets/home/shells/hero/bars/bar-estimates.svg";
import barInvoices from "../../assets/home/shells/hero/bars/bar-invoices.svg";
import barCustomers from "../../assets/home/shells/hero/bars/bar-customers.svg";
import barTasks from "../../assets/home/shells/hero/bars/bar-tasks.svg";
import calloutEstimates from "../../assets/home/shells/hero/callouts/callout-estimates.svg";
import calloutInvoices from "../../assets/home/shells/hero/callouts/callout-invoices.svg";
import calloutCustomers from "../../assets/home/shells/hero/callouts/callout-customers.svg";
import calloutTasks from "../../assets/home/shells/hero/callouts/callout-tasks.svg";
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
const assetMap = {
  Estimates: { bar: barEstimates, callout: calloutEstimates },
  Invoices: { bar: barInvoices, callout: calloutInvoices },
  Customers: { bar: barCustomers, callout: calloutCustomers },
  Tasks: { bar: barTasks, callout: calloutTasks },
} as const;

const geometry = {
  viewBoxWidth: 240,
  viewBoxHeight: 180,
  baseY: 158,
  barCenters: [28, 72, 116, 160],
  barWidth: 24,
  minHeight: 52,
  maxHeight: 102,
  callouts: [
    { x: 8, y: 4, width: 48, height: 30 },
    { x: 61, y: 4, width: 48, height: 30 },
    { x: 114, y: 4, width: 48, height: 30 },
    { x: 167, y: 4, width: 48, height: 30 },
  ],
  badge: { x: 174, y: 133, width: 60, height: 38 },
} as const;

function smoothPath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
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
  const ordered = orderedLabels.map((label) => {
    const metric = metrics.find((candidate) => candidate.label === label);
    return { label, value: Math.max(0, Number(metric?.value ?? 0)) };
  });

  const maxValue = Math.max(...ordered.map((metric) => metric.value), 1);
  const bars = ordered.map((metric, index) => {
    const ratio = metric.value / maxValue;
    const height =
      geometry.minHeight +
      ratio * (geometry.maxHeight - geometry.minHeight);
    const topY = geometry.baseY - height;
    return {
      ...metric,
      index,
      x: geometry.barCenters[index],
      height: Number(height.toFixed(2)),
      topY: Number(topY.toFixed(2)),
      callout: geometry.callouts[index],
      assets: assetMap[metric.label],
    };
  });

  const total = bars.reduce((sum, bar) => sum + bar.value, 0);
  const resolvedBadge =
    total > 0 ? { value: `${total} active`, label: "work items" } : badge;
  const points = bars.map((bar) => ({ x: bar.x, y: bar.topY - 2 }));
  const linePath = smoothPath(points);
  const animationKey = bars
    .map((bar) => `${bar.label}:${bar.value}:${bar.height}`)
    .join("|");

  return (
    <div
      className="home-hero-analytics home-hero-analytics--shell-v1"
      role="img"
      aria-label={bars.map((bar) => `${bar.label} ${bar.value}`).join(", ")}
      data-testid="home-hero-analytics"
      data-layout-version="hero-shell-v1"
      data-composition-split="43-57"
      data-chart-contained="true"
      data-bar-count={bars.length}
      data-categories={bars.map((bar) => bar.label).join(",")}
      data-line-source="same-shell-bar-top-points"
      data-value-source="current-home-stat-values"
      data-badge-value={resolvedBadge.value}
      data-badge-label={resolvedBadge.label}
      data-reduced-motion-safe="true"
    >
      <svg
        key={animationKey}
        className="home-hero-analytics__svg"
        viewBox={`0 0 ${geometry.viewBoxWidth} ${geometry.viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="heroShellClip">
            <rect x="0" y="0" width="240" height="180" rx="8" />
          </clipPath>
          <filter id="shellLineGlow" x="-50%" y="-100%" width="200%" height="300%">
            <feGaussianBlur stdDeviation="2.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="shellLineGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="52%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>

        <g clipPath="url(#heroShellClip)">
          <image
            href={platformShell}
            data-shell-asset="hero/platform-shell.svg"
            x="-5"
            y="78"
            width="250"
            height="96"
            preserveAspectRatio="xMidYMid meet"
            className="home-hero-analytics__platform"
          />

          {bars.map((bar) => (
            <g
              key={bar.label}
              className="home-hero-analytics__bar-group"
              data-category={bar.label}
              data-value={bar.value}
              data-height={bar.height}
              style={
                {
                  "--bar-delay": `${bar.index * 85}ms`,
                  transformOrigin: `${bar.x}px ${geometry.baseY}px`,
                } as CSSProperties
              }
            >
              <image
                href={bar.assets.bar}
                data-shell-asset={`hero/bars/bar-${bar.label.toLowerCase()}.svg`}
                x={bar.x - geometry.barWidth / 2}
                y={bar.topY}
                width={geometry.barWidth}
                height={bar.height}
                preserveAspectRatio="none"
              />
            </g>
          ))}

          <g className="home-hero-analytics__trend" filter="url(#shellLineGlow)">
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
            {points.map((point, index) => (
              <circle
                key={index}
                className="home-hero-analytics__line-point"
                cx={point.x}
                cy={point.y}
                r="3.6"
              />
            ))}
          </g>

          {bars.map((bar) => {
            const c = bar.callout;
            return (
              <g
                key={`callout-${bar.label}`}
                className="home-hero-analytics__callout"
                style={{ "--callout-delay": `${350 + bar.index * 75}ms` } as CSSProperties}
              >
                <line
                  x1={c.x + c.width / 2}
                  y1={c.y + c.height}
                  x2={bar.x}
                  y2={bar.topY - 4}
                  stroke="#A5F3FC"
                  strokeOpacity=".54"
                  strokeWidth=".8"
                  className="home-hero-analytics__pin"
                />
                <image
                  href={bar.assets.callout}
                  data-shell-asset={`hero/callouts/callout-${bar.label.toLowerCase()}.svg`}
                  x={c.x}
                  y={c.y}
                  width={c.width}
                  height={c.height}
                  preserveAspectRatio="none"
                />
                <text
                  x={c.x + 4}
                  y={c.y + 9}
                  className="home-hero-analytics__callout-label"
                >
                  {bar.label}
                </text>
                <text
                  x={c.x + 4}
                  y={c.y + 22}
                  className="home-hero-analytics__callout-value"
                >
                  {bar.value}
                </text>
              </g>
            );
          })}

          <g className="home-hero-analytics__badge">
            <image
              href={badgeShell}
              data-shell-asset="hero/badge-shell.svg"
              x={geometry.badge.x}
              y={geometry.badge.y}
              width={geometry.badge.width}
              height={geometry.badge.height}
              preserveAspectRatio="none"
            />
            <text
              x={geometry.badge.x + 7}
              y={geometry.badge.y + 15}
              className="home-hero-analytics__badge-value"
            >
              {resolvedBadge.value}
            </text>
            <text
              x={geometry.badge.x + 7}
              y={geometry.badge.y + 27}
              className="home-hero-analytics__badge-label"
            >
              {resolvedBadge.label}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
