import { describe, expect, it } from "vitest";
import { builderContracts } from "../src/config/builderContracts";
import { getGuidedBuilderFields } from "../src/config/builderFieldConfigs";
import {
  helpServices,
  guideResources,
  monthlySupportPlans,
} from "../src/config/helpCatalog";
import { globalStarterLibrary } from "../src/data/mock/globalStarterLibrary";
import { initialWorkspaces } from "../src/data/mock/workspaces";
import { defaultApprovalSettings } from "../src/data/mock/estimateBuilderSeeds";

describe("five correction layers", () => {
  it("generates guided questions from every Workshop builder contract", () => {
    for (const contract of builderContracts) {
      expect(getGuidedBuilderFields(contract.builderId).length).toBe(
        contract.simpleModeFields.length,
      );
    }
    expect(getGuidedBuilderFields("estimate-builder").length).toBeGreaterThan(
      3,
    );
    expect(getGuidedBuilderFields("invoice-builder").length).toBeGreaterThan(3);
  });

  it("keeps calendar, transfer history, templates, styles, and connections business scoped", () => {
    for (const [businessId, workspace] of Object.entries(initialWorkspaces)) {
      expect(
        workspace.calendarEvents.every(
          (item) => item.businessProfileId === businessId,
        ),
      ).toBe(true);
      expect(
        workspace.importHistory.every(
          (item) => item.businessProfileId === businessId,
        ),
      ).toBe(true);
      expect(
        workspace.exportHistory.every(
          (item) => item.businessProfileId === businessId,
        ),
      ).toBe(true);
      expect(
        workspace.documentTemplates.some(
          (item) => item.documentType === "Estimate",
        ),
      ).toBe(true);
      expect(
        workspace.documentTemplates.some(
          (item) => item.documentType === "Invoice",
        ),
      ).toBe(true);
      expect(
        workspace.documentStyles.some(
          (item) => item.documentType === "estimate",
        ),
      ).toBe(true);
      expect(
        workspace.documentStyles.some(
          (item) => item.documentType === "invoice",
        ),
      ).toBe(true);
      expect(
        workspace.integrations.some((item) => item.provider === "Excel / CSV"),
      ).toBe(true);
      expect(
        workspace.integrations.every((item) => item.businessId === businessId),
      ).toBe(true);
    }
  });

  it("offers a cross-industry library beyond item rows", () => {
    const types = new Set(globalStarterLibrary.map((item) => item.libraryType));
    for (const type of [
      "category",
      "service",
      "discount",
      "estimate_template",
      "invoice_template",
      "progress_invoice_template",
      "change_order_template",
      "document_template",
      "note",
      "term",
      "footer",
      "message_template",
      "qr_starter",
      "lead_form",
      "customer_tag",
      "payment_instruction",
      "approval_preset",
    ])
      expect(types.has(type as never)).toBe(true);
  });

  it("uses simple approval defaults and service-specific Help contracts", () => {
    expect(defaultApprovalSettings.requireCheckbox).toBe(true);
    expect(defaultApprovalSettings.requireTypedName).toBe(false);
    expect(defaultApprovalSettings.requireSignature).toBe(false);
    expect(
      helpServices.filter((service) => service.serviceQuestions.length > 0)
        .length,
    ).toBeGreaterThanOrEqual(8);
    expect(monthlySupportPlans).toHaveLength(3);
    expect(guideResources).toHaveLength(6);
  });

  it("seeds complete, business-scoped document style controls safely", () => {
    for (const [businessId, workspace] of Object.entries(initialWorkspaces)) {
      for (const style of workspace.documentStyles) {
        expect(style.businessProfileId).toBe(businessId);
        expect(style.columnStyles.length).toBeGreaterThanOrEqual(8);
        expect(style.tableStyle.headerRowBackgroundColor).toBeTruthy();
        expect(style.tableStyle.bodyRowBackgroundColor).toBeTruthy();
        expect(style.tableStyle.rowLineColor).toBeTruthy();
        expect(style.tableStyle.columnLineColor).toBeTruthy();
        expect(style.rowStyle.standardRowBackgroundColor).toBeTruthy();
        expect(style.sectionRowStyle.backgroundColor).toBeTruthy();
        expect(style.totalsBoxStyle.amountColor).toBeTruthy();
        expect(style.notesStyle.headingColor).toBeTruthy();
        expect(style.termsStyle.bodyTextColor).toBeTruthy();
        expect(style.paymentInstructionsStyle.backgroundColor).toBeTruthy();
        expect(style.changeOrderPolicyStyle.backgroundColor).toBeTruthy();
        expect(style.signatureStyle.lineColor).toBeTruthy();
        expect(
          style.columnStyles
            .filter((column) => column.internalOnly)
            .every(
              (column) => !column.visibleToCustomer && !column.visibleOnPdf,
            ),
        ).toBe(true);
      }
    }
  });
});
