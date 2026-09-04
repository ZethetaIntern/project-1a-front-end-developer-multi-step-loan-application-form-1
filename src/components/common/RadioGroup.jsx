import ErrorMessage from "./ErrorMessage.jsx";

export default function RadioGroup({ label, name, register, error, options }) {
  return (
    <fieldset>
      <legend className="field-label">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option.value} className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 has-[:checked]:border-primary has-[:checked]:bg-blue-50">
            <input type="radio" value={option.value} className="h-4 w-4 text-primary focus:ring-primary" {...register(name)} />
            {option.label}
          </label>
        ))}
      </div>
      <ErrorMessage error={error} />
    </fieldset>
  );
}
