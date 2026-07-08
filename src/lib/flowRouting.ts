import type { ActivityLogItem } from "../types/models";

export type ActivityFlowTarget =
  | "estimate-detail"
  | "money"
  | "customer-detail"
  | "lead-detail"
  | "help-request-detail"
  | "workshop-library"
  | "file-vault"
  | "calendar"
  | "sync-center"
  | "customers"
  | "home";

const recordTargets: Record<string, ActivityFlowTarget> = {
  estimate: "estimate-detail",
  invoice: "money",
  customer: "customer-detail",
  lead: "lead-detail",
  help_request: "help-request-detail",
  workshop_item: "workshop-library",
  file: "file-vault",
  calendar_event: "calendar",
  import_history: "sync-center",
  export_history: "sync-center",
  sync_record: "sync-center",
  project: "customers",
};

const routeTargets = new Set<ActivityFlowTarget>([
  "estimate-detail",
  "money",
  "customer-detail",
  "lead-detail",
  "help-request-detail",
  "workshop-library",
  "file-vault",
  "calendar",
  "sync-center",
  "customers",
  "home",
]);

export function resolveActivityTarget(
  activity: ActivityLogItem,
): ActivityFlowTarget {
  if (activity.relatedRecordType && recordTargets[activity.relatedRecordType])
    return recordTargets[activity.relatedRecordType];
  if (
    activity.deepLinkRoute &&
    routeTargets.has(activity.deepLinkRoute as ActivityFlowTarget)
  )
    return activity.deepLinkRoute as ActivityFlowTarget;
  if (/import|export|sync/i.test(activity.type)) return "sync-center";
  if (/calendar|appointment|schedule/i.test(activity.type)) return "calendar";
  if (/workshop|qr|flyer|post|promo/i.test(activity.type))
    return "workshop-library";
  if (/estimate/i.test(activity.type)) return "money";
  if (/invoice|payment/i.test(activity.type)) return "money";
  if (/customer|lead|project/i.test(activity.type)) return "customers";
  if (/help/i.test(activity.type)) return "help-request-detail";
  return "home";
}
