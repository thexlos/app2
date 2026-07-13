import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBuilderContract } from "../src/config/builderContracts";
import { ContractBuilderScreen } from "../src/screens/ContractBuilderScreen";
import {
  canDownloadFileAsset,
  getFileVaultCategories,
  getFileVaultStatus,
  getLinkedRecordSummary,
} from "../src/lib/fileVault";
import {
  duplicateWorkshopItemPayload,
  normalizeWorkshopItem,
} from "../src/lib/workshopPayloads";
import {
  ACTIVE_BUSINESS_KEY,
  clearStoredAppState,
  loadStoredAppState,
  STORAGE_VERSION_KEY,
  WORKSPACES_KEY,
} from "../src/services/storage/appStorage";
import {
  buildQrPayload,
  downloadDataUrl,
  generateQrSvg,
  validateQrInput,
} from "../src/services/qr/qrGenerator";
import { AppStateProvider, useAppState } from "../src/state/AppState";
import type { FileAsset, WorkshopItem } from "../src/types/models";

type State = ReturnType<typeof useAppState>;

function renderState() {
  let latest: State | undefined;
  function Probe() {
    latest = useAppState();
    return null;
  }
  const rendered = render(
    <AppStateProvider>
      <Probe />
    </AppStateProvider>,
  );
  return { state: () => latest!, ...rendered };
}

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("Phase 2/3 local persistence", () => {
  it("falls back safely when storage is empty or corrupted", () => {
    expect(loadStoredAppState()).toBeUndefined();
    window.localStorage.setItem(STORAGE_VERSION_KEY, "1");
    window.localStorage.setItem(ACTIVE_BUSINESS_KEY, "missing-business");
    window.localStorage.setItem(WORKSPACES_KEY, "{broken");
    expect(loadStoredAppState()).toBeUndefined();
  });

  it("persists created records and active business across provider remounts", async () => {
    const first = renderState();
    const businessA = first.state().currentBusinessId;
    const businessB = first
      .state()
      .profiles.find((profile) => profile.id !== first.state().currentBusinessId)!.id;

    act(() => {
      first.state().createCustomer({
        name: "Persistent Customer",
        phone: "401-555-0101",
        email: "persist@example.com",
        billingAddress: "1 Persist Way",
        jobSiteAddress: "1 Persist Way",
        customerType: "Person",
        preferredContactMethod: "Email",
        status: "New",
        notes: ["Saved locally"],
      });
      first.state().saveWorkshopItem({
        itemType: "flyer",
        title: "Persistent Flyer",
        description: "Saved builder fields",
        status: "Draft",
        createdFrom: "Manual Builder",
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        builderData: {
          headline: "Refresh-safe headline",
          message: "Refresh-safe message",
        },
        previewData: { headline: "Refresh-safe headline" },
        tags: ["flyer"],
        exportFormats: ["PNG"],
      });
      first.state().createQrCode({
        name: "Persistent QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/",
        url: "https://example.com/",
        label: "Scan me",
        createdFrom: "Manual Builder",
      });
      first.state().submitHelpRequest({
        type: "QR code setup",
        serviceLevel: "Start Here Service Request",
        description: "Help with this QR",
        fileNames: [],
        quoteStatus: "Waiting Review",
      });
      first.state().switchBusiness(businessB);
    });

    await waitFor(() =>
      expect(window.localStorage.getItem(WORKSPACES_KEY)).toContain(
        "Persistent Customer",
      ),
    );
    first.unmount();

    const second = renderState();
    expect(second.state().currentBusinessId).toBe(businessB);
    expect(
      second
        .state()
        .workspace.customers.some((item) => item.name === "Persistent Customer"),
    ).toBe(false);
    act(() => second.state().switchBusiness(businessA));
    expect(
      second
        .state()
        .workspace.customers.some((item) => item.name === "Persistent Customer"),
    ).toBe(true);
    expect(
      second
        .state()
        .workspace.workshopItems.some((item) => item.title === "Persistent Flyer"),
    ).toBe(true);
    expect(
      second.state().workspace.qrCodes.some((item) => item.name === "Persistent QR"),
    ).toBe(true);
    expect(
      second
        .state()
        .workspace.helpRequests.some((item) => item.type === "QR code setup"),
    ).toBe(true);
  });

  it("reset clears app storage keys and returns to initial data", async () => {
    const view = renderState();
    act(() => {
      view.state().createCustomer({
        name: "Reset Me",
        phone: "401-555-0102",
        email: "reset@example.com",
        billingAddress: "2 Reset Way",
        jobSiteAddress: "2 Reset Way",
        customerType: "Person",
        preferredContactMethod: "Email",
        status: "New",
        notes: [],
      });
    });
    await waitFor(() =>
      expect(window.localStorage.getItem(WORKSPACES_KEY)).toContain("Reset Me"),
    );
    act(() => view.state().resetDemoData());
    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_VERSION_KEY)).toBeNull();
      expect(window.localStorage.getItem(ACTIVE_BUSINESS_KEY)).toBeNull();
      expect(window.localStorage.getItem(WORKSPACES_KEY)).toBeNull();
    });
    expect(view.state().currentScreen).toBe("home");
    expect(view.state().notice).toBe("Demo data reset.");
  });
});

