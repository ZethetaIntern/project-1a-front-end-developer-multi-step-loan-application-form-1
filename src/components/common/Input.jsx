import ErrorMessage from "./ErrorMessage.jsx";

export default function Input({ label, name, register, error, type = "text", hint, onChange, ...props }) {
  const id = props.id || name;
  const reg = register ? register(name) : {};
  const handleChange = (event) => {
    reg.onChange?.(event);
    onChange?.(event);
  };

  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className="field-control"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...reg}
        {...props}
        onChange={handleChange}
      />
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      <div id={`${id}-error`}>
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}
