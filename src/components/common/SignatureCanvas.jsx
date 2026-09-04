import { useEffect, useRef } from "react";
import ReactSignatureCanvas from "react-signature-canvas";

export default function SignatureCanvasField({ label, value, onChange, error }) {
  const ref = useRef(null);

  useEffect(() => {
    if (value && ref.current?.isEmpty()) ref.current.fromDataURL(value);
  }, [value]);

  function save() {
    if (!ref.current || ref.current.isEmpty()) {
      onChange("");
      return;
    }
    onChange(ref.current.toDataURL("image/png"));
  }

  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="rounded-md border border-slate-300 bg-white p-2">
        <ReactSignatureCanvas ref={ref} penColor="#172033" canvasProps={{ className: "h-36 w-full rounded bg-white", "aria-label": label }} onEnd={save} />
      </div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold focus-ring"
          onClick={() => {
            ref.current.clear();
            onChange("");
          }}
        >
          Clear
        </button>
        {value ? <span className="self-center text-sm font-semibold text-success">Signature captured</span> : null}
      </div>
      {error ? <p className="field-error">{error.message}</p> : null}
    </div>
  );
}
