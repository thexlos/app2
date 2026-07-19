import { useId } from "react";
import type { CardLabTone } from "./InlineGlassFrame";

const iconTones: Record<
  CardLabTone,
  { main: string; light: string; dark: string }
> = {
  cyan: { main: "#00E5FF", light: "#D8FCFF", dark: "#07567B" },
  green: { main: "#22D88A", light: "#DEFFF1", dark: "#087247" },
  purple: { main: "#B26CFF", light: "#F5E9FF", dark: "#633098" },
  orange: { main: "#FFB020", light: "#FFF4D1", dark: "#965608" },
};

function PremiumIconDefs({
  id,
  tone,
}: {
  id: string;
  tone: CardLabTone;
}) {
  const color = iconTones[tone];

  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color.light} stopOpacity=".27" />
        <stop offset="20%" stopColor={color.main} stopOpacity=".36" />
        <stop offset="100%" stopColor={color.dark} stopOpacity=".10" />
      </linearGradient>
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={color.light} />
        <stop offset="100%" stopColor={color.main} />
      </linearGradient>
      <filter id={`${id}-glow`} x="-65%" y="-65%" width="230%" height="230%">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="2.2"
          floodColor={color.main}
          floodOpacity=".92"
        />
      </filter>
    </defs>
  );
}

export function PremiumEstimateDocumentIcon({
  tone,
  className = "",
}: {
  tone: CardLabTone;
  className?: string;
}) {
  const id = useId().replaceAll(":", "");
  const color = iconTones[tone];

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      data-premium-icon="estimate-document-v1.3"
    >
      <PremiumIconDefs id={id} tone={tone} />

      <g filter={`url(#${id}-glow)`}>
        <path
          d="M 15 6 H 39 L 50 17 V 57 H 15 Z"
          fill={`url(#${id}-body)`}
          stroke={color.main}
          strokeWidth="2.45"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 39 6 V 18 H 50"
          fill="none"
          stroke={color.light}
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d="M 23 25 H 42"
          stroke={`url(#${id}-line)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 23 35 H 42"
          stroke={`url(#${id}-line)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 23 45 H 39"
          stroke={`url(#${id}-line)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

export function PremiumCreateEstimateIcon({
  tone,
  className = "",
}: {
  tone: CardLabTone;
  className?: string;
}) {
  const id = useId().replaceAll(":", "");
  const color = iconTones[tone];

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      data-premium-icon="create-estimate-v1.3"
    >
      <PremiumIconDefs id={id} tone={tone} />

      <g filter={`url(#${id}-glow)`}>
        <path
          d="M 13 6 H 36 L 47 17 V 54 H 13 Z"
          fill={`url(#${id}-body)`}
          stroke={color.main}
          strokeWidth="2.35"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 36 6 V 18 H 47"
          fill="none"
          stroke={color.light}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d="M 21 25 H 38"
          stroke={`url(#${id}-line)`}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 21 35 H 34"
          stroke={`url(#${id}-line)`}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <circle
          cx="48"
          cy="47"
          r="9"
          fill="#020A16"
          stroke={color.main}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 48 43 V 51 M 44 47 H 52"
          stroke={color.light}
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
