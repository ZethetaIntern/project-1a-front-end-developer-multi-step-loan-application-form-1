import Input from "./Input.jsx";
import { formatCurrency } from "../../utils/formatters.js";

export default function CurrencyInput({ watch, name, ...props }) {
  const value = watch(name);
  return (
    <div>
      <Input name={name} type="number" inputMode="numeric" {...props} />
      {value ? <p className="mt-1 text-xs font-semibold text-slate-500">{formatCurrency(value)}</p> : null}
    </div>
  );
}
