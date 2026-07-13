import { businessProfiles } from "../../data/mock/businessProfiles";
import { initialWorkspaces } from "../../data/mock/workspaces";
import { normalizeWorkshopItem } from "../../lib/workshopPayloads";
import type { BusinessWorkspaceData, QRCodeRecord } from "../../types/models";

export const APP_STORAGE_VERSION = 1;
export const STORAGE_VERSION_KEY = "startHereHelper.storageVersion";
export const ACTIVE_BUSINESS_KEY = "startHereHelper.activeBusinessProfileId";
export const WORKSPACES_KEY = "startHereHelper.workspaces";

export interface StoredAppState {
  activeBusinessProfileId: string;
  workspaces: Record<string, BusinessWorkspaceData>;
}

interface RawStoredAppState {
  storageVersion: unknown;
  activeBusinessProfileId: unknown;
  workspaces: unknown;
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneInitialWorkspaces() {
  return JSON.parse(JSON.stringify(initialWorkspaces)) as Record<
    string,
    BusinessWorkspaceData
  >;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeQrRecord(record: QRCodeRecord): QRCodeRecord {
  const payload = record.payload ?? record.url ?? "";
  const now = new Date().toISOString();
  return {
    ...record,
    status: record.status === "Created" ? "Ready" : record.status ?? "Ready",
    payloadType: record.payloadType ?? "url",
    payload,
    url: record.url ?? (record.payloadType === "url" ? payload : undefined),
    scans: record.scans ?? 0,
    fileAssetIds: record.fileAssetIds ?? [],
    createdAt: record.createdAt ?? now,
    updatedAt: record.updatedAt ?? now,
    createdFrom: record.createdFrom ?? "Manual Builder",
  };
}

function normalizeWorkspace(workspace: BusinessWorkspaceData): BusinessWorkspaceData {
  return {
    ...workspace,
    qrCodes: (workspace.qrCodes ?? []).map(normalizeQrRecord),
    workshopItems: (workspace.workshopItems ?? []).map(normalizeWorkshopItem),
    files: workspace.files ?? [],
    businessAssets: workspace.businessAssets ?? [],
    guidedWizardSessions: workspace.guidedWizardSessions ?? [],
  };
}

function mergeWorkspaces(
  stored: Record<string, BusinessWorkspaceData>,
): Record<string, BusinessWorkspaceData> {
  const merged = cloneInitialWorkspaces();
  for (const profile of businessProfiles) {
    const workspace = stored[profile.id];
    merged[profile.id] = workspace
      ? normalizeWorkspace({
          ...merged[profile.id],
          ...workspace,
        })
      : normalizeWorkspace(merged[profile.id]);
  }
  return merged;
}

function validateRaw(raw: RawStoredAppState): StoredAppState | undefined {
  const version = Number(raw.storageVersion);
  if (version !== APP_STORAGE_VERSION) return undefined;
  if (typeof raw.activeBusinessProfileId !== "string") return undefined;
  if (!isPlainRecord(raw.workspaces)) return undefined;

  const workspaces = mergeWorkspaces(
    raw.workspaces as Record<string, BusinessWorkspaceData>,
  );
  const activeBusinessProfileId =
    businessProfiles.some((profile) => profile.id === raw.activeBusinessProfileId)
      ? raw.activeBusinessProfileId
      : businessProfiles[0].id;

  return { activeBusinessProfileId, workspaces };
}

export function migrateStoredAppState(
  raw: RawStoredAppState,
): StoredAppState | undefined {
  try {
    return validateRaw(raw);
  } catch {
    return undefined;
  }
}

export function loadStoredAppState(): StoredAppState | undefined {
  if (!canUseLocalStorage()) return undefined;
  try {
    const storageVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
    const activeBusinessProfileId =
      window.localStorage.getItem(ACTIVE_BUSINESS_KEY);
    const workspacesRaw = window.localStorage.getItem(WORKSPACES_KEY);
    if (!storageVersion || !activeBusinessProfileId || !workspacesRaw) {
      return undefined;
    }
    const workspaces = JSON.parse(workspacesRaw) as unknown;
    return migrateStoredAppState({
      storageVersion,
      activeBusinessProfileId,
      workspaces,
    });
  } catch {
    return undefined;
  }
}

export function saveStoredAppState(state: StoredAppState) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(STORAGE_VERSION_KEY, String(APP_STORAGE_VERSION));
  window.localStorage.setItem(
    ACTIVE_BUSINESS_KEY,
    state.activeBusinessProfileId,
  );
  window.localStorage.setItem(WORKSPACES_KEY, JSON.stringify(state.workspaces));
}

export function clearStoredAppState() {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(STORAGE_VERSION_KEY);
  window.localStorage.removeItem(ACTIVE_BUSINESS_KEY);
  window.localStorage.removeItem(WORKSPACES_KEY);
}

export function hasStoredAppState() {
  if (!canUseLocalStorage()) return false;
  return Boolean(
    window.localStorage.getItem(STORAGE_VERSION_KEY) &&
      window.localStorage.getItem(ACTIVE_BUSINESS_KEY) &&
      window.localStorage.getItem(WORKSPACES_KEY),
  );
}
