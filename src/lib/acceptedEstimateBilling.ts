import type {
  ChangeOrder,
  Estimate,
  Invoice,
  ProgressInvoice,
} from "../types/models";

export interface ApprovedBillingSummary {
  acceptedEstimateValue: number;
  approvedChangeOrderValue: number;
  approvedScopeValue: number;
  invoicedValue: number;
  paidValue: number;
  remainingToInvoice: number;
  remainingToCollect: number;
}

export function calculateApprovedBillingSummary(
  estimate: Estimate,
  changeOrders: ChangeOrder[],
  invoices: Array<Invoice | ProgressInvoice>,
): ApprovedBillingSummary {
  const acceptedVersion = [...estimate.versions]
    .filter((version) => version.status === "Accepted")
    .sort((a, b) => b.version - a.version)[0];
  const acceptedEstimateValue =
    acceptedVersion?.total ??
    (estimate.status === "Accepted" ? estimate.total : 0);
  const approvedChangeOrderValue = changeOrders
    .filter(
      (order) =>
        order.estimateId === estimate.id && order.status === "Accepted",
    )
    .reduce((sum, order) => sum + order.amount, 0);
  const approvedScopeValue = acceptedEstimateValue + approvedChangeOrderValue;
  const relatedInvoices = invoices.filter(
    (invoice) =>
      invoice.estimateId === estimate.id && invoice.status !== "Canceled",
  );
  const invoicedValue = relatedInvoices.reduce(
    (sum, invoice) =>
      sum + ("amount" in invoice ? invoice.amount : invoice.total),
    0,
  );
  const paidValue = relatedInvoices.reduce(
    (sum, invoice) =>
      sum +
      ("amountPaid" in invoice
        ? invoice.amountPaid
        : invoice.status === "Paid"
          ? invoice.amount
          : 0),
    0,
  );
  return {
    acceptedEstimateValue,
    approvedChangeOrderValue,
    approvedScopeValue,
    invoicedValue,
    paidValue,
    remainingToInvoice: Math.max(0, approvedScopeValue - invoicedValue),
    remainingToCollect: Math.max(0, invoicedValue - paidValue),
  };
}

export function validateInvoiceAgainstAcceptedScope({
  estimate,
  changeOrders,
  invoices,
  proposedAmount,
  sourceLineItemIds = [],
}: {
  estimate: Estimate;
  changeOrders: ChangeOrder[];
  invoices: Array<Invoice | ProgressInvoice>;
  proposedAmount: number;
  sourceLineItemIds?: string[];
}) {
  if (
    estimate.status !== "Accepted" &&
    !estimate.versions.some((version) => version.status === "Accepted")
  ) {
    return {
      valid: false,
      message: "Accept the estimate before creating an approved-scope invoice.",
    };
  }
  if (!(proposedAmount > 0))
    return {
      valid: false,
      message: "Enter an invoice amount greater than zero.",
    };
  const summary = calculateApprovedBillingSummary(
    estimate,
    changeOrders,
    invoices,
  );
  if (proposedAmount > summary.remainingToInvoice + 0.005) {
    return {
      valid: false,
      message:
        "This invoice exceeds the remaining approved balance. Create an approved change order or adjustment first.",
      summary,
    };
  }
  const approvedLineIds = new Set([
    ...estimate.lineItems.map((item) => item.id),
    ...changeOrders
      .filter((order) => order.status === "Accepted")
      .flatMap((order) => order.lineItems?.map((item) => item.id) ?? []),
  ]);
  if (sourceLineItemIds.some((id) => !approvedLineIds.has(id))) {
    return {
      valid: false,
      message:
        "One or more invoice items are outside the accepted scope. Add them through a change order first.",
      summary,
    };
  }
  return {
    valid: true,
    message: "Invoice is within the accepted scope.",
    summary,
  };
}
