import { ArrowRight, Check } from "lucide-react";

export default function LessonCompletion({
  handleComplete,
  completing,
  completed,
  solvedQuestionCount,
  practiceQuestionsLength,
}: {
  handleComplete: () => void;
  completing: boolean;
  completed: boolean;
  solvedQuestionCount: number;
  practiceQuestionsLength: number;
}) {
  return (
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
            solvedQuestionCount < practiceQuestionsLength
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
  );
}
