import { useEffect } from "react";
import CurrencyInput from "../components/common/CurrencyInput.jsx";
import Input from "../components/common/Input.jsx";
import RadioGroup from "../components/common/RadioGroup.jsx";
import Select from "../components/common/Select.jsx";
import { LOAN_TYPES } from "../utils/constants.js";
import { formatCurrency } from "../utils/formatters.js";

export default function Step1LoanType({ form }) {
  const { register, formState, watch, setValue } = form;
  const loanType = watch("loanType");
  const config = LOAN_TYPES[loanType] || LOAN_TYPES.personal;

  useEffect(() => {
    const currentPurpose = watch("purpose");
    if (currentPurpose && !config.purposes.includes(currentPurpose)) setValue("purpose", "");
  }, [config.purposes, setValue, watch]);

  return (
    <section className="grid gap-5">
      <RadioGroup
        label="Loan Type"
        name="loanType"
        register={register}
        error={formState.errors.loanType}
        options={[
          { value: "personal", label: "Personal Loan" },
          { value: "home", label: "Home Loan" },
          { value: "business", label: "Business Loan" },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <CurrencyInput label="Loan Amount" name="loanAmount" register={register} error={formState.errors.loanAmount} watch={watch} min="50000" max={config.max} hint={`Allowed range: Rs. 50,000 to ${formatCurrency(config.max)}`} />
        <Input label="Loan Tenure (months)" name="tenure" type="number" register={register} error={formState.errors.tenure} min={config.minTenure} max={config.maxTenure} hint={`${config.minTenure}-${config.maxTenure} months`} />
        <Select label="Loan Purpose" name="purpose" register={register} error={formState.errors.purpose} options={config.purposes} />
        <Input label="Referral Code" name="referralCode" register={register} error={formState.errors.referralCode} hint="Optional, 6-10 alphanumeric characters" />
      </div>
    </section>
  );
}
