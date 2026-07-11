export const frameworks = [
  {
    id: "pipeda",
    name: "PIPEDA",
    region: "Canada",
    priority: "High",
    applicable: "automatic",
    description:
      "Canadian privacy readiness for businesses that collect, use, or disclose personal information in commercial activities.",
  },

  {
    id: "phipa",
    name: "PHIPA",
    region: "Ontario, Canada",
    priority: "High",
    applicable: "conditional",
    description:
      "Ontario health information privacy readiness for healthcare custodians and organizations handling personal health information.",
  },

  {
    id: "aoda",
    name: "AODA",
    region: "Ontario, Canada",
    priority: "Standard",
    applicable: "conditional",
    description:
      "Ontario accessibility readiness for organizations operating in Ontario.",
  },

  {
    id: "soc2",
    name: "SOC 2",
    region: "Global",
    priority: "Recommended",
    applicable: "recommended",
    description:
      "Security, availability, confidentiality, processing integrity, and privacy readiness for service organizations.",
  },

  {
    id: "iso27001",
    name: "ISO 27001",
    region: "Global",
    priority: "Recommended",
    applicable: "recommended",
    description:
      "Information Security Management System (ISMS) readiness based on ISO 27001.",
  },

  {
    id: "gdpr",
    name: "GDPR",
    region: "European Union",
    priority: "Conditional",
    applicable: "manual",
    description:
      "Privacy and data protection readiness for organizations offering goods or services to, or monitoring individuals in, the European Economic Area.",
  },

  {
    id: "pci",
    name: "PCI DSS",
    region: "Global",
    priority: "Conditional",
    applicable: "conditional",
    description:
      "Payment Card Industry Data Security Standard readiness for organizations storing, processing, or transmitting payment card information.",
  },

  
];

export function getFramework(id) {
  return frameworks.find((framework) => framework.id === id);
}