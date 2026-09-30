import { Check } from "lucide-react";

export default function LearningObjectives({
  objectives,
}: {
  objectives: string[];
}) {
  if (!objectives || objectives.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
        What you'll master
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {objectives.map((objective) => (
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
        ))}
      </div>
    </section>
  );
}
