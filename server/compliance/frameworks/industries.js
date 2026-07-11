export const industryFrameworkMap = {
  healthcare: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  dental: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  clinic: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  hospital: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  pharmacy: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  therapy: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],

  technology: ["pipeda", "gdpr", "soc2", "iso27001"],
  software: ["pipeda", "gdpr", "soc2", "iso27001"],
  saas: ["pipeda", "gdpr", "soc2", "iso27001"],
  cybersecurity: ["pipeda", "gdpr", "soc2", "iso27001"],

  ecommerce: ["pipeda", "gdpr", "pci", "aoda", "soc2"],
  retail: ["pipeda", "gdpr", "pci", "aoda"],

  accounting: ["pipeda", "soc2", "iso27001"],
  finance: ["pipeda", "pci", "iso27001", "soc2"],
  insurance: ["pipeda", "iso27001", "soc2"],

  consulting: ["pipeda", "aoda", "soc2"],
  legal: ["pipeda", "soc2", "iso27001"],
  law: ["pipeda", "soc2", "iso27001"],

  education: ["pipeda", "aoda"],
  school: ["pipeda", "aoda"],
  university: ["pipeda", "aoda"],
  daycare: ["pipeda", "aoda"],

  restaurant: ["pipeda", "aoda"],

  manufacturing: ["aoda"],
  construction: ["aoda"],
  logistics: ["aoda"],

  nonprofit: ["pipeda", "aoda"],

  default: ["pipeda", "aoda"],
};

export function detectFrameworks(industry = "") {
  const clean = industry.toLowerCase();

  const frameworks = new Set();

  Object.entries(industryFrameworkMap).forEach(([keyword, list]) => {
    if (clean.includes(keyword)) {
      list.forEach((framework) => frameworks.add(framework));
    }
  });

  if (frameworks.size === 0) {
    industryFrameworkMap.default.forEach((framework) =>
      frameworks.add(framework)
    );
  }

  return [...frameworks];
}