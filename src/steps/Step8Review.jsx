import Checkbox from "../components/common/Checkbox.jsx";
import { LOAN_TYPES } from "../utils/constants.js";
import { requiredDocumentTypes } from "../utils/documentRules.js";
import { calculateAffordabilityRatio, calculateEMI, calculateProcessingFee, calculateTotalInterest } from "../utils/emiCalculator.js";
import { formatCurrency, maskAadhaar, maskPan } from "../utils/formatters.js";
import { getPrimaryMonthlyIncome, shouldShowCoApplicant } from "../utils/validators.js";

function SummarySection({ title, children, onEdit }) {
  return (
    <section className="rounded-md border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <button type="button" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold focus-ring" onClick={onEdit}>
          Edit
        </button>
      </div>
      <div className="grid gap-2 text-sm text-slate-700">{children}</div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <p className="flex justify-between gap-4 border-b border-slate-100 pb-1">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-900">{value || "Not provided"}</span>
    </p>
  );
}

export default function Step8Review({ form, goToStep, onSubmit, submitting, applicationRef }) {
  const { register, formState, watch } = form;
  const data = watch();
  const loan = LOAN_TYPES[data.loanType] || LOAN_TYPES.personal;
  const emi = calculateEMI({ principal: data.loanAmount, annualRate: loan.rate, months: data.tenure });
  const interest = calculateTotalInterest({ principal: data.loanAmount, emi, months: data.tenure });
  const fee = calculateProcessingFee(data.loanAmount);
  const income = getPrimaryMonthlyIncome(data) + (shouldShowCoApplicant(data) ? Number(data.coIncome || 0) : 0);
  const ratio = calculateAffordabilityRatio({ emi, income });
  const docs = requiredDocumentTypes(data);

  return (
    <section className="grid gap-5">
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-3 text-lg font-bold text-primary">Pre-Approval Summary</h3>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <Row label="Loan Amount" value={formatCurrency(data.loanAmount)} />
          <Row label="Tenure" value={`${data.tenure || 0} months`} />
          <Row label="Indicative Rate" value={`${loan.rate}% p.a.`} />
          <Row label="Estimated EMI" value={formatCurrency(emi)} />
          <Row label="Total Interest" value={formatCurrency(interest)} />
          <Row label="Total Cost" value={formatCurrency(Number(data.loanAmount || 0) + interest + fee)} />
          <Row label="Processing Fee" value={formatCurrency(fee)} />
          <Row label="Affordability Ratio" value={`${ratio}%`} />
        </div>
        {ratio > 50 ? <p className="mt-3 rounded-md border border-amber-300 bg-white p-3 text-sm font-semibold text-warning">Estimated EMI exceeds 50% of monthly income.</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SummarySection title="Loan Details" onEdit={() => goToStep("loan")}>
          <Row label="Loan Type" value={loan.label} />
          <Row label="Purpose" value={data.purpose} />
        </SummarySection>
        <SummarySection title="Personal Information" onEdit={() => goToStep("personal")}>
          <Row label="Name" value={data.fullName} />
          <Row label="Mobile" value={data.mobile} />
          <Row label="Email" value={data.email} />
        </SummarySection>
        <SummarySection title="KYC" onEdit={() => goToStep("kyc")}>
          <Row label="PAN" value={maskPan(data.pan)} />
          <Row label="Aadhaar" value={maskAadhaar(data.aadhaar)} />
        </SummarySection>
        <SummarySection title="Address" onEdit={() => goToStep("address")}>
          <Row label="City" value={data.currentCity} />
          <Row label="State" value={data.currentState} />
        </SummarySection>
        <SummarySection title="Employment" onEdit={() => goToStep("employment")}>
          <Row label="Type" value={data.employmentType} />
          <Row label="Monthly Income" value={formatCurrency(income)} />
        </SummarySection>
        {shouldShowCoApplicant(data) ? (
          <SummarySection title="Co-Applicant" onEdit={() => goToStep("coApplicant")}>
            <Row label="Name" value={data.coName} />
            <Row label="Relationship" value={data.coRelationship} />
          </SummarySection>
        ) : null}
        <SummarySection title="Documents" onEdit={() => goToStep("documents")}>
          {docs.map((doc) => (
            <Row key={doc.key} label={doc.label} value={data.documents?.[doc.key] ? "Uploaded" : "Missing"} />
          ))}
          <Row label="Signature" value={data.signature ? "Captured" : "Missing"} />
        </SummarySection>
      </div>

      <div className="grid gap-3">
        <Checkbox label="I confirm all information provided is accurate." name="consentAccuracy" register={register} error={formState.errors.consentAccuracy} />
        <Checkbox label="I authorise credit score checking via CIBIL/Equifax." name="consentCredit" register={register} error={formState.errors.consentCredit} />
        <Checkbox label="I agree to the Terms and Conditions." name="consentTerms" register={register} error={formState.errors.consentTerms} />
        <Checkbox label="I consent to receive communications regarding this application." name="consentCommunication" register={register} error={formState.errors.consentCommunication} />
      </div>

      <button type="button" className="rounded-md bg-success px-5 py-3 text-sm font-bold text-white focus-ring disabled:opacity-60" disabled={submitting} onClick={onSubmit}>
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
      {applicationRef ? (
        <div role="dialog" aria-modal="true" className="rounded-lg border border-green-300 bg-green-50 p-5">
          <h3 className="text-lg font-bold text-success">Application Submitted Successfully</h3>
          <p className="mt-2 text-sm font-semibold">Application Reference: {applicationRef}</p>
          <p className="text-sm">{loan.label} · {formatCurrency(data.loanAmount)} · EMI {formatCurrency(emi)}</p>
        </div>
      ) : null}
    </section>
  );
}
