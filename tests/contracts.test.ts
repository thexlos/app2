import { describe, expect, it } from "vitest";
import {
  builderContracts,
  getBuilderContract,
} from "../src/config/builderContracts";
import { screenContracts } from "../src/config/screenContracts";

describe("screen and builder contracts", () => {
  it("registers every required major screen with the full contract shape", () => {
    expect(screenContracts).toHaveLength(56);
    for (const contract of screenContracts) {
      expect(contract.screenId).toBeTruthy();
      expect(contract.purpose).toBeTruthy();
      expect(contract.primaryUserGoal).toBeTruthy();
      expect(contract.simpleModeBehavior).toBeTruthy();
      expect(contract.mainSections.length).toBeGreaterThan(0);
      expect(contract.mobileLayoutRules.length).toBeGreaterThan(0);
      expect(contract.tabletLayoutRules.length).toBeGreaterThan(0);
      expect(contract.futureDesktopNotes).toBeTruthy();
    }
  });

  it("registers a distinct contract for all thirteen Workshop builders", () => {
    expect(builderContracts).toHaveLength(13);
    expect(
      new Set(builderContracts.map((contract) => contract.builderId)).size,
    ).toBe(13);
  });

  it("keeps social and flyer fields out of the QR Code Builder", () => {
    const qr = getBuilderContract("Create QR Code")!;
    const labels = qr.simpleModeFields.map((field) => field.label).join(" ");
    expect(labels).toContain("Destination link");
    expect(labels).toContain("QR code name");
    expect(labels).not.toMatch(/Main message|Caption|Where will it be used/i);
    expect(qr.previewType).toBe("QR preview card");
  });
});
