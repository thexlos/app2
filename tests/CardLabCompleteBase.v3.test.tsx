import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabCompleteBaseScreen } from "../src/screens/CardLabCompleteBaseScreen";

describe("Complete Blank Base Lab v3", () => {
  it("renders one complete artwork image plus live content", () => {
    const { container } = render(<CardLabCompleteBaseScreen />);

    expect(
      container
        .querySelector(".complete-base-lab")
        ?.getAttribute("data-complete-base-lab"),
    ).toBe("v3");

    expect(container.querySelector(".complete-base-card__artwork")).toBeTruthy();
    expect(container.querySelector(".complete-base-stat__value")).toBeTruthy();
    expect(container.querySelector(".complete-base-action__arrow")).toBeTruthy();
  });

  it("uses the complete padded base dimensions", () => {
    const { container } = render(<CardLabCompleteBaseScreen />);

    const stat = container.querySelector('[data-complete-base-card="stat"]');
    const action = container.querySelector('[data-complete-base-card="action"]');

    expect(stat?.getAttribute("data-core-size")).toBe("210x340");
    expect(stat?.getAttribute("data-base-size")).toBe("270x400");
    expect(action?.getAttribute("data-core-size")).toBe("283x167");
    expect(action?.getAttribute("data-base-size")).toBe("343x227");
  });

  it("keeps text and arrows live", () => {
    render(<CardLabCompleteBaseScreen />);

    expect(screen.getAllByText("Estimates").length).toBeGreaterThan(1);
    expect(screen.getAllByText("12").length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText("Create Estimate").length).toBeGreaterThan(1);
  });
});
