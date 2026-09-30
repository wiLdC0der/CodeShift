import { Lightbulb } from "lucide-react";

export default function KeyDifferences({
  differences,
}: {
  differences: string[];
}) {
  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
      <div className="flex items-center gap-2">
        <Lightbulb size={17} className="text-zinc-400" />
        <h2 className="font-semibold text-white">
          What changes when you move to Java?
        </h2>
      </div>

      <div className="mt-5 space-y-3">
        {differences.map((difference) => (
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
  );
}
