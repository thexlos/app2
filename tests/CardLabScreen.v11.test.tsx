import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabScreen } from "../src/screens/CardLabScreen";

describe("ArmaDesk Card Lab v1.1", () => {
  it("renders the v1.1 stat and action geometry", () => {
    const { container } = render(<CardLabScreen />);

    expect(
      container
        .querySelector(".card-lab-screen")
        ?.getAttribute("data-card-lab-version"),
    ).toBe("v1.1");

    const statFrame = container.querySelector(
      '.card-lab-stat .card-lab-frame[data-frame-variant="stat"]',
    );
    const actionFrame = container.querySelector(
      '.card-lab-action .card-lab-frame[data-frame-variant="action"]',
    );

    expect(statFrame?.getAttribute("viewBox")).toBe("0 0 128 226");
    expect(actionFrame?.getAttribute("viewBox")).toBe("0 0 260 132");
  });

  it("uses live two-line action content without masks or shell images", () => {
    const { container } = render(<CardLabScreen />);

    expect(screen.getAllByLabelText("Create Estimate").length).toBeGreaterThan(1);
    expect(
      container.querySelectorAll(".card-lab-action__label > span"),
    ).not.toHaveLength(0);
    expect(container.querySelector("mask")).toBeNull();
    expect(
      container.querySelector('[vector-effect="non-scaling-stroke"]'),
    ).toBeTruthy();
  });

  it("keeps distinct pressed and focus presentation classes", () => {
    const { container } = render(<CardLabScreen />);

    expect(container.querySelector(".card-lab-card.is-pressed")).toBeTruthy();
    expect(container.querySelector(".card-lab-card.is-focus")).toBeTruthy();
    expect(
      container.querySelector(".is-focus .card-lab-frame__highlight--primary"),
    ).toBeTruthy();
  });
});
