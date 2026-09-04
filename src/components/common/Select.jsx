import ErrorMessage from "./ErrorMessage.jsx";

export default function Select({ label, name, register, error, options, placeholder = "Select", ...props }) {
  const id = props.id || name;
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="field-control" aria-invalid={Boolean(error)} {...register(name)} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
      <ErrorMessage error={error} />
    </div>
  );
}
