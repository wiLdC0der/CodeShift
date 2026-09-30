import type { LessonExample } from "../../data/interactiveLessons";

export default function LessonExamples({
  examples,
}: {
  examples: LessonExample[];
}) {
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
          Examples
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Translate the operations you already know.
        </h2>
      </div>

      <div className="space-y-4">
        {examples.map((example) => (
          <div
            key={example.title}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30"
          >
            <div className="border-b border-zinc-800 px-6 py-4">
              <h3 className="font-medium text-white">
                {example.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                {example.explanation}
              </p>
            </div>

            <div className="grid lg:grid-cols-2">
              <div className="border-b border-zinc-800 lg:border-b-0 lg:border-r">
                <div className="border-b border-zinc-800 px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                    Python
                  </span>
                </div>
                <pre className="overflow-x-auto bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
                  <code>{example.python}</code>
                </pre>
              </div>

              <div>
                <div className="border-b border-zinc-800 px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                    Java
                  </span>
                </div>
                <pre className="overflow-x-auto bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
                  <code>{example.java}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
