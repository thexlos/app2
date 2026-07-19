import type { LucideIcon } from "lucide-react";

export type PremiumTone =
  | "cyan"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "blue";

export type PremiumStatItem = {
  label: string;
  value: number | string;
  trend: string;
  icon: LucideIcon;
  tone: PremiumTone;
  onClick: () => void;
};

export type PremiumActionItem = {
  label: string;
  icon: LucideIcon;
  tone: PremiumTone;
  onClick: () => void;
};

export type PremiumScheduleItem = {
  month: string;
  day: string;
  weekday: string;
  title: string;
  detail: string;
  status: string;
  extra?: string;
  onClick: () => void;
};

export type PremiumSuggestionItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: PremiumTone;
  onClick: () => void;
};
