import { useCallback, useEffect } from "react";
import Checkbox from "../components/common/Checkbox.jsx";
import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import usePinCodeLookup from "../hooks/usePinCodeLookup.js";

export default function Step4Address({ form }) {
  const { register, formState, watch, setValue } = form;
  const residenceType = watch("residenceType");
  const yearsAtAddress = Number(watch("yearsAtAddress") || 0);
  const samePermanent = watch("samePermanent");
  const state = watch("currentState");
  const derivedState = watch("pinDerivedState");

  const onFound = useCallback(
    (result) => {
      setValue("currentCity", result.city, { shouldValidate: true });
      setValue("currentState", result.state, { shouldValidate: true });
      setValue("currentPostOffice", result.postOffice, { shouldValidate: true });
      setValue("pinDerivedState", result.state);
    },
    [setValue],
  );

  const pinStatus = usePinCodeLookup(watch("currentPin"), onFound);

  useEffect(() => {
    if (samePermanent) {
      setValue("permanentAddress1", watch("currentAddress1"));
      setValue("permanentPin", watch("currentPin"));
      setValue("permanentCity", watch("currentCity"));
      setValue("permanentState", watch("currentState"));
    }
  }, [samePermanent, setValue, watch]);

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Address Line 1" name="currentAddress1" register={register} error={formState.errors.currentAddress1} />
        <Input label="Address Line 2" name="currentAddress2" register={register} error={formState.errors.currentAddress2} />
        <Input label="PIN Code" name="currentPin" register={register} error={formState.errors.currentPin} autoComplete="postal-code" />
        <Input label="City" name="currentCity" register={register} error={formState.errors.currentCity} />
        <Input label="State" name="currentState" register={register} error={formState.errors.currentState} />
        <Input label="Post Office" name="currentPostOffice" register={register} error={formState.errors.currentPostOffice} />
        <Select label="Residence Type" name="residenceType" register={register} error={formState.errors.residenceType} options={["Owned", "Rented", "Company", "Family"]} />
        <Input label="Years at Current Address" name="yearsAtAddress" type="number" step="0.1" register={register} error={formState.errors.yearsAtAddress} />
      </div>
      <p className="text-sm font-semibold text-slate-600" aria-live="polite">
        {pinStatus === "loading" ? "Looking up PIN..." : null}
        {pinStatus === "found" ? "PIN details populated." : null}
        {pinStatus === "missing" ? "No local match found for this PIN." : null}
      </p>
      {derivedState && state && derivedState !== state ? <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-warning">State differs from the PIN lookup result.</p> : null}
      {residenceType === "Rented" ? <Input label="Monthly Rent" name="monthlyRent" type="number" register={register} error={formState.errors.monthlyRent} /> : null}
      {yearsAtAddress < 1 ? <Input label="Previous Address" name="previousAddress" register={register} error={formState.errors.previousAddress} /> : null}
      <Checkbox label="Same as Permanent Address" name="samePermanent" register={register} error={formState.errors.samePermanent} />
      {!samePermanent ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Permanent Address" name="permanentAddress1" register={register} error={formState.errors.permanentAddress1} />
          <Input label="Permanent PIN" name="permanentPin" register={register} error={formState.errors.permanentPin} />
          <Input label="Permanent City" name="permanentCity" register={register} error={formState.errors.permanentCity} />
          <Input label="Permanent State" name="permanentState" register={register} error={formState.errors.permanentState} />
        </div>
      ) : null}
    </section>
  );
}
