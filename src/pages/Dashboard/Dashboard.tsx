import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Flame,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRoadmap,
  type RoadmapProfile,
} from "../../services/roadmap";

import {
  getAllProgress,
  type Progress,
} from "../../services/progress";

export default function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<RoadmapProfile | null>(null);

  const [progress, setProgress] =
    useState<Progress[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [roadmapData, progressData] =
          await Promise.all([
            getRoadmap(),
            getAllProgress(),
          ]);

        setProfile(roadmapData.roadmap);
        setProgress(progressData.progress);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-500">
        Loading your learning path...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Unable to load your dashboard
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            {error || "Learning profile not found."}
          </p>
        </div>
      </div>
    );
  }

  const {
    sourceLanguage,
    targetLanguage,
    skillLevel,
    scores,
    concepts,
  } = profile;

  const completedKeys = new Set(
    progress
      .filter((item) => item.completed)
      .map((item) => item.conceptKey),
  );

  const completedLessons = progress.filter(
    (item) => item.completed,
  ).length;

  const firstIncompleteIndex = concepts.findIndex(
    (concept) => !completedKeys.has(concept.key),
  );

  const nextConcept =
    firstIncompleteIndex === -1
      ? concepts[concepts.length - 1]
      : concepts[firstIncompleteIndex];

const lessonMap: Record<string, string> = {
  "java-types": "types-to-types",
  "java-control-flow": "control-flow-to-control-flow",
  "java-methods": "functions-to-methods",
  "java-arraylist": "lists-to-arraylist",
  "java-hashmap": "dictionary-to-hashmap",
  "java-hashset": "set-to-hashset",
  "java-classes": "classes-to-objects",
  "java-inheritance": "inheritance-python-to-java",
  "java-interfaces": "interfaces-python-to-java",
  "java-generics": "generics-python-to-java",
  "java-sorting": "sorting-python-to-java",
  "java-binary-search": "binary-search-python-to-java",
  "java-recursion": "recursion-python-to-java",
  "java-arrays": "list-to-array",
};
  function openConcept(conceptKey: string) {
    const lessonId = lessonMap[conceptKey];

    if (lessonId) {
      navigate(`/learn/${lessonId}`);
      return;
    }

    navigate("/roadmap");
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      {/* Header */}
      <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm text-zinc-500">
            Welcome back
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Continue your transition to {targetLanguage}.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Pick up where you left off. Your roadmap adapts as
            your knowledge improves.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-xs text-zinc-400">
            Learning path active
          </span>
        </div>
      </section>

      {/* Main progress */}
      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex flex-col justify-between gap-6 sm:flex-row">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                Current path
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300">
                  {sourceLanguage}
                </span>

                <ArrowRight
                  size={15}
                  className="text-zinc-600"
                />

                <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300">
                  {targetLanguage}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                {skillLevel.toLowerCase()} transition
              </h2>
            </div>

            <div className="sm:text-right">
              <p className="text-3xl font-semibold tracking-tight text-white">
                {scores.overallScore}%
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Python baseline
              </p>
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Assessment score
              </span>

              <span className="text-xs font-medium text-zinc-300">
                {scores.overallScore}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-200 transition-all"
                style={{
                  width: `${scores.overallScore}%`,
                }}
              />
            </div>
          </div>

          {/* Skill breakdown */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs text-zinc-600">
                Syntax
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {scores.syntaxScore}%
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs text-zinc-600">
                Data Structures
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {scores.dataStructuresScore}%
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs text-zinc-600">
                Algorithms
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {scores.algorithmsScore}%
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs text-zinc-600">
                OOP
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {scores.oopScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Continue learning */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Continue learning
          </p>

          <h2 className="mt-3 text-lg font-semibold text-white">
            {nextConcept?.title ?? "Start learning"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {nextConcept?.description ??
              "Your personalized next concept will appear here."}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              {completedLessons === concepts.length
                ? "Roadmap complete"
                : "Next recommended concept"}
            </span>

            <button
              type="button"
              onClick={() =>
                nextConcept &&
                openConcept(nextConcept.key)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              {completedLessons === concepts.length
                ? "Review"
                : "Continue"}

              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Flame size={16} />

            <span className="text-xs">
              Current streak
            </span>
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            0 days
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Your learning streak starts here.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <BookOpen size={16} />

            <span className="text-xs">
              Lessons completed
            </span>
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            {completedLessons}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            {completedLessons === 0
              ? "Start your first lesson."
              : `${completedLessons} lesson${
                  completedLessons === 1 ? "" : "s"
                } completed.`}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Target size={16} />

            <span className="text-xs">
              Learning progress
            </span>
          </div>

          <p className="mt-3 text-2xl font-semibold text-white">
            {concepts.length
              ? Math.round(
                  (completedLessons / concepts.length) * 100,
                )
              : 0}
            %
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            {completedLessons} of {concepts.length} roadmap concepts
            completed.
          </p>
        </div>
      </section>

      {/* Personalized roadmap */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20">
        <div className="border-b border-zinc-800 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Your roadmap
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {sourceLanguage} knowledge → {targetLanguage} fluency
            </h2>

            <button
              type="button"
              onClick={() => navigate("/roadmap")}
              className="hidden items-center gap-1 text-xs text-zinc-500 transition hover:text-zinc-300 sm:flex"
            >
              View full roadmap
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/70">
          {concepts.map((item, index) => {
            const completed = completedKeys.has(item.key);

            const isCurrent =
              !completed &&
              index === firstIncompleteIndex;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => openConcept(item.key)}
                className={`flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition ${
                  isCurrent
                    ? "bg-zinc-900/70"
                    : "hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  {completed ? (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 text-xs text-white">
                      ✓
                    </div>
                  ) : isCurrent ? (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-500 bg-zinc-800 text-xs font-semibold text-white">
                      →
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-[10px] text-zinc-600">
                      {index + 1}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3
                      className={`truncate text-sm font-medium ${
                        completed
                          ? "text-zinc-500 line-through"
                          : isCurrent
                            ? "text-white"
                            : "text-zinc-300"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-zinc-600">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                    completed
                      ? "border-zinc-800 text-zinc-600"
                      : isCurrent
                        ? "border-zinc-700 bg-zinc-800 text-zinc-300"
                        : "border-zinc-800 text-zinc-600"
                  }`}
                >
                  {completed
                    ? "Completed"
                    : isCurrent
                      ? "Next"
                      : "Upcoming"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}