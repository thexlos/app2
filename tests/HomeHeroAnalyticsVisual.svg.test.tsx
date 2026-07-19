import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeroAnalyticsVisual } from "../src/components/home/HomeHeroAnalyticsVisual";

const metrics = [
  { label: "Estimates" as const, value: 4, tone: "blue" as const },
  { label: "Invoices" as const, value: 2, tone: "purple" as const },
  { label: "Customers" as const, value: 3, tone: "blue" as const },
  { label: "Tasks" as const, value: 4, tone: "green" as const },
];

describe("HomeHeroAnalyticsVisual exact visual shell v1", () => {
  it("keeps bars and line in the same SVG coordinate system", () => {
    const { container } = render(
      <HomeHeroAnalyticsVisual
        metrics={metrics}
        badge={{ value: "0 active", label: "work items" }}
      />,
    );

    const root = screen.getByTestId("home-hero-analytics");
    expect(root.getAttribute("data-layout-version")).toBe("hero-shell-v1");
    expect(root.getAttribute("data-composition-split")).toBe("43-57");
    expect(root.getAttribute("data-chart-contained")).toBe("true");
    expect(root.getAttribute("data-bar-count")).toBe("4");
    expect(root.getAttribute("data-line-source")).toBe(
      "same-shell-bar-top-points",
    );
    expect(root.getAttribute("data-categories")).toBe(
      "Estimates,Invoices,Customers,Tasks",
    );
    expect(root.getAttribute("data-badge-value")).toBe("13 active");

    expect(container.querySelectorAll(".home-hero-analytics__bar-group")).toHaveLength(4);
    expect(container.querySelectorAll(".home-hero-analytics__line-point")).toHaveLength(4);
    expect(container.querySelectorAll(".home-hero-analytics__pin")).toHaveLength(4);
    expect(container.querySelectorAll(".home-hero-analytics__callout")).toHaveLength(4);

    expect(screen.queryByText("+23%")).toBeNull();
    expect(screen.queryByText(/vs last week/i)).toBeNull();
  });
});
