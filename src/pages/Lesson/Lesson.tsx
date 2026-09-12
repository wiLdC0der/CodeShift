import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Lightbulb,
  Play,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  executeCode,
  submitCode,
  type ExecutionResult,
  type SubmissionResult,
} from "../../services/execute";

import {
  getLessonById,
  type Lesson,
} from "../../data/lessons";

import {
  completeLesson,
  getAllProgress,
  getProgress,
  markLessonVisited,
  type Progress,
} from "../../services/progress";

import {
  interactiveLessons,
  type PracticeQuestion,
} from "../../data/interactiveLessons";

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] =
    useState<Progress | null>(null);
  
  const [questionProgress, setQuestionProgress] =
  useState<Progress[]>([]);

  

  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  const [selectedQuestionId, setSelectedQuestionId] =
    useState("");

  const [showHints, setShowHints] = useState(false);
  const [visibleHints, setVisibleHints] = useState(0);

  const [code, setCode] = useState("");

  const [running, setRunning] = useState(false);

  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  
  const [submissionResult, setSubmissionResult] =
  useState<SubmissionResult | null>(null);

  const [submitting, setSubmitting] =
  useState(false);

  useEffect(() => {
    if (!lessonId) {
      return;
    }

    const currentLesson = getLessonById(lessonId);

    if (!currentLesson) {
      setError("Lesson not found.");
      return;
    }

    setLesson(currentLesson);

    getProgress(currentLesson.conceptKey)
      .then((data) => {
        setProgress(data.progress);
      })
      .catch((err) => {
        console.error(err);
      });


    getAllProgress()
    .then((data) => {
      setQuestionProgress(data.progress);
    })
    .catch((err) => {
      console.error("Unable to load question progress:", err);
    });

    markLessonVisited(currentLesson.conceptKey).catch(
      (err) => {
        console.error(err);
      },
    );
  }, [lessonId]);

  const interactiveLesson = useMemo(() => {
    if (!lesson) {
      return null;
    }

    return interactiveLessons[lesson.conceptKey] ?? null;
  }, [lesson]);

  const practiceQuestions =
    interactiveLesson?.practice ?? [];

  const questionProgressMap = useMemo(() => {
  const map = new Map<string, Progress>();

  for (const item of questionProgress) {
    map.set(item.conceptKey, item);
  }

  return map;
}, [questionProgress]);

const firstIncompleteQuestionIndex = useMemo(() => {
  return practiceQuestions.findIndex(
    (question) =>
      !questionProgressMap.get(
        `${lesson?.conceptKey}:${question.id}`,
      )?.completed,
  );
}, [practiceQuestions, questionProgressMap, lesson?.conceptKey]);

const solvedQuestionCount = useMemo(() => {
  return practiceQuestions.filter(
    (question) =>
      questionProgressMap.get(
        `${lesson?.conceptKey}:${question.id}`,
      )?.completed,
  ).length;
}, [practiceQuestions, questionProgressMap, lesson?.conceptKey]);

const practiceMastery =
  practiceQuestions.length > 0
    ? Math.round(
        (solvedQuestionCount / practiceQuestions.length) * 100,
      )
    : 0;

const selectedQuestion: PracticeQuestion | null =
  practiceQuestions.find(
    (question) => question.id === selectedQuestionId,
  ) ??
  practiceQuestions[
    firstIncompleteQuestionIndex >= 0
      ? firstIncompleteQuestionIndex
      : practiceQuestions.length - 1
  ] ??
  null;

  useEffect(() => {
    if (!selectedQuestion) {
      return;
    }

    setSelectedQuestionId(selectedQuestion.id);
    setCode(selectedQuestion.starterCode);
    setShowHints(false);
    setVisibleHints(0);
    setExecutionResult(null);
    setSubmissionResult(null);
  }, [selectedQuestion]);
      async function handleComplete() {
        if (
          !lesson ||
          completing ||
          solvedQuestionCount < practiceQuestions.length
        ) {
          return;
        }

  try {
      setCompleting(true);

      const data = await completeLesson(
        lesson.conceptKey,
      );

      setProgress(data.progress);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save progress.",
      );
    } finally {
      setCompleting(false);
    }
  }

  async function handleRunCode() {
    if (running || !code.trim()) {
      return;
    }

    try {
      setRunning(true);
      setExecutionResult(null);

      const result = await executeCode(code);
      setExecutionResult(result);
    } catch (err) {
      setExecutionResult({
        status: "runtime_error",
        output:
          err instanceof Error
            ? err.message
            : "Unable to execute code.",
      });
    } finally {
      setRunning(false);
    }
  }

