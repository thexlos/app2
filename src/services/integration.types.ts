import type { IntegrationProvider } from "../types/models";

export interface IntegrationResult<T = never> {
  ok: boolean;
  mode: "mock";
  provider: IntegrationProvider;
  message: string;
  data?: T;
}

export interface IntegrationService {
  provider: IntegrationProvider;
  getStatus(
    businessId: string,
  ): Promise<IntegrationResult<{ connected: boolean }>>;
  connect(businessId: string): Promise<IntegrationResult>;
}

export const mockOnlyMessage = (provider: IntegrationProvider) =>
  `${provider} is a placeholder in this build. No live account was connected and no external data was changed.`;
