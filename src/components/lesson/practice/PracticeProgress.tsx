export default function PracticeProgress({
  solvedCount,
  totalCount,
  mastery,
}: {
  solvedCount: number;
  totalCount: number;
  mastery: number;
}) {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            Practice Progress
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {solvedCount} of {totalCount} questions solved
          </p>
        </div>

        <span className="text-lg font-semibold text-white">
          {mastery}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{ width: `${mastery}%` }}
        />
      </div>
    </div>
  );
}
