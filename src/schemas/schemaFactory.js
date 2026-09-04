import { z } from "zod";
import { LOAN_TYPES, MIN_LOAN_AMOUNT } from "../utils/constants.js";
import { getAge, isAllowedPanForLoan, isValidAadhaar, isValidGst, shouldShowCoApplicant } from "../utils/validators.js";
import { requiredDocumentTypes } from "../utils/documentRules.js";

const asNumber = z.coerce.number({ invalid_type_error: "Enter a number." });
const mustBeChecked = (message) => z.any().refine((value) => value === true || value === "on", message);
const fullName = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters.")
  .max(100, "Name must be 100 characters or fewer.")
  .regex(/^[A-Za-z .]+$/, "Use letters, spaces and periods only.");

export function getStepSchema(stepId, data) {
  if (stepId === "loan") {
    const config = LOAN_TYPES[data.loanType] || LOAN_TYPES.personal;
    return z.object({
      loanType: z.enum(["personal", "home", "business"]),
      loanAmount: asNumber.min(MIN_LOAN_AMOUNT, "Minimum amount is Rs. 50,000.").max(config.max, `Maximum amount for ${config.label} exceeded.`),
      tenure: asNumber.min(config.minTenure, `Minimum tenure is ${config.minTenure} months.`).max(config.maxTenure, `Maximum tenure is ${config.maxTenure} months.`),
      purpose: z.string().min(1, "Select a loan purpose."),
      referralCode: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || /^[A-Za-z0-9]{6,10}$/.test(value), "Referral code must be 6-10 alphanumeric characters."),
    });
  }

  if (stepId === "personal") {
    return z
      .object({
        fullName,
        dob: z.string().min(1, "Date of birth is required.").refine((value) => {
          const age = getAge(value);
          return age >= 21 && age <= 65;
        }, "Applicant age must be between 21 and 65."),
        gender: z.string().min(1, "Select gender."),
        maritalStatus: z.string().min(1, "Select marital status."),
        fatherName: fullName,
        motherName: fullName,
        email: z.string().email("Enter a valid email address."),
        mobile: z.string().regex(/^[6-9][0-9]{9}$/, "Mobile must be 10 digits and start with 6-9."),
        alternateMobile: z.string().optional(),
      })
      .refine((value) => !value.alternateMobile || /^[6-9][0-9]{9}$/.test(value.alternateMobile), {
        path: ["alternateMobile"],
        message: "Alternate mobile must be 10 digits and start with 6-9.",
      })
      .refine((value) => !value.alternateMobile || value.alternateMobile !== value.mobile, {
        path: ["alternateMobile"],
        message: "Alternate mobile must differ from primary mobile.",
      });
  }

  if (stepId === "kyc") {
    return z.object({
      pan: z.string().transform((value) => value.toUpperCase()).refine((value) => isAllowedPanForLoan(value, data.loanType), "Enter a valid PAN for the selected loan type."),
      panVerified: mustBeChecked("Verify PAN before continuing."),
      aadhaar: z.string().refine(isValidAadhaar, "Enter a valid Aadhaar with Verhoeff checksum."),
      aadhaarVerified: mustBeChecked("Verify Aadhaar before continuing."),
      aadhaarConsent: mustBeChecked("Aadhaar consent is required."),
    });
  }

  if (stepId === "address") {
    return z
      .object({
        currentAddress1: z.string().min(5, "Enter current address."),
        currentPin: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit PIN."),
        currentCity: z.string().min(2, "City is required."),
        currentState: z.string().min(2, "State is required."),
        currentPostOffice: z.string().min(2, "Post office is required."),
        residenceType: z.string().min(1, "Select residence type."),
        yearsAtAddress: asNumber.min(0, "Years cannot be negative."),
        monthlyRent: z.string().optional(),
        previousAddress: z.string().optional(),
        samePermanent: z.boolean(),
        permanentAddress1: z.string().optional(),
        permanentPin: z.string().optional(),
        permanentCity: z.string().optional(),
        permanentState: z.string().optional(),
      })
      .refine((value) => value.residenceType !== "Rented" || Number(value.monthlyRent || 0) > 0, {
        path: ["monthlyRent"],
        message: "Monthly rent is required for rented residence.",
      })
      .refine((value) => Number(value.yearsAtAddress || 0) >= 1 || Boolean(value.previousAddress), {
        path: ["previousAddress"],
        message: "Previous address is required when current stay is below one year.",
      })
      .refine((value) => value.samePermanent || (value.permanentAddress1 && value.permanentPin && value.permanentCity && value.permanentState), {
        path: ["permanentAddress1"],
        message: "Permanent address is required.",
      });
  }

  if (stepId === "employment") {
    return z
      .object({
        employmentType: z.enum(["salaried", "selfEmployed", "businessOwner"]),
        companyName: z.string().optional(),
        designation: z.string().optional(),
        monthlySalary: z.string().optional(),
        salariedExperience: z.string().optional(),
        businessName: z.string().optional(),
        businessType: z.string().optional(),
        annualTurnover: z.string().optional(),
        yearsInBusiness: z.string().optional(),
        selfMonthlyIncome: z.string().optional(),
        businessAddress: z.string().optional(),
        gstNumber: z.string().optional(),
      })
      .superRefine((value, ctx) => {
        if (data.loanType === "business" && value.employmentType === "salaried") {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["employmentType"], message: "Business loans require Self-Employed or Business Owner." });
        }
        if (value.employmentType === "salaried") {
          if (!value.companyName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["companyName"], message: "Company name is required." });
          if (!value.designation) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["designation"], message: "Designation is required." });
          if (Number(value.monthlySalary || 0) < 15000) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["monthlySalary"], message: "Minimum salary is Rs. 15,000." });
          if (Number(value.salariedExperience || 0) < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["salariedExperience"], message: "Experience cannot be negative." });
        } else {
          if (!value.businessName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["businessName"], message: "Business name is required." });
          if (!value.businessType) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["businessType"], message: "Business type is required." });
          if (Number(value.annualTurnover || 0) < 300000) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["annualTurnover"], message: "Minimum turnover is Rs. 3,00,000." });
          if (Number(value.yearsInBusiness || 0) < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["yearsInBusiness"], message: "Minimum years in business is 2." });
          if (!value.businessAddress) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["businessAddress"], message: "Business address is required." });
          if (value.employmentType === "selfEmployed" && Number(value.selfMonthlyIncome || 0) < 15000) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["selfMonthlyIncome"], message: "Monthly income must be at least Rs. 15,000." });
          if (value.employmentType === "businessOwner" && !isValidGst(value.gstNumber || "")) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["gstNumber"], message: "Enter a valid 15-character GST number." });
        }
      });
  }

  if (stepId === "coApplicant") {
    if (!shouldShowCoApplicant(data)) return z.object({});
    return z.object({
      coName: fullName,
      coRelationship: z.string().min(1, "Select relationship."),
      coPan: z.string().transform((value) => value.toUpperCase()).refine((value) => isAllowedPanForLoan(value, "personal"), "Enter a valid individual PAN."),
      coPanVerified: mustBeChecked("Verify co-applicant PAN."),
      coIncome: asNumber.min(15000, "Minimum co-applicant income is Rs. 15,000."),
      coConsent: mustBeChecked("Co-applicant consent is required."),
      coSignature: z.string().min(1, "Co-applicant signature is required."),
    });
  }

  if (stepId === "documents") {
    return z.object({ documents: z.record(z.any()), signature: z.string().min(1, "Applicant signature is required.") }).superRefine((value, ctx) => {
      requiredDocumentTypes(data).forEach((doc) => {
        if (!value.documents?.[doc.key]) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["documents"], message: `${doc.label} is required.` });
        }
      });
    });
  }

  return z.object({
    consentAccuracy: mustBeChecked("Confirm information accuracy."),
    consentCredit: mustBeChecked("Credit check consent is required."),
    consentTerms: mustBeChecked("Terms consent is required."),
    consentCommunication: mustBeChecked("Communication consent is required."),
  });
}
