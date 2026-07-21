import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "../src/app/App";
import {
  approvalActionArtwork,
  approvalStatArtwork,
} from "../src/components/card-lab-home-visual/HomeVisualApprovalCards";
import { CardLabHomeVisualScreen } from "../src/screens/CardLabHomeVisualScreen";
import { AppStateProvider } from "../src/state/AppState";

afterEach(() => {
  cleanup();
  window.location.hash = "";
});

describe("isolated Home visual approval lab", () => {
  it("renders on its isolated hash route without the app Home shell", () => {
    window.location.hash = "#/card-lab-home-visual";
    const { container } = render(
      <AppStateProvider>
        <App />
      </AppStateProvider>,
    );

    expect(container.querySelector('[data-home-visual-lab="v2"]')).toBeTruthy();
    expect(container.querySelector(".home-screen")).toBeNull();
    expect(container.querySelector(".home-hero")).toBeNull();
    expect(container.querySelector(".bottom-nav")).toBeNull();
    expect(screen.getByText("Home Card Artwork — Not Integrated Into Home")).toBeTruthy();
  });

  it("uses exactly four supplied stat and six supplied action mappings", () => {
    const { container } = render(<CardLabHomeVisualScreen />);

    expect(Object.keys(approvalStatArtwork)).toEqual([
      "Estimates",
      "Invoices",
      "Customers",
      "Tasks",
    ]);
    expect(Object.keys(approvalActionArtwork)).toEqual([
      "Create Estimate",
      "Create Invoice",
      "Add Customer",
      "Calendar",
      "QR Code",
      "Business Kit",
    ]);
    expect(
      container.querySelectorAll(
        ".home-visual-lab__phone-preview [data-approval-card=\"stat\"]",
      ),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll(
        ".home-visual-lab__phone-preview [data-approval-card=\"action\"]",
      ),
    ).toHaveLength(6);
  });

  it("keeps artwork decorative and all labels, values, trends, and arrows live", () => {
    const { container } = render(<CardLabHomeVisualScreen />);
    const workingPreview = container.querySelector(".home-visual-lab__phone-preview")!;

    expect(workingPreview.querySelectorAll("img.home-visual-card__artwork")).toHaveLength(10);
    expect(workingPreview.querySelectorAll("img[alt=\"\"][aria-hidden=\"true\"]"))
      .toHaveLength(10);
    expect(workingPreview.querySelectorAll(".home-visual-action__arrow")).toHaveLength(6);
    expect(workingPreview.querySelectorAll(".home-chip, .home-stat-card__icon"))
      .toHaveLength(0);
    expect(screen.getByRole("button", { name: "Estimates: 4" })).toBeTruthy();
    expect(screen.getAllByText("↑ 3 today").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Create Estimate" }).length)
      .toBeGreaterThan(0);
  });

  it("keeps approval controls interactive without changing app state", () => {
    render(<CardLabHomeVisualScreen />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "430px" }));
    });
    expect(screen.getByRole("button", { name: "430px" }).getAttribute("aria-pressed"))
      .toBe("true");

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Business Kit" }));
    });
    expect(screen.getByText("Business Kit selected")).toBeTruthy();
  });
});
