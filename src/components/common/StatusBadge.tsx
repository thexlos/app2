import type { ReactNode } from "react";
import type { Tone } from "../../types/models";

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return <span className={`status status--${tone}`}>{children}</span>;
}

export function statusTone(status: string): Tone {
  if (
    [
      "Accepted",
      "Paid",
      "Connected",
      "Mock Connected",
      "Completed",
      "Approved",
    ].includes(status)
  )
    return "success";
  if (["Rejected", "Overdue", "Sync Failed", "Canceled"].includes(status))
    return "danger";
  if (
    [
      "Changes Requested",
      "Needs Review",
      "Waiting for Approval",
      "Ready for Review",
    ].includes(status)
  )
    return "warning";
  if (["Draft", "Sent", "Viewed", "Not Connected"].includes(status))
    return "info";
  return "neutral";
}
