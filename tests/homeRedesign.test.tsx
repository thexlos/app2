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

  it("shows one connected business control bar with selector, kit, and setup controls", () => {
    const { container } = renderHome();
    const businessRow = container.querySelector(".home-top-utility-row");
    expect(businessRow).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Switch business: J Thomas Flooring",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Open Kit" })).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: `Open setup: Set up ${defaultSetupPercent}% complete`,
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

  it("renders the reference hero copy with a code-built analytics visual", () => {
    const { container } = renderHome();
    expect(screen.queryByText("Business Command Desk")).toBeNull();
    expect(screen.queryByText("Review Today")).toBeNull();
    expect(screen.getByText("Good morning,")).toBeTruthy();
    expect(screen.getByText("Thomas!")).toBeTruthy();
    expect(screen.getByText("Here’s what’s happening with your business today.")).toBeTruthy();
    expect(screen.getByRole("button", { name: /View Insights/i })).toBeTruthy();
    expect(screen.getByText("+23%")).toBeTruthy();
    expect(screen.getByText("vs last week")).toBeTruthy();
    expect(container.querySelector("[data-testid='home-hero-analytics']")).toBeTruthy();
    expect(container.querySelector(".home-hero-analytics__platform")).toBeTruthy();
  });

  it("does not render the old oversized setup hero ring", () => {
    renderHome();
    expect(
      screen.queryByLabelText(`Business setup ${defaultSetupPercent}% complete`),
    ).toBeNull();
  });

  it("shows the setup ring below 100% and routes to setup", () => {
    const view = renderHome();
    const setupChip = screen.getByRole("button", {
      name: `Open setup: Set up ${defaultSetupPercent}% complete`,
    });
    expect(screen.getByText(`${defaultSetupPercent}%`)).toBeTruthy();
    expect(screen.getByText("Set up")).toBeTruthy();
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
    expect(screen.getByRole("button", { name: "Estimates: 4" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Invoices: 2" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Customers: 3" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Tasks: 4" })).toBeTruthy();
    expect(screen.getByText("↑ 3 today")).toBeTruthy();
    expect(screen.getByText("↑ 2 paid")).toBeTruthy();
    expect(screen.getByText("↑ 6 this week")).toBeTruthy();
    expect(screen.getByText("↑ 2 due today")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Changes:/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Outstanding:/ })).toBeNull();
  });

  it("keeps the stats card routing behavior", () => {
    const cases = [
      ["Estimates: 4", "estimate-detail"],
      ["Invoices: 2", "money"],
      ["Customers: 3", "customers"],
      ["Tasks: 4", "calendar"],
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

  it("renders Upcoming Schedule with existing schedule data and routes to calendar", () => {
    const view = renderHome();
    expect(screen.getByRole("heading", { name: "Upcoming Schedule" })).toBeTruthy();
    expect(screen.queryByText("Customer appointment")).toBeNull();
    expect(screen.getByText("JUL")).toBeTruthy();
    expect(screen.getByText("13")).toBeTruthy();
    expect(screen.getByText("MON")).toBeTruthy();
    expect(screen.getByText("Site Visit")).toBeTruthy();
    expect(screen.getByText("10:00 AM • 123 Main St")).toBeTruthy();
    expect(screen.getByText("Upcoming")).toBeTruthy();
    expect(screen.getByText("1 more event")).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "View Calendar" }));
    });
    expect(view.state().currentScreen).toBe("calendar");
  });

  it("renders exactly the two reference Smart Suggestions cards", () => {
    renderHome();
    expect(screen.getByRole("heading", { name: "Smart Suggestions" })).toBeTruthy();
    expect(screen.getByText("Send 2 pending estimates")).toBeTruthy();
    expect(screen.getByText("Worth $4,250")).toBeTruthy();
    expect(screen.getByText("Follow up with 3 recent leads")).toBeTruthy();
    expect(screen.getByText("High opportunity")).toBeTruthy();
    expect(screen.queryByText("Estimate needs follow-up")).toBeNull();
    expect(screen.queryByText("Invoice is overdue")).toBeNull();
    expect(screen.queryByText("Approval received")).toBeNull();
    expect(screen.queryByText("Dismiss anytime or open the related area.")).toBeNull();
    expect(screen.queryByText("Do It")).toBeNull();
    expect(screen.queryByText("Later")).toBeNull();
    expect(screen.queryByText("Dismiss")).toBeNull();
  });

  it("keeps Smart Suggestions card routing working without inline action clutter", () => {
    const view = renderHome();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Send 2 pending estimates" }));
    });
    expect(view.state().currentScreen).toBe("estimate-detail");
  });

  it("does not expand extra Smart Suggestions on Home", () => {
    renderHome();
    act(() => {
      fireEvent.click(screen.getAllByRole("button", { name: "See All" }).at(-1)!);
    });
    expect(screen.queryByText("Approval received")).toBeNull();
  });

  it("locks visible Home content to the mockup order and stops after Smart Suggestions", () => {
    const { container } = renderHome();
    const header = container.querySelector(".home-app-header");
    const businessRow = container.querySelector(".home-top-utility-row");
    const hero = container.querySelector(".home-hero");
    const stats = container.querySelector(".home-stats-section");
    const quickActions = container.querySelector(".home-quick-actions-panel");
    const schedule = container.querySelector(".home-schedule-panel");
    const suggestions = container.querySelector(".home-suggestions-panel");
    expect(header).toBeTruthy();
    expect(businessRow).toBeTruthy();
    expect(hero).toBeTruthy();
    expect(stats).toBeTruthy();
    expect(quickActions).toBeTruthy();
    expect(schedule).toBeTruthy();
    expect(suggestions).toBeTruthy();
    expect(
      header!.compareDocumentPosition(businessRow!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      businessRow!.compareDocumentPosition(hero!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      hero!.compareDocumentPosition(stats!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      stats!.compareDocumentPosition(quickActions!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      quickActions!.compareDocumentPosition(schedule!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      schedule!.compareDocumentPosition(suggestions!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(suggestions!.nextElementSibling).toBeNull();
    expect(quickActions!.classList.contains("home-panel")).toBe(false);
    expect(schedule!.classList.contains("home-panel")).toBe(false);
    expect(suggestions!.classList.contains("home-panel")).toBe(false);
    expect(screen.queryByText("Needs attention")).toBeNull();
    expect(screen.queryByText("My Business Kit")).toBeNull();
    expect(screen.queryByText("Recent activity")).toBeNull();
    expect(screen.queryByText("Recent creations")).toBeNull();
    expect(screen.queryByText("Business Command Desk")).toBeNull();
    expect(screen.queryByText("Review Today")).toBeNull();
  });

  it("does not render the old setup banner when progress is below 100%", () => {
    renderHome();
    expect(screen.queryByText(/on track/i)).toBeNull();
    expect(screen.queryByText(/Continue setup/i)).toBeNull();
  });

  it("keeps the setup ring available at 100% setup", () => {
    businessProfiles[0].setupPercent = 100;
    renderHome();
    expect(screen.queryByText(/Continue setup/i)).toBeNull();
    expect(
      screen.getByRole("button", { name: "Open setup: Set up 100% complete" }),
    ).toBeTruthy();
    expect(screen.getByText("100%")).toBeTruthy();
    expect(screen.getByText("Set up")).toBeTruthy();
  });

  it("keeps the reference hero copy at 100% setup", () => {
    businessProfiles[0].setupPercent = 100;
    renderHome();
    expect(screen.queryByText("Business ready")).toBeNull();
    expect(screen.getByText("Good morning,")).toBeTruthy();
    expect(screen.getByText("Thomas!")).toBeTruthy();
    expect(screen.getByText("Here’s what’s happening with your business today.")).toBeTruthy();
    expect(screen.queryByText("Today at a glance")).toBeNull();
  });
});
