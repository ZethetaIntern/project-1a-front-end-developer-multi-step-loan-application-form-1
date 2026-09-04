export default function ProgressBar({ steps, currentStepId }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);
  const percent = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <div aria-label="Application progress">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200" aria-hidden="true">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
      <ol className="mt-4 grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.id}>
            <span className={`block rounded-md border px-3 py-2 text-xs font-bold ${index <= currentIndex ? "border-primary bg-blue-50 text-primary" : "border-slate-200 bg-white text-slate-500"}`}>
              {step.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
