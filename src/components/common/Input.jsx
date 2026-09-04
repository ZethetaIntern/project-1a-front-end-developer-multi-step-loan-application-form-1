import ErrorMessage from "./ErrorMessage.jsx";

export default function Input({ label, name, register, error, type = "text", hint, ...props }) {
  const id = props.id || name;
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} type={type} className="field-control" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...register(name)} {...props} />
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      <div id={`${id}-error`}>
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}
