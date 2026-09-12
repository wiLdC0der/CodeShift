import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Lightbulb,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getLessonById,
  type Lesson,
} from "../../data/lessons";

import {
  completeLesson,
  getProgress,
  markLessonVisited,
  type Progress,
} from "../../services/progress";

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] =
    useState<Progress | null>(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

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

    markLessonVisited(currentLesson.conceptKey).catch(
      (err) => {
        console.error(err);
      },
    );
  }, [lessonId]);

  async function handleComplete() {
    if (!lesson || completing) {
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
            {lesson.keyDifferences.map((difference) => (
              <div
                key={difference}
                className="flex gap-3 text-sm leading-6 text-zinc-500"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />

                <p>{difference}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Under the hood */}
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              Under the hood
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Same goal. Different runtime model.
            </h2>
          </div>

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
        </section>

        {/* Exercise */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800">
          <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              Practice
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Translate what you already know.
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {lesson.exercise.prompt}
            </p>
          </div>

          <pre className="overflow-x-auto bg-zinc-950 p-6 text-sm leading-7 text-zinc-400">
            <code>{lesson.exercise.starterCode}</code>
          </pre>

          <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/30 px-6 py-4">
            <span className="text-xs text-zinc-600">
              Coding playground coming next
            </span>

            <button
              type="button"
              onClick={handleComplete}
              disabled={completing || completed}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {completed ? (
                <>
                  <Check size={14} />
                  Completed
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