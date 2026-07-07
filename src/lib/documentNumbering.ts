import type { DocumentNumberSettings } from "../types/models";

export function formatDocumentNumber(
  settings: DocumentNumberSettings,
  type: "estimate" | "invoice" | "change-order" | "progress",
) {
  const prefix =
    type === "estimate"
      ? settings.estimatePrefix
      : type === "invoice"
        ? settings.invoicePrefix
        : type === "change-order"
          ? settings.changeOrderPrefix
          : settings.progressInvoicePrefix;
  const next =
    type === "estimate"
      ? settings.nextEstimateNumber
      : type === "invoice"
        ? settings.nextInvoiceNumber
        : type === "change-order"
          ? settings.nextChangeOrderNumber
          : settings.nextProgressInvoiceNumber;
  const number = String(next).padStart(settings.numberPadding, "0");
  return settings.useYearInNumber
    ? `${prefix}-${new Date().getFullYear()}-${number}`
    : `${prefix}-${number}`;
}
