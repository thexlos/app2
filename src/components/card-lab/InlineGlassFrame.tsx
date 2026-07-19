import { useId } from "react";

export type CardLabTone = "cyan" | "green" | "purple" | "orange";

const toneColors: Record<
  CardLabTone,
  { main: string; light: string; dark: string }
> = {
  cyan: { main: "#00E5FF", light: "#BFF8FF", dark: "#064B73" },
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
    surface: `surface-${rawId}`,
    rim: `rim-${rawId}`,
    glow: `glow-${rawId}`,
    sheen: `sheen-${rawId}`,
  };
  const color = toneColors[tone];
  const isStat = variant === "stat";
  const width = isStat ? 120 : 260;
  const height = isStat ? 180 : 92;
  const radius = isStat ? 24 : 25;
  const innerRadius = radius - 5;

  const corner = isStat ? 25 : 27;
  const topRightX = width - 3;
  const bottomY = height - 3;

  return (
    <svg
      className="card-lab-frame"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={ids.surface} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#193756" stopOpacity=".98" />
          <stop offset="38%" stopColor="#091D35" stopOpacity=".99" />
          <stop offset="100%" stopColor="#020A17" stopOpacity=".995" />
        </linearGradient>
        <linearGradient id={ids.rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.light} stopOpacity=".95" />
          <stop offset="18%" stopColor={color.main} stopOpacity=".72" />
          <stop offset="57%" stopColor={color.dark} stopOpacity=".28" />
          <stop offset="100%" stopColor={color.main} stopOpacity=".92" />
        </linearGradient>
        <linearGradient id={ids.sheen} x1="0" y1="0" x2="1" y2=".75">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".25" />
          <stop offset="28%" stopColor="#FFFFFF" stopOpacity=".05" />
          <stop offset="68%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={ids.glow} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation={isStat ? "3.6" : "3.2"}
            floodColor={color.main}
            floodOpacity=".55"
          />
          <feDropShadow
            dx="0"
            dy="9"
            stdDeviation="8"
            floodColor="#000000"
            floodOpacity=".42"
          />
        </filter>
      </defs>

      <g filter={`url(#${ids.glow})`}>
        <rect
          x="3"
          y="3"
          width={width - 6}
          height={height - 6}
          rx={radius}
          fill={`url(#${ids.surface})`}
          stroke={`url(#${ids.rim})`}
          strokeWidth="1.35"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          x="7"
          y="7"
          width={width - 14}
          height={height - 14}
          rx={innerRadius}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".08"
          strokeWidth=".75"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={`M ${radius + 5} 5 H ${width - radius - 8}`}
          stroke={`url(#${ids.sheen})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${width - 5} ${radius + 8} V ${height - radius - 9}`}
          stroke={color.main}
          strokeOpacity=".45"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${radius + 10} ${height - 5} H ${width - radius - 7}`}
          stroke={color.main}
          strokeOpacity=".62"
          strokeWidth="1.7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={`M 4 ${corner + 3} C 4 10, 10 4, ${corner + 3} 4`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".92"
          strokeWidth="2.15"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${width - corner - 3} 4 C ${width - 10} 4, ${topRightX} 10, ${topRightX} ${corner + 3}`}
          fill="none"
          stroke={color.light}
          strokeOpacity=".72"
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${topRightX} ${height - corner - 3} C ${topRightX} ${height - 10}, ${width - 10} ${bottomY}, ${width - corner - 3} ${bottomY}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".80"
          strokeWidth="1.9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${corner + 3} ${bottomY} C 10 ${bottomY}, 4 ${height - 10}, 4 ${height - corner - 3}`}
          fill="none"
          stroke={color.main}
          strokeOpacity=".74"
          strokeWidth="1.9"
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
    fill: `well-fill-${rawId}`,
    glow: `well-glow-${rawId}`,
  };
  const color = toneColors[tone];

  return (
    <svg
      className="card-lab-icon-well__frame"
      viewBox="0 0 64 64"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={ids.fill} cx=".32" cy=".12" r=".95">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".25" />
          <stop offset="30%" stopColor={color.main} stopOpacity=".22" />
          <stop offset="100%" stopColor="#020B1A" stopOpacity=".97" />
        </radialGradient>
        <filter id={ids.glow} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="4"
            floodColor={color.main}
            floodOpacity=".72"
          />
        </filter>
      </defs>
      <g filter={`url(#${ids.glow})`}>
        <path
          d="M 18 4 H 46 L 60 18 V 46 L 46 60 H 18 L 4 46 V 18 Z"
          fill={`url(#${ids.fill})`}
          stroke={color.main}
          strokeOpacity=".78"
          strokeWidth="1.15"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 21 10 H 43 L 54 21 V 43 L 43 54 H 21 L 10 43 V 21 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".10"
          strokeWidth=".75"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
