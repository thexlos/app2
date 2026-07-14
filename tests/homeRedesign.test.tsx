import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { businessProfiles } from "../src/data/mock/businessProfiles";
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
    expect(screen.getByText("Quick actions")).toBeTruthy();
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

  it("routes all required quick actions", () => {
    const cases = [
      ["Create Estimate", "estimate-builder"],
      ["Create Invoice", "invoice-builder"],
      ["Add Customer", "add-customer"],
      ["Calendar & Schedule", "calendar"],
      ["Create QR Code", "create-mode"],
      ["My Creations", "workshop-library"],
      ["File Vault", "file-vault"],
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
      if (label === "Create QR Code") {
        expect(view.state().selectedCreateTask).toBe("Create QR Code");
      }
    });
  });

  it("starts Smart Suggestions collapsed", () => {
    renderHome();
    expect(screen.getByText("Smart suggestions")).toBeTruthy();
    expect(screen.queryByText("Dismiss anytime or open the related area.")).toBeNull();
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
