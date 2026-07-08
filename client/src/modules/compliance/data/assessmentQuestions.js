export const assessmentSteps = [
  {
    id: "business",
    title: "Business Profile",
    questions: [
      { name: "businessName", label: "Business Name", type: "text", required: true },
      { name: "industry", label: "Industry", type: "text", required: true },
      { name: "country", label: "Country", type: "text", defaultValue: "Canada" },
      { name: "province", label: "Province / State", type: "text", defaultValue: "Ontario" },
      { name: "website", label: "Website", type: "text" },
      { name: "email", label: "Business Email", type: "email" },
      { name: "employees", label: "Number of Employees", type: "select", options: ["1", "2-10", "11-50", "51-200", "200+"] },
    ],
  },
  {
    id: "operations",
    title: "Business Operations",
    questions: [
      { name: "collectsCustomerData", label: "Do you collect customer information?", type: "boolean" },
      { name: "acceptsOnlinePayments", label: "Do you accept online payments?", type: "boolean" },
      { name: "hasEmployees", label: "Do you have employees or contractors?", type: "boolean" },
      { name: "usesCloudSoftware", label: "Do you use cloud software?", type: "boolean" },
    ],
  },
  {
    id: "data",
    title: "Data Collection",
    questions: [
      { name: "collectsHealthData", label: "Do you collect health or medical information?", type: "boolean" },
      { name: "collectsFinancialData", label: "Do you collect financial information?", type: "boolean" },
      { name: "collectsChildrenData", label: "Do you collect information from children?", type: "boolean" },
      { name: "collectsEmployeeData", label: "Do you collect employee information?", type: "boolean" },
    ],
  },
  {
    id: "security",
    title: "Security Controls",
    questions: [
      { name: "hasMFA", label: "Do you use multi-factor authentication?", type: "boolean" },
      { name: "hasBackups", label: "Do you perform backups?", type: "boolean" },
      { name: "hasAccessControl", label: "Do you control who has access to systems?", type: "boolean" },
      { name: "hasIncidentPlan", label: "Do you have an incident response plan?", type: "boolean" },
    ],
  },
  {
    id: "governance",
    title: "Existing Governance",
    questions: [
      { name: "hasPrivacyPolicy", label: "Do you have a Privacy Policy?", type: "boolean" },
      { name: "hasTerms", label: "Do you have Terms of Service?", type: "boolean" },
      { name: "hasCookiePolicy", label: "Do you have a Cookie Policy?", type: "boolean" },
      { name: "hasSecurityPolicy", label: "Do you have a Security Policy?", type: "boolean" },
      { name: "hasRiskRegister", label: "Do you have a Risk Register?", type: "boolean" },
      { name: "hasVendorRegister", label: "Do you have a Vendor Register?", type: "boolean" },
    ],
  },
  {
    id: "ai",
    title: "AI Usage",
    questions: [
      { name: "usesAI", label: "Do you use AI tools in your business?", type: "boolean" },
      { name: "usesCustomerDataInAI", label: "Do you enter customer data into AI tools?", type: "boolean" },
      { name: "hasAIPolicy", label: "Do you have a Responsible AI Policy?", type: "boolean" },
    ],
  },
];