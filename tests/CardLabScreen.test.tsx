import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabScreen } from "../src/screens/CardLabScreen";

describe("ArmaDesk isolated Card Lab", () => {
  it("renders working stat and Quick Action prototypes", () => {
    const { container } = render(<CardLabScreen />);

    expect(screen.getByText("Isolated Premium Card Lab")).toBeTruthy();
    expect(container.querySelectorAll(".card-lab-stat").length).toBeGreaterThan(3);
    expect(container.querySelectorAll(".card-lab-action").length).toBeGreaterThan(3);
  });

  it("uses non-scaling SVG strokes and live content", () => {
    const { container } = render(<CardLabScreen />);

    expect(
      container.querySelector('[vector-effect="non-scaling-stroke"]'),
    ).toBeTruthy();
    expect(screen.getAllByText("Estimates").length).toBeGreaterThan(1);
    expect(screen.getAllByText("Create Estimate").length).toBeGreaterThan(1);
  });
});
