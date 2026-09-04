export function requiredDocumentTypes(data) {
  const docs = [
    { key: "aadhaar", label: "Aadhaar" },
    { key: "bankStatement", label: "Bank Statement" },
    { key: "photograph", label: "Photograph" },
  ];
  if (!data.panVerified) docs.unshift({ key: "panCard", label: "PAN Card" });
  if (data.employmentType === "salaried") docs.push({ key: "salarySlips", label: "Salary Slips" });
  if (data.employmentType === "selfEmployed") docs.push({ key: "itr", label: "ITR" });
  if (data.employmentType === "businessOwner") docs.push({ key: "itr", label: "ITR" }, { key: "businessRegistration", label: "Business Registration" }, { key: "gstReturns", label: "GST Returns" });
  if (data.loanType === "home") docs.push({ key: "propertyDocuments", label: "Property Documents" });
  if (data.loanType === "business") {
    if (!docs.some((doc) => doc.key === "businessRegistration")) docs.push({ key: "businessRegistration", label: "Business Registration" });
    if (!docs.some((doc) => doc.key === "gstReturns")) docs.push({ key: "gstReturns", label: "GST Returns" });
  }
  return docs;
}