describe("Phase 2/3 workshop payload contracts", () => {
  const baseItem: WorkshopItem = {
    id: "creation-1",
    businessProfileId: "business-1",
    itemType: "flyer",
    title: "Flyer Draft",
    description: "Flyer with saved fields",
    status: "Draft",
    builderId: "flyer-builder",
    sourceTool: "Make a Flyer",
    builderData: { headline: "Original", cta: "Call today" },
    previewData: { headline: "Original" },
    createdAt: "2026-07-13T12:00:00.000Z",
    updatedAt: "2026-07-13T12:00:00.000Z",
    lastUsedAt: "Not yet",
    createdFrom: "Manual Builder",
    fileAssetIds: [],
    qrCodeIds: [],
    socialPostIds: [],
    tags: ["flyer"],
    exportFormats: ["PNG"],
    isTemplate: false,
    archived: false,
    activityHistory: [],
  };

  it("normalizes saved workshop payload fields", () => {
    const normalized = normalizeWorkshopItem(baseItem);
    expect(normalized.builderId).toBe("flyer-builder");
    expect(normalized.builderData?.headline).toBe("Original");
    expect(normalized.exportHistory).toEqual([]);
    expect(normalized.version).toBe(1);
  });

  it("duplicates builderData without mutating the original", () => {
    const copy = duplicateWorkshopItemPayload(baseItem, "creation-copy");
    copy.builderData!.headline = "Changed copy";
    expect(copy.id).toBe("creation-copy");
    expect(copy.title).toBe("Flyer Draft Copy");
    expect(copy.createdFrom).toBe("Duplicate");
    expect(baseItem.builderData?.headline).toBe("Original");
  });

  it("guided wizard answers save into builderData", () => {
    const view = renderState();
    act(() => {
      view.state().completeGuidedWizard("flyer-builder", "Make a Flyer", {
        headline: "Guided Headline",
        message: "Guided Message",
      });
      view.state().saveWorkshopItem({
        itemType: "flyer",
        title: "Guided Headline",
        description: "Guided flyer",
        status: "Draft",
        createdFrom: "Guided Wizard",
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        builderData: {
          headline: "Guided Headline",
          message: "Guided Message",
        },
        previewData: { headline: "Guided Headline" },
        tags: ["flyer"],
        exportFormats: ["PNG"],
      });
    });
    expect(
      view.state().workspace.workshopItems.find((item) => item.title === "Guided Headline")
        ?.builderData?.message,
    ).toBe("Guided Message");
  });
});

describe("Phase 2/3 cleanup builder examples", () => {
  it("opens new workshop builders blank until Load Example is selected", () => {
    const contract = getBuilderContract("Make a Flyer")!;
    render(
      <AppStateProvider>
        <ContractBuilderScreen contract={contract} />
      </AppStateProvider>,
    );
    const headline = screen.getByLabelText(
      "Flyer title / headline",
    ) as HTMLInputElement;
    expect(headline.value).toBe("");

    fireEvent.click(screen.getByRole("button", { name: /load example/i }));

    expect(headline.value).toBe(contract.sampleMockData.headline);
    expect(
      screen.getByText(/example content loaded/i).textContent,
    ).toContain("Replace it");
  });
});

