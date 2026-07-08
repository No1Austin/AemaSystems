import { frameworks } from "./frameworks";

export function scoreFrameworks(existingItems = []) {
  return frameworks.map((framework) => {
    const completed = framework.requiredItems.filter((item) =>
      existingItems.includes(item)
    );

    const missing = framework.requiredItems.filter(
      (item) => !existingItems.includes(item)
    );

    const score =
      framework.requiredItems.length === 0
        ? 100
        : Math.round((completed.length / framework.requiredItems.length) * 100);

    return {
      ...framework,
      score,
      completed,
      missing,
    };
  });
}