export type HeroMetricLabel = "Estimates" | "Invoices" | "Customers" | "Tasks";
export type HeroMetricTone = "blue" | "green" | "purple" | "orange";

export type HeroAnalyticsMetric = {
  label: HeroMetricLabel;
  value: number;
  tone: HeroMetricTone;
};

export type HeroAnalyticsBadge = {
  value: string;
  label: string;
  comparison?: string;
};

export type HomeHeroAnalyticsVisualProps = {
  metrics: HeroAnalyticsMetric[];
  badge: HeroAnalyticsBadge;
};
