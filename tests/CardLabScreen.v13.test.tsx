import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabScreen } from "../src/screens/CardLabScreen";

describe("ArmaDesk Card Lab v1.3", () => {
  it("renders final frame geometry", () => {
    const { container } = render(<CardLabScreen />);

    expect(
      container
        .querySelector(".card-lab-screen")
        ?.getAttribute("data-card-lab-version"),
    ).toBe("v1.3");

    const statFrame = container.querySelector(
      '.card-lab-stat .card-lab-frame[data-frame-variant="stat"]',
    );
    const actionFrame = container.querySelector(
      '.card-lab-action .card-lab-frame[data-frame-variant="action"]',
    );

    expect(statFrame?.getAttribute("viewBox")).toBe("0 0 136 226");
    expect(actionFrame?.getAttribute("viewBox")).toBe("0 0 286 126");
  });

  it("renders detailed custom icons with visible document lines", () => {
    const { container } = render(<CardLabScreen />);

    expect(
      container.querySelector('[data-premium-icon="estimate-document-v1.3"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-premium-icon="create-estimate-v1.3"]'),
    ).toBeTruthy();

    const estimateIcon = container.querySelector(
      '[data-premium-icon="estimate-document-v1.3"]',
    );
    expect(estimateIcon?.querySelectorAll("path").length).toBeGreaterThanOrEqual(5);

    expect(screen.getAllByLabelText("Create Estimate").length).toBeGreaterThan(1);
  });

  it("uses second inner rim and non-scaling strokes without masks", () => {
    const { container } = render(<CardLabScreen />);

    expect(
      container.querySelector(".card-lab-frame__inner-rim-secondary"),
    ).toBeTruthy();
    expect(
      container.querySelector('[vector-effect="non-scaling-stroke"]'),
    ).toBeTruthy();
    expect(container.querySelector("mask")).toBeNull();
  });

  it("keeps tight pressed and focus states", () => {
    const { container } = render(<CardLabScreen />);

    expect(container.querySelector(".card-lab-card.is-pressed")).toBeTruthy();
    expect(container.querySelector(".card-lab-card.is-focus")).toBeTruthy();
    expect(
      container.querySelector(".is-focus .card-lab-frame__highlight--primary"),
    ).toBeTruthy();
  });
});
