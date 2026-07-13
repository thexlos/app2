import type { BuilderData, RecoveryDraft } from "../../types/models";

export const RECOVERY_DRAFTS_KEY = "startHereHelper.recoveryDrafts";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isBuilderData(value: unknown): value is BuilderData {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isRecoveryDraft(value: unknown): value is RecoveryDraft {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const draft = value as Partial<RecoveryDraft>;
  return (
    typeof draft.id === "string" &&
    typeof draft.businessProfileId === "string" &&
    typeof draft.builderId === "string" &&
    typeof draft.sourceTool === "string" &&
    typeof draft.selectedCreateTask === "string" &&
    typeof draft.updatedAt === "string" &&
    draft.status === "Recoverable Draft" &&
    isBuilderData(draft.builderData)
  );
}

export function loadRecoveryDrafts(): RecoveryDraft[] {
  if (!canUseLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(RECOVERY_DRAFTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isRecoveryDraft) : [];
  } catch {
    return [];
  }
}

export function saveRecoveryDrafts(drafts: RecoveryDraft[]) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(RECOVERY_DRAFTS_KEY, JSON.stringify(drafts));
}

export function clearRecoveryDrafts() {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(RECOVERY_DRAFTS_KEY);
}

export function hasMeaningfulBuilderData(builderData: BuilderData) {
  return Object.values(builderData).some((value) => {
    if (Array.isArray(value)) return value.some((item) => String(item).trim());
    if (typeof value === "string") return Boolean(value.trim());
    if (typeof value === "number") return Number.isFinite(value) && value !== 0;
    if (typeof value === "boolean") return value;
    return value !== null && value !== undefined;
  });
}
