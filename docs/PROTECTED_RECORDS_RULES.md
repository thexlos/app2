# Protected Records Rules

## Mandatory behavior

Before approval, a draft can be customized. After a protected transition, the relevant version is immutable.

Protected transitions include accepted, rejected, signed, paid, and accounting-synced. Rejected and Changes Requested responses require customer notes. All versions remain saved.

## Accepted estimate changes

Never edit the accepted snapshot. Offer:

1. Revision for reapproval
2. Change order linked to the accepted estimate
3. Duplicate as a new estimate
4. New document
5. View accepted version

Approved change orders update project value without rewriting the original estimate.

## Enforcement layers

- UI: disables in-place editing and explains why.
- Service: checks status and creates append-only versions transactionally.
- Database: immutable version rows, tenant constraints, unique version numbers, and protected snapshot references.
- Audit: actor, time, action, previous/new totals, response note, and related record.
- Files: protected snapshots use immutable object keys and retention rules.
- Delivery evidence: preserve the exact Client Approval View data and the exact Official Document/PDF snapshot for the responded version.

The client-side rules in this foundation demonstrate behavior but are not a security boundary.
