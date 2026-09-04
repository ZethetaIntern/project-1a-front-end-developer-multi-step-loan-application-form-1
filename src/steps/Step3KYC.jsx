import Checkbox from "../components/common/Checkbox.jsx";
import Input from "../components/common/Input.jsx";
import useVerification from "../hooks/useVerification.js";
import { isAllowedPanForLoan, isPanFormat, isValidAadhaar } from "../utils/validators.js";

export default function Step3KYC({ form }) {
  const { register, formState, watch, setValue, setError, clearErrors } = form;
  const { loadingField, verify } = useVerification();
  const pan = (watch("pan") || "").toUpperCase();
  const aadhaar = watch("aadhaar") || "";
  const loanType = watch("loanType");

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Input
          label="PAN"
          name="pan"
          register={register}
          error={formState.errors.pan || formState.errors.panVerified}
          maxLength="10"
          onChange={(event) => {
            setValue("pan", event.target.value.toUpperCase(), { shouldDirty: true });
            setValue("panVerified", false);
          }}
        />
        <button
          type="button"
          id="verifyPanBtn"
          className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white focus-ring disabled:opacity-60"
          disabled={loadingField === "pan"}
          onClick={() => {
            if (!isPanFormat(pan)) {
              setError("pan", { message: "PAN format is invalid (must be 5 letters, 4 digits, 1 letter)." });
              return;
            }
            if (!isAllowedPanForLoan(pan, loanType)) {
              setError("pan", { message: "PAN 4th character must indicate entity type (P for Individual, C for Company, etc.)." });
              return;
            }
            verify(
              "pan",
              true,
              () => {
                setValue("panVerified", true, { shouldValidate: true });
                clearErrors(["pan", "panVerified"]);
              },
              () => setError("pan", { message: "PAN verification failed." }),
            );
          }}
        >
          {loadingField === "pan" ? "Verifying..." : watch("panVerified") ? "Verified" : "Verify PAN"}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Input
          label="Aadhaar"
          name="aadhaar"
          register={register}
          error={formState.errors.aadhaar || formState.errors.aadhaarVerified}
          maxLength="12"
          inputMode="numeric"
          onChange={(event) => {
            setValue("aadhaar", event.target.value.replace(/\D/g, ""), { shouldDirty: true });
            setValue("aadhaarVerified", false);
          }}
        />
        <button
          type="button"
          id="verifyAadhaarBtn"
          className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white focus-ring disabled:opacity-60"
          disabled={loadingField === "aadhaar"}
          onClick={() => {
            if (!/^[0-9]{12}$/.test(aadhaar) || /^([0-9])\1+$/.test(aadhaar)) {
              setError("aadhaar", { message: "Aadhaar must be 12 numeric digits." });
              return;
            }
            if (!isValidAadhaar(aadhaar)) {
              setError("aadhaar", { message: "Aadhaar checksum is invalid (failed Verhoeff checksum)." });
              return;
            }
            verify(
              "aadhaar",
              true,
              () => {
                setValue("aadhaarVerified", true, { shouldValidate: true });
                clearErrors(["aadhaar", "aadhaarVerified"]);
              },
              () => setError("aadhaar", { message: "Aadhaar verification failed." }),
            );
          }}
        >
          {loadingField === "aadhaar" ? "Verifying..." : watch("aadhaarVerified") ? "Verified" : "Verify Aadhaar"}
        </button>
      </div>
      <Checkbox label="I consent to Aadhaar verification for this simulated application." name="aadhaarConsent" register={register} error={formState.errors.aadhaarConsent} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Voter ID" name="voterId" register={register} error={formState.errors.voterId} />
        <Input label="Passport" name="passport" register={register} error={formState.errors.passport} />
      </div>
    </section>
  );
}
