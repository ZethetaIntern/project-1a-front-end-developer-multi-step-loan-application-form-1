import { useEffect } from "react";
import CurrencyInput from "../components/common/CurrencyInput.jsx";
import Input from "../components/common/Input.jsx";
import RadioGroup from "../components/common/RadioGroup.jsx";

const branchFields = {
  salaried: ["businessName", "businessType", "annualTurnover", "yearsInBusiness", "selfMonthlyIncome", "businessAddress", "gstNumber"],
  selfEmployed: ["companyName", "designation", "monthlySalary", "salariedExperience", "gstNumber"],
  businessOwner: ["companyName", "designation", "monthlySalary", "salariedExperience", "selfMonthlyIncome"],
};

export default function Step5Employment({ form }) {
  const { register, formState, watch, setValue } = form;
  const employmentType = watch("employmentType");
  const loanType = watch("loanType");

  useEffect(() => {
    if (loanType === "business" && employmentType === "salaried") setValue("employmentType", "selfEmployed", { shouldValidate: true });
  }, [employmentType, loanType, setValue]);

  useEffect(() => {
    (branchFields[employmentType] || []).forEach((field) => setValue(field, ""));
  }, [employmentType, setValue]);

  const options = [
    ...(loanType === "business" ? [] : [{ value: "salaried", label: "Salaried" }]),
    { value: "selfEmployed", label: "Self-Employed" },
    { value: "businessOwner", label: "Business Owner" },
  ];

  return (
    <section className="grid gap-5">
      <RadioGroup label="Employment Type" name="employmentType" register={register} error={formState.errors.employmentType} options={options} />
      {employmentType === "salaried" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Company Name" name="companyName" register={register} error={formState.errors.companyName} />
          <Input label="Designation" name="designation" register={register} error={formState.errors.designation} />
          <CurrencyInput label="Monthly Net Salary" name="monthlySalary" type="number" register={register} error={formState.errors.monthlySalary} watch={watch} />
          <Input label="Years of Experience" name="salariedExperience" type="number" step="0.1" register={register} error={formState.errors.salariedExperience} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Business Name" name="businessName" register={register} error={formState.errors.businessName} />
          <Input label="Business Type" name="businessType" register={register} error={formState.errors.businessType} />
          <CurrencyInput label="Annual Turnover" name="annualTurnover" type="number" register={register} error={formState.errors.annualTurnover} watch={watch} />
          <Input label="Years in Business" name="yearsInBusiness" type="number" step="0.1" register={register} error={formState.errors.yearsInBusiness} />
          {employmentType === "selfEmployed" ? <CurrencyInput label="Monthly Income" name="selfMonthlyIncome" type="number" register={register} error={formState.errors.selfMonthlyIncome} watch={watch} /> : null}
          {employmentType === "businessOwner" ? <Input label="GST Number" name="gstNumber" register={register} error={formState.errors.gstNumber} maxLength="15" /> : null}
          <Input label="Business Address" name="businessAddress" register={register} error={formState.errors.businessAddress} />
        </div>
      )}
    </section>
  );
}
