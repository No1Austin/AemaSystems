import { useState } from "react";
import { blueprintQuestions } from "../blueprint/questions";
import { calculateBlueprintScore } from "../blueprint/scoring";
import "./GrowthBlueprint.css";

export default function GrowthBlueprint() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== blueprintQuestions.length) {
      alert("Please answer all questions.");
      return;
    }

    const score = calculateBlueprintScore(answers);
    setResult(score);
  };

  return (
    <main className="blueprint-page">
      <section className="blueprint-hero">
        <h1>AEMA Growth Blueprint™</h1>
        <p>
          Discover your business health score and see what systems your business needs to grow.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="blueprint-form">
        {blueprintQuestions.map((q, index) => (
          <div className="question-card" key={q.id}>
            <span>{q.category}</span>
            <h3>{index + 1}. {q.question}</h3>

            {q.options.map((option) => (
              <label key={option.label}>
                <input
                  type="radio"
                  name={q.id}
                  value={option.value}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        ))}

        <button type="submit">Get My Free Score</button>
      </form>

      {result && (
        <section className="result-card">
          <h2>Your Business Health Score</h2>
          <strong>{result.percentage}%</strong>
          <p>{result.level}</p>
          <button>Unlock Full AI Roadmap</button>
        </section>
      )}
    </main>
  );
}