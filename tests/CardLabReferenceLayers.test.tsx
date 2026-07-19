import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabReferenceLayersScreen } from "../src/screens/CardLabReferenceLayersScreen";

describe("ArmaDesk reference-derived layer Card Lab", () => {
  it("uses exact source-derived aspect ratios", () => {
    const { container } = render(<CardLabReferenceLayersScreen />);

    const stat = container.querySelector('[data-reference-layer-card="stat"]');
    const action = container.querySelector('[data-reference-layer-card="action"]');

    expect(stat?.getAttribute("data-source-ratio")).toBe("210/340");
    expect(action?.getAttribute("data-source-ratio")).toBe("283/167");
  });

  it("renders independent border, texture, icon, and live content layers", () => {
    const { container } = render(<CardLabReferenceLayersScreen />);

    expect(container.querySelector(".reference-card__border")).toBeTruthy();
    expect(container.querySelector(".reference-card__texture")).toBeTruthy();
    expect(container.querySelector(".reference-card__icon-cluster")).toBeTruthy();
    expect(container.querySelector(".reference-stat__value")).toBeTruthy();
    expect(container.querySelector(".reference-action__arrow")).toBeTruthy();
  });

  it("keeps text and values live", () => {
    render(<CardLabReferenceLayersScreen />);

    expect(screen.getAllByText("Estimates").length).toBeGreaterThan(1);
    expect(screen.getAllByText("12").length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText("Create Estimate").length).toBeGreaterThan(1);
  });
});
