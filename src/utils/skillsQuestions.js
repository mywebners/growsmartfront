/** Fallback questions mapped to Kaggle career_data.xlsx skill columns (scores 0–20). */
export const SKILL_QUESTIONS = [
  {
    id: "Linguistic-1",
    dimension: "Linguistic",
    model_key: "Linguistic",
    kaggle_column: "Linguistic",
    icon: "🗣️",
    text: "How strong are you at writing clear reports, emails, proposals, or content that others easily understand?",
  },
  {
    id: "Logical-1",
    dimension: "Logical",
    model_key: "Logical - Mathematical",
    kaggle_column: "Logical - Mathematical",
    icon: "🧠",
    text: "How comfortable are you analyzing problems, numbers, or systems step-by-step?",
  },
  {
    id: "Spatial-1",
    dimension: "Spatial",
    model_key: "Spatial-Visualization",
    kaggle_column: "Spatial-Visualization",
    icon: "📐",
    text: "How good are you at visual planning (designs, diagrams, layouts, maps)?",
  },
  {
    id: "Interpersonal-1",
    dimension: "Interpersonal",
    model_key: "Interpersonal",
    kaggle_column: "Interpersonal",
    icon: "🤝",
    text: "How well can you work with clients, teammates, or customers?",
  },
  {
    id: "Intrapersonal-1",
    dimension: "Intrapersonal",
    model_key: "Intrapersonal",
    kaggle_column: "Intrapersonal",
    icon: "🎯",
    text: "How clear are you about your own strengths, weaknesses, and long-term goals?",
  },
  {
    id: "Bodily-1",
    dimension: "Bodily",
    model_key: "Bodily",
    kaggle_column: "Bodily",
    icon: "🛠️",
    text: "How confident are you in hands-on work (labs, tools, fieldwork, practical tasks)?",
  },
  {
    id: "Naturalist-1",
    dimension: "Naturalist",
    model_key: "Naturalist",
    kaggle_column: "Naturalist",
    icon: "🌱",
    text: "How interested are you in nature, health, environment, living systems, or outdoor observation?",
  },
  {
    id: "Musical-1",
    dimension: "Musical",
    model_key: "Musical",
    kaggle_column: "Musical",
    icon: "🎧",
    text: "How strong is your sense of rhythm, sound, media timing, or audio/visual patterns?",
  },
];

export const SKILL_QUESTION_BY_ID = SKILL_QUESTIONS.reduce((acc, q) => {
  acc[q.id] = q.text;
  return acc;
}, {});

export const SKILL_OPTION_LABELS = {
  1: "Not really",
  2: "A little",
  3: "So-so",
  4: "Pretty good",
  5: "Very good",
};

export const SKILL_DIMENSIONS = [
  "Linguistic",
  "Musical",
  "Bodily",
  "Logical",
  "Spatial",
  "Interpersonal",
  "Intrapersonal",
  "Naturalist",
];

/** Map UI Likert 1–5 → Kaggle dataset skill scale (~0–20). */
export function likertToKaggleSkill(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 12;
  return Math.max(0, Math.min(20, Math.round(4 * num)));
}
