import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { bytesToSize } from "../../utils/formatters.js";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImage(file) {
  const dataUrl = await readAsDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.76);
}

export default function FileUpload({ label, value, onChange }) {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (accepted, rejected) => {
      setError("");
      if (rejected.length) {
        const err = rejected[0].errors[0];
        if (err?.code === "file-invalid-type") {
          setError("File is not accepted. Please upload a PDF, JPG, or PNG file.");
        } else if (err?.code === "file-too-large") {
          setError("File is not accepted. File size exceeds the 5 MB limit.");
        } else {
          setError(err?.message || "File is not accepted.");
        }
        return;
      }
      const file = accepted[0];
      if (!file) return;
      setProgress(25);
      try {
        const isImage = file.type.startsWith("image/");
        const preview = isImage ? await compressImage(file) : "";
        const rawPreview = isImage ? preview : await readAsDataUrl(file);
        setProgress(100);
        onChange({
          name: file.name,
          type: file.type,
          size: file.size,
          compressedSize: preview ? Math.round((preview.length * 3) / 4) : file.size,
          preview: rawPreview,
          uploadedAt: new Date().toISOString(),
        });
      } catch (_err) {
        setError("Could not process this file.");
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_SIZE,
    accept: ACCEPTED,
  });

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {value ? <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-success">Uploaded</span> : null}
      </div>
      {!value ? (
        <div {...getRootProps()} className={`cursor-pointer rounded-md border border-dashed p-4 text-center text-sm ${isDragActive ? "border-primary bg-blue-50" : "border-slate-300 bg-slate-50"}`}>
          <input {...getInputProps()} aria-label={`Upload ${label}`} />
          <p className="font-semibold text-primary">Browse Files</p>
          <p className="text-xs text-slate-500">PDF, JPG or PNG up to 5 MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {value.type?.startsWith("image/") ? <img src={value.preview} alt={`${label} preview`} className="h-16 w-16 rounded-md object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">PDF</div>}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{value.name}</p>
            <p className="text-xs text-slate-500">
              {bytesToSize(value.size)} original · {bytesToSize(value.compressedSize)} stored
            </p>
          </div>
          <button type="button" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 focus-ring" onClick={() => onChange(null)}>
            Remove
          </button>
        </div>
      )}
      {progress > 0 && progress < 100 ? <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} /></div> : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
