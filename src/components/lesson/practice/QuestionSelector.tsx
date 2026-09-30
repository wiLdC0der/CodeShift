import type { PracticeQuestion } from "../../../data/interactiveLessons";
import type { Progress } from "../../../services/progress";

export default function QuestionSelector({
  practiceQuestions,
  lessonConceptKey,
  questionProgressMap,
  firstIncompleteQuestionIndex,
  selectedQuestionId,
  onQuestionChange,
}: {
  practiceQuestions: PracticeQuestion[];
  lessonConceptKey: string;
  questionProgressMap: Map<string, Progress>;
  firstIncompleteQuestionIndex: number;
  selectedQuestionId?: string;
  onQuestionChange: (question: PracticeQuestion) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {practiceQuestions.map((question, index) => {
        const progressKey = `${lessonConceptKey}:${question.id}`;
        const questionProgress = questionProgressMap.get(progressKey);
        const isCompleted = questionProgress?.completed ?? false;

        const isLocked =
          firstIncompleteQuestionIndex !== -1 &&
          index > firstIncompleteQuestionIndex;

        const isSelected = selectedQuestionId === question.id;

        return (
          <button
            key={question.id}
            type="button"
            disabled={isLocked}
            onClick={() => {
              if (!isLocked) {
                onQuestionChange(question);
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
  );
}
