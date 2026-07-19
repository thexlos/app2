import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabCleanArtworkScreen } from "../src/screens/CardLabCleanArtworkScreen";

describe("Clean Artwork Lab v2.2", () => {
  it("renders padded artwork separate from live content", () => {
    const { container } = render(<CardLabCleanArtworkScreen />);

    expect(
      container
        .querySelector(".clean-art-lab")
        ?.getAttribute("data-clean-art-lab"),
    ).toBe("v2.2");

    expect(container.querySelector(".clean-art-card__surface")).toBeTruthy();
    expect(container.querySelector(".clean-art-card__padded-art")).toBeTruthy();
    expect(
      container.querySelector(".clean-art-card__artwork-layer--border"),
    ).toBeTruthy();
    expect(
      container.querySelector(".clean-art-card__artwork-layer--texture"),
    ).toBeTruthy();
    expect(
      container.querySelector(".clean-art-card__artwork-layer--icon"),
    ).toBeTruthy();
    expect(container.querySelector(".clean-stat__value")).toBeTruthy();
    expect(container.querySelector(".clean-action__arrow")).toBeTruthy();
  });

  it("uses the padded and core dimensions", () => {
    const { container } = render(<CardLabCleanArtworkScreen />);

    const stat = container.querySelector('[data-clean-artwork-card="stat"]');
    const action = container.querySelector('[data-clean-artwork-card="action"]');

    expect(stat?.getAttribute("data-core-size")).toBe("210x340");
    expect(stat?.getAttribute("data-artwork-size")).toBe("250x380");
    expect(action?.getAttribute("data-core-size")).toBe("283x167");
    expect(action?.getAttribute("data-artwork-size")).toBe("327x211");
  });

  it("keeps all text and arrows live", () => {
    render(<CardLabCleanArtworkScreen />);

    expect(screen.getAllByText("Estimates").length).toBeGreaterThan(1);
    expect(screen.getAllByText("12").length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText("Create Estimate").length).toBeGreaterThan(1);
  });
});