function handleQuestionChange(
  question: PracticeQuestion,
) {
  const questionIndex =
    practiceQuestions.findIndex(
      (item) => item.id === question.id,
    );

  if (
    firstIncompleteQuestionIndex !== -1 &&
    questionIndex > firstIncompleteQuestionIndex
  ) {
    return;
  }

  setSelectedQuestionId(question.id);
  setCode(question.starterCode);
  setShowHints(false);
  setVisibleHints(0);
  setExecutionResult(null);
}

async function handleSubmit() {
  if (
    !selectedQuestion ||
    !lesson ||
    submitting ||
    running ||
    !code.trim()
  ) {
    return;
  }

  try {
    setSubmitting(true);
    setSubmissionResult(null);

    const result = await submitCode(
      code,
      selectedQuestion.id,
    );

    setSubmissionResult(result);

    // Only progress when the solution is correct.
    if (!result.correct) {
      return;
    }

    const progressKey =
      `${lesson.conceptKey}:${selectedQuestion.id}`;

    // Save this question as completed.
    const data = await completeLesson(progressKey);

    setQuestionProgress((current) => {
      const existingIndex = current.findIndex(
        (item) => item.conceptKey === progressKey,
      );

      if (existingIndex === -1) {
        return [...current, data.progress];
      }

      const updated = [...current];
      updated[existingIndex] = data.progress;

      return updated;
    });

    // Find the current question.
    const currentIndex = practiceQuestions.findIndex(
      (question) => question.id === selectedQuestion.id,
    );

    const nextIndex = currentIndex + 1;

    // If this was the final question, complete the entire lesson.
    if (nextIndex >= practiceQuestions.length) {
      const lessonData = await completeLesson(
        lesson.conceptKey,
      );

      setProgress(lessonData.progress);

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

      return;
    }

    // Otherwise move automatically to the next question.
    const nextQuestion =
      practiceQuestions[nextIndex];

    setTimeout(() => {
      setSelectedQuestionId(nextQuestion.id);
    }, 500);
  } catch (err) {
    setSubmissionResult({
      correct: false,
      status: "runtime_error",
      output:
        err instanceof Error
          ? err.message
          : "Unable to submit solution.",
      message: "Unable to submit your solution.",
    });
  } finally {
    setSubmitting(false);
  }
}

  function showNextHint() {
    if (!selectedQuestion) {
      return;
    }

    setVisibleHints((current) =>
      Math.min(
        current + 1,
        selectedQuestion.hints.length,
      ),
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <div>
          <h1 className="text-xl font-semibold">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            {error}
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-300"
          >
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-500">
        Loading lesson...
      </div>
    );
  }

  const completed = progress?.completed ?? false;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Code2 size={15} />
            </div>

            <span className="text-sm font-semibold">
              CodeShift
            </span>
          </div>

          <div className="text-xs text-zinc-500">
            {progress?.mastery ?? 0}% mastery
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Lesson header */}
        <section className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
            {lesson.category}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {lesson.title}
          </h1>

          <p className="mt-3 text-base leading-7 text-zinc-500">
            {lesson.subtitle}
          </p>
        </section>

        {/* Python / Java comparison */}
        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <div className="border-b border-zinc-800 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-zinc-600">
                You already know
              </p>

              <h2 className="mt-1 font-semibold text-white">
                {lesson.python.title}
              </h2>
            </div>

            <pre className="overflow-x-auto border-b border-zinc-800 bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
              <code>{lesson.python.code}</code>
            </pre>

            <div className="p-5">
              <p className="text-sm leading-7 text-zinc-500">
                {lesson.python.explanation}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <div className="border-b border-zinc-800 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-zinc-600">
                What you're learning
              </p>

              <h2 className="mt-1 font-semibold text-white">
                {lesson.java.title}
              </h2>
            </div>

            <pre className="overflow-x-auto border-b border-zinc-800 bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
              <code>{lesson.java.code}</code>
            </pre>

            <div className="p-5">
              <p className="text-sm leading-7 text-zinc-500">
                {lesson.java.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Key differences */}
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
          <div className="flex items-center gap-2">
            <Lightbulb size={17} className="text-zinc-400" />

            <h2 className="font-semibold text-white">
              What changes when you move to Java?
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {lesson.keyDifferences.map(
              (difference) => (
                <div
                  key={difference}
                  className="flex gap-3 text-sm leading-6 text-zinc-500"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />

                  <p>{difference}</p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Learning objectives */}
        {interactiveLesson && (
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              What you'll master
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {interactiveLesson.learningObjectives.map(
                (objective) => (
                  <div
                    key={objective}
                    className="flex gap-3 text-sm leading-6 text-zinc-400"
                  >
                    <Check
                      size={16}
                      className="mt-1 shrink-0 text-zinc-500"
                    />

                    <span>{objective}</span>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {/* Examples */}
        {interactiveLesson && (
          <section className="mt-10">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                Examples
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Translate the operations you already know.
              </h2>
            </div>

            <div className="space-y-4">
              {interactiveLesson.examples.map(
                (example) => (
                  <div
                    key={example.title}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30"
                  >
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="font-medium text-white">
                        {example.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        {example.explanation}
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2">
                      <div className="border-b border-zinc-800 lg:border-b-0 lg:border-r">
                        <div className="border-b border-zinc-800 px-5 py-3">
                          <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                            Python
                          </span>
                        </div>

                        <pre className="overflow-x-auto bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
                          <code>
                            {example.python}
                          </code>
                        </pre>
                      </div>

                      <div>
                        <div className="border-b border-zinc-800 px-5 py-3">
                          <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                            Java
                          </span>
                        </div>

                        <pre className="overflow-x-auto bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
                          <code>
                            {example.java}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {/* Under the hood */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              Under the hood
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Same goal. Different runtime model.
            </h2>
          </div>

          {interactiveLesson ? (
            <div className="space-y-3">
              {interactiveLesson.underTheHood.map(
                (item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6"
                  >
                    <h3 className="font-medium text-zinc-200">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-zinc-500">
                      {item.explanation}
                    </p>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                <p className="text-sm font-medium text-zinc-300">
                  Python
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  {lesson.underTheHood.python}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                <p className="text-sm font-medium text-zinc-300">
                  Java
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  {lesson.underTheHood.java}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Common mistakes */}
        {interactiveLesson && (
          <section className="mt-10">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                Common mistakes
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Watch for these when switching from Python.
              </h2>
            </div>

            <div className="space-y-3">
              {interactiveLesson.commonMistakes.map(
                (item) => (
                  <div
                    key={item.mistake}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5"
                  >
                    <p className="font-medium text-zinc-200">
                      {item.mistake}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {item.explanation}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {/* Practice */}
        {interactiveLesson && selectedQuestion && (
          <section className="mt-10">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                Practice
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Now write the Java yourself.
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Work through the questions in order. Start
                with the easy problems before moving to the
                harder ones.
              </p>
            </div>
            <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Practice Progress
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {solvedQuestionCount} of {practiceQuestions.length} questions solved
                    </p>
                  </div>

                  <span className="text-lg font-semibold text-white">
                    {practiceMastery}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${practiceMastery}%` }}
                  />
                </div>
              </div>
            {/* Question selector */}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {practiceQuestions.map((question, index) => {
    const progressKey = `${lesson.conceptKey}:${question.id}`;

    const questionProgress =
      questionProgressMap.get(progressKey);

    const isCompleted =
      questionProgress?.completed ?? false;

    const isLocked =
      firstIncompleteQuestionIndex !== -1 &&
      index > firstIncompleteQuestionIndex;

    const isSelected =
      selectedQuestion?.id === question.id;

    return (
      <button
        key={question.id}
        type="button"
        disabled={isLocked}
        onClick={() => {
          if (!isLocked) {
            handleQuestionChange(question);
          }
        }}
        className={`rounded-lg border px-4 py-3 text-left transition ${
          isLocked
            ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-40"
            : isSelected
              ? "border-white/20 bg-white/[0.08]"
              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
        }`}
      >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Question {index + 1}
              </span>

              {isCompleted && (
                <span className="text-xs text-emerald-400">
                  Solved
                </span>
              )}

              {isLocked && (
                <span className="text-xs text-zinc-500">
                  Locked
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-zinc-500">
              {question.difficulty}
            </p>
          </button>
             );
             })}
           </div>

            {/* Selected question */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800">
              <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md border border-zinc-700 px-2 py-1 text-[11px] uppercase tracking-wider text-zinc-500">
                    {selectedQuestion.difficulty}
                  </span>

                  <h3 className="font-semibold text-white">
                    {selectedQuestion.title}
                  </h3>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                  {selectedQuestion.prompt}
                </p>
              </div>

              {/* Hints */}
              <div className="border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() =>
                    setShowHints((current) => !current)
                  }
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb
                      size={16}
                      className="text-zinc-500"
                    />

                    <span className="text-sm font-medium text-zinc-300">
                      Progressive hints
                    </span>
                  </div>

                  {showHints ? (
                    <ChevronUp
                      size={16}
                      className="text-zinc-600"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-zinc-600"
                    />
                  )}
                </button>

                {showHints && (
                  <div className="border-t border-zinc-800 px-6 py-5">
                    <div className="space-y-3">
                      {selectedQuestion.hints
                        .slice(0, visibleHints)
                        .map((hint, index) => (
                          <div
                            key={hint}
                            className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                          >
                            <span className="text-xs text-zinc-600">
                              {index + 1}
                            </span>

                            <p className="text-sm leading-6 text-zinc-400">
                              {hint}
                            </p>
                          </div>
                        ))}
                    </div>

                    {visibleHints <
                      selectedQuestion.hints
                        .length && (
                      <button
                        type="button"
                        onClick={showNextHint}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900"
                      >
                        <Lightbulb size={14} />
                        Show next hint
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Code editor */}
              <div className="bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Code2
                      size={15}
                      className="text-zinc-600"
                    />

                    <span className="text-xs text-zinc-500">
                      Java
                    </span>
                  </div>

                  <span className="text-[11px] text-zinc-700">
                    Java 17
                  </span>
                </div>

                <Editor
                  height="420px"
                  language="java"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) =>
                    setCode(value ?? "")
                  }
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    fontSize: 14,
                    lineNumbers: "on",
                    automaticLayout: true,
                    padding: {
                      top: 16,
                      bottom: 16,
                    },
                    scrollBeyondLastLine: false,
                    tabSize: 4,
                    wordWrap: "on",
                  }}
                />
              </div>

              {/* Run controls */}
              <div className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {running ? (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-500" />
                        Running your Java code...
                      </div>
                    ) : executionResult ? (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {executionResult.status === "success" ? (
                          <>
                            <Check size={15} />
                            Program finished successfully.
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-zinc-500" />
                            Program finished with{" "}
                            {executionResult.status.replace(
                              "_",
                              " ",
                            )}
                            .
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Play size={13} />
                        Run your code to see the output.
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={running || !code.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Play size={14} />
                    {running ? "Running..." : "Run code"}
                  </button>
                </div>
              </div>

              {/* Output */}
              {executionResult && (
                <div className="border-t border-zinc-800 bg-zinc-950">
                  <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Output
                    </span>

                    <span className="text-[11px] text-zinc-700">
                      {executionResult.status === "success"
                        ? "Success"
                        : executionResult.status
                            .replace("_", " ")
                            .toUpperCase()}
                    </span>
                  </div>

                  <pre className="min-h-[100px] overflow-x-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-zinc-300">
                    {executionResult.output ||
                      "(Program produced no output)"}
                  </pre>
                </div>
              )}

              {/* Submission */}
              <div className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    {submissionResult ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                          {submissionResult.correct ? (
                            <Check size={15} />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-zinc-500" />
                          )}

                          <span>
                            {submissionResult.message}
                          </span>
                        </div>

                        {!submissionResult.correct &&
                          submissionResult.status === "success" &&
                          submissionResult.expectedOutput && (
                            <p className="text-xs text-zinc-600">
                              Expected output:{" "}
                              {submissionResult.expectedOutput}
                            </p>
                          )}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600">
                        Submit when you think your solution is correct.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      submitting ||
                      running ||
                      !code.trim()
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check size={14} />

                    {submitting
                      ? "Checking..."
                      : "Submit solution"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Completion */}
        <section className="mt-10 border-t border-zinc-800 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Finished studying this lesson?
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Complete it to record your progress.
              </p>
            </div>

            <button
              type="button"
              onClick={handleComplete}
              disabled={
                          completing ||
                          completed ||
                          solvedQuestionCount < practiceQuestions.length
                        }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {completed ? (
                <>
                  <Check size={14} />
                  Lesson completed
                </>
              ) : completing ? (
                "Saving..."
              ) : (
                <>
                  Mark lesson complete
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}