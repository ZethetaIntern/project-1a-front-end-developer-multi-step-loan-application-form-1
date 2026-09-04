# Project 1A: Front End Developer Multi Step Loan Application Form - Architecture

## Architecture Overview

The application uses a Wizard plus Step Registry architecture. The Wizard owns navigation, visible steps, validation, draft state, and submission state. Individual step components own only the UI for their fields.

```text
App
 |
 v
Wizard
 |-- Step Registry
 |-- React Hook Form state
 |-- Zod schemaFactory validation
 |-- LocalStorage draft persistence
 |-- Submission simulation
 |
 +--> Step Components
 +--> Common Controls
 +--> Business Utilities
```

## Design Goals

- Keep form orchestration separate from step UI.
- Keep validation separate from rendering.
- Keep financial calculations in utilities.
- Make cross-step dependencies explicit.
- Avoid backend assumptions for a frontend internship project.

## Wizard Architecture

`Wizard.jsx` defines the current step, calculates visible steps, validates before navigation, saves drafts, restores drafts, and triggers final submission.

## Step Registry

The registry lists the logical steps:

```text
loan -> personal -> kyc -> address -> employment -> coApplicant? -> documents -> review
```

Step 6 is conditional and recalculated whenever form values change.

## Form State Management

React Hook Form stores all form values in one form context. Components read values with `watch()` only where conditional behavior or calculations require it.

## React Hook Form

Reusable controls receive `register`, current errors, and field names. This avoids one `useState` per input and keeps dirty/touched state centralized.

## Zod Validation

`schemaFactory.js` returns the correct schema for the active step. The Wizard calls the schema before moving forward.

## Schema Factory

The schema factory accepts current form data so validation can depend on loan type, employment type, verification state, required documents, and co-applicant visibility.

## Cross-Step Dependencies

Implemented dependencies include:

- Loan Type -> Amount Limits
- Loan Type -> Tenure Limits
- Loan Type -> Purpose Options
- Loan Type -> Employment Restrictions
- Loan Type -> Documents
- Loan Amount -> Step 6 Visibility
- PAN Verification -> PAN Document Requirement
- Residence Type -> Rent Field
- Years at Address -> Previous Address
- Employment Type -> Employment Fields
- Employment Type -> Document Requirements
- Income and Co-applicant Income -> Affordability

## Conditional Step 6

```text
Personal amount > 500000  -> show
Home                      -> show
Business amount > 2000000 -> show
Otherwise                 -> skip
```

The Wizard filters the registry dynamically and moves the applicant to the nearest valid step if Step 6 disappears.

## Employment Conditional Rendering

Step 5 renders Salaried, Self-Employed, or Business Owner fields. When employment type changes, fields from inactive branches are cleared.

## KYC Verification Flow

```text
Input
 |
Local format/checksum validation
 |
Simulated 1.5 second verification
 |
Verified flag stored separately
```

Verification flags are reset when PAN or Aadhaar values change.

## PIN Lookup Flow

```text
6-digit PIN
 |
Static local lookup
 |
Populate city, state, post office
 |
Warn if edited state differs from derived state
```

## Document Upload Flow

```text
Drop/select file
 |
Validate type and size
 |
Image? compress with Canvas
 |
Store metadata and preview in form state
```

## Image Compression Flow

Images are read as data URLs, resized to a practical maximum dimension, and encoded back through Canvas.

## E-Signature Flow

Signature canvas supports pointer input, empty validation, clear action, and PNG data URL export.

## Auto-Save Flow

```text
Form changes
 |
Debounced timer
 |
Serialize version, timestamp, step, data
 |
LocalStorage
```

## Resume Flow

At startup, the Wizard reads LocalStorage. Valid drafts show a resume prompt. Expired or corrupt drafts are discarded.

## EMI Calculation

EMI, total interest, processing fee, and affordability ratio live in `emiCalculator.js`.

## Pre-Approval Review

The review step is read-only, includes edit navigation for each section, and shows all calculated financial values.

## Submission Flow

Final submission validates all visible steps and final consents, prevents double submission, generates an application reference, shows a success modal, and clears the saved draft.

## Accessibility

Controls include visible labels, focus states, descriptive errors, live regions for status, and keyboard-operable buttons and fields.

## Error Handling

Handled cases include invalid form values, invalid KYC formats, invalid Aadhaar checksum, invalid PIN, missing documents, empty signatures, corrupt drafts, stale conditional data, rapid navigation, and double submission.

## Testing Strategy

Cypress covers happy paths, validation, conditional Step 6, PIN lookup, employment switching, uploads, signature capture, autosave/resume, keyboard access, rapid navigation, corrupted storage, and cross-step dependencies.

## Performance

The app avoids large local state trees, compresses image previews, cleans timers, and calculates business values outside UI components.

## Security Boundaries

The frontend does not provide production-grade PII security. Real deployment would require secure backend APIs, authentication, server-side validation, managed encryption keys, observability controls, and regulatory compliance.

## Future Backend Integration

Future services could replace simulations for KYC, address lookup, document storage, eligibility scoring, loan offers, audit logging, and application submission.
