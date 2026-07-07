export interface HelperAccessGrant {
  businessId: string;
  projectId: string;
  permissions: ("view-files" | "add-files" | "comment" | "prepare-draft")[];
  expiresAt?: string;
}

// Helper Access is project-scoped and never includes third-party account passwords.
// TODO: persist grants server-side with invitation acceptance, revocation, audit events,
// least-privilege checks, file scanning, and expiring signed file URLs.
export async function createMockHelperAccess(grant: HelperAccessGrant) {
  return { ok: true as const, mode: "mock" as const, grant };
}
