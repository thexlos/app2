import type { Estimate, EstimateVersion, RecordStatus } from "../types/models";

const protectedStatuses: RecordStatus[] = ["Accepted", "Rejected", "Paid"];

export function isProtectedRecord(status: RecordStatus): boolean {
  return protectedStatuses.includes(status);
}

export function canEditEstimateInPlace(estimate: Estimate): boolean {
  return (
    !isProtectedRecord(estimate.status) &&
    estimate.status !== "Converted to Invoice"
  );
}

export function noteIsRequiredForCustomerResponse(
  action: "approve" | "reject" | "request-changes",
): boolean {
  return action === "reject" || action === "request-changes";
}

export function createEstimateVersion(
  estimate: Estimate,
  status: RecordStatus,
  changeSummary: string,
  customerNote?: string,
): EstimateVersion {
  const nextVersion =
    Math.max(...estimate.versions.map((version) => version.version), 0) + 1;
  const createdAt = new Date().toISOString();
  return {
    id: `${estimate.id}-v${nextVersion}`,
    estimateId: estimate.id,
    version: nextVersion,
    versionNumber: nextVersion,
    status,
    createdAt,
    changedBy: "Carlos Thomas",
    createdBy: "Carlos Thomas",
    total: estimate.total,
    subtotal: estimate.subtotal ?? estimate.total,
    tax: estimate.tax ?? 0,
    discount: estimate.discount ?? 0,
    sectionsSnapshot: estimate.sections
      ? structuredClone(estimate.sections)
      : undefined,
    termsSnapshot: estimate.termsData
      ? structuredClone(estimate.termsData)
      : undefined,
    approvalSettingsSnapshot: estimate.approvalSettings
      ? structuredClone(estimate.approvalSettings)
      : undefined,
    changeSummary,
    customerNote,
    snapshotPath: `/snapshots/${estimate.number.toLowerCase()}-v${nextVersion}.pdf`,
    officialDocumentSnapshot: `/snapshots/${estimate.number.toLowerCase()}-v${nextVersion}.pdf`,
    clientViewSnapshot: {
      estimateNumber: estimate.number,
      projectName: estimate.projectName,
      total: estimate.total,
      message:
        estimate.deliverySettings?.emailMessage ??
        "Please review this estimate.",
      allowPdfDownload: estimate.deliverySettings?.allowPdfDownload ?? true,
      sections: estimate.sections
        ? structuredClone(estimate.sections)
        : undefined,
      customerMessage: estimate.customerMessage,
    },
    customerAction:
      status === "Accepted"
        ? "Approved"
        : status === "Rejected"
          ? "Rejected"
          : status === "Changes Requested"
            ? "Changes Requested"
            : undefined,
    approvedAt: status === "Accepted" ? createdAt : undefined,
    rejectedAt: status === "Rejected" ? createdAt : undefined,
    changesRequestedAt: status === "Changes Requested" ? createdAt : undefined,
  };
}
