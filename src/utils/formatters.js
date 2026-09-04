export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function maskPan(value = "") {
  if (!value) return "Not provided";
  return value.length >= 6 ? `${value.slice(0, 2)}***${value.slice(-2)}` : value;
}

export function maskAadhaar(value = "") {
  if (!value) return "Not provided";
  return value.length >= 4 ? `XXXX XXXX ${value.slice(-4)}` : value;
}

export function bytesToSize(bytes = 0) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
