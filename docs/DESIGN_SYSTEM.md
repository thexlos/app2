# Design System

## Direction

The UI follows the supplied Modern & Clean Home concept, simplified to avoid action duplication. It uses a true-white background, deep navy text, royal blue primary actions, green success, amber attention, and red only for errors/overdue items.

## Tokens

Source: `src/design-system/tokens.css`.

- Minimum touch target: 48 px
- Primary radius: 14 px; large surfaces: 20–22 px
- Thin neutral borders and restrained navy shadows
- System-first Inter-compatible type stack
- Phone: two-column quick actions and stacked cards; tablet: three/four-column actions and split content where useful
- Bottom navigation remains the primary navigation at 390, 430, 768, 1024, and wider browser widths
- No desktop sidebar is rendered in this app-first version

## Components

- Buttons: primary, outline, neutral, ghost, danger
- Status badges: success, warning, danger, info, neutral
- Open list rows for data; cards only for meaningful grouping
- Modal for trust-sensitive choices
- Business switcher, bottom navigation, desktop sidebar
- Alerts, upload area, segmented controls, empty state

## Simplicity rule

Common fields are visible first. Progress billing, custom columns, visibility rules, tax/discount, and sync settings live under **More Options**. “Create Post” starts a post; management centers are named separately.

The Document Style Editor follows the same rule: ten overall presets appear first and Advanced Style stays collapsed. Advanced tabs separately control page, header, four info boxes, table, individual columns, item/section rows, totals, four notes/terms boxes, footer, QR, and signature styling. Official-document styling never changes the separate Client Approval View.

## Accessibility

Use semantic headings, labels, visible focus, high contrast, large controls, responsive non-table mobile layouts, text status alongside color, and confirmation for destructive/trust-sensitive actions.
