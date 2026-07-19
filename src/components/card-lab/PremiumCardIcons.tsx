import { useId } from "react";
import type { CardLabTone } from "./InlineGlassFrame";

const iconTones: Record<CardLabTone, { main: string; light: string; dark: string }> = {
  cyan: { main: "#00E5FF", light: "#C7FAFF", dark: "#07567B" },
  green: { main: "#22D88A", light: "#D5FFED", dark: "#087247" },
  purple: { main: "#B26CFF", light: "#F2E2FF", dark: "#633098" },
  orange: { main: "#FFB020", light: "#FFF2C9", dark: "#965608" },
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
        <stop offset="0%" stopColor={color.light} stopOpacity=".36" />
        <stop offset="22%" stopColor={color.main} stopOpacity=".92" />
        <stop offset="100%" stopColor={color.dark} stopOpacity=".72" />
      </linearGradient>
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={color.light} />
        <stop offset="100%" stopColor={color.main} />
      </linearGradient>
      <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="2.4"
          floodColor={color.main}
          floodOpacity=".90"
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
      data-premium-icon="estimate-document"
    >
      <PremiumIconDefs id={id} tone={tone} />
      <g filter={`url(#${id}-glow)`}>
        <path
          d="M 16 7 H 39 L 49 17 V 55 H 16 Z"
          fill={`url(#${id}-body)`}
          fillOpacity=".18"
          stroke={color.main}
          strokeWidth="2.4"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 39 7 V 18 H 49"
          stroke={color.light}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 23 25 H 42"
          stroke={`url(#${id}-line)`}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 23 34 H 42"
          stroke={`url(#${id}-line)`}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 23 43 H 36"
          stroke={`url(#${id}-line)`}
          strokeWidth="3"
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
      data-premium-icon="create-estimate"
    >
      <PremiumIconDefs id={id} tone={tone} />
      <g filter={`url(#${id}-glow)`}>
        <path
          d="M 14 7 H 37 L 47 17 V 53 H 14 Z"
          fill={`url(#${id}-body)`}
          fillOpacity=".18"
          stroke={color.main}
          strokeWidth="2.3"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 37 7 V 18 H 47"
          stroke={color.light}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 21 25 H 38"
          stroke={`url(#${id}-line)`}
          strokeWidth="2.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 21 33 H 33"
          stroke={`url(#${id}-line)`}
          strokeWidth="2.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="47"
          cy="47"
          r="10"
          fill="#03101F"
          stroke={color.main}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 47 42 V 52 M 42 47 H 52"
          stroke={color.light}
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
