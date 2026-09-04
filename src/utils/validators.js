import { LOAN_TYPES, MIN_LOAN_AMOUNT } from "./constants.js";

const verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export function isPanFormat(value = "") {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);
}

export function isAllowedPanForLoan(pan = "", loanType = "personal") {
  if (!isPanFormat(pan)) return false;
  const entity = pan.charAt(3);
  return loanType === "business" ? ["P", "C", "F"].includes(entity) : entity === "P";
}

export function isValidAadhaar(value = "") {
  if (!/^[0-9]{12}$/.test(value) || /^([0-9])\1+$/.test(value)) return false;
  let c = 0;
  value
    .split("")
    .reverse()
    .map(Number)
    .forEach((digit, i) => {
      c = verhoeffD[c][verhoeffP[i % 8][digit]];
    });
  return c === 0;
}

export function isValidGst(value = "") {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value);
}

export function getAge(dob) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function shouldShowCoApplicant(data) {
  const amount = Number(data.loanAmount || 0);
  if (data.loanType === "home") return true;
  if (data.loanType === "business") return amount > 2000000;
  return amount > 500000;
}

export function getPrimaryMonthlyIncome(data) {
  if (data.employmentType === "salaried") return Number(data.monthlySalary || 0);
  if (data.employmentType === "selfEmployed") return Number(data.selfMonthlyIncome || 0);
  if (data.employmentType === "businessOwner") return Math.round(Number(data.annualTurnover || 0) / 12);
  return 0;
}

export function loanAmountMessage(loanType) {
  const config = LOAN_TYPES[loanType] || LOAN_TYPES.personal;
  return `Amount must be between ${MIN_LOAN_AMOUNT} and ${config.max}.`;
}
