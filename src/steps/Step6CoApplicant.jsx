import { useEffect } from "react";
import Checkbox from "../components/common/Checkbox.jsx";
import CurrencyInput from "../components/common/CurrencyInput.jsx";
import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import SignatureCanvasField from "../components/common/SignatureCanvas.jsx";
import useVerification from "../hooks/useVerification.js";
import { isAllowedPanForLoan, isPanFormat } from "../utils/validators.js";

export default function Step6CoApplicant({ form }) {
  const { register, formState, watch, setValue, setError, clearErrors } = form;
  const { loadingField, verify } = useVerification();
  const maritalStatus = watch("maritalStatus");
  const coPan = (watch("coPan") || "").toUpperCase();

  useEffect(() => {
    if (maritalStatus === "Married" && !watch("coRelationship")) setValue("coRelationship", "Spouse");
  }, [maritalStatus, setValue, watch]);

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Co-applicant Name" name="coName" register={register} error={formState.errors.coName} />
        <Select label="Relationship" name="coRelationship" register={register} error={formState.errors.coRelationship} options={["Spouse", "Parent", "Sibling", "Business Partner"]} />
        <CurrencyInput label="Co-applicant Monthly Income" name="coIncome" type="number" register={register} error={formState.errors.coIncome} watch={watch} />
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Input label="Co-applicant PAN" name="coPan" register={register} error={formState.errors.coPan || formState.errors.coPanVerified} maxLength="10" onChange={(event) => {
          setValue("coPan", event.target.value.toUpperCase(), { shouldDirty: true });
          setValue("coPanVerified", false);
        }} />
        <button
          type="button"
          id="verifyCoPanBtn"
          className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white focus-ring disabled:opacity-60"
          disabled={loadingField === "coPan"}
          onClick={() => {
            if (!isPanFormat(coPan)) {
              setError("coPan", { message: "Co-applicant PAN format is invalid." });
              return;
            }
            if (!isAllowedPanForLoan(coPan, "personal")) {
              setError("coPan", { message: "Enter a valid individual PAN." });
              return;
            }
            verify(
              "coPan",
              true,
              () => {
                setValue("coPanVerified", true, { shouldValidate: true });
                clearErrors(["coPan", "coPanVerified"]);
              },
              () => setError("coPan", { message: "Enter a valid individual PAN." }),
            );
          }}
        >
          {loadingField === "coPan" ? "Verifying..." : watch("coPanVerified") ? "Verified" : "Verify PAN"}
        </button>
      </div>
      <Checkbox label="Co-applicant has consented to this simulated application." name="coConsent" register={register} error={formState.errors.coConsent} />
      <SignatureCanvasField label="Co-applicant Signature" value={watch("coSignature")} onChange={(value) => setValue("coSignature", value, { shouldValidate: true })} error={formState.errors.coSignature} />
    </section>
  );
}
