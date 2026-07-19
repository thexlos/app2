import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabReferenceLayersScreen } from "../src/screens/CardLabReferenceLayersScreen";

describe("Reference Layer Lab v2.1 registration cleanup", () => {
  it("uses full-canvas inset-zero registration for every visual layer", () => {
    const { container } = render(<CardLabReferenceLayersScreen />);

    expect(
      container
        .querySelector(".reference-lab-screen")
        ?.getAttribute("data-reference-layer-lab"),
    ).toBe("v2.1");

    expect(
      container.querySelector(
        '[data-registration="full-canvas-inset-zero"]',
      ),
    ).toBeTruthy();

    expect(
      container.querySelectorAll(".reference-card__layer").length,
    ).toBeGreaterThan(4);
  });

  it("keeps exact source ratios and live content", () => {
    const { container } = render(<CardLabReferenceLayersScreen />);

    expect(
      container
        .querySelector('[data-reference-layer-card="stat"]')
        ?.getAttribute("data-source-ratio"),
    ).toBe("210/340");

    expect(
      container
        .querySelector('[data-reference-layer-card="action"]')
        ?.getAttribute("data-source-ratio"),
    ).toBe("283/167");

    expect(screen.getAllByText("Estimates").length).toBeGreaterThan(1);
    expect(screen.getAllByText("12").length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText("Create Estimate").length).toBeGreaterThan(1);
  });

  it("uses separate surface, texture, border, well, and glyph layers", () => {
    const { container } = render(<CardLabReferenceLayersScreen />);

    expect(container.querySelector(".reference-card__surface")).toBeTruthy();
    expect(container.querySelector(".reference-card__texture")).toBeTruthy();
    expect(container.querySelector(".reference-card__border")).toBeTruthy();
    expect(container.querySelector(".reference-card__icon-well")).toBeTruthy();
    expect(container.querySelector(".reference-card__icon-glyph")).toBeTruthy();
  });

  it("supports long values, long trends, single-line and long labels", () => {
    const { container } = render(<CardLabReferenceLayersScreen />);

    expect(container.querySelector(".is-long-value")).toBeTruthy();
    expect(container.querySelector(".is-long-trend")).toBeTruthy();
    expect(container.querySelector(".is-single-line")).toBeTruthy();
    expect(container.querySelector(".is-long-label")).toBeTruthy();
  });
});
