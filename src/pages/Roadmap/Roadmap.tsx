import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Circle,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getRoadmap,
  type RoadmapProfile,
} from "../../services/roadmap";

import {
  getAllProgress,
  type Progress,
} from "../../services/progress";

export default function Roadmap() {
  const navigate = useNavigate();

  const [roadmap, setRoadmap] =
    useState<RoadmapProfile | null>(null);

  const [progress, setProgress] =
    useState<Progress[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const [roadmapData, progressData] =
          await Promise.all([
            getRoadmap(),
            getAllProgress(),
          ]);

        setRoadmap(roadmapData.roadmap);
        setProgress(progressData.progress);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your roadmap.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-400">
        Loading your roadmap...
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-400">
        {error || "Roadmap unavailable."}
      </div>
    );
  }

  const completedKeys = new Set(
    progress
      .filter((item) => item.completed)
      .map((item) => item.conceptKey),
  );


  const completedCount = roadmap.concepts.filter(
    (concept) => completedKeys.has(concept.key),
  ).length;

  const firstIncompleteIndex =
    roadmap.concepts.findIndex(
      (concept) => !completedKeys.has(concept.key),
    );

  const overallProgress = roadmap.concepts.length
    ? Math.round(
        (completedCount / roadmap.concepts.length) * 100,
      )
    : 0;

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
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-zinc-500">
          Personalized learning path
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {roadmap.sourceLanguage} → {roadmap.targetLanguage}
        </h1>

        <p className="mt-2 text-zinc-400">
          Concepts are ordered based on your assessment and progress.
        </p>
      </div>

      {/* Progress summary */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Roadmap progress
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {overallProgress}%
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {completedCount} of{" "}
              {roadmap.concepts.length} concepts completed
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400">
            {roadmap.skillLevel}
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-200 transition-all"
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Roadmap */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="border-b border-zinc-800 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Your roadmap
          </p>

          <h2 className="mt-1 text-lg font-medium text-white">
            {roadmap.concepts.length} concepts
          </h2>
        </div>

        <div className="divide-y divide-zinc-800">
          {roadmap.concepts.map((concept, index) => {
            const completed = completedKeys.has(
              concept.key,
            );

            const isNext =
              !completed &&
              index === firstIncompleteIndex;

            const isUpcoming =
              !completed && !isNext;

            const lessonAvailable =
              Boolean(lessonMap[concept.key]);

            return (
              <button
                key={concept.key}
                type="button"
                disabled={!lessonAvailable}
                onClick={() =>
                  openConcept(concept.key)
                }
                className={`group flex w-full items-center gap-5 px-6 py-5 text-left transition ${
                  lessonAvailable
                    ? "hover:bg-zinc-900/60"
                    : "cursor-default"
                }`}
              >
                {/* Status icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                    completed
                      ? "border-zinc-600 bg-zinc-800"
                      : isNext
                        ? "border-zinc-500"
                        : "border-zinc-800"
                  }`}
                >
                  {completed ? (
                    <Check
                      className="h-5 w-5 text-white"
                    />
                  ) : isNext ? (
                    <Circle
                      className="h-5 w-5 text-white"
                    />
                  ) : (
                    <Lock
                      className="h-4 w-4 text-zinc-600"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3
                      className={`font-medium ${
                        completed
                          ? "text-zinc-500"
                          : isNext
                            ? "text-white"
                            : "text-zinc-300"
                      }`}
                    >
                      {concept.title}
                    </h3>

                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${
                        completed
                          ? "border-zinc-800 text-zinc-600"
                          : isNext
                            ? "border-zinc-700 text-zinc-300"
                            : "border-zinc-800 text-zinc-600"
                      }`}
                    >
                      {completed
                        ? "Completed"
                        : isNext
                          ? "Next"
                          : "Upcoming"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-zinc-500">
                    {concept.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <span>{concept.category}</span>
                    <span>•</span>
                    <span>
                      Priority {concept.priority}
                    </span>
                  </div>
                </div>

                {/* Action */}
                {lessonAvailable ? (
                  <ArrowRight
                    className={`h-5 w-5 shrink-0 transition ${
                      completed
                        ? "text-zinc-700 group-hover:text-zinc-400"
                        : "text-zinc-600 group-hover:translate-x-1 group-hover:text-white"
                    }`}
                  />
                ) : (
                  <span className="shrink-0 text-xs text-zinc-700">
                    Coming soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}