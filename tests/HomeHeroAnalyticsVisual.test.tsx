import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HomeHeroAnalyticsVisual } from "../src/components/home/HomeHeroAnalyticsVisual";

const metrics = [
  { label: "Estimates" as const, value: 4, tone: "blue" as const },
  { label: "Invoices" as const, value: 2, tone: "purple" as const },
  { label: "Customers" as const, value: 3, tone: "blue" as const },
  { label: "Tasks" as const, value: 4, tone: "green" as const },
];

describe("HomeHeroAnalyticsVisual composition v2.3", () => {
  it("renders exactly four live metric bars and truthful total badge", () => {
    const { container } = render(
      <HomeHeroAnalyticsVisual
        metrics={metrics}
        badge={{ value: "0 active", label: "work items" }}
      />,
    );

    const root = screen.getByTestId("home-hero-analytics");
    expect(root.getAttribute("data-layout-version")).toBe("hero-composition-v2.3");
    expect(root.getAttribute("data-composition-split")).toBe("43-57");
    expect(root.getAttribute("data-chart-contained")).toBe("true");
    expect(root.getAttribute("data-bar-count")).toBe("4");
    expect(root.getAttribute("data-line-source")).toBe("same-svg-bar-top-points");
    expect(root.getAttribute("data-categories")).toBe(
      "Estimates,Invoices,Customers,Tasks",
    );
    expect(root.getAttribute("data-value-source")).toBe(
      "current-home-stat-values",
    );
    expect(root.getAttribute("data-badge-value")).toBe("13 active");

    const bars = container.querySelectorAll(
      ".home-hero-analytics__bar-group",
    );
    expect(bars).toHaveLength(4);
    expect(
      container.querySelectorAll(".home-hero-analytics__callout"),
    ).toHaveLength(4);

    for (const label of ["Estimates", "Invoices", "Customers", "Tasks"]) {
      expect(container.querySelector(`[data-category="${label}"]`)).toBeTruthy();
    }

    expect(container.querySelector(".home-hero-analytics__line-path")).toBeTruthy();
    expect(container.querySelectorAll(".home-hero-analytics__line-point")).toHaveLength(4);
    expect(screen.queryByText("+23%")).toBeNull();
    expect(screen.queryByText(/vs last week/i)).toBeNull();
  });

  it("keeps the supplied reduced-motion CSS contract", () => {
    const css = readFileSync(join(process.cwd(), "src/screens/home.css"), "utf8");

    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".home-hero-analytics--composition-v23");
    expect(css).toContain("grid-template-columns: minmax(0, 43fr) minmax(0, 57fr);");
    expect(css).toContain("clip-path: inset(0 round 12px)");
    expect(css).toContain("stroke-dashoffset: 0");
  });
});
