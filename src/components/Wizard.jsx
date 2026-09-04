import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ProgressBar from "./ProgressBar.jsx";
import StepNavigation from "./StepNavigation.jsx";
import Step1LoanType from "../steps/Step1LoanType.jsx";
import Step2PersonalInfo from "../steps/Step2PersonalInfo.jsx";
import Step3KYC from "../steps/Step3KYC.jsx";
import Step4Address from "../steps/Step4Address.jsx";
import Step5Employment from "../steps/Step5Employment.jsx";
import Step6CoApplicant from "../steps/Step6CoApplicant.jsx";
import Step7Documents from "../steps/Step7Documents.jsx";
import Step8Review from "../steps/Step8Review.jsx";
import useAutoSave from "../hooks/useAutoSave.js";
import { DEFAULT_VALUES, LOAN_TYPES, PROJECT_TITLE } from "../utils/constants.js";
import { clearDraft, loadDraft, saveDraft } from "../utils/storage.js";
import { getStepSchema } from "../schemas/schemaFactory.js";
import { shouldShowCoApplicant } from "../utils/validators.js";

const registry = [
  { id: "loan", title: "Loan Details", component: Step1LoanType },
  { id: "personal", title: "Personal Info", component: Step2PersonalInfo },
  { id: "kyc", title: "KYC", component: Step3KYC },
  { id: "address", title: "Address", component: Step4Address },
  { id: "employment", title: "Employment", component: Step5Employment },
  { id: "coApplicant", title: "Co-Applicant", component: Step6CoApplicant, conditional: shouldShowCoApplicant },
  { id: "documents", title: "Documents", component: Step7Documents },
  { id: "review", title: "Review", component: Step8Review },
];

function makeReference() {
  const token = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `LS-${new Date().getFullYear()}-${token}`;
}

export default function Wizard() {
  const [currentStepId, setCurrentStepId] = useState("loan");
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationRef, setApplicationRef] = useState("");
  const headingRef = useRef(null);

  const form = useForm({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });
  const { watch, reset, getValues, setError, clearErrors, formState } = form;
  const formData = watch();
  const savedAt = useAutoSave(formData, currentStepId, 30000);

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  const visibleSteps = useMemo(() => registry.filter((step) => !step.conditional || step.conditional(formData)), [formData]);
  const currentIndex = Math.max(0, visibleSteps.findIndex((step) => step.id === currentStepId));
  const currentStep = visibleSteps[currentIndex] || visibleSteps[0];
  const StepComponent = currentStep.component;

  useEffect(() => {
    if (!visibleSteps.some((step) => step.id === currentStepId)) {
      const fallback = visibleSteps[Math.min(currentIndex, visibleSteps.length - 1)] || visibleSteps[0];
      setCurrentStepId(fallback.id);
    }
  }, [currentIndex, currentStepId, visibleSteps]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [currentStepId]);

  function applyIssues(result) {
    clearErrors();
    if (result.success) return true;
    const seen = new Set();
    result.error.issues.forEach((issue) => {
      const name = issue.path[0] || currentStepId;
      if (seen.has(name)) return;
      seen.add(name);
      setError(name, { type: "manual", message: issue.message });
    });
    return false;
  }

  function validateStep(stepId) {
    const schema = getStepSchema(stepId, getValues());
    return applyIssues(schema.safeParse(getValues()));
  }

  async function next() {
    if (busy) return;
    setBusy(true);
    const ok = validateStep(currentStep.id);
    if (ok) setCurrentStepId(visibleSteps[Math.min(currentIndex + 1, visibleSteps.length - 1)].id);
    setBusy(false);
  }

  function previous() {
    if (busy || currentIndex === 0) return;
    setCurrentStepId(visibleSteps[currentIndex - 1].id);
  }

  function persistDraft() {
    saveDraft({ currentStep: currentStepId, formData: getValues() });
  }

  function resumeDraft() {
    if (draft?.formData) {
      reset({ ...DEFAULT_VALUES, ...draft.formData });
      setCurrentStepId(draft.currentStep || "loan");
    }
    setDraft(null);
  }

  function startFresh() {
    clearDraft();
    reset(DEFAULT_VALUES);
    setCurrentStepId("loan");
    setDraft(null);
  }

  async function submit() {
    if (submitting || applicationRef) return;
    const allValid = [...visibleSteps.map((step) => step.id), "review"].every((stepId) => validateStep(stepId));
    if (!allValid) return;
    setSubmitting(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 900);
    });
    setApplicationRef(makeReference());
    clearDraft();
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-sm font-bold uppercase text-primary">Loan Application Portal</p>
          <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{PROJECT_TITLE}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">A frontend-only, production-style loan application workflow with simulated KYC, document upload, autosave, and pre-approval calculations.</p>
        </header>

        {draft ? (
          <section className="panel mb-6" aria-label="Resume previous application">
            <h2 className="text-lg font-bold text-slate-900">Resume Previous Application?</h2>
            <p className="mt-1 text-sm text-slate-600">A saved draft from {new Date(draft.savedAt).toLocaleString()} is available.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white focus-ring" onClick={resumeDraft}>
                Resume Application
              </button>
              <button type="button" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold focus-ring" onClick={startFresh}>
                Start Fresh
              </button>
            </div>
          </section>
        ) : null}

        <section className="panel mb-6">
          <ProgressBar steps={visibleSteps} currentStepId={currentStep.id} />
        </section>

        <form className="panel" noValidate>
          <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 ref={headingRef} tabIndex="-1" className="text-xl font-bold text-slate-950">
                {currentStep.title}
              </h2>
              <p className="text-sm text-slate-600">{LOAN_TYPES[formData.loanType]?.label || "Loan Application"}</p>
            </div>
            <p className="text-sm font-semibold text-slate-500" aria-live="polite">
              {savedAt ? `Autosaved ${savedAt.toLocaleTimeString()}` : formState.isDirty ? "Autosave pending" : "Ready"}
            </p>
          </div>

          <StepComponent form={form} goToStep={setCurrentStepId} onSubmit={submit} submitting={submitting} applicationRef={applicationRef} />

          <StepNavigation isFirst={currentIndex === 0} isLast={currentStep.id === "review"} onPrevious={previous} onNext={next} onSaveDraft={persistDraft} busy={busy} />
        </form>
      </div>
    </main>
  );
}
