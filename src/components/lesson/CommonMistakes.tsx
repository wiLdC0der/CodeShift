export default function CommonMistakes({
  mistakes,
}: {
  mistakes?: { mistake: string; explanation: string }[];
}) {
  if (!mistakes || mistakes.length === 0) {
    return null;
  }

  return (
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
        {mistakes.map((item) => (
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
        ))}
      </div>
    </section>
  );
}
