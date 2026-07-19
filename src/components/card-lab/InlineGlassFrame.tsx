import { useId } from "react";

export type CardLabTone = "cyan" | "green" | "purple" | "orange";

const toneColors: Record<
  CardLabTone,
  { main: string; light: string; dark: string }
> = {
  cyan: { main: "#00E5FF", light: "#D0FBFF", dark: "#064B73" },
  green: { main: "#22D88A", light: "#D8FFEF", dark: "#08603D" },
  purple: { main: "#B26CFF", light: "#F3E4FF", dark: "#57238E" },
  orange: { main: "#FFB020", light: "#FFF2C9", dark: "#8A4B04" },
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
    surface: `surface-v12-${rawId}`,
    tone: `tone-v12-${rawId}`,
    topSheen: `top-sheen-v12-${rawId}`,
    bottomRim: `bottom-rim-v12-${rawId}`,
    circuit: `circuit-v12-${rawId}`,
    glow: `glow-v12-${rawId}`,
  };

  const color = toneColors[tone];
  const isStat = variant === "stat";
  const width = isStat ? 132 : 280;
  const height = isStat ? 220 : 132;
  const radius = isStat ? 25 : 28;
  const innerRadius = radius - 5;
  const corner = isStat ? 30 : 34;
  const right = width - 3;
  const bottom = height - 3;

  return (
    <svg
      className="card-lab-frame"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-frame-version="v1.2"
      data-frame-variant={variant}
    >
      <defs>
        <linearGradient id={ids.surface} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14334E" />
          <stop offset="31%" stopColor="#091D34" />
          <stop offset="72%" stopColor="#04111F" />
          <stop offset="100%" stopColor="#01060F" />
        </linearGradient>

        <radialGradient id={ids.tone} cx=".12" cy=".04" r=".82">
          <stop offset="0%" stopColor={color.main} stopOpacity=".12" />
          <stop offset="42%" stopColor={color.main} stopOpacity=".025" />
          <stop offset="100%" stopColor={color.dark} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={ids.topSheen} x1="0" y1="0" x2="1" y2=".75">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".24" />
          <stop offset="24%" stopColor="#FFFFFF" stopOpacity=".055" />
          <stop offset="62%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={ids.bottomRim} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color.main} stopOpacity="0" />
          <stop offset="18%" stopColor={color.main} stopOpacity=".58" />
          <stop offset="84%" stopColor={color.main} stopOpacity=".78" />
          <stop offset="100%" stopColor={color.main} stopOpacity="0" />
        </linearGradient>

        <pattern
          id={ids.circuit}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M -6 28 L 28 -6 M 4 32 L 32 4"
            stroke={color.main}
            strokeOpacity=".035"
            strokeWidth=".55"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 4 20 H 11 V 14 H 20"
            fill="none"
            stroke={color.main}
            strokeOpacity=".05"
            strokeWidth=".55"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="20" cy="14" r=".8" fill={color.main} fillOpacity=".10" />
        </pattern>

        <filter id={ids.glow} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation={isStat ? "2.2" : "2.1"}
            floodColor={color.main}
            floodOpacity=".34"
          />
          <feDropShadow
            dx="0"
            dy="9"
            stdDeviation="9"
            floodColor="#000000"
            floodOpacity=".55"
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
          strokeOpacity=".25"
          strokeWidth=".8"
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
          strokeOpacity=".13"
          strokeWidth=".65"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight card-lab-frame__highlight--primary"
          d={`M 4 ${corner + 3} C 4 11, 11 4, ${corner + 4} 4`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".98"
          strokeWidth="2.15"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__top-sheen"
          d={`M ${corner + 10} 4 H ${width - corner - 22}`}
          stroke={`url(#${ids.topSheen})`}
          strokeWidth="1.85"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight"
          d={`M ${width - corner - 8} 4 C ${width - 11} 4, ${right} 11, ${right} ${corner - 5}`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".50"
          strokeWidth="1.25"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight"
          d={`M ${right} ${height - corner - 5} C ${right} ${height - 11}, ${width - 11} ${bottom}, ${width - corner - 5} ${bottom}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".72"
          strokeWidth="1.55"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight card-lab-frame__highlight--primary"
          d={`M ${corner + 3} ${bottom} C 11 ${bottom}, 4 ${height - 11}, 4 ${height - corner - 3}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".82"
          strokeWidth="1.85"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__bottom-rim"
          d={`M ${corner + 10} ${height - 4} H ${width - corner - 8}`}
          stroke={`url(#${ids.bottomRim})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={`M 12 15 C ${width * 0.32} 7, ${width * 0.56} 8, ${width - 22} 25`}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".045"
          strokeWidth={isStat ? "12" : "15"}
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
    fill: `well-fill-v12-${rawId}`,
    inner: `well-inner-v12-${rawId}`,
    glow: `well-glow-v12-${rawId}`,
  };
  const color = toneColors[tone];

  return (
    <svg
      className="card-lab-icon-well__frame"
      viewBox="0 0 76 76"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-icon-well-version="v1.2"
    >
      <defs>
        <radialGradient id={ids.fill} cx=".28" cy=".08" r=".96">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".30" />
          <stop offset="25%" stopColor={color.main} stopOpacity=".24" />
          <stop offset="100%" stopColor="#010816" stopOpacity=".98" />
        </radialGradient>
        <linearGradient id={ids.inner} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.light} stopOpacity=".48" />
          <stop offset="100%" stopColor={color.dark} stopOpacity=".14" />
        </linearGradient>
        <filter id={ids.glow} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="3.8"
            floodColor={color.main}
            floodOpacity=".70"
          />
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity=".44"
          />
        </filter>
      </defs>

      <g filter={`url(#${ids.glow})`}>
        <path
          d="M 21 4 H 55 L 72 21 V 55 L 55 72 H 21 L 4 55 V 21 Z"
          fill={`url(#${ids.fill})`}
          stroke={color.main}
          strokeOpacity=".84"
          strokeWidth="1.15"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 24 11 H 52 L 65 24 V 52 L 52 65 H 24 L 11 52 V 24 Z"
          fill="none"
          stroke={`url(#${ids.inner})`}
          strokeWidth=".85"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 22 5 H 50"
          stroke="#FFFFFF"
          strokeOpacity=".20"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