describe("Phase 2/3 real QR generator", () => {
  it("validates URL and contact-card QR inputs", () => {
    expect(
      validateQrInput({ qrType: "Website / Link", destination: "bad url" }).valid,
    ).toBe(false);
    const valid = buildQrPayload({
      qrType: "Website / Link",
      destination: "example.com",
    });
    expect(valid.valid).toBe(true);
    expect(valid.normalizedUrl).toBe("https://example.com/");
    expect(
      validateQrInput({
        qrType: "Contact Card",
        contact: { contactName: "Test Person" },
      }).valid,
    ).toBe(false);
    expect(
      validateQrInput({
        qrType: "Contact Card",
        contact: { contactName: "Test Person", email: "test@example.com" },
      }).payload,
    ).toContain("BEGIN:VCARD");
  });

  it("generates QR SVG from a valid URL", async () => {
    const svg = await generateQrSvg("https://example.com/");
    expect(svg).toContain("<svg");
  });

  it("creates File Vault metadata for QR exports", () => {
    const view = renderState();
    let workshopItemId = "";
    let qrCodeId = "";
    act(() => {
      const saved = view.state().createQrCode({
        name: "File Metadata QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/",
        url: "https://example.com/",
        createdFrom: "Manual Builder",
      });
      workshopItemId = saved.workshopItemId;
      qrCodeId = saved.qrCodeId;
      view.state().addFileMetadata({
        name: "file-metadata-qr.svg",
        type: "image/svg+xml",
        workshopItemId,
        qrCodeId,
        source: "QR Generator",
        generatedContent: "<svg></svg>",
        metadataOnly: false,
      });
    });
    const file = view.state().workspace.files.find((item) => item.qrCodeId === qrCodeId);
    expect(file?.workshopItemId).toBe(workshopItemId);
    expect(file?.metadataOnly).toBe(false);
  });

  it("uses a browser download anchor for generated data URLs", () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    downloadDataUrl("test-qr.png", "data:image/png;base64,AA==");

    expect(click).toHaveBeenCalledOnce();
    click.mockRestore();
  });
});

describe("Phase 2/3 cleanup File Vault helpers", () => {
  it("categorizes generated QR files and metadata-only export records", () => {
    const view = renderState();
    const workspace = view.state().workspace;
    const generatedQrFile: FileAsset = {
      id: "file-generated-qr",
      businessId: view.state().currentBusinessId,
      name: "review-qr.svg",
      type: "image/svg+xml",
      source: "QR Generator",
      generatedContent: "<svg></svg>",
      metadataOnly: false,
      qrCodeId: workspace.qrCodes[0]?.id,
      visibility: "Internal",
    };
    const metadataOnlyFile: FileAsset = {
      id: "file-export-metadata",
      businessId: view.state().currentBusinessId,
      name: "flyer-export.pdf",
      type: "application/pdf",
      source: "Workshop Export",
      metadataOnly: true,
      workshopItemId: workspace.workshopItems[0]?.id,
      visibility: "Internal",
    };

    expect(getFileVaultStatus(generatedQrFile).label).toBe("Generated File");
    expect(getFileVaultCategories(generatedQrFile, workspace)).toContain("QR Codes");
    expect(getFileVaultCategories(generatedQrFile, workspace)).toContain(
      "Generated Exports",
    );
    expect(canDownloadFileAsset(generatedQrFile)).toBe(true);

    expect(getFileVaultStatus(metadataOnlyFile).label).toBe("Metadata Only");
    expect(getFileVaultCategories(metadataOnlyFile, workspace)).toContain(
      "Metadata Only",
    );
    expect(canDownloadFileAsset(metadataOnlyFile)).toBe(false);
    expect(getLinkedRecordSummary(metadataOnlyFile, workspace)).toContain(
      "Creation:",
    );
  });
});
