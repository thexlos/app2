import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  homeQuickActionArtworkMap,
  homeStatArtworkMap,
} from "../src/components/home/HomeArtworkCards";
import { HomeScreen } from "../src/screens/HomeScreen";
import { AppStateProvider, useAppState } from "../src/state/AppState";

type State = ReturnType<typeof useAppState>;

function renderHome() {
  let latest: State | undefined;

  function Probe() {
    latest = useAppState();
    return null;
  }

  const rendered = render(
    <AppStateProvider>
      <HomeScreen />
      <Probe />
    </AppStateProvider>,
  );

  return { state: () => latest!, ...rendered };
}

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("ArmaDesk Home card artwork integration", () => {
  it("registers exactly four stat and six Quick Action artwork mappings", () => {
    expect(Object.keys(homeStatArtworkMap)).toEqual([
      "Estimates",
      "Invoices",
      "Customers",
      "Tasks",
    ]);
    expect(Object.keys(homeQuickActionArtworkMap)).toEqual([
      "Create Estimate",
      "Create Invoice",
      "Add Customer",
      "Calendar",
      "QR Code",
      "Business Kit",
    ]);

    const { container } = renderHome();
    expect(container.querySelectorAll('[data-home-artwork-card="stat"]')).toHaveLength(4);
    expect(
      container.querySelectorAll('[data-home-artwork-card="quick-action"]'),
    ).toHaveLength(6);
    expect(container.querySelectorAll("img.home-card-artwork")).toHaveLength(10);
  });

  it("uses the intact registered PNGs without duplicate visual icons", () => {
    const { container } = renderHome();

    for (const artwork of [
      ...Object.values(homeStatArtworkMap),
      ...Object.values(homeQuickActionArtworkMap),
    ]) {
      const card = container.querySelector(`[data-artwork-key="${artwork.assetKey}"]`);
      const image = card?.querySelector("img.home-card-artwork") as HTMLImageElement | null;
      expect(image).toBeTruthy();
      expect(image?.getAttribute("src")).toBe(artwork.src);
      expect(image?.getAttribute("alt")).toBe("");
      expect(image?.getAttribute("aria-hidden")).toBe("true");
      expect(image?.style.left).toBe(`${artwork.registration.leftPercent}%`);
      expect(image?.style.top).toBe(`${artwork.registration.topPercent}%`);
      expect(image?.style.width).toBe(`${artwork.registration.widthPercent}%`);
      expect(image?.style.height).toBe(`${artwork.registration.heightPercent}%`);
    }

    expect(container.querySelectorAll(".home-stat-card--artwork .home-stat-card__icon"))
      .toHaveLength(0);
    expect(container.querySelectorAll(".home-action-card--artwork .home-chip"))
      .toHaveLength(0);
    expect(container.querySelectorAll(".home-action-card--artwork .home-action-card__arrow"))
      .toHaveLength(6);
  });

  it("keeps all values, labels, routes, and Quick Action callbacks live", () => {
    const statView = renderHome();
    expect(screen.getByRole("button", { name: "Estimates: 4" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Invoices: 2" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Customers: 3" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Tasks: 4" })).toBeTruthy();
    expect(screen.getByText("↑ 3 today")).toBeTruthy();
    expect(screen.getByText("↑ 2 paid")).toBeTruthy();
    expect(screen.getByText("↑ 6 this week")).toBeTruthy();
    expect(screen.getByText("↑ 2 due today")).toBeTruthy();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Customers: 3" }));
    });
    expect(statView.state().currentScreen).toBe("customers");

    const actionCases = [
      ["Create Estimate", "estimate-builder"],
      ["Create Invoice", "invoice-builder"],
      ["Add Customer", "add-customer"],
      ["Calendar", "calendar"],
      ["QR Code", "create-mode"],
      ["Business Kit", "my-business-kit"],
    ] as const;

    for (const [label, expectedScreen] of actionCases) {
      cleanup();
      window.localStorage.clear();
      const view = renderHome();
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: label }));
      });
      expect(view.state().currentScreen).toBe(expectedScreen);
    }
  });

  it("preserves the Hero and locked Home section order", () => {
    const { container } = renderHome();
    const content = container.querySelector(".home-content");
    const hero = content?.querySelector(".home-hero");
    const stats = content?.querySelector(".home-stats-section");
    const quickActions = content?.querySelector(".home-quick-actions-panel");
    const schedule = content?.querySelector(".home-schedule-panel");
    const suggestions = content?.querySelector(".home-suggestions-panel");

    expect(hero?.querySelector(".home-hero-analytics--composition-v23")).toBeTruthy();
    for (const [first, second] of [
      [hero, stats],
      [stats, quickActions],
      [quickActions, schedule],
      [schedule, suggestions],
    ]) {
      expect(
        first!.compareDocumentPosition(second!) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });
});
