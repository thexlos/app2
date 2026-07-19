import type { CSSProperties } from "react";
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

const geometry = {
  viewBoxWidth: 240,
  viewBoxHeight: 180,
  baseY: 158,
  barCenters: [28, 72, 116, 160],
  barWidth: 24,
  barDepth: 6,
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

const tones: Record<
  HeroAnalyticsMetric["label"],
  { main: string; light: string; dark: string }
> = {
  Estimates: { main: "#22D3EE", light: "#A5F3FC", dark: "#075985" },
  Invoices: { main: "#A855F7", light: "#E9D5FF", dark: "#6B21A8" },
  Customers: { main: "#3B82F6", light: "#BFDBFE", dark: "#1E40AF" },
  Tasks: { main: "#14B8A6", light: "#99F6E4", dark: "#0F766E" },
};

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
    const x = geometry.barCenters[index];
    const topY = geometry.baseY - height;
    const callout = geometry.callouts[index];

    return {
      ...metric,
      index,
      x,
      height: Number(height.toFixed(2)),
      topY: Number(topY.toFixed(2)),
      lineY: Number((topY - geometry.barDepth).toFixed(2)),
      callout,
      tone: tones[metric.label],
    };
  });

  const total = bars.reduce((sum, bar) => sum + bar.value, 0);
  const resolvedBadge =
    total > 0 ? { value: `${total} active`, label: "work items" } : badge;
  const linePoints = bars.map((bar) => ({ x: bar.x, y: bar.lineY }));
  const linePath = smoothPath(linePoints);
  const animationKey = bars
    .map((bar) => `${bar.label}:${bar.value}:${bar.height}`)
    .join("|");

  const summary = bars.map((bar) => `${bar.label} ${bar.value}`).join(", ");

  return (
    <div
      className="home-hero-analytics home-hero-analytics--composition-v23"
      role="img"
      aria-label={`Business activity analytics. ${summary}. ${resolvedBadge.value} ${resolvedBadge.label}.`}
      data-testid="home-hero-analytics"
      data-layout-version="hero-composition-v2.3"
      data-composition-split="43-57"
      data-chart-contained="true"
      data-bar-count={bars.length}
      data-categories={bars.map((bar) => bar.label).join(",")}
      data-line-source="same-svg-bar-top-points"
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
          <clipPath id="heroCompositionClip">
            <rect x="0" y="0" width="240" height="180" rx="8" />
          </clipPath>
          <filter id="heroCompositionBarGlow" x="-70%" y="-40%" width="240%" height="200%">
            <feGaussianBlur stdDeviation="3.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heroCompositionLineGlow" x="-50%" y="-100%" width="200%" height="300%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="heroCompositionLineGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="52%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          {bars.map((bar) => (
            <linearGradient
              key={`gradient-${bar.label}`}
              id={`compositionBarGradient-${bar.index}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor={bar.tone.light} stopOpacity=".98" />
              <stop offset="42%" stopColor={bar.tone.main} stopOpacity=".74" />
              <stop offset="100%" stopColor={bar.tone.dark} stopOpacity=".88" />
            </linearGradient>
          ))}
        </defs>

        <g clipPath="url(#heroCompositionClip)">
          <image
            href={compactPlatformBase}
            x="-5"
            y="70"
            width="250"
            height="120"
            preserveAspectRatio="xMidYMid meet"
            className="home-hero-analytics__platform"
          />

          <g className="home-hero-analytics__bars">
            {bars.map((bar) => {
              const left = bar.x - geometry.barWidth / 2;
              const right = bar.x + geometry.barWidth / 2;
              const depth = geometry.barDepth;
              const top = bar.topY;
              const base = geometry.baseY;

              return (
                <g
                  key={bar.label}
                  className="home-hero-analytics__bar-group"
                  data-category={bar.label}
                  data-value={bar.value}
                  data-height={bar.height}
                  style={
                    {
                      "--bar-delay": `${bar.index * 85}ms`,
                      "--callout-delay": `${360 + bar.index * 80}ms`,
                      transformOrigin: `${bar.x}px ${base}px`,
                    } as CSSProperties
                  }
                >
                  <polygon
                    className="home-hero-analytics__bar-side"
                    points={`${right},${top} ${right + depth},${top - depth} ${right + depth},${base - depth} ${right},${base}`}
                    fill={bar.tone.dark}
                    opacity=".72"
                  />
                  <rect
                    className="home-hero-analytics__bar-front"
                    x={left}
                    y={top}
                    width={geometry.barWidth}
                    height={bar.height}
                    rx="4"
                    fill={`url(#compositionBarGradient-${bar.index})`}
                    stroke={bar.tone.main}
                  />
                  <polygon
                    className="home-hero-analytics__bar-top"
                    points={`${left},${top} ${left + depth},${top - depth} ${right + depth},${top - depth} ${right},${top}`}
                    fill={bar.tone.light}
                    stroke={bar.tone.main}
                  />
                </g>
              );
            })}
          </g>

          <g className="home-hero-analytics__pins">
            {bars.map((bar) => {
              const c = bar.callout;
              return (
                <line
                  key={`pin-${bar.label}`}
                  x1={c.x + c.width / 2}
                  y1={c.y + c.height}
                  x2={bar.x}
                  y2={bar.lineY - 3}
                  stroke={bar.tone.main}
                  strokeWidth="1"
                  opacity=".9"
                  className="home-hero-analytics__pin"
                  style={{ "--callout-delay": `${360 + bar.index * 80}ms` } as CSSProperties}
                />
              );
            })}
          </g>

          <g className="home-hero-analytics__trend" filter="url(#heroCompositionLineGlow)">
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
                key={`point-${index}`}
                className="home-hero-analytics__line-point"
                cx={point.x}
                cy={point.y}
                r="3.7"
              />
            ))}
          </g>

          <g className="home-hero-analytics__callouts">
            {bars.map((bar) => {
              const c = bar.callout;
              return (
                <g
                  key={`callout-${bar.label}`}
                  className="home-hero-analytics__callout"
                  style={{ "--callout-delay": `${360 + bar.index * 80}ms` } as CSSProperties}
                >
                  <rect
                    x={c.x}
                    y={c.y}
                    width={c.width}
                    height={c.height}
                    rx="6"
                    fill="#020A1B"
                    fillOpacity=".95"
                    stroke={bar.tone.main}
                    strokeWidth=".8"
                  />
                  <text
                    x={c.x + 4}
                    y={c.y + 9}
                    fill={bar.tone.main}
                    className="home-hero-analytics__callout-label"
                  >
                    {bar.label}
                  </text>
                  <text
                    x={c.x + 4}
                    y={c.y + 22}
                    fill="#F8FAFC"
                    className="home-hero-analytics__callout-value"
                  >
                    {bar.value}
                  </text>
                </g>
              );
            })}
          </g>

          <g className="home-hero-analytics__badge">
            <rect
              x={geometry.badge.x}
              y={geometry.badge.y}
              width={geometry.badge.width}
              height={geometry.badge.height}
              rx="8"
              fill="#020A1B"
              fillOpacity=".95"
              stroke="#38BDF8"
              strokeOpacity=".56"
            />
            <text
              x={geometry.badge.x + 6}
              y={geometry.badge.y + 14}
              className="home-hero-analytics__badge-value"
              fill="#F8FAFC"
            >
              {resolvedBadge.value}
            </text>
            <text
              x={geometry.badge.x + 6}
              y={geometry.badge.y + 26}
              className="home-hero-analytics__badge-label"
              fill="#CBD5E1"
            >
              {resolvedBadge.label}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
