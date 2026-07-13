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
    expect(screen.getByText("Start Here")).toBeTruthy();
    expect(screen.getByText("Quick actions")).toBeTruthy();
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

  it("shows the setup banner when progress is below 100%", () => {
    renderHome();
    expect(screen.getByText(/on track/i)).toBeTruthy();
    expect(screen.getByText(/Continue setup/i)).toBeTruthy();
  });

  it("hides setup controls when progress is 100%", () => {
    businessProfiles[0].setupPercent = 100;
    renderHome();
    expect(screen.queryByText(/Continue setup/i)).toBeNull();
    expect(screen.queryByText(/set up/i)).toBeNull();
  });

  it("shows the ready-state glance area at 100% setup", () => {
    businessProfiles[0].setupPercent = 100;
    renderHome();
    expect(screen.getByText("Today at a glance")).toBeTruthy();
    expect(screen.getByText("Business ready")).toBeTruthy();
  });
});
