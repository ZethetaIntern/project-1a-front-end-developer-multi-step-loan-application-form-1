import FileUpload from "../components/common/FileUpload.jsx";
import SignatureCanvasField from "../components/common/SignatureCanvas.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { requiredDocumentTypes } from "../utils/documentRules.js";

export default function Step7Documents({ form }) {
  const { formState, watch, setValue } = form;
  const data = watch();
  const documents = data.documents || {};
  const requiredDocs = requiredDocumentTypes(data);

  function setDocument(key, file) {
    setValue("documents", { ...documents, [key]: file || undefined }, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-2">
        {requiredDocs.map((doc) => (
          <FileUpload key={doc.key} label={doc.label} value={documents[doc.key]} onChange={(file) => setDocument(doc.key, file)} />
        ))}
      </div>
      <ErrorMessage error={formState.errors.documents} />
      <SignatureCanvasField label="Applicant E-Signature" value={data.signature} onChange={(value) => setValue("signature", value, { shouldValidate: true, shouldDirty: true })} error={formState.errors.signature} />
    </section>
  );
}
