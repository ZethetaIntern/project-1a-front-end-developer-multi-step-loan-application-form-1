const validAadhaar = "234567890124";

function fillStep1(type = "personal", amount = "600000", tenure = "36") {
  cy.contains(type === "home" ? "Home Loan" : type === "business" ? "Business Loan" : "Personal Loan").click();
  cy.get("#loanAmount").clear().type(amount);
  cy.get("#tenure").clear().type(tenure);
  cy.get("#purpose").select(1);
  cy.contains("button", "Next").click();
}

function fillStep2(marital = "Married") {
  cy.get("#fullName").type("Amit Kumar");
  cy.get("#dob").type("1990-01-01");
  cy.get("#gender").select("Male");
  cy.get("#maritalStatus").select(marital);
  cy.get("#fatherName").type("Ramesh Kumar");
  cy.get("#motherName").type("Sunita Kumar");
  cy.get("#email").type("amit@example.com");
  cy.get("#mobile").type("9876543210");
  cy.get("#alternateMobile").type("9876543211");
  cy.contains("button", "Next").click();
}

function fillKyc(pan = "ABCPF1234F") {
  cy.get("#pan").type(pan);
  cy.contains("button", "Verify PAN").click();
  cy.contains("button", "Verified", { timeout: 2500 });
  cy.get("#aadhaar").type(validAadhaar);
  cy.contains("button", "Verify Aadhaar").click();
  cy.contains("button", "Verified", { timeout: 2500 });
  cy.get("#aadhaarConsent").check();
  cy.contains("button", "Next").click();
}

function fillAddress() {
  cy.get("#currentAddress1").type("12 MG Road");
  cy.get("#currentPin").type("400001");
  cy.contains("PIN details populated", { timeout: 1500 });
  cy.get("#residenceType").select("Owned");
  cy.get("#yearsAtAddress").type("3");
  cy.contains("button", "Next").click();
}

function fillEmployment(kind = "salaried") {
  if (kind !== "salaried") cy.contains(kind === "businessOwner" ? "Business Owner" : "Self-Employed").click();
  if (kind === "salaried") {
    cy.get("#companyName").type("Acme Finance");
    cy.get("#designation").type("Manager");
    cy.get("#monthlySalary").type("90000");
    cy.get("#salariedExperience").type("6");
  } else {
    cy.get("#businessName").type("Amit Traders");
    cy.get("#businessType").type("Retail");
    cy.get("#annualTurnover").type("2400000");
    cy.get("#yearsInBusiness").type("4");
    if (kind === "selfEmployed") cy.get("#selfMonthlyIncome").type("90000");
    if (kind === "businessOwner") cy.get("#gstNumber").type("27ABCDE1234F1Z5");
    cy.get("#businessAddress").type("Market Road");
  }
  cy.contains("button", "Next").click();
}

function fillCoApplicant() {
  cy.get("#coName").type("Priya Kumar");
  cy.get("#coIncome").type("50000");
  cy.get("#coPan").type("ABCPF1234F");
  cy.contains("button", "Verify PAN").click();
  cy.contains("button", "Verified", { timeout: 2500 });
  cy.get("#coConsent").check();
  cy.get("canvas").last().trigger("mousedown", { which: 1, clientX: 50, clientY: 50 }).trigger("mousemove", { clientX: 120, clientY: 90 }).trigger("mouseup");
  cy.contains("button", "Next").click();
}

function uploadDocs() {
  cy.get("input[type=file]").each(($input) => {
    cy.wrap($input).selectFile("cypress/fixtures/sample.pdf", { force: true });
  });
  cy.get("canvas").first().trigger("mousedown", { which: 1, clientX: 40, clientY: 40 }).trigger("mousemove", { clientX: 110, clientY: 80 }).trigger("mouseup");
  cy.contains("button", "Next").click();
}

