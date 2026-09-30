import type { ExecutionResult } from "../../../services/execute";

export default function ExecutionOutput({
  executionResult,
}: {
  executionResult: ExecutionResult | null;
}) {
  if (!executionResult) {
    return null;
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
          Output
        </span>

        <span className="text-[11px] text-zinc-700">
          {executionResult.status === "success"
            ? "Success"
            : executionResult.status
                .replace("_", " ")
                .toUpperCase()}
        </span>
      </div>

      <pre className="min-h-[100px] overflow-x-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-zinc-300">
        {executionResult.output ||
          "(Program produced no output)"}
      </pre>
    </div>
  );
}
