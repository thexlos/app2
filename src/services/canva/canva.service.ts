import {
  mockOnlyMessage,
  type IntegrationResult,
  type IntegrationService,
} from "../integration.types";

export interface CanvaLink {
  businessId: string;
  url: string;
  label: string;
}

// Current scope stores user-provided collaboration links and uploads only.
// TODO(real integration): validate Canva's current official API capabilities and add
// approved account connection, secure token storage, and design access boundaries.
export const canvaMockService: IntegrationService & {
  saveLink(link: CanvaLink): Promise<IntegrationResult<CanvaLink>>;
} = {
  provider: "Canva",
  async getStatus() {
    return {
      ok: true,
      mode: "mock",
      provider: "Canva",
      message: mockOnlyMessage("Canva"),
      data: { connected: false },
    };
  },
  async connect() {
    return {
      ok: false,
      mode: "mock",
      provider: "Canva",
      message: mockOnlyMessage("Canva"),
    };
  },
  async saveLink(link) {
    return {
      ok: true,
      mode: "mock",
      provider: "Canva",
      message:
        "Canva share link saved inside this business workspace. No password was requested.",
      data: link,
    };
  },
};
