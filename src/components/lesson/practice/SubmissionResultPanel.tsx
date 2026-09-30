import { Check } from "lucide-react";
import type { SubmissionResult } from "../../../services/execute";

export default function SubmissionResultPanel({
  submissionResult,
  submitting,
  running,
  code,
  handleSubmit,
}: {
  submissionResult: SubmissionResult | null;
  submitting: boolean;
  running: boolean;
  code: string;
  handleSubmit: () => void;
}) {
  return (
    <div className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {submissionResult ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                {submissionResult.correct ? (
                  <Check size={15} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-zinc-500" />
                )}

                <span>{submissionResult.message}</span>
              </div>

              {!submissionResult.correct &&
                submissionResult.status === "success" &&
                submissionResult.expectedOutput && (
                  <p className="text-xs text-zinc-600">
                    Expected output:{" "}
                    {submissionResult.expectedOutput}
                  </p>
                )}
            </div>
          ) : (
            <p className="text-xs text-zinc-600">
              Submit when you think your solution is correct.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || running || !code.trim()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check size={14} />
          {submitting ? "Checking..." : "Submit solution"}
        </button>
      </div>
    </div>
  );
}
