import { describe, expect, it } from "vitest";
import {
  canEditEstimateInPlace,
  createEstimateVersion,
  isProtectedRecord,
  noteIsRequiredForCustomerResponse,
} from "../src/lib/protectedRecords";
import { initialWorkspaces } from "../src/data/mock/workspaces";

describe("protected record rules", () => {
  const accepted = initialWorkspaces["j-thomas-flooring"].estimates.find(
    (estimate) => estimate.status === "Accepted",
  )!;

  it("locks accepted, rejected, and paid records", () => {
    expect(isProtectedRecord("Accepted")).toBe(true);
    expect(isProtectedRecord("Rejected")).toBe(true);
    expect(isProtectedRecord("Paid")).toBe(true);
    expect(isProtectedRecord("Draft")).toBe(false);
  });

  it("does not allow accepted estimates to be edited in place", () => {
    expect(canEditEstimateInPlace(accepted)).toBe(false);
  });

  it("requires notes for rejection and change requests", () => {
    expect(noteIsRequiredForCustomerResponse("approve")).toBe(false);
    expect(noteIsRequiredForCustomerResponse("reject")).toBe(true);
    expect(noteIsRequiredForCustomerResponse("request-changes")).toBe(true);
  });

  it("preserves both customer-view data and an official document snapshot", () => {
    const version = createEstimateVersion(
      accepted,
      "Rejected",
      "Customer rejected",
      "Please revise the scope.",
    );
    expect(version.clientViewSnapshot).toMatchObject({
      estimateNumber: accepted.number,
      total: accepted.total,
    });
    expect(version.officialDocumentSnapshot).toContain(".pdf");
    expect(version.customerAction).toBe("Rejected");
  });
});
