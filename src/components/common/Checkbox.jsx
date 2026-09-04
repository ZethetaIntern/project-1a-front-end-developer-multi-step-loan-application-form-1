import ErrorMessage from "./ErrorMessage.jsx";

export default function Checkbox({ label, name, register, error, ...props }) {
  const id = props.id || name;
  return (
    <div>
      <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800">
        <input id={id} type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" {...register(name)} {...props} />
        <span>{label}</span>
      </label>
      <ErrorMessage error={error} />
    </div>
  );
}
