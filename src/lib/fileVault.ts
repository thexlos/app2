import type { BusinessWorkspaceData, FileAsset, Tone } from "../types/models";

export const fileVaultFilters = [
  "All",
  "Logos & Brand",
  "QR Codes",
  "Flyers & Posts",
  "Business Cards",
  "Print Files",
  "Estimates & Invoices",
  "Customer Files",
  "Project Files",
  "Help Request Files",
  "Canva / VistaPrint",
  "Uploads",
  "Generated Exports",
  "Metadata Only",
  "Archived",
] as const;

export type FileVaultFilter = (typeof fileVaultFilters)[number];

export interface FileVaultStatus {
  label: "Generated File" | "Metadata Only" | "External Link" | "Uploaded Reference" | "Archived";
  tone: Tone;
  description: string;
}

export function hasGeneratedFileContent(file: FileAsset) {
  return Boolean(file.dataUrl || file.generatedContent);
}

export function getFileVaultStatus(file: FileAsset): FileVaultStatus {
  if (file.archived) {
    return {
      label: "Archived",
      tone: "neutral",
      description: "This file is hidden from the active File Vault list.",
    };
  }
  if (hasGeneratedFileContent(file)) {
    return {
      label: "Generated File",
      tone: "success",
      description: "This browser has generated content that can download now.",
    };
  }
  if (file.url) {
    return {
      label: "External Link",
      tone: "info",
      description: "This record points to an outside file or design link.",
    };
  }
  if (/upload|help request/i.test(file.source ?? "")) {
    return {
      label: "Uploaded Reference",
      tone: "neutral",
      description: "The prototype saved the file reference, not cloud file bytes.",
    };
  }
  return {
    label: "Metadata Only",
    tone: "warning",
    description: "This record has file details but no downloadable bytes yet.",
  };
}

export function canDownloadFileAsset(file: FileAsset) {
  return hasGeneratedFileContent(file);
}

export function getLinkedRecordSummary(
  file: FileAsset,
  workspace: BusinessWorkspaceData,
) {
  const links = [
    file.customerId
      ? `Customer: ${workspace.customers.find((item) => item.id === file.customerId)?.name ?? file.customerId}`
      : "",
    file.leadId
      ? `Lead: ${workspace.leads.find((item) => item.id === file.leadId)?.name ?? file.leadId}`
      : "",
    file.projectId
      ? `Project: ${workspace.projects.find((item) => item.id === file.projectId)?.name ?? file.projectId}`
      : "",
    file.helpRequestId
      ? `Help: ${workspace.helpRequests.find((item) => item.id === file.helpRequestId)?.type ?? file.helpRequestId}`
      : "",
    file.workshopItemId
      ? `Creation: ${workspace.workshopItems.find((item) => item.id === file.workshopItemId)?.title ?? file.workshopItemId}`
      : "",
    file.qrCodeId
      ? `QR: ${workspace.qrCodes.find((item) => item.id === file.qrCodeId)?.name ?? file.qrCodeId}`
      : "",
  ].filter(Boolean);
  return links.length ? links.join(" · ") : "No linked records yet";
}

export function getFileVaultCategories(
  file: FileAsset,
  workspace: BusinessWorkspaceData,
): FileVaultFilter[] {
  const categories = new Set<FileVaultFilter>(["All"]);
  const searchable = `${file.name} ${file.type} ${file.source ?? ""} ${file.url ?? ""}`.toLowerCase();
  const workshopItem = file.workshopItemId
    ? workspace.workshopItems.find((item) => item.id === file.workshopItemId)
    : undefined;
  const itemType = workshopItem?.itemType ?? "";

  if (/logo|brand|asset/.test(searchable)) categories.add("Logos & Brand");
  if (file.qrCodeId || /qr|quick response/.test(searchable)) categories.add("QR Codes");
  if (/flyer|post|social|promo/.test(`${searchable} ${itemType}`))
    categories.add("Flyers & Posts");
  if (/business_card|business card|card/.test(`${searchable} ${itemType}`))
    categories.add("Business Cards");
  if (/print|vistaprint|pdf|sign|card/.test(searchable)) categories.add("Print Files");
  if (/estimate|invoice|progress|change order/.test(searchable))
    categories.add("Estimates & Invoices");
  if (file.customerId) categories.add("Customer Files");
  if (file.projectId) categories.add("Project Files");
  if (file.helpRequestId) categories.add("Help Request Files");
  if (/canva|vistaprint/.test(searchable)) categories.add("Canva / VistaPrint");
  if (/upload/i.test(file.source ?? "")) categories.add("Uploads");
  if (/qr generator|workshop export/i.test(file.source ?? "") || hasGeneratedFileContent(file))
    categories.add("Generated Exports");
  if (file.metadataOnly && !hasGeneratedFileContent(file)) categories.add("Metadata Only");
  if (file.archived) categories.add("Archived");

  return Array.from(categories);
}
