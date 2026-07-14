import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { businessProfiles } from "../src/data/mock/businessProfiles";
import { BottomNavigation } from "../src/components/navigation/Navigation";
import { HomeScreen } from "../src/screens/HomeScreen";
import { AppStateProvider, useAppState } from "../src/state/AppState";

type State = ReturnType<typeof useAppState>;

const defaultSetupPercent = businessProfiles[0].setupPercent;

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
  businessProfiles[0].setupPercent = defaultSetupPercent;
});

describe("Home redesign", () => {
  it("renders without crashing", () => {
    renderHome();
    expect(screen.getByText("ArmaDesk")).toBeTruthy();
    expect(screen.getByText("Quick Actions")).toBeTruthy();
  });

  it("shows the ArmaDesk header with the brand logo image only", () => {
    renderHome();
    const header = screen.getByLabelText("ArmaDesk home");
    const logo = header.querySelector(".home-brand__logo");
    expect(screen.getByText("ArmaDesk")).toBeTruthy();
    expect(logo).toBeTruthy();
    expect(logo?.getAttribute("src")).toContain("armadesk-logo-mark");
    expect(screen.queryByText("Start Here Helper")).toBeNull();
  });

  it("keeps the existing bottom navigation labels and class structure", () => {
    render(
      <AppStateProvider>
        <BottomNavigation />
      </AppStateProvider>,
    );
    const bottomNav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(bottomNav.classList.contains("bottom-nav")).toBe(true);
    expect(screen.getByRole("button", { name: "Home" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Customers" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Money" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Help" })).toBeTruthy();
  });

  it("shows the compact business selector", () => {
    renderHome();
    expect(
      screen.getByRole("button", {
        name: "Switch business: J Thomas Flooring",
      }),
    ).toBeTruthy();
  });

  it("routes the compact Open Kit action to My Business Kit", () => {
    const view = renderHome();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Open Kit" }));
    });
    expect(view.state().currentScreen).toBe("my-business-kit");
  });

  it("renders the compact command desk hero with a code-built analytics visual", () => {
    const { container } = renderHome();
    expect(screen.getByText("Business Command Desk")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Good morning, Thomas" })).toBeTruthy();
    expect(
      screen.getByText("Create, store, send, and manage today’s work from one place."),
    ).toBeTruthy();
    expect(container.querySelector("[data-testid='home-hero-analytics']")).toBeTruthy();
  });

  it("does not render the old oversized setup hero ring", () => {
    renderHome();
    expect(
      screen.queryByLabelText(`Business setup ${defaultSetupPercent}% complete`),
    ).toBeNull();
  });

  it("shows the compact setup chip below 100% and routes to setup", () => {
    const view = renderHome();
    const setupChip = screen.getByRole("button", {
      name: `Open setup: Set Up ${defaultSetupPercent}% complete`,
    });
    expect(screen.getByText(`Set Up · ${defaultSetupPercent}%`)).toBeTruthy();
    act(() => {
      fireEvent.click(setupChip);
    });
    expect(view.state().currentScreen).toBe("setup");
  });

  it("renders the stats with state-derived values directly under the hero", () => {
    const { container } = renderHome();
    const hero = container.querySelector(".home-hero");
    const statsSection = container.querySelector(".home-stats-section");
    expect(hero).toBeTruthy();
    expect(statsSection).toBeTruthy();
    expect(
      hero!.compareDocumentPosition(statsSection!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByText("Today’s Snapshot")).toBeNull();
    expect(screen.getByRole("button", { name: "Estimates: 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Changes: 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Invoices: 2" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Outstanding: $4,850" })).toBeTruthy();
  });

  it("keeps the stats card routing behavior", () => {
    const cases = [
      ["Estimates: 1", "estimate-detail"],
      ["Changes: 1", "estimate-detail"],
      ["Invoices: 2", "money"],
      ["Outstanding: $4,850", "money"],
    ] as const;

    cases.forEach(([label, expectedScreen]) => {
      cleanup();
      window.localStorage.clear();
      const view = renderHome();
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: label }));
      });
      expect(view.state().currentScreen).toBe(expectedScreen);
    });
  });

  it("routes all required quick actions", () => {
    const cases = [
      ["Create Estimate", "estimate-builder"],
      ["Create Invoice", "invoice-builder"],
      ["Add Customer", "add-customer"],
      ["Calendar", "calendar"],
      ["QR Code", "create-mode"],
      ["Business Kit", "my-business-kit"],
    ] as const;

    cases.forEach(([label, expectedScreen]) => {
      cleanup();
      window.localStorage.clear();
      const view = renderHome();
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: label }));
      });
      expect(view.state().currentScreen).toBe(expectedScreen);
      if (label === "QR Code") {
        expect(view.state().selectedCreateTask).toBe("Create QR Code");
      }
    });
  });

  it("limits the primary quick action grid to the six reference actions", () => {
    const { container } = renderHome();
    const quickGrid = container.querySelector(".home-quick-grid");
    expect(quickGrid?.textContent).toContain("Create Estimate");
    expect(quickGrid?.textContent).toContain("Create Invoice");
    expect(quickGrid?.textContent).toContain("Add Customer");
    expect(quickGrid?.textContent).toContain("Calendar");
    expect(quickGrid?.textContent).toContain("QR Code");
    expect(quickGrid?.textContent).toContain("Business Kit");
    expect(quickGrid?.textContent).not.toContain("My Creations");
    expect(quickGrid?.textContent).not.toContain("File Vault");
  });

  it("keeps Needs Attention visible and routes to the estimate review", () => {
    const view = renderHome();
    const quickActions = view.container.querySelector(".home-quick-actions-panel");
    const attentionButton = screen.getByText("Needs attention").closest("button");
    const schedulePanel = view.container.querySelector(".home-schedule-panel");
    expect(quickActions).toBeTruthy();
    expect(attentionButton).toBeTruthy();
    expect(schedulePanel).toBeTruthy();
    expect(
      quickActions!.compareDocumentPosition(attentionButton!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      attentionButton!.compareDocumentPosition(schedulePanel!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    act(() => {
      fireEvent.click(attentionButton!);
    });
    expect(view.state().currentScreen).toBe("estimate-detail");
  });

  it("renders Upcoming Schedule with existing schedule data and routes to calendar", () => {
    const view = renderHome();
    expect(screen.getByRole("heading", { name: "Upcoming Schedule" })).toBeTruthy();
    expect(screen.getByText("Customer appointment")).toBeTruthy();
    expect(screen.getByText("Site Visit")).toBeTruthy();
    expect(screen.getByText("1 more event")).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "View Calendar" }));
    });
    expect(view.state().currentScreen).toBe("calendar");
  });

  it("renders Smart Suggestions with existing suggestion data", () => {
    renderHome();
    expect(screen.getByRole("heading", { name: "Smart Suggestions" })).toBeTruthy();
    expect(screen.getByText("Estimate needs follow-up")).toBeTruthy();
    expect(screen.getByText("Invoice is overdue")).toBeTruthy();
    expect(screen.queryByText("Approval received")).toBeNull();
    expect(screen.queryByText("Dismiss anytime or open the related area.")).toBeNull();
  });

  it("keeps Smart Suggestions actions working", () => {
    const view = renderHome();
    act(() => {
      fireEvent.click(
        screen.getByRole("button", { name: "Do It: Estimate needs follow-up" }),
      );
    });
    expect(view.state().currentScreen).toBe("estimate-detail");
  });

  it("expands Smart Suggestions with See All", () => {
    renderHome();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "See All" }));
    });
    expect(screen.getByText("Approval received")).toBeTruthy();
  });

  it("starts Recent Activity collapsed", () => {
    renderHome();
    expect(screen.getByText("Recent activity")).toBeTruthy();
    expect(screen.queryByText(/Estimate #1042 was accepted/i)).toBeNull();
  });

  it("shows Recent Creations when creations exist", () => {
    renderHome();
    expect(screen.getByText("Recent creations")).toBeTruthy();
    expect(screen.getByRole("button", { name: /More\s*Open My Creations/i })).toBeTruthy();
  });

  it("does not render the old setup banner when progress is below 100%", () => {
    renderHome();
    expect(screen.queryByText(/on track/i)).toBeNull();
    expect(screen.queryByText(/Continue setup/i)).toBeNull();
  });

  it("hides setup controls when progress is 100%", () => {
    businessProfiles[0].setupPercent = 100;
    renderHome();
    expect(screen.queryByText(/Continue setup/i)).toBeNull();
    expect(screen.queryByText(/set up/i)).toBeNull();
  });

  it("shows setup complete in the compact setup chip at 100% setup", () => {
    businessProfiles[0].setupPercent = 100;
    renderHome();
    expect(screen.getByText("Setup Complete")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Open setup: Setup Complete" }),
    ).toBeTruthy();
  });

  it("shows the compact ready-state hero at 100% setup", () => {
    businessProfiles[0].setupPercent = 100;
    renderHome();
    expect(screen.getByText("Business ready")).toBeTruthy();
    expect(
      screen.getByText("Your workspace is ready. Let’s keep today moving."),
    ).toBeTruthy();
    expect(screen.queryByText("Today at a glance")).toBeNull();
  });
});
