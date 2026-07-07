import {
  mockOnlyMessage,
  type IntegrationResult,
  type IntegrationService,
} from "../integration.types";
import type { IntegrationProvider } from "../../types/models";

type SocialProvider = Extract<
  IntegrationProvider,
  "Facebook Page" | "Instagram Business" | "Google Business Profile"
>;
export interface SocialPublishDraft {
  caption: string;
  imageAssetId?: string;
  destination: SocialProvider;
}

export function createSocialMockService(
  provider: SocialProvider,
): IntegrationService & {
  publish(
    businessId: string,
    draft: SocialPublishDraft,
  ): Promise<IntegrationResult>;
} {
  return {
    provider,
    async getStatus() {
      return {
        ok: true,
        mode: "mock",
        provider,
        message: mockOnlyMessage(provider),
        data: { connected: false },
      };
    },
    async connect() {
      return {
        ok: false,
        mode: "mock",
        provider,
        message: mockOnlyMessage(provider),
      };
    },
    async publish() {
      return {
        ok: false,
        mode: "mock",
        provider,
        message: `${mockOnlyMessage(provider)} The draft remains saved locally.`,
      };
    },
  };
}

// TODO(real integration): configure separate provider applications, approved permissions,
// callback URLs, encrypted per-business tokens, publish eligibility checks, retry rules,
// and posting history before enabling any Publish button.
export const facebookMockService = createSocialMockService("Facebook Page");
export const instagramMockService =
  createSocialMockService("Instagram Business");
export const googleBusinessMockService = createSocialMockService(
  "Google Business Profile",
);