describe("loan application journeys", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("Personal Loan happy path", () => {
    fillStep1("personal", "600000", "36");
    fillStep2();
    fillKyc();
    fillAddress();
    fillEmployment();
    fillCoApplicant();
    uploadDocs();
    cy.contains("Pre-Approval Summary");
    cy.get("#consentAccuracy").check();
    cy.get("#consentCredit").check();
    cy.get("#consentTerms").check();
    cy.get("#consentCommunication").check();
    cy.contains("Submit Application").click();
    cy.contains("Application Submitted Successfully");
  });

  it("Home Loan happy path", () => {
    fillStep1("home", "2500000", "120");
    fillStep2();
    fillKyc();
    fillAddress();
    fillEmployment();
    cy.contains("Co-Applicant");
  });

  it("Business Loan happy path", () => {
    fillStep1("business", "2500000", "48");
    fillStep2("Single");
    fillKyc("ABCCF1234F");
    fillAddress();
    fillEmployment("businessOwner");
    cy.contains("Co-Applicant");
  });

  it("validates Step 1", () => {
    cy.contains("button", "Next").click();
    cy.contains("Minimum amount");
  });

  it("validates Step 2", () => {
    fillStep1("personal", "300000", "24");
    cy.contains("button", "Next").click();
    cy.contains("Date of birth is required");
  });

  it("validates PAN and Aadhaar", () => {
    fillStep1();
    fillStep2();
    cy.get("#pan").type("BADPAN");
    cy.contains("button", "Verify PAN").click();
    cy.contains("invalid");
  });

  it("performs PIN lookup", () => {
    fillStep1("personal", "300000", "24");
    fillStep2("Single");
    fillKyc();
    cy.get("#currentAddress1").type("12 MG Road");
    cy.get("#currentPin").type("560001");
    cy.contains("Bengaluru", { timeout: 1500 });
  });

  it("switches employment branches", () => {
    fillStep1("personal", "300000", "24");
    fillStep2("Single");
    fillKyc();
    fillAddress();
    cy.contains("Self-Employed").click();
    cy.contains("Business Name");
    cy.contains("Salaried").click();
    cy.contains("Company Name");
  });

  it("handles conditional Step 6 thresholds", () => {
    fillStep1("personal", "500000", "24");
    fillStep2("Single");
    fillKyc();
    fillAddress();
    fillEmployment();
    cy.contains("Documents");
  });

  it("activates Step 6 above personal threshold", () => {
    fillStep1("personal", "500001", "24");
    fillStep2();
    fillKyc();
    fillAddress();
    fillEmployment();
    cy.contains("Co-Applicant");
  });

  it("supports file upload", () => {
    fillStep1("personal", "300000", "24");
    fillStep2("Single");
    fillKyc();
    fillAddress();
    fillEmployment();
    cy.get("input[type=file]").first().selectFile("cypress/fixtures/sample.pdf", { force: true });
    cy.contains("Uploaded");
  });

  it("captures e-signature", () => {
    fillStep1("personal", "300000", "24");
    fillStep2("Single");
    fillKyc();
    fillAddress();
    fillEmployment();
    cy.get("canvas").first().trigger("mousedown", { which: 1, clientX: 40, clientY: 40 }).trigger("mousemove", { clientX: 110, clientY: 80 }).trigger("mouseup");
    cy.contains("Signature captured");
  });

  it("shows resume prompt", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("project1a.loanApplication.draft", JSON.stringify({ version: 1, savedAt: new Date().toISOString(), currentStep: "personal", formData: { loanType: "personal" } }));
    });
    cy.visit("/");
    cy.contains("Resume Previous Application?");
  });

  it("allows keyboard navigation into fields", () => {
    cy.get("#loanAmount").focus().should("be.focused").type("50000");
  });

  it("handles rapid navigation clicks", () => {
    fillStep1("personal", "300000", "24");
    cy.contains("button", "Previous").click().click();
    cy.contains("Loan Details");
  });

  it("rejects invalid file type", () => {
    fillStep1("personal", "300000", "24");
    fillStep2("Single");
    fillKyc();
    fillAddress();
    fillEmployment();
    cy.get("input[type=file]").first().selectFile("cypress/fixtures/sample.txt", { force: true });
    cy.contains("File is not accepted");
  });

  it("discards corrupted local storage", () => {
    cy.window().then((win) => win.localStorage.setItem("project1a.loanApplication.draft", "{bad"));
    cy.visit("/");
    cy.contains("Loan Details");
  });

  it("updates dependencies when loan type changes", () => {
    cy.contains("Business Loan").click();
    cy.get("#tenure").type("360");
    cy.contains("button", "Next").click();
    cy.contains("Maximum tenure");
  });
});
