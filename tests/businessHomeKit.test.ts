import { describe, expect, it } from "vitest";
import { businessProfiles } from "../src/data/mock/businessProfiles";
import { initialWorkspaces } from "../src/data/mock/workspaces";
import {
  calculateApprovedBillingSummary,
  validateInvoiceAgainstAcceptedScope,
} from "../src/lib/acceptedEstimateBilling";

describe("My Business Kit and approved-scope billing", () => {
  it("keeps item banks and document templates separated by business", () => {
    for (const profile of businessProfiles) {
      const workspace = initialWorkspaces[profile.id];
      expect(workspace.itemBank.length).toBeGreaterThan(0);
      expect(
        workspace.itemBank.every(
          (item) => item.businessProfileId === profile.id,
        ),
      ).toBe(true);
      expect(
        workspace.documentTemplates.every(
          (template) => template.businessProfileId === profile.id,
        ),
      ).toBe(true);
      expect(workspace.businessHomeKit.businessProfileId).toBe(profile.id);
    }
    expect(initialWorkspaces[businessProfiles[0].id].itemBank[0].id).not.toBe(
      initialWorkspaces[businessProfiles[1].id].itemBank[0].id,
    );
  });

  it("uses snapshots when a bank item is copied to a document", () => {
    const source = initialWorkspaces[businessProfiles[0].id].itemBank[0];
    const snapshot = structuredClone(source);
    source.defaultRate += 10;
    expect(snapshot.defaultRate).not.toBe(source.defaultRate);
    source.defaultRate -= 10;
  });

  it("calculates remaining accepted scope and rejects overbilling", () => {
    const workspace = initialWorkspaces[businessProfiles[0].id];
    const estimate = workspace.estimates[0];
    const invoices = [{ ...workspace.invoices[0], estimateId: estimate.id }];
    const summary = calculateApprovedBillingSummary(
      estimate,
      workspace.changeOrders,
      invoices,
    );
    expect(summary.acceptedEstimateValue).toBe(7500);
    expect(summary.remainingToInvoice).toBe(4500);
    expect(
      validateInvoiceAgainstAcceptedScope({
        estimate,
        changeOrders: workspace.changeOrders,
        invoices,
        proposedAmount: 4501,
      }).valid,
    ).toBe(false);
    expect(
      validateInvoiceAgainstAcceptedScope({
        estimate,
        changeOrders: workspace.changeOrders,
        invoices,
        proposedAmount: 4500,
      }).valid,
    ).toBe(true);
  });
});
