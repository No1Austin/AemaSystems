export const industryFrameworkMap = {
  healthcare: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  dental: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  clinic: ["pipeda", "phipa", "aoda", "iso27001", "soc2"],
  ecommerce: ["pipeda", "gdpr", "pci", "aoda", "soc2"],
  restaurant: ["pipeda", "aoda"],
  consulting: ["pipeda", "aoda", "soc2"],
  technology: ["pipeda", "gdpr", "soc2", "iso27001"],
  saas: ["pipeda", "gdpr", "soc2", "iso27001"],
  law: ["pipeda", "soc2", "iso27001"],
  accounting: ["pipeda", "soc2", "iso27001"],
  education: ["pipeda", "aoda"],
  default: ["pipeda", "aoda"],
};

export function detectFrameworks(industry = "") {
  const clean = industry.toLowerCase();

  const match = Object.keys(industryFrameworkMap).find((key) =>
    clean.includes(key)
  );

  return industryFrameworkMap[match] || industryFrameworkMap.default;
}