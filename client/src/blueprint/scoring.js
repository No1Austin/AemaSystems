export function calculateBlueprintScore(answers) {
  const totalPossible = Object.keys(answers).length * 5;
  const totalScore = Object.values(answers).reduce((sum, value) => sum + Number(value), 0);
  const percentage = Math.round((totalScore / totalPossible) * 100);

  let level = "Needs Systems";
  if (percentage >= 80) level = "Growth Ready";
  else if (percentage >= 60) level = "Improving";
  else if (percentage >= 40) level = "Foundation Stage";

  return {
    totalScore,
    percentage,
    level,
  };
}