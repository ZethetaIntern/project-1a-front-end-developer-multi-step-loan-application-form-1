# Project 1A: Front End Developer Multi Step Loan Application Form

## Project Overview

This project is a responsive frontend-only multi-step loan application form for Personal, Home, and Business loans. It demonstrates production-style React form architecture, client-side validation, conditional workflow behavior, document upload simulation, e-signature capture, autosave, resume, and pre-approval calculations.

## Problem Statement

Loan forms are long, sensitive, and easy to abandon. The goal is to guide applicants through a clear wizard that validates information at the right time, adapts to the selected loan type, and gives a transparent pre-approval estimate before submission.

## Objectives

- Build an 8-step wizard using React, Vite, JavaScript, Tailwind CSS, React Hook Form, and Zod.
- Implement cross-step business rules and conditional steps.
- Simulate PAN, Aadhaar, PIN lookup, document upload, and submission without a backend.
- Provide responsive, accessible, mobile-first UI.
- Cover major journeys with Cypress.

## Features

- Three loan types: Personal Loan, Home Loan, Business Loan.
- Dynamic loan amount, tenure, and purpose rules.
- Step-by-step validation with user-friendly errors.
- Simulated PAN and Aadhaar verification.
- Aadhaar Verhoeff checksum validation.
- Static PIN lookup for Indian cities and states.
- Conditional residence, employment, and co-applicant sections.
- Document upload with preview, validation, progress state, and image compression.
- Applicant and co-applicant e-signature capture.
- Draft autosave, resume prompt, corrupt-draft handling, and 72-hour TTL.
- EMI, interest, processing fee, total borrowing cost, and affordability ratio.
- Final consent checklist and success modal with application reference.

## 8-Step Workflow

1. Loan Type and Basic Information
2. Personal Information
3. Identity Verification / KYC
4. Address Information
5. Employment and Income
6. Co-Applicant and Guarantor, shown only when required
7. Document Upload and E-Signature
8. Review, Consent, and Pre-Approval

## Conditional Logic

- Personal Loan above Rs. 5,00,000 shows Step 6.
- Personal Loan exactly Rs. 5,00,000 does not show Step 6.
- Home Loan always shows Step 6.
- Business Loan above Rs. 20,00,000 shows Step 6.
- Business Loan only allows Self-Employed or Business Owner employment.
- Rented residences require monthly rent.
- Current address below one year requires previous address.
- PAN copy is optional when PAN has already been verified.
- Required documents change by loan type and employment type.

## Validation

Validation is powered by Zod schemas selected through `schemaFactory.js`. React Hook Form owns field state and the Wizard validates the active step before navigation.

## PAN/Aadhaar Verification Simulation

PAN and Aadhaar verification are simulated locally. There is no NSDL, UIDAI, CIBIL, Equifax, or government API connection. Valid local input shows a verification delay and then a verified badge.

## PIN Code Lookup

PIN lookup uses static local data for common Indian PIN examples such as Mumbai, New Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, and Lucknow.

## Document Upload

The upload UI accepts PDF, JPG, and PNG files up to 5 MB. Image previews are compressed with the browser Canvas API before being stored in form state. Upload is a frontend simulation only.

## E-Signature

The app uses `react-signature-canvas` for mouse and touch signatures. The signature is stored as a PNG data URL and displayed as captured status in the review flow.

## Auto-Save and Resume

Drafts are saved to LocalStorage with a schema version, timestamp, current step, and form data. Drafts expire after 72 hours. Invalid or corrupted drafts are discarded safely.

## Pre-Approval and EMI

The review step calculates indicative EMI, total interest, processing fee, total cost of borrowing, and affordability ratio. EMI above 50% of monthly income shows a warning.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- React Hook Form
- Zod
- @hookform/resolvers
- react-dropzone
- react-signature-canvas
- LocalStorage
- Cypress

## Folder Structure

```text
src/
  components/
    common/
    ProgressBar.jsx
    StepNavigation.jsx
    Wizard.jsx
  hooks/
  schemas/
  steps/
  utils/
cypress/
  e2e/
  fixtures/
```

## Installation

```bash
npm install
```

## Running the Project

```bash
npm run dev
```

Open the Vite URL printed in the terminal.

## Running Tests

```bash
npm run build
npm run lint
npm run test:e2e
```

## Accessibility

Inputs use visible labels, focus states, ARIA error relationships where appropriate, keyboard-accessible controls, and polite live regions for dynamic status.

## Security Considerations

This is a frontend simulation. LocalStorage, masking, and browser-only validation are not production-grade protection for financial PII. A real system requires secure backend APIs, authentication, server-side validation, audit logging, encryption with managed keys, and regulatory controls.

## Known Limitations

- No backend or real loan service.
- No real PAN, Aadhaar, credit bureau, bank, or property verification.
- Document upload is not persisted to a server.
- LocalStorage is used only to demonstrate draft persistence.

## Architecture

See `ARCHITECTURE.md` for the full wizard architecture and data flow.

## Internship Requirement Mapping

The implementation maps to the assignment requirements by providing an 8+ step React loan application form, conditional fields and steps, validation, KYC simulation, PIN lookup, document upload, image compression, e-signature, autosave/resume, review/edit navigation, pre-approval calculation, responsive UI, accessibility considerations, and Cypress journey coverage.
