# Screen contracts

The executable screen contract registry is maintained in `src/config/screenContracts.ts`.

Every registered screen resolves to the same complete contract shape: purpose, primary user goal, Simple Mode behavior, sections, actions, empty state, validation, routing, related data, next actions, prohibited content, mobile rules, tablet rules, and future desktop notes.

Create/Workshop builders have a second executable registry in `src/config/builderContracts.ts`. A Workshop tool must resolve to its own builder contract before the DIY builder or guided wizard is rendered. QR, flyer, post, business card, promotion, review, lead form, menu, signage, event, file-fix, Canva, and VistaPrint workflows therefore cannot inherit another tool’s field list or preview label.
