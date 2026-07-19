import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { HomeScreen } from "../src/screens/HomeScreen";
import { AppStateProvider } from "../src/state/AppState";

function renderHome() {
  return render(
    <AppStateProvider>
      <HomeScreen />
    </AppStateProvider>,
  );
}

describe("ArmaDesk premium Home card system", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("preserves the approved card groups and visible order", () => {
    const { container } = renderHome();

    expect(container.querySelectorAll(".home-stat-card")).toHaveLength(4);
    expect(container.querySelectorAll(".home-action-card")).toHaveLength(6);
    expect(container.querySelectorAll(".home-schedule-card")).toHaveLength(1);
    expect(container.querySelectorAll(".home-suggestion-card")).toHaveLength(2);

    expect(screen.getByText("Quick Actions")).toBeTruthy();
    expect(screen.getByText("Upcoming Schedule")).toBeTruthy();
    expect(screen.getByText("Smart Suggestions")).toBeTruthy();
  });

  it("keeps the six approved Quick Actions", () => {
    renderHome();

    for (const label of [
      "Create Estimate",
      "Create Invoice",
      "Add Customer",
      "Calendar",
      "QR Code",
      "Business Kit",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
  });
});
