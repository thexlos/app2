# Integration Plan

## Current state

All providers are explicit mock services. Disabled controls and responses say that no external action occurred.

## Shared production requirements

- Provider-approved application and current official API review
- Account connection callback URLs and per-environment configuration
- Encrypted token storage, rotation, revocation, least privilege, and per-business ownership checks
- Idempotency, retries, rate limits, webhooks, sync logs, conflict review, and audit events
- Clear manual fallback and account disconnect/delete behavior

## Provider order

1. **QuickBooks:** start with read-only customer/item import; then finalized invoice push; then payment/status pull. Drafts and internal versions stay in Start Here.
2. **Facebook Page / Instagram Business / Google Business Profile:** connect per business, validate eligibility, save draft first, explicit publish confirmation, and post history.
3. **Canva:** store share links/uploads now; integrate only supported official capabilities later. Never request passwords.
4. **VistaPrint:** print-prep/export/instructions and paid handoff. Treat direct integration as unavailable unless a suitable official API is confirmed.
5. **Payments/email/SMS:** separate provider evaluation after invoices, signed links, consent, and audit infrastructure are stable.

## Environment variables (future names, not active)

Document provider-specific client IDs/secrets and redirect URLs only when implementation begins. Secrets belong in secure deployment configuration, never the repository or client bundle.
