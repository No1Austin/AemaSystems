export const frameworks = [
  {
    id: "soc2",
    name: "SOC 2 Readiness",
    description:
      "Helps evaluate whether the business has basic security, privacy, risk, vendor, and incident response practices.",
    requiredItems: [
      "Privacy Policy",
      "Security Policy",
      "Incident Response Plan",
      "Vendor Register",
      "Risk Register",
    ],
  },
  {
    id: "iso27001",
    name: "ISO 27001 Readiness",
    description:
      "Helps evaluate information security management readiness.",
    requiredItems: [
      "Security Policy",
      "Incident Response Plan",
      "Vendor Register",
      "Risk Register",
    ],
  },
  {
    id: "pipeda",
    name: "PIPEDA Readiness",
    description:
      "Helps evaluate Canadian privacy readiness for businesses handling personal information.",
    requiredItems: ["Privacy Policy", "Cookie Policy"],
  },
  {
    id: "gdpr",
    name: "GDPR Readiness",
    description:
      "Helps evaluate basic privacy readiness for businesses that may serve users in Europe.",
    requiredItems: ["Privacy Policy", "Cookie Policy", "Risk Register"],
  },
  {
    id: "aoda",
    name: "AODA Readiness",
    description:
      "Helps evaluate basic Ontario accessibility readiness.",
    requiredItems: ["Accessibility Statement"],
  },
];