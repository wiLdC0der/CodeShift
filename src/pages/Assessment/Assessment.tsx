import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { submitAssessment } from "../../services/assessment";

type Question = {
  id: number;
  category: "syntax" | "data-structures" | "oop" | "algorithms";
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
};

const questions: Question[] = [
  {
    id: 1,
    category: "syntax",
    question: "What does this Python code print?",
    code: `numbers = [1, 2, 3, 4]
print(numbers[-1])`,
    options: ["1", "4", "Error", "None"],
    correctAnswer: 1,
  },
  {
    id: 2,
    category: "data-structures",
    question: "Which Python data structure stores key-value pairs?",
    options: ["list", "tuple", "dict", "set"],
    correctAnswer: 2,
  },
  {
    id: 3,
    category: "syntax",
    question: "What is the result of this expression?",
    code: `len([10, 20, 30])`,
    options: ["2", "3", "4", "Error"],
    correctAnswer: 1,
  },
  {
    id: 4,
    category: "oop",
    question: "Which keyword creates a class in Python?",
    options: ["object", "class", "struct", "type"],
    correctAnswer: 1,
  },
  {
    id: 5,
    category: "algorithms",
    question: "What is the average lookup complexity of a Python dictionary?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 0,
  },
];

type Scores = {
  syntaxScore: number;
  dataStructuresScore: number;
  algorithmsScore: number;
  oopScore: number;
  overallScore: number;
};

function calculateScores(answers: number[]): Scores {
  const categories = {
    syntax: { correct: 0, total: 0 },
    "data-structures": { correct: 0, total: 0 },
    algorithms: { correct: 0, total: 0 },
    oop: { correct: 0, total: 0 },
  };

  questions.forEach((question, index) => {
    const category = categories[question.category];

    category.total += 1;

    if (answers[index] === question.correctAnswer) {
      category.correct += 1;
    }
  });

  const calculateCategoryScore = (category: {
    correct: number;
    total: number;
  }) => {
    if (category.total === 0) {
      return 0;
    }

    return Math.round((category.correct / category.total) * 100);
  };

  const syntaxScore = calculateCategoryScore(categories.syntax);
  const dataStructuresScore = calculateCategoryScore(
    categories["data-structures"],
  );
  const algorithmsScore = calculateCategoryScore(
    categories.algorithms,
  );
  const oopScore = calculateCategoryScore(categories.oop);

  const overallScore = Math.round(
    (syntaxScore +
      dataStructuresScore +
      algorithmsScore +
      oopScore) /
      4,
  );

  return {
    syntaxScore,
    dataStructuresScore,
    algorithmsScore,
    oopScore,
    overallScore,
  };
}

export default function Assessment() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];

  const progress =
    ((currentIndex + (selected !== null ? 1 : 0)) /
      questions.length) *
    100;

  async function handleNext() {
    if (selected === null || submitting) {
      return;
    }

    setError("");

    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = selected;

    setAnswers(updatedAnswers);

    if (currentIndex === questions.length - 1) {
      try {
        setSubmitting(true);

        const scores = calculateScores(updatedAnswers);

        await submitAssessment(scores);

        setCompleted(true);
      } catch (error) {
        console.error("Assessment submission failed:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to save your assessment.",
        );
      } finally {
        setSubmitting(false);
      }

      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setSelected(null);
  }

  if (completed) {
    const scores = calculateScores(answers);
    const percentage = scores.overallScore;

    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
          <div className="w-full max-w-xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950">
              <Check size={22} />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Assessment complete
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Your Python baseline
            </h1>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
              <p className="text-5xl font-semibold">
                {percentage}%
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Overall Python knowledge baseline
              </p>

              <div className="mt-8 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-200 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-600">Syntax</p>
                  <p className="mt-1 text-lg font-semibold">
                    {scores.syntaxScore}%
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-600">
                    Data Structures
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {scores.dataStructuresScore}%
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-600">Algorithms</p>
                  <p className="mt-1 text-lg font-semibold">
                    {scores.algorithmsScore}%
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-600">OOP</p>
                  <p className="mt-1 text-lg font-semibold">
                    {scores.oopScore}%
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-zinc-500">
                We'll use this baseline to build your personalized
                Python → Java learning path.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              Build my roadmap
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800/70">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Code2 size={17} strokeWidth={2.5} />
            </div>

            <span className="text-sm font-semibold">
              CodeShift
            </span>
          </div>

          <span className="text-xs text-zinc-500">
            Python → Java
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-200 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <section>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            {currentQuestion.category.replace("-", " ")}
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {currentQuestion.question}
          </h1>

          {currentQuestion.code && (
            <pre className="mt-6 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm leading-7 text-zinc-300">
              <code>{currentQuestion.code}</code>
            </pre>
          )}

          <div className="mt-6 space-y-2">
            {currentQuestion.options.map((option, index) => {
              const active = selected === index;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-sm transition ${
                    active
                      ? "border-zinc-500 bg-zinc-900 text-white"
                      : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-200"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                      active
                        ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                        : "border-zinc-700 text-zinc-600"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  {option}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={selected === null || submitting}
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {submitting
                ? "Saving..."
                : currentIndex === questions.length - 1
                  ? "Finish"
                  : "Next"}

              {!submitting && <ArrowRight size={15} />}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}