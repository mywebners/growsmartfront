export const SKILL_QUESTIONS = [
  { id: "Linguistic-1", dimension: "Linguistic", text: "How confident are you in writing clear essays, stories, or reports?" },
  { id: "Linguistic-2", dimension: "Linguistic", text: "How well can you explain difficult topics in your own words?" },
  { id: "Musical-1", dimension: "Musical", text: "How easily do you notice rhythm, tone, or beat changes in sounds?" },
  { id: "Musical-2", dimension: "Musical", text: "How strong is your memory for melodies or tunes after hearing them?" },
  { id: "Bodily-1", dimension: "Bodily", text: "How good is your body coordination in sports, dance, or practical tasks?" },
  { id: "Bodily-2", dimension: "Bodily", text: "How confident are you in hands-on activities like labs, repair, or building?" },
  { id: "Logical-1", dimension: "Logical", text: "How much do you enjoy solving puzzles, equations, or logic challenges?" },
  { id: "Logical-2", dimension: "Logical", text: "How comfortable are you with data patterns, formulas, and step-by-step problem solving?" },
  { id: "Spatial-1", dimension: "Spatial", text: "How easy is it for you to mentally rotate shapes or imagine 3D objects?" },
  { id: "Spatial-2", dimension: "Spatial", text: "How good are you at reading maps, diagrams, and visual layouts?" },
  { id: "Interpersonal-1", dimension: "Interpersonal", text: "How well do you understand other people's feelings during teamwork?" },
  { id: "Interpersonal-2", dimension: "Interpersonal", text: "How comfortable are you leading group discussions or resolving conflicts?" },
  { id: "Intrapersonal-1", dimension: "Intrapersonal", text: "How clearly do you understand your own strengths, weaknesses, and goals?" },
  { id: "Intrapersonal-2", dimension: "Intrapersonal", text: "How disciplined are you in self-study and staying focused without reminders?" },
  { id: "Naturalist-1", dimension: "Naturalist", text: "How interested are you in biology, environment, plants, or animals?" },
  { id: "Naturalist-2", dimension: "Naturalist", text: "How often do you observe nature details and classify living things around you?" },
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
