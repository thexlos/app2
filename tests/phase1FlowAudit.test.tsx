import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { resolveActivityTarget } from "../src/lib/flowRouting";
import {
  AppStateProvider,
  useAppState,
} from "../src/state/AppState";

type State = ReturnType<typeof useAppState>;

function renderState() {
  let latest: State | undefined;
  function Probe() {
    latest = useAppState();
    return null;
  }
  render(
    <AppStateProvider>
      <Probe />
    </AppStateProvider>,
  );
  return () => latest!;
}

describe("Phase 1 flow audit", () => {
  it("resolves recent activity to specific sections", () => {
    expect(
      resolveActivityTarget({
        id: "a1",
        businessId: "business",
        label: "Lead added",
        detail: "Sample lead",
        occurredAt: "Now",
        tone: "info",
        type: "lead.created",
        relatedRecordType: "lead",
        relatedRecordId: "lead-1",
      }),
    ).toBe("lead-detail");
    expect(
      resolveActivityTarget({
        id: "a2",
        businessId: "business",
        label: "Export prepared",
        detail: "CSV",
        occurredAt: "Now",
        tone: "info",
        type: "export.prepared",
      }),
    ).toBe("sync-center");
  });

  it("keeps newly created records isolated by active business", () => {
    const state = renderState();
    const businessA = state().currentBusinessId;
    const businessB = state().profiles.find((item) => item.id !== businessA)!.id;
    let customerId = "";
    act(() => {
      customerId = state().createCustomer({
        name: "Phase One Customer",
        phone: "401-555-0111",
        email: "phase-one@example.com",
        billingAddress: "1 Sample Street",
        jobSiteAddress: "1 Sample Street",
        customerType: "Person",
        preferredContactMethod: "Email",
        status: "New",
        notes: [],
      });
      state().saveWorkshopItem({
        itemType: "flyer",
        title: "Phase One Flyer",
        description: "Business-scoped draft",
        status: "Draft",
        createdFrom: "Manual Builder",
        tags: ["test"],
        exportFormats: ["PDF"],
      });
    });
    expect(state().workspace.customers.some((item) => item.id === customerId)).toBe(true);
    expect(state().workspace.workshopItems.some((item) => item.title === "Phase One Flyer")).toBe(true);

    act(() => state().switchBusiness(businessB));
    expect(state().workspace.customers.some((item) => item.id === customerId)).toBe(false);
    expect(state().workspace.workshopItems.some((item) => item.title === "Phase One Flyer")).toBe(false);

    act(() => state().switchBusiness(businessA));
    expect(state().workspace.customers.some((item) => item.id === customerId)).toBe(true);
    expect(state().workspace.workshopItems.some((item) => item.title === "Phase One Flyer")).toBe(true);
  });

  it("persists help actions and workshop lifecycle changes", () => {
    const state = renderState();
    let requestId = "";
    let workshopId = "";
    act(() => {
      requestId = state().submitHelpRequest({
        type: "Flyer refresh",
        serviceLevel: "Start Here Service Request",
        description: "Review this flyer",
        fileNames: [],
        quoteStatus: "Quote Sent",
      });
      workshopId = state().saveWorkshopItem({
        itemType: "flyer",
        title: "Flow Test Flyer",
        description: "Draft for lifecycle test",
        status: "Draft",
        createdFrom: "Manual Builder",
        tags: [],
        exportFormats: ["PDF"],
      });
    });
    act(() => {
      state().handleHelpRequestAction(
        requestId,
        "Add Note or Question",
        "Please use the updated logo.",
      );
      state().handleHelpRequestAction(requestId, "Approve Quote");
      state().duplicateWorkshopItem(workshopId);
      state().archiveWorkshopItem(workshopId);
    });

    const request = state().workspace.helpRequests.find(
      (item) => item.id === requestId,
    )!;
    expect(request.quoteStatus).toBe("Approved");
    expect(request.status).toBe("In Progress");
    expect(request.messages?.[0]?.message).toBe("Please use the updated logo.");
    expect(
      state().workspace.workshopItems.find((item) => item.id === workshopId)
        ?.archived,
    ).toBe(true);
    expect(
      state().workspace.workshopItems.some(
        (item) => item.title === "Flow Test Flyer Copy",
      ),
    ).toBe(true);
  });

  it("supports the lead to appointment to customer to estimate route", () => {
    const state = renderState();
    let leadId = "";
    act(() => {
      leadId = state().createLead({
        name: "Phase One Lead",
        phone: "401-555-0199",
        email: "lead@example.com",
        interestedService: "Sample service",
        source: "Manual",
        preferredContactMethod: "Call",
        status: "New",
        message: "Please call",
        tags: [],
        notes: [],
        internalNotes: [],
      });
      state().openLead(leadId);
    });
    expect(state().currentScreen).toBe("lead-detail");
    act(() => state().openSchedule({ leadId }));
    expect(state().currentScreen).toBe("calendar");
    act(() => {
      state().scheduleEvent({
        title: "Lead appointment",
        eventType: "Appointment",
        startDate: "2026-07-08",
        startTime: "10:00",
        allDay: false,
        relatedLeadId: leadId,
        status: "Scheduled",
        createdFrom: "Lead",
        reminders: ["1 hour before"],
      });
    });
    expect(
      state().workspace.calendarEvents.some(
        (event) => event.relatedLeadId === leadId,
      ),
    ).toBe(true);

    let customerId = "";
    act(() => {
      customerId = state().convertLeadToCustomer(leadId)!;
      state().openCustomer(customerId);
    });
    expect(state().currentScreen).toBe("customer-detail");
    expect(
      state().workspace.customers.some((customer) => customer.id === customerId),
    ).toBe(true);
    act(() => state().openEstimateBuilder(customerId));
    expect(state().currentScreen).toBe("estimate-builder");
    expect(state().selectedCustomerId).toBe(customerId);
  });

  it("keeps File Vault actions stateful and business scoped", () => {
    const state = renderState();
    let fileId = "";
    act(() => {
      fileId = state().addFileMetadata({ name: "phase-one-file.mock" });
      state().pinFileToBusinessKit(fileId);
    });
    expect(state().workspace.files.find((file) => file.id === fileId)?.pinned).toBe(
      true,
    );
    expect(
      state().workspace.businessAssets.some((asset) =>
        asset.fileIds.includes(fileId),
      ),
    ).toBe(true);
    act(() => state().archiveFile(fileId));
    expect(state().workspace.files.find((file) => file.id === fileId)?.archived).toBe(
      true,
    );
  });
});
