import { useId } from "react";

export type CardLabTone = "cyan" | "green" | "purple" | "orange";

const toneColors: Record<
  CardLabTone,
  { main: string; light: string; dark: string }
> = {
  cyan: { main: "#00E5FF", light: "#C7FAFF", dark: "#064B73" },
  green: { main: "#22D88A", light: "#C7FFE7", dark: "#08603D" },
  purple: { main: "#B26CFF", light: "#F0DCFF", dark: "#57238E" },
  orange: { main: "#FFB020", light: "#FFF0BF", dark: "#8A4B04" },
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
    surface: `surface-v11-${rawId}`,
    tone: `tone-v11-${rawId}`,
    sheen: `sheen-v11-${rawId}`,
    texture: `texture-v11-${rawId}`,
    glow: `glow-v11-${rawId}`,
    bottom: `bottom-v11-${rawId}`,
  };

  const color = toneColors[tone];
  const isStat = variant === "stat";
  const width = isStat ? 128 : 260;
  const height = isStat ? 226 : 132;
  const radius = isStat ? 25 : 27;
  const innerRadius = radius - 5;
  const corner = isStat ? 30 : 32;
  const right = width - 3;
  const bottom = height - 3;

  return (
    <svg
      className="card-lab-frame"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-frame-version="v1.1"
      data-frame-variant={variant}
    >
      <defs>
        <linearGradient id={ids.surface} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#183957" stopOpacity=".995" />
          <stop offset="32%" stopColor="#0A203A" stopOpacity=".995" />
          <stop offset="72%" stopColor="#061426" stopOpacity=".998" />
          <stop offset="100%" stopColor="#010712" />
        </linearGradient>

        <radialGradient id={ids.tone} cx=".18" cy=".06" r=".92">
          <stop offset="0%" stopColor={color.main} stopOpacity=".20" />
          <stop offset="43%" stopColor={color.main} stopOpacity=".055" />
          <stop offset="100%" stopColor={color.dark} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={ids.sheen} x1="0" y1="0" x2="1" y2=".8">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".28" />
          <stop offset="25%" stopColor="#FFFFFF" stopOpacity=".07" />
          <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={ids.bottom} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color.main} stopOpacity="0" />
          <stop offset="22%" stopColor={color.main} stopOpacity=".68" />
          <stop offset="82%" stopColor={color.main} stopOpacity=".82" />
          <stop offset="100%" stopColor={color.main} stopOpacity="0" />
        </linearGradient>

        <pattern
          id={ids.texture}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M -4 18 L 18 -4 M 4 22 L 22 4"
            stroke={color.main}
            strokeOpacity=".055"
            strokeWidth=".55"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="15"
            cy="15"
            r=".7"
            fill={color.main}
            fillOpacity=".10"
          />
        </pattern>

        <filter id={ids.glow} x="-35%" y="-30%" width="170%" height="175%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation={isStat ? "2.7" : "2.5"}
            floodColor={color.main}
            floodOpacity=".42"
          />
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="9"
            floodColor="#000000"
            floodOpacity=".52"
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
          strokeOpacity=".30"
          strokeWidth=".9"
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
          className="card-lab-frame__texture"
          x="8"
          y="8"
          width={width - 16}
          height={height - 16}
          rx={innerRadius}
          fill={`url(#${ids.texture})`}
        />

        <path
          d={`M 9 ${radius + 6} V ${height - radius - 14}`}
          stroke={color.main}
          strokeOpacity=".17"
          strokeWidth=".8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight card-lab-frame__highlight--primary"
          d={`M 4 ${corner + 2} C 4 11, 11 4, ${corner + 4} 4`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".96"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight"
          d={`M ${corner + 8} 4 H ${width - corner - 18}`}
          stroke={`url(#${ids.sheen})`}
          strokeWidth="2.05"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight"
          d={`M ${width - corner - 8} 4 C ${width - 11} 4, ${right} 11, ${right} ${corner - 2}`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".58"
          strokeWidth="1.45"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight"
          d={`M ${right} ${height - corner - 5} C ${right} ${height - 11}, ${width - 11} ${bottom}, ${width - corner - 4} ${bottom}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".78"
          strokeWidth="1.75"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__highlight card-lab-frame__highlight--primary"
          d={`M ${corner + 2} ${bottom} C 11 ${bottom}, 4 ${height - 11}, 4 ${height - corner - 2}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".84"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="card-lab-frame__bottom-rim"
          d={`M ${corner + 9} ${height - 4} H ${width - corner - 7}`}
          stroke={`url(#${ids.bottom})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={`M 11 13 C ${width * 0.30} 5, ${width * 0.55} 7, ${width - 18} 25`}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".06"
          strokeWidth={isStat ? "15" : "19"}
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
    fill: `well-fill-v11-${rawId}`,
    side: `well-side-v11-${rawId}`,
    glow: `well-glow-v11-${rawId}`,
  };
  const color = toneColors[tone];

  return (
    <svg
      className="card-lab-icon-well__frame"
      viewBox="0 0 72 72"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-icon-well-version="v1.1"
    >
      <defs>
        <radialGradient id={ids.fill} cx=".30" cy=".10" r=".96">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".30" />
          <stop offset="24%" stopColor={color.main} stopOpacity=".28" />
          <stop offset="100%" stopColor="#020A18" stopOpacity=".98" />
        </radialGradient>
        <linearGradient id={ids.side} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.light} stopOpacity=".50" />
          <stop offset="100%" stopColor={color.dark} stopOpacity=".18" />
        </linearGradient>
        <filter id={ids.glow} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="4.2"
            floodColor={color.main}
            floodOpacity=".75"
          />
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity=".42"
          />
        </filter>
      </defs>

      <g filter={`url(#${ids.glow})`}>
        <path
          d="M 20 4 H 52 L 68 20 V 52 L 52 68 H 20 L 4 52 V 20 Z"
          fill={`url(#${ids.fill})`}
          stroke={color.main}
          strokeOpacity=".86"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 23 10 H 49 L 62 23 V 49 L 49 62 H 23 L 10 49 V 23 Z"
          fill="none"
          stroke={`url(#${ids.side})`}
          strokeWidth=".9"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 20 5 H 46"
          stroke="#FFFFFF"
          strokeOpacity=".24"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 67 26 V 47"
          stroke={color.main}
          strokeOpacity=".42"
          strokeWidth="1.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
