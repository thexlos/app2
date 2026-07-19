import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabScreen } from "../src/screens/CardLabScreen";

describe("ArmaDesk Card Lab container-scaling compatibility", () => {
  it("renders corrected frame geometry and container scaling", () => {
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

    expect(
      container.querySelector('[data-scale-mode="container"]'),
    ).toBeTruthy();
  });

  it("uses custom live premium SVG icons", () => {
    const { container } = render(<CardLabScreen />);

    expect(
      container.querySelector(
        '[data-premium-icon="estimate-document-v1.3"]',
      ),
    ).toBeTruthy();
    expect(
      container.querySelector(
        '[data-premium-icon="create-estimate-v1.3"]',
      ),
    ).toBeTruthy();

    expect(screen.getAllByLabelText("Create Estimate").length).toBeGreaterThan(1);
  });

  it("does not use masks or stretched background shells", () => {
    const { container } = render(<CardLabScreen />);

    expect(container.querySelector("mask")).toBeNull();
    expect(
      container.querySelector('[vector-effect="non-scaling-stroke"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-frame-version="v1.3"]'),
    ).toBeTruthy();
  });

  it("keeps pressed and focus presentation distinct", () => {
    const { container } = render(<CardLabScreen />);

    expect(container.querySelector(".card-lab-card.is-pressed")).toBeTruthy();
    expect(container.querySelector(".card-lab-card.is-focus")).toBeTruthy();
    expect(
      container.querySelector(".is-focus .card-lab-frame__highlight--primary"),
    ).toBeTruthy();
  });
});
