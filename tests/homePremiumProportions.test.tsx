import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScreen } from "../src/screens/HomeScreen";
import { AppStateProvider } from "../src/state/AppState";

describe("ArmaDesk premium proportion patch", () => {
  it("preserves all existing card groups", () => {
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

  it("keeps Smart Suggestions as the final Home content section", () => {
    const { container } = render(
      <AppStateProvider>
        <HomeScreen />
      </AppStateProvider>,
    );

    const content = container.querySelector(".home-content");
    expect(content?.lastElementChild?.classList.contains("home-suggestions-panel"))
      .toBe(true);
  });
});
