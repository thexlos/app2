import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppStateProvider } from "../src/state/AppState";
import { DocumentStyleEditorScreen } from "../src/screens/TemplateAndAssetScreens";

afterEach(cleanup);

describe("Document Style Editor", () => {
  it("starts simple and exposes all requested advanced style sections", () => {
    render(
      <AppStateProvider>
        <DocumentStyleEditorScreen />
      </AppStateProvider>,
    );

    for (const preset of [
      "Clean",
      "Bold",
      "Modern",
      "Minimal",
      "Contractor",
      "Service Business",
      "Luxury",
      "Simple Black & White",
      "Color Header",
      "Classic Invoice",
    ])
      expect(screen.getByRole("button", { name: preset })).toBeTruthy();

    const advanced = screen.getByText("Advanced Style").closest("details");
    expect(advanced?.hasAttribute("open")).toBe(false);
    fireEvent.click(screen.getByText("Advanced Style"));

    for (const tab of [
      "Overall",
      "Header",
      "Info Blocks",
      "Table",
      "Columns",
      "Rows",
      "Totals",
      "Notes & Terms",
      "Footer",
      "QR / Signature",
    ])
      expect(screen.getByRole("button", { name: tab })).toBeTruthy();
  });

  it("keeps internal columns out of customer and PDF views", () => {
    render(
      <AppStateProvider>
        <DocumentStyleEditorScreen />
      </AppStateProvider>,
    );
    fireEvent.click(screen.getByText("Advanced Style"));
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    fireEvent.click(screen.getByRole("button", { name: "Internal Cost" }));

    expect(screen.getByLabelText("Internal only")).toHaveProperty(
      "checked",
      true,
    );
    expect(screen.getByLabelText("Show on Customer View")).toHaveProperty(
      "checked",
      false,
    );
    expect(screen.getByLabelText("Show on PDF")).toHaveProperty(
      "checked",
      false,
    );
  });

  it("renders separate table, row, totals, and notes controls", () => {
    render(
      <AppStateProvider>
        <DocumentStyleEditorScreen />
      </AppStateProvider>,
    );
    fireEvent.click(screen.getByText("Advanced Style"));

    fireEvent.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.getByText("Header row background color")).toBeTruthy();
    expect(screen.getByText("Body row background color")).toBeTruthy();
    expect(screen.getByText("Row line color")).toBeTruthy();
    expect(screen.getByText("Column line color")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Rows" }));
    expect(screen.getByText("Standard row background color")).toBeTruthy();
    expect(screen.getByText("Section row font weight")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Totals" }));
    expect(screen.getByText("Balance due color")).toBeTruthy();
    expect(screen.getByText("Amount paid color")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Notes & Terms" }));
    expect(
      screen.getByRole("button", { name: "Change Order Policy" }),
    ).toBeTruthy();
  });
});
