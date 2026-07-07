import { describe, expect, it } from "vitest";
import {
  businessKits,
  businessProfiles,
} from "../src/data/mock/businessProfiles";
import { initialWorkspaces } from "../src/data/mock/workspaces";

describe("foundation seed data", () => {
  it("creates five isolated business workspaces", () => {
    expect(businessProfiles).toHaveLength(5);
    expect(Object.keys(initialWorkspaces)).toHaveLength(5);
    const allCustomerIds = Object.values(initialWorkspaces).flatMap(
      (workspace) => workspace.customers.map((customer) => customer.id),
    );
    expect(new Set(allCustomerIds).size).toBe(allCustomerIds.length);
  });

  it("includes all twelve required business kits", () => {
    expect(businessKits).toHaveLength(12);
    expect(
      businessKits.every(
        (kit) =>
          kit.setupChecklist.length > 0 && kit.suggestedFolders.length > 0,
      ),
    ).toBe(true);
  });

  it("keeps every integration explicitly in mock mode", () => {
    expect(
      Object.values(initialWorkspaces)
        .flatMap((workspace) => workspace.integrations)
        .every((integration) => integration.mockMode),
    ).toBe(true);
  });

  it("seeds a separate Workshop Library for every business profile", () => {
    for (const profile of businessProfiles) {
      const items = initialWorkspaces[profile.id].workshopItems;
      expect(items).toHaveLength(4);
      expect(items.every((item) => item.businessProfileId === profile.id)).toBe(
        true,
      );
    }
    const allIds = Object.values(initialWorkspaces).flatMap((workspace) =>
      workspace.workshopItems.map((item) => item.id),
    );
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
