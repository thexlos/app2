import {
  mockOnlyMessage,
  type IntegrationResult,
  type IntegrationService,
} from "../integration.types";

export interface QuickBooksService extends IntegrationService {
  importCustomers(businessId: string): Promise<IntegrationResult>;
  importItems(businessId: string): Promise<IntegrationResult>;
  sendFinalInvoice(
    businessId: string,
    invoiceId: string,
  ): Promise<IntegrationResult>;
}

// TODO(real integration): add Intuit app credentials, account connection callback,
// encrypted token storage, refresh handling, webhooks, conflict review, audit logs,
// idempotency, and per-business authorization before replacing this service.
export const quickBooksMockService: QuickBooksService = {
  provider: "QuickBooks",
  async getStatus() {
    return {
      ok: true,
      mode: "mock",
      provider: "QuickBooks",
      message: mockOnlyMessage("QuickBooks"),
      data: { connected: false },
    };
  },
  async connect() {
    return {
      ok: false,
      mode: "mock",
      provider: "QuickBooks",
      message: mockOnlyMessage("QuickBooks"),
    };
  },
  async importCustomers() {
    return {
      ok: false,
      mode: "mock",
      provider: "QuickBooks",
      message: mockOnlyMessage("QuickBooks"),
    };
  },
  async importItems() {
    return {
      ok: false,
      mode: "mock",
      provider: "QuickBooks",
      message: mockOnlyMessage("QuickBooks"),
    };
  },
  async sendFinalInvoice() {
    return {
      ok: false,
      mode: "mock",
      provider: "QuickBooks",
      message: mockOnlyMessage("QuickBooks"),
    };
  },
};
