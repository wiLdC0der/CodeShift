import type { Lesson } from "../../data/lessons";

export default function LanguageComparison({
  python,
  java,
}: {
  python: Lesson["python"];
  java: Lesson["java"];
}) {
  return (
    <section className="mt-10 grid gap-4 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30">
        <div className="border-b border-zinc-800 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            You already know
          </p>
          <h2 className="mt-1 font-semibold text-white">
            {python.title}
          </h2>
        </div>
        <pre className="overflow-x-auto border-b border-zinc-800 bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
          <code>{python.code}</code>
        </pre>
        <div className="p-5">
          <p className="text-sm leading-7 text-zinc-500">
            {python.explanation}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30">
        <div className="border-b border-zinc-800 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            What you're learning
          </p>
          <h2 className="mt-1 font-semibold text-white">
            {java.title}
          </h2>
        </div>
        <pre className="overflow-x-auto border-b border-zinc-800 bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
          <code>{java.code}</code>
        </pre>
        <div className="p-5">
          <p className="text-sm leading-7 text-zinc-500">
            {java.explanation}
          </p>
        </div>
      </div>
    </section>
  );
}
