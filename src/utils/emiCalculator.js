export function calculateEMI({ principal, annualRate, months }) {
  const p = Number(principal || 0);
  const n = Number(months || 0);
  const r = Number(annualRate || 0) / 12 / 100;
  if (!p || !n || !r) return 0;
  return Math.round((p * r * (1 + r) ** n) / ((1 + r) ** n - 1));
}

export function calculateTotalInterest({ principal, emi, months }) {
  return Math.max(0, Math.round(Number(emi || 0) * Number(months || 0) - Number(principal || 0)));
}

export function calculateProcessingFee(amount) {
  return Math.min(25000, Math.max(2000, Math.round(Number(amount || 0) * 0.01)));
}

export function calculateAffordabilityRatio({ emi, income }) {
  const monthlyIncome = Number(income || 0);
  return monthlyIncome ? Math.round((Number(emi || 0) / monthlyIncome) * 100) : 0;
}
