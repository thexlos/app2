import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScreen } from "../src/screens/HomeScreen";
import { AppStateProvider } from "../src/state/AppState";

describe("ArmaDesk final premium card visual match", () => {
  it("preserves all approved Home card families", () => {
    const { container } = render(
      <AppStateProvider>
        <HomeScreen />
      </AppStateProvider>,
    );

    expect(container.querySelectorAll(".home-stat-card")).toHaveLength(4);
    expect(container.querySelectorAll(".home-action-card")).toHaveLength(6);
    expect(container.querySelectorAll(".home-schedule-card")).toHaveLength(1);
    expect(container.querySelectorAll(".home-suggestion-card")).toHaveLength(2);
  });

  it("keeps Smart Suggestions as final Home content", () => {
    const { container } = render(
      <AppStateProvider>
        <HomeScreen />
      </AppStateProvider>,
    );

    const homeContent = container.querySelector(".home-content");
    expect(
      homeContent?.lastElementChild?.classList.contains("home-suggestions-panel"),
    ).toBe(true);
  });
});
