export default function StepNavigation({ isFirst, isLast, onPrevious, onNext, onSaveDraft, busy }) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 focus-ring disabled:opacity-50" onClick={onPrevious} disabled={isFirst || busy}>
        Previous
      </button>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary focus-ring" onClick={onSaveDraft}>
          Save Draft
        </button>
        {!isLast ? (
          <button type="button" className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-white focus-ring disabled:opacity-60" onClick={onNext} disabled={busy}>
            {busy ? "Checking..." : "Next"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
