import { useId } from "react";

export type CardLabTone = "cyan" | "green" | "purple" | "orange";

const toneColors: Record<
  CardLabTone,
  { main: string; light: string; dark: string }
> = {
  cyan: { main: "#00E5FF", light: "#D8FCFF", dark: "#064B73" },
  green: { main: "#22D88A", light: "#DEFFF1", dark: "#08603D" },
  purple: { main: "#B26CFF", light: "#F5E9FF", dark: "#57238E" },
  orange: { main: "#FFB020", light: "#FFF4D1", dark: "#8A4B04" },
};

export function InlineGlassFrame({
  tone,
  variant,
}: {
  tone: CardLabTone;
  variant: "stat" | "action";
}) {
  const rawId = useId().replaceAll(":", "");
  const ids = {
    surface: `surface-v13-${rawId}`,
    tone: `tone-v13-${rawId}`,
    top: `top-v13-${rawId}`,
    bottom: `bottom-v13-${rawId}`,
    circuit: `circuit-v13-${rawId}`,
    glow: `glow-v13-${rawId}`,
  };

  const color = toneColors[tone];
  const isStat = variant === "stat";
  const width = isStat ? 136 : 286;
  const height = isStat ? 226 : 126;
  const radius = isStat ? 26 : 27;
  const innerRadius = radius - 5;
  const corner = isStat ? 31 : 33;
  const right = width - 3;
  const bottom = height - 3;

  return (
    <svg
      className="card-lab-frame"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-frame-version="v1.3"
      data-frame-variant={variant}
    >
      <defs>
        <linearGradient id={ids.surface} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#102B43" />
          <stop offset="29%" stopColor="#081A2F" />
          <stop offset="70%" stopColor="#03101E" />
          <stop offset="100%" stopColor="#00050C" />
        </linearGradient>

        <radialGradient id={ids.tone} cx=".10" cy=".03" r=".70">
          <stop offset="0%" stopColor={color.main} stopOpacity=".085" />
          <stop offset="45%" stopColor={color.main} stopOpacity=".018" />
          <stop offset="100%" stopColor={color.dark} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={ids.top} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".28" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity=".06" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={ids.bottom} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color.main} stopOpacity="0" />
          <stop offset="22%" stopColor={color.main} stopOpacity=".56" />
          <stop offset="78%" stopColor={color.main} stopOpacity=".74" />
          <stop offset="100%" stopColor={color.main} stopOpacity="0" />
        </linearGradient>

        <pattern
          id={ids.circuit}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M -5 30 L 30 -5 M 8 34 L 34 8"
            stroke={color.main}
            strokeOpacity=".025"
            strokeWidth=".55"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 3 21 H 11 V 15 H 19 V 8"
            fill="none"
            stroke={color.main}
            strokeOpacity=".065"
            strokeWidth=".55"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="19" cy="8" r=".85" fill={color.main} fillOpacity=".11" />
        </pattern>

        <filter id={ids.glow} x="-28%" y="-28%" width="156%" height="168%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation={isStat ? "1.9" : "1.8"}
            floodColor={color.main}
            floodOpacity=".29"
          />
          <feDropShadow
            dx="0"
            dy="9"
            stdDeviation="9"
            floodColor="#000000"
            floodOpacity=".58"
          />
        </filter>
      </defs>

      <g filter={`url(#${ids.glow})`}>
        <rect
          className="card-lab-frame__surface"
          x="3"
          y="3"
          width={width - 6}
          height={height - 6}
          rx={radius}
          fill={`url(#${ids.surface})`}
          stroke={color.main}
          strokeOpacity=".22"
          strokeWidth=".75"
          vectorEffect="non-scaling-stroke"
        />

        <rect
          x="4"
          y="4"
          width={width - 8}
          height={height - 8}
          rx={radius - 1}
          fill={`url(#${ids.tone})`}
        />

        <rect
          className="card-lab-frame__inner-rim"
          x="7"
          y="7"
          width={width - 14}
          height={height - 14}
          rx={innerRadius}
          fill={`url(#${ids.circuit})`}
          stroke={color.main}
          strokeOpacity=".11"
          strokeWidth=".62"
          vectorEffect="non-scaling-stroke"
        />

        <rect
          className="card-lab-frame__inner-rim-secondary"
          x="10"
          y="10"
          width={width - 20}
          height={height - 20}
          rx={innerRadius - 3}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".035"
          strokeWidth=".52"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight card-lab-frame__highlight--primary"
          d={`M 4 ${corner + 3} C 4 11, 11 4, ${corner + 4} 4`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".98"
          strokeWidth="2.1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__top-reflection"
          d={`M ${corner + 10} 4 H ${Math.min(width - corner - 24, width * 0.60)}`}
          stroke={`url(#${ids.top})`}
          strokeWidth="1.65"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight"
          d={`M ${width - corner - 7} 4 C ${width - 11} 4, ${right} 11, ${right} ${corner - 7}`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".42"
          strokeWidth="1.15"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight"
          d={`M ${right} ${height - corner - 6} C ${right} ${height - 11}, ${width - 11} ${bottom}, ${width - corner - 6} ${bottom}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".68"
          strokeWidth="1.45"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight card-lab-frame__highlight--primary"
          d={`M ${corner + 4} ${bottom} C 11 ${bottom}, 4 ${height - 11}, 4 ${height - corner - 4}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".80"
          strokeWidth="1.75"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__bottom-rim"
          d={`M ${corner + 11} ${height - 4} H ${width - corner - 9}`}
          stroke={`url(#${ids.bottom})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={`M 13 15 C ${width * 0.26} 9, ${width * 0.43} 9, ${width * 0.55} 17`}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".038"
          strokeWidth={isStat ? "9" : "11"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

export function InlineIconWell({
  tone,
}: {
  tone: CardLabTone;
}) {
  const rawId = useId().replaceAll(":", "");
  const ids = {
    fill: `well-fill-v13-${rawId}`,
    inner: `well-inner-v13-${rawId}`,
    glow: `well-glow-v13-${rawId}`,
  };

  const color = toneColors[tone];

  return (
    <svg
      className="card-lab-icon-well__frame"
      viewBox="0 0 72 72"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-icon-well-version="v1.3"
    >
      <defs>
        <radialGradient id={ids.fill} cx=".28" cy=".08" r=".96">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".27" />
          <stop offset="25%" stopColor={color.main} stopOpacity=".21" />
          <stop offset="100%" stopColor="#010713" stopOpacity=".985" />
        </radialGradient>
        <linearGradient id={ids.inner} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.light} stopOpacity=".44" />
          <stop offset="100%" stopColor={color.dark} stopOpacity=".11" />
        </linearGradient>
        <filter id={ids.glow} x="-55%" y="-55%" width="210%" height="210%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="3.3"
            floodColor={color.main}
            floodOpacity=".64"
          />
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity=".46"
          />
        </filter>
      </defs>

      <g filter={`url(#${ids.glow})`}>
        <path
          d="M 20 4 H 52 L 68 20 V 52 L 52 68 H 20 L 4 52 V 20 Z"
          fill={`url(#${ids.fill})`}
          stroke={color.main}
          strokeOpacity=".82"
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 23 11 H 49 L 61 23 V 49 L 49 61 H 23 L 11 49 V 23 Z"
          fill="none"
          stroke={`url(#${ids.inner})`}
          strokeWidth=".8"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 21 5 H 47"
          stroke="#FFFFFF"
          strokeOpacity=".18"
          strokeWidth="1.35"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
