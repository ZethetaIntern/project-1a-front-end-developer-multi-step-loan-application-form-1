import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";

export default function Step2PersonalInfo({ form }) {
  const { register, formState } = form;
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Input label="Full Name" name="fullName" register={register} error={formState.errors.fullName} autoComplete="name" />
      <Input label="Date of Birth" name="dob" type="date" register={register} error={formState.errors.dob} />
      <Select label="Gender" name="gender" register={register} error={formState.errors.gender} options={["Male", "Female", "Other"]} />
      <Select label="Marital Status" name="maritalStatus" register={register} error={formState.errors.maritalStatus} options={["Single", "Married", "Divorced", "Widowed"]} />
      <Input label="Father's Name" name="fatherName" register={register} error={formState.errors.fatherName} />
      <Input label="Mother's Name" name="motherName" register={register} error={formState.errors.motherName} />
      <Input label="Email" name="email" type="email" register={register} error={formState.errors.email} autoComplete="email" />
      <Input label="Mobile Number" name="mobile" type="tel" register={register} error={formState.errors.mobile} autoComplete="tel" />
      <Input label="Alternate Mobile" name="alternateMobile" type="tel" register={register} error={formState.errors.alternateMobile} />
    </section>
  );
}
