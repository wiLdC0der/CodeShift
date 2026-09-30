import type { Lesson } from "../../data/lessons";

export default function UnderTheHood({
  interactiveUnderTheHood,
  lessonUnderTheHood,
}: {
  interactiveUnderTheHood?: { title: string; explanation: string }[];
  lessonUnderTheHood: Lesson["underTheHood"];
}) {
  return (
    <section className="mt-10">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
          Under the hood
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Same goal. Different runtime model.
        </h2>
      </div>

      {interactiveUnderTheHood && interactiveUnderTheHood.length > 0 ? (
        <div className="space-y-3">
          {interactiveUnderTheHood.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6"
            >
              <h3 className="font-medium text-zinc-200">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="text-sm font-medium text-zinc-300">
              Python
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {lessonUnderTheHood.python}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="text-sm font-medium text-zinc-300">
              Java
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {lessonUnderTheHood.java}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
