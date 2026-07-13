import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getBuilderContract } from "../src/config/builderContracts";
import { ContractBuilderScreen } from "../src/screens/ContractBuilderScreen";
import { QRCodeDetailScreen } from "../src/screens/QRCodeDetailScreen";
import { QRCodeBuilderScreen } from "../src/screens/QRCodeBuilderScreen";
import { WorkshopLibraryScreen } from "../src/screens/WorkshopLibraryScreen";
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
import { RECOVERY_DRAFTS_KEY } from "../src/services/storage/recoveryDraftStorage";
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

afterEach(() => {
  vi.useRealTimers();
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

describe("Auto-save recovery drafts", () => {
  it("auto-saves meaningful flyer input but not a blank opened builder", async () => {
    const contract = getBuilderContract("Make a Flyer")!;
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <ContractBuilderScreen contract={contract} />
      </AppStateProvider>,
    );
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    expect(latest!.recoveryDrafts).toHaveLength(0);
    expect(JSON.parse(window.localStorage.getItem(RECOVERY_DRAFTS_KEY) ?? "[]")).toHaveLength(0);
    cleanup();

    render(
      <AppStateProvider>
        <Probe />
        <ContractBuilderScreen contract={contract} />
      </AppStateProvider>,
    );
    const startingFiles = latest!.workspace.files.length;
    fireEvent.change(screen.getByLabelText("Flyer title / headline"), {
      target: { value: "Recovery Headline" },
    });
    fireEvent.change(screen.getByLabelText("Main message"), {
      target: { value: "Recovery message" },
    });
    await waitFor(
      () =>
        expect(latest!.recoveryDrafts[0]?.builderData.headline).toBe(
          "Recovery Headline",
        ),
      { timeout: 1800 },
    );
    expect(window.localStorage.getItem(RECOVERY_DRAFTS_KEY)).toContain(
      "Recovery Headline",
    );
    expect(latest!.workspace.files).toHaveLength(startingFiles);
  });

  it("survives provider remount, can continue, discard, and convert to My Creations", async () => {
    const first = renderState();
    act(() => {
      first.state().saveRecoveryDraft({
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        selectedCreateTask: "Make a Flyer",
        builderData: {
          headline: "Recovered Flyer",
          message: "Recovered body copy",
        },
      });
    });
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    expect(window.localStorage.getItem(RECOVERY_DRAFTS_KEY)).toContain(
      "Recovered Flyer",
    );
    first.unmount();

    const second = renderState();
    expect(second.state().recoveryDrafts[0]?.builderData.headline).toBe(
      "Recovered Flyer",
    );
    const draftId = second.state().recoveryDrafts[0].id;
    act(() => second.state().continueRecoveryDraft(draftId));
    expect(second.state().currentScreen).toBe("create-builder");
    expect(second.state().selectedRecoveryDraftId).toBe(draftId);

    act(() => second.state().discardRecoveryDraft(draftId));
    expect(second.state().recoveryDrafts).toHaveLength(0);

    act(() => {
      second.state().saveRecoveryDraft({
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        selectedCreateTask: "Make a Flyer",
        builderData: { headline: "Convert Me" },
      });
    });
    const convertId = second.state().recoveryDrafts[0].id;
    act(() => {
      second.state().saveRecoveryDraftAsCreation(convertId);
    });
    expect(
      second.state().workspace.workshopItems.some((item) => item.title === "Convert Me"),
    ).toBe(true);
    expect(second.state().recoveryDrafts).toHaveLength(0);
  });

  it("manual Save Draft clears the related recovery draft", () => {
    const view = renderState();
    act(() => {
      view.state().saveRecoveryDraft({
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        selectedCreateTask: "Make a Flyer",
        builderData: { headline: "Manual Save Clears Me" },
      });
    });
    expect(view.state().recoveryDrafts).toHaveLength(1);
    act(() => {
      view.state().saveWorkshopItem({
        itemType: "flyer",
        title: "Manual Save Clears Me",
        description: "Manual draft",
        status: "Draft",
        createdFrom: "Manual Builder",
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        builderData: { headline: "Manual Save Clears Me" },
        tags: ["flyer"],
        exportFormats: ["PNG"],
      });
    });
    expect(view.state().recoveryDrafts).toHaveLength(0);
  });

  it("restores QR recovery draft fields without creating File Vault files", async () => {
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }
    render(
      <AppStateProvider>
        <Probe />
        <QRCodeBuilderScreen />
      </AppStateProvider>,
    );
    const startingFiles = latest!.workspace.files.length;
    act(() => {
      latest!.saveRecoveryDraft({
        builderId: "qr-code-builder",
        sourceTool: "Create QR Code",
        selectedCreateTask: "Create QR Code",
        builderData: {
          qrType: "Website / Link",
          destination: "https://example.com/quote",
          qrName: "Recovered QR",
          shortLabel: "Scan for quote",
        },
      });
    });
    const draftId = latest!.recoveryDrafts[0].id;
    act(() => latest!.continueRecoveryDraft(draftId));

    expect((screen.getByLabelText("Destination link") as HTMLInputElement).value).toBe(
      "https://example.com/quote",
    );
    expect((screen.getByLabelText("QR code name") as HTMLInputElement).value).toBe(
      "Recovered QR",
    );
    expect(JSON.parse(window.localStorage.getItem(RECOVERY_DRAFTS_KEY) ?? "[]")).toHaveLength(1);
    expect(latest!.workspace.files).toHaveLength(startingFiles);
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
    const startingFiles = view.state().workspace.files.length;
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
    });
    expect(view.state().workspace.files).toHaveLength(startingFiles);
    act(() => {
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

describe("QR save flow cleanup and duplicate prevention", () => {
  it("does not expose a hidden File Vault checkbox in QR More Options", () => {
    render(
      <AppStateProvider>
        <QRCodeBuilderScreen />
      </AppStateProvider>,
    );

    fireEvent.click(screen.getByText("More Options"));

    expect(
      screen.queryByText(/Also save a copy to File Vault/i),
    ).toBeNull();
    expect(screen.queryByText(/Also save copy to File Vault/i)).toBeNull();
    expect(screen.queryByText(/Save copy checkbox/i)).toBeNull();
  });

  it("Create QR shows a visible File Vault choice and No does not create a file", async () => {
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <QRCodeBuilderScreen />
      </AppStateProvider>,
    );
    const startingFiles = latest!.workspace.files.length;

    fireEvent.click(
      screen.getByRole("button", { name: /Website \/ Link/i }),
    );
    fireEvent.change(screen.getByLabelText("Destination link"), {
      target: { value: "https://example.com/qr-create-choice" },
    });
    fireEvent.change(screen.getByLabelText("QR code name"), {
      target: { value: "Visible Choice QR" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create QR Code/i }));

    await screen.findByText("Save a copy to File Vault?");
    expect(screen.getByText("QR code generated and saved to My Creations.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /No, not now/i }));

    expect(latest!.workspace.files).toHaveLength(startingFiles);
    expect(
      screen.getByText(/No File Vault copy was saved/i).textContent,
    ).toContain("My Creations");
  });

  it("QR download no longer asks for File Vault and does not auto-save a file", async () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <QRCodeBuilderScreen />
      </AppStateProvider>,
    );
    const startingFiles = latest!.workspace.files.length;
    fireEvent.click(
      screen.getByRole("button", { name: /Website \/ Link/i }),
    );
    fireEvent.change(screen.getByLabelText("Destination link"), {
      target: { value: "https://example.com/qr-download-choice" },
    });
    fireEvent.change(screen.getByLabelText("QR code name"), {
      target: { value: "Download Choice QR" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create QR Code/i }));
    await screen.findByText("Save a copy to File Vault?");
    fireEvent.click(screen.getByRole("button", { name: /No, not now/i }));

    fireEvent.click(await screen.findByRole("button", { name: /Download PNG/i }));

    expect(screen.getByText("PNG downloaded to your device.")).toBeTruthy();
    expect(screen.queryByText("Save this downloaded file to File Vault?")).toBeNull();
    expect(click).toHaveBeenCalledOnce();

    expect(latest!.workspace.files).toHaveLength(startingFiles);
    click.mockRestore();
  });

  it("My Creations opens saved QR in viewer mode and Edit opens the builder", () => {
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <WorkshopLibraryScreen />
      </AppStateProvider>,
    );
    let qrCodeId = "";
    let workshopItemId = "";
    act(() => {
      const saved = latest!.createQrCode({
        name: "Viewer First QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/viewer-first",
        url: "https://example.com/viewer-first",
        createdFrom: "Manual Builder",
      });
      qrCodeId = saved.qrCodeId;
      workshopItemId = saved.workshopItemId;
    });

    const card = screen.getByText("Viewer First QR").closest("article");
    expect(card).not.toBeNull();
    fireEvent.click(within(card!).getByRole("button", { name: "Open" }));

    expect(latest!.currentScreen).toBe("qr-detail");
    expect(latest!.selectedQrId).toBe(qrCodeId);

    act(() => latest!.openQrEditor(qrCodeId, workshopItemId));
    expect(latest!.currentScreen).toBe("create-builder");
    expect(latest!.selectedCreateTask).toBe("Create QR Code");
  });

  it("editing an existing QR requires overwrite confirmation before updating", async () => {
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <QRCodeBuilderScreen />
      </AppStateProvider>,
    );
    let qrCodeId = "";
    let workshopItemId = "";
    act(() => {
      const saved = latest!.createQrCode({
        name: "Overwrite Guard QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/original-overwrite",
        url: "https://example.com/original-overwrite",
        createdFrom: "Manual Builder",
      });
      qrCodeId = saved.qrCodeId;
      workshopItemId = saved.workshopItemId;
      latest!.openQrEditor(qrCodeId, workshopItemId);
    });

    fireEvent.change(screen.getByLabelText("Destination link"), {
      target: { value: "https://example.com/updated-overwrite" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    expect(screen.getByText("Save changes to this QR?")).toBeTruthy();
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Cancel",
      }),
    );
    expect(
      latest!.workspace.qrCodes.find((item) => item.id === qrCodeId)?.payload,
    ).toBe("https://example.com/original-overwrite");

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Save Changes",
      }),
    );

    await screen.findByText("Save updated copy to File Vault?");
    const updated = latest!.workspace.qrCodes.find((item) => item.id === qrCodeId);
    expect(updated?.payload).toBe("https://example.com/updated-overwrite");
    expect(updated?.workshopItemId).toBe(workshopItemId);
  });

  it("Save as New Copy uses unique Version names and keeps the original", async () => {
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <QRCodeBuilderScreen />
      </AppStateProvider>,
    );
    let originalQrId = "";
    act(() => {
      const saved = latest!.createQrCode({
        name: "Versioned QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/original-versioned",
        url: "https://example.com/original-versioned",
        createdFrom: "Manual Builder",
      });
      originalQrId = saved.qrCodeId;
      latest!.createQrCode({
        name: "Versioned QR - Version 2",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/version-2",
        url: "https://example.com/version-2",
        createdFrom: "Manual Builder",
        forceNew: true,
      });
      latest!.openQrEditor(originalQrId, saved.workshopItemId);
    });

    fireEvent.change(screen.getByLabelText("Destination link"), {
      target: { value: "https://example.com/version-3" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save as New Copy/i }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Name this new copy")).toBeTruthy();
    expect(
      (within(dialog).getByLabelText("New name") as HTMLInputElement).value,
    ).toBe("Versioned QR - Version 3");

    fireEvent.click(within(dialog).getByRole("button", { name: /Save New Copy/i }));

    await screen.findByText("Save a copy to File Vault?");
    expect(
      latest!.workspace.qrCodes.find((item) => item.id === originalQrId)?.payload,
    ).toBe("https://example.com/original-versioned");
    expect(
      latest!.workspace.qrCodes.some(
        (item) =>
          item.name === "Versioned QR - Version 3" &&
          item.payload === "https://example.com/version-3",
      ),
    ).toBe(true);
  });

  it("File Vault source QR edits ask to overwrite and update the existing file copy", async () => {
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <QRCodeBuilderScreen />
      </AppStateProvider>,
    );
    let qrCodeId = "";
    let workshopItemId = "";
    let fileId = "";
    await act(async () => {
      const saved = latest!.createQrCode({
        name: "Vault Source QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/source-original",
        url: "https://example.com/source-original",
        createdFrom: "Manual Builder",
      });
      qrCodeId = saved.qrCodeId;
      workshopItemId = saved.workshopItemId;
      const copy = await latest!.createQrFileVaultCopy(qrCodeId, "png");
      fileId = copy.fileId!;
      latest!.openQrEditor(qrCodeId, workshopItemId, fileId);
    });

    fireEvent.change(screen.getByLabelText("Destination link"), {
      target: { value: "https://example.com/source-updated" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await screen.findByText("Overwrite saved File Vault copy?");
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Yes, overwrite saved file",
      }),
    );

    await screen.findByText("Saved QR and File Vault copy updated.");
    expect(
      latest!.workspace.qrCodes.find((item) => item.id === qrCodeId)?.payload,
    ).toBe("https://example.com/source-updated");
    expect(
      latest!.workspace.files.filter((file) => file.qrCodeId === qrCodeId),
    ).toHaveLength(1);
    expect(latest!.workspace.files.find((file) => file.id === fileId)?.metadataOnly).toBe(false);
    expect(screen.queryByText("Save a copy to File Vault?")).toBeNull();
  });

  it("updates one recovery draft for the same active work", () => {
    const view = renderState();

    act(() => {
      view.state().saveRecoveryDraft({
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        selectedCreateTask: "Make a Flyer",
        builderData: { headline: "First headline" },
      });
    });
    const firstId = view.state().recoveryDrafts[0].id;

    act(() => {
      view.state().saveRecoveryDraft({
        builderId: "flyer-builder",
        sourceTool: "Make a Flyer",
        selectedCreateTask: "Make a Flyer",
        builderData: { headline: "Updated headline" },
      });
    });

    expect(view.state().recoveryDrafts).toHaveLength(1);
    expect(view.state().recoveryDrafts[0].id).toBe(firstId);
    expect(view.state().recoveryDrafts[0].builderData.headline).toBe(
      "Updated headline",
    );
  });

  it("creating the same QR twice updates the existing QR and linked creation", () => {
    const view = renderState();
    const payload = "https://example.com/no-duplicate-qr";

    act(() => {
      view.state().createQrCode({
        name: "Duplicate Guard QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload,
        url: payload,
        createdFrom: "Manual Builder",
      });
    });
    act(() => {
      view.state().openCreateTask("Create QR Code");
    });
    act(() => {
      view.state().createQrCode({
        name: "Duplicate Guard QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload,
        url: payload,
        label: "Updated label",
        createdFrom: "Manual Builder",
      });
    });

    expect(
      view
        .state()
        .workspace.qrCodes.filter((item) => item.name === "Duplicate Guard QR"),
    ).toHaveLength(1);
    expect(
      view
        .state()
        .workspace.workshopItems.filter(
          (item) => item.title === "Duplicate Guard QR" && item.itemType === "qr_code",
        ),
    ).toHaveLength(1);
    expect(view.state().notice).toBe(
      "This QR already exists. The saved QR was updated.",
    );
  });

  it("Save Copy to File Vault twice does not duplicate QR files", async () => {
    const view = renderState();
    let qrCodeId = "";
    await act(async () => {
      const saved = view.state().createQrCode({
        name: "Vault Duplicate QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/vault-duplicate",
        url: "https://example.com/vault-duplicate",
        createdFrom: "Manual Builder",
      });
      qrCodeId = saved.qrCodeId;
    });

    await act(async () => {
      await view.state().createQrFileVaultCopy(qrCodeId, "png");
    });
    await act(async () => {
      await view.state().createQrFileVaultCopy(qrCodeId, "png");
    });

    expect(
      view
        .state()
        .workspace.files.filter(
          (file) => file.qrCodeId === qrCodeId && file.source === "QR Generator",
        ),
    ).toHaveLength(1);
    expect(view.state().notice).toBe(
      "This QR file is already saved in File Vault.",
    );
  });

  it("metadata-only File Vault copies update when generated content arrives", () => {
    const view = renderState();
    let firstFileId = "";

    act(() => {
      firstFileId = view.state().addFileMetadata({
        name: "metadata-only-qr.svg",
        type: "image/svg+xml",
        qrCodeId: "qr-metadata-update",
        source: "QR Generator",
        metadataOnly: true,
      });
    });
    act(() => {
      const secondFileId = view.state().addFileMetadata({
        name: "metadata-only-qr.svg",
        type: "image/svg+xml",
        qrCodeId: "qr-metadata-update",
        source: "QR Generator",
        generatedContent: "<svg>ready</svg>",
        metadataOnly: false,
      });
      expect(secondFileId).toBe(firstFileId);
    });

    const matches = view
      .state()
      .workspace.files.filter((file) => file.name === "metadata-only-qr.svg");
    expect(matches).toHaveLength(1);
    expect(matches[0].metadataOnly).toBe(false);
    expect(matches[0].generatedContent).toBe("<svg>ready</svg>");
    expect(view.state().notice).toBe(
      "File Vault copy updated with generated content.",
    );
  });

  it("download can run repeatedly while File Vault copy still stays single", async () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const view = renderState();
    let qrCodeId = "";

    await act(async () => {
      const saved = view.state().createQrCode({
        name: "Repeated Download QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/repeated-download",
        url: "https://example.com/repeated-download",
        createdFrom: "Manual Builder",
      });
      qrCodeId = saved.qrCodeId;
    });
    await act(async () => {
      await view.state().downloadQrToDevice(qrCodeId, "png");
      await view.state().downloadQrToDevice(qrCodeId, "png");
    });
    await act(async () => {
      await view.state().createQrFileVaultCopy(qrCodeId, "png");
    });
    await act(async () => {
      await view.state().createQrFileVaultCopy(qrCodeId, "png");
    });

    expect(click).toHaveBeenCalledTimes(2);
    expect(
      view
        .state()
        .workspace.files.filter(
          (file) => file.qrCodeId === qrCodeId && file.source === "QR Generator",
        ),
    ).toHaveLength(1);
    click.mockRestore();
  });

  it("QR Detail share fallback is honest when navigator.share is unavailable", () => {
    const originalShare = navigator.share;
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    let latest: State | undefined;
    function Probe() {
      latest = useAppState();
      return null;
    }

    render(
      <AppStateProvider>
        <Probe />
        <QRCodeDetailScreen />
      </AppStateProvider>,
    );
    act(() => {
      const saved = latest!.createQrCode({
        name: "Share Fallback QR",
        type: "Website / Link",
        status: "Ready",
        payloadType: "url",
        payload: "https://example.com/share-fallback",
        url: "https://example.com/share-fallback",
        createdFrom: "Manual Builder",
      });
      latest!.openQrDetail(saved.qrCodeId, saved.workshopItemId);
    });

    fireEvent.click(screen.getByRole("button", { name: /Share \/ Send/i }));

    expect(screen.getByText("Share or send this QR")).toBeTruthy();
    expect(
      screen.getByText(/Messages are sent from your device or prepared for you/i),
    ).toBeTruthy();
    expect(screen.getByText(/Text message, data, and carrier charges may apply/i)).toBeTruthy();
    expect(screen.queryByText(/SMS was sent/i)).toBeNull();

    Object.defineProperty(navigator, "share", {
      value: originalShare,
      configurable: true,
    });
  });
});
