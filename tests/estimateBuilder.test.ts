import { describe, expect, it } from "vitest";
import { createSampleEstimateSeed } from "../src/data/mock/estimateBuilderSeeds";
import { createEstimateVersion } from "../src/lib/protectedRecords";

describe("Estimate Builder seed and contracts", () => {
  const seed = createSampleEstimateSeed("j-thomas-flooring");

  it("uses a fictional professional estimate structure and calculated total", () => {
    expect(seed.customer.name).toBe("Northwind Property Group");
    expect(seed.estimate.projectName).toBe("Lakeside Office Refresh");
    expect(seed.estimate.number).toBe("DRAFT-001");
    expect(seed.estimate.sections?.map((section) => section.title)).toEqual([
      "PLANNING",
      "SURFACE PREPARATION",
      "MAIN WORK AREA",
      "FINISHING",
    ]);
    expect(seed.estimate.lineItems).toHaveLength(10);
    expect(seed.estimate.total).toBe(12977);
  });

  it("keeps advanced and approval behavior explicit", () => {
    expect(
      seed.estimate.lineItems.every(
        (item) =>
          item.pdfVisible && item.visibleToCustomer && !item.internalOnly,
      ),
    ).toBe(true);
    expect(seed.estimate.approvalSettings).toMatchObject({
      allowApprove: true,
      allowReject: true,
      allowRequestChanges: true,
      requireRejectNote: true,
      requireChangeRequestNote: true,
      requireTypedName: false,
      allowPdfDownload: true,
    });
    expect(seed.estimate.numberedNotes).toHaveLength(3);
  });

  it("captures sections, terms, approval settings, and client data in versions", () => {
    const version = createEstimateVersion(
      seed.estimate,
      "Sent",
      "Sent for approval",
    );
    expect(version.sectionsSnapshot).toHaveLength(4);
    expect(version.termsSnapshot?.paymentTerms).toBe(
      "Balance due upon completion",
    );
    expect(version.approvalSettingsSnapshot?.requireRejectNote).toBe(true);
    expect(version.clientViewSnapshot).toMatchObject({
      estimateNumber: "DRAFT-001",
      projectName: "Lakeside Office Refresh",
      total: 12977,
    });
  });
});
