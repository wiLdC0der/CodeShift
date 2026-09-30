import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
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
  getRoadmap,
  getConceptStatus,
} from "../../services/roadmap";

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

import LanguageComparison from "../../components/lesson/LanguageComparison";
import KeyDifferences from "../../components/lesson/KeyDifferences";
import LearningObjectives from "../../components/lesson/LearningObjectives";
import LessonExamples from "../../components/lesson/LessonExamples";
import UnderTheHood from "../../components/lesson/UnderTheHood";
import CommonMistakes from "../../components/lesson/CommonMistakes";
import PracticeProgress from "../../components/lesson/practice/PracticeProgress";
import QuestionSelector from "../../components/lesson/practice/QuestionSelector";
import ExecutionOutput from "../../components/lesson/practice/ExecutionOutput";
import SubmissionResultPanel from "../../components/lesson/practice/SubmissionResultPanel";
import LessonCompletion from "../../components/lesson/LessonCompletion";

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

    async function loadData() {
      try {
        const [progressData, allProgressData, roadmapData] = await Promise.all([
          getProgress(currentLesson!.conceptKey),
          getAllProgress(),
          getRoadmap(),
        ]);

        const status = getConceptStatus(
          roadmapData.roadmap,
          allProgressData.progress,
          currentLesson!.conceptKey
        );

        if (status === "upcoming") {
          navigate("/roadmap");
          return;
        }

        setProgress(progressData.progress);
        setQuestionProgress(allProgressData.progress);

        await markLessonVisited(currentLesson!.conceptKey);
      } catch (err) {
        console.error(err);
        setError("Unable to load lesson data.");
      }
    }

    loadData();
  }, [lessonId, navigate]);

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
      selectedQuestion.expectedOutput
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

        <LanguageComparison python={lesson.python} java={lesson.java} />

        <KeyDifferences differences={lesson.keyDifferences} />

        {interactiveLesson && (
          <LearningObjectives objectives={interactiveLesson.learningObjectives} />
        )}

        {interactiveLesson && (
          <LessonExamples examples={interactiveLesson.examples} />
        )}

        <UnderTheHood 
          interactiveUnderTheHood={interactiveLesson?.underTheHood} 
          lessonUnderTheHood={lesson.underTheHood} 
        />

        {interactiveLesson && (
          <CommonMistakes mistakes={interactiveLesson.commonMistakes} />
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
              <PracticeProgress 
                solvedCount={solvedQuestionCount} 
                totalCount={practiceQuestions.length} 
                mastery={practiceMastery} 
              />
            <QuestionSelector
              practiceQuestions={practiceQuestions}
              lessonConceptKey={lesson.conceptKey}
              questionProgressMap={questionProgressMap}
              firstIncompleteQuestionIndex={firstIncompleteQuestionIndex}
              selectedQuestionId={selectedQuestion?.id}
              onQuestionChange={handleQuestionChange}
            />

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

              <ExecutionOutput executionResult={executionResult} />

              <SubmissionResultPanel
                submissionResult={submissionResult}
                submitting={submitting}
                running={running}
                code={code}
                handleSubmit={handleSubmit}
              />
            </div>
          </section>
        )}

        {/* Completion */}
        <LessonCompletion
          handleComplete={handleComplete}
          completing={completing}
          completed={completed}
          solvedQuestionCount={solvedQuestionCount}
          practiceQuestionsLength={practiceQuestions.length}
        />
      </main>
    </div>
  );
}