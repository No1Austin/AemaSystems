import { frameworks } from "./frameworks";

/**
 * Scores every configured framework against:
 * - assessment answers
 * - existing document/evidence names
 * - manual evidence confirmations
 * - country/province applicability rules
 *
 * Expected usage:
 *
 * const frameworkResults = scoreFrameworks({
 *   answers,
 *   existingItems,
 *   country: answers.country,
 *   province: answers.province,
 *   manualEvidence,
 * });
 */
export function scoreFrameworks({
  answers = {},
  existingItems = [],
  country = "",
  province = "",
  manualEvidence = {},
} = {}) {
  const normalizedExistingItems = normalizeExistingItems(existingItems);

  return frameworks.map((framework) =>
    scoreFramework({
      framework,
      answers,
      existingItems: normalizedExistingItems,
      country,
      province,
      manualEvidence,
    })
  );
}

function scoreFramework({
  framework,
  answers,
  existingItems,
  country,
  province,
  manualEvidence,
}) {
  const applicability = evaluateFrameworkApplicability({
    framework,
    answers,
    country,
    province,
  });

  const domainResults = (framework.domains ?? []).map((domain) =>
    scoreDomain({
      domain,
      answers,
      existingItems,
      manualEvidence,
    })
  );

  const applicableDomains = domainResults.filter(
    (domain) => domain.status !== "not-applicable"
  );

  const totalDomainWeight = applicableDomains.reduce(
    (sum, domain) => sum + domain.weight,
    0
  );

  const rawFrameworkScore =
    totalDomainWeight === 0
      ? 0
      : applicableDomains.reduce(
          (sum, domain) => sum + domain.score * domain.weight,
          0
        ) / totalDomainWeight;

  const score = applicability.applicable
    ? Math.round(rawFrameworkScore)
    : 0;

  const completed = [];
  const partial = [];
  const missing = [];
  const needsReview = [];
  const notApplicable = [];

  for (const domain of domainResults) {
    for (const control of domain.controls) {
      const summaryItem = {
        id: control.id,
        name: control.name,
        domainId: domain.id,
        domainName: domain.name,
        score: control.score,
        status: control.status,
        completedChecks: control.completedChecks,
        missingChecks: control.missingChecks,
      };

      if (control.status === "ready") {
        completed.push(summaryItem);
      } else if (control.status === "partial") {
        partial.push(summaryItem);
      } else if (control.status === "missing") {
        missing.push(summaryItem);
      } else if (control.status === "needs-review") {
        needsReview.push(summaryItem);
      } else if (control.status === "not-applicable") {
        notApplicable.push(summaryItem);
      }
    }
  }

  return {
    ...framework,

    applicable: applicability.applicable,
    applicabilityStatus: applicability.status,
    applicabilityReason: applicability.reason,
    requiresManualConfirmation:
      applicability.requiresManualConfirmation,
    confirmationQuestion:
      applicability.confirmationQuestion ?? null,

    score,
    status: determineFrameworkStatus({
      applicable: applicability.applicable,
      score,
      needsReviewCount: needsReview.length,
    }),

    domains: domainResults,

    completed,
    partial,
    missing,
    needsReview,
    notApplicable,

    summary: {
      totalDomains: domainResults.length,
      applicableDomains: applicableDomains.length,
      totalControls:
        completed.length +
        partial.length +
        missing.length +
        needsReview.length,
      completed: completed.length,
      partial: partial.length,
      missing: missing.length,
      needsReview: needsReview.length,
      notApplicable: notApplicable.length,
    },
  };
}

function scoreDomain({
  domain,
  answers,
  existingItems,
  manualEvidence,
}) {
  const controls = (domain.controls ?? []).map((control) =>
    scoreControl({
      control,
      answers,
      existingItems,
      manualEvidence,
    })
  );

  const applicableControls = controls.filter(
    (control) => control.status !== "not-applicable"
  );

  const totalControlWeight = applicableControls.reduce(
    (sum, control) => sum + control.weight,
    0
  );

  const rawScore =
    totalControlWeight === 0
      ? 0
      : applicableControls.reduce(
          (sum, control) => sum + control.score * control.weight,
          0
        ) / totalControlWeight;

  const score = Math.round(rawScore);

  return {
    id: domain.id,
    name: domain.name,
    description: domain.description ?? "",
    weight: toPositiveNumber(domain.weight, 1),
    score,
    status:
      applicableControls.length === 0
        ? "not-applicable"
        : determineReadinessStatus(score),
    controls,
    summary: {
      totalControls: controls.length,
      applicableControls: applicableControls.length,
      completed: applicableControls.filter(
        (control) => control.status === "ready"
      ).length,
      partial: applicableControls.filter(
        (control) => control.status === "partial"
      ).length,
      missing: applicableControls.filter(
        (control) => control.status === "missing"
      ).length,
      needsReview: applicableControls.filter(
        (control) => control.status === "needs-review"
      ).length,
    },
  };
}

function scoreControl({
  control,
  answers,
  existingItems,
  manualEvidence,
}) {
  const weight = toPositiveNumber(control.weight, 1);

  if (!isControlApplicable(control, answers)) {
    return {
      ...control,
      weight,
      score: 0,
      status: "not-applicable",
      completedChecks: [],
      missingChecks: [],
      totalChecks: 0,
    };
  }

  const checks = [
    ...buildPositiveAnswerChecks(control, answers),
    ...buildNegativeAnswerChecks(control, answers),
    ...buildEvidenceChecks(control, existingItems),
    ...buildManualEvidenceChecks(control, manualEvidence),
  ];

  if (
    control.requiresManualEvidence &&
    !Object.prototype.hasOwnProperty.call(
      manualEvidence,
      control.id
    )
  ) {
    return {
      ...control,
      weight,
      score: 0,
      status: "needs-review",
      completedChecks: [],
      missingChecks: [
        {
          type: "manual-evidence",
          key: control.id,
          label: "Manual evidence or professional review required",
          passed: false,
        },
      ],
      totalChecks: 1,
    };
  }

  if (checks.length === 0) {
    return {
      ...control,
      weight,
      score: 0,
      status: "needs-review",
      completedChecks: [],
      missingChecks: [
        {
          type: "assessment",
          key: control.id,
          label: "This control has not yet been assessed",
          passed: false,
        },
      ],
      totalChecks: 1,
    };
  }

  const completedChecks = checks.filter((check) => check.passed);
  const missingChecks = checks.filter((check) => !check.passed);

  const score = Math.round(
    (completedChecks.length / checks.length) * 100
  );

  return {
    ...control,
    weight,
    score,
    status: determineReadinessStatus(score),
    completedChecks,
    missingChecks,
    totalChecks: checks.length,
  };
}

function buildPositiveAnswerChecks(control, answers) {
  return (control.answerKeys ?? []).map((key) => ({
    type: "answer",
    key,
    label: humanizeKey(key),
    value: answers[key] ?? "",
    passed: answers[key] === "yes",
  }));
}

function buildNegativeAnswerChecks(control, answers) {
  return (control.negativeAnswerKeys ?? []).map((key) => ({
    type: "answer",
    key,
    label: humanizeKey(key),
    value: answers[key] ?? "",
    passed: answers[key] !== "yes",
  }));
}

function buildEvidenceChecks(control, existingItems) {
  return (control.evidenceItems ?? []).map((item) => ({
    type: "evidence",
    key: normalize(item),
    label: item,
    passed: existingItems.has(normalize(item)),
  }));
}

function buildManualEvidenceChecks(control, manualEvidence) {
  if (!control.requiresManualEvidence) {
    return [];
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      manualEvidence,
      control.id
    )
  ) {
    return [];
  }

  return [
    {
      type: "manual-evidence",
      key: control.id,
      label: "Manual evidence confirmed",
      passed: Boolean(manualEvidence[control.id]),
    },
  ];
}

function isControlApplicable(control, answers) {
  const anyYes = control.applicableWhenAnyYes ?? [];
  const allYes = control.applicableWhenAllYes ?? [];
  const anyNo = control.applicableWhenAnyNo ?? [];
  const allNo = control.applicableWhenAllNo ?? [];

  if (
    anyYes.length > 0 &&
    !anyYes.some((key) => answers[key] === "yes")
  ) {
    return false;
  }

  if (
    allYes.length > 0 &&
    !allYes.every((key) => answers[key] === "yes")
  ) {
    return false;
  }

  if (
    anyNo.length > 0 &&
    !anyNo.some((key) => answers[key] === "no")
  ) {
    return false;
  }

  if (
    allNo.length > 0 &&
    !allNo.every((key) => answers[key] === "no")
  ) {
    return false;
  }

  return true;
}

function evaluateFrameworkApplicability({
  framework,
  answers,
  country,
  province,
}) {
  const rule = framework.applicability ?? {
    mode: "recommended",
  };

  const resolvedCountry =
    country || answers.country || "";
  const resolvedProvince =
    province || answers.province || "";

  const countryMatches =
    !rule.countries?.length ||
    rule.countries.some(
      (item) =>
        normalize(item) === normalize(resolvedCountry)
    );

  const provinceMatches =
    !rule.provinces?.length ||
    rule.provinces.some(
      (item) =>
        normalize(item) === normalize(resolvedProvince)
    );

  const allAnswersMatch =
    !rule.allAnswersYes?.length ||
    rule.allAnswersYes.every(
      (key) => answers[key] === "yes"
    );

  const anyAnswersMatch =
    !rule.anyAnswersYes?.length ||
    rule.anyAnswersYes.some(
      (key) => answers[key] === "yes"
    );

  const allConditionsMatch =
    countryMatches &&
    provinceMatches &&
    allAnswersMatch &&
    anyAnswersMatch;

  if (rule.mode === "conditional") {
    return {
      applicable: allConditionsMatch,
      status: allConditionsMatch
        ? rule.requiresManualConfirmation
          ? "confirmation-required"
          : "potentially-applicable"
        : "not-applicable",
      reason: rule.reason ?? "",
      requiresManualConfirmation: Boolean(
        rule.requiresManualConfirmation
      ),
      confirmationQuestion:
        rule.confirmationQuestion ?? null,
    };
  }

  if (rule.mode === "recommended") {
    return {
      applicable: allConditionsMatch,
      status: allConditionsMatch
        ? "recommended"
        : "not-triggered",
      reason: rule.reason ?? "",
      requiresManualConfirmation: Boolean(
        rule.requiresManualConfirmation
      ),
      confirmationQuestion:
        rule.confirmationQuestion ?? null,
    };
  }

  return {
    applicable: true,
    status: "applicable",
    reason: rule.reason ?? "",
    requiresManualConfirmation: false,
    confirmationQuestion: null,
  };
}

function determineReadinessStatus(score) {
  if (score >= 100) return "ready";
  if (score > 0) return "partial";
  return "missing";
}

function determineFrameworkStatus({
  applicable,
  score,
  needsReviewCount,
}) {
  if (!applicable) return "not-applicable";

  if (needsReviewCount > 0 && score === 0) {
    return "needs-review";
  }

  if (score >= 85) return "strong-readiness";
  if (score >= 60) return "moderate-readiness";
  if (score > 0) return "early-readiness";

  return "not-ready";
}

function normalizeExistingItems(existingItems) {
  return new Set(
    (Array.isArray(existingItems) ? existingItems : [])
      .filter(Boolean)
      .map((item) => normalize(item))
  );
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function humanizeKey(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function toPositiveNumber(value, fallback = 1) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}
