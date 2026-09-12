export type ExecutionResult = {
  status:
    | "success"
    | "compile_error"
    | "runtime_error"
    | "timeout";
  output: string;
};

export type SubmissionResult = {
  correct: boolean;
  status:
    | "success"
    | "compile_error"
    | "runtime_error"
    | "timeout";
  output: string;
  expectedOutput?: string;
  message: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000/api";

export async function executeCode(
  code: string,
): Promise<ExecutionResult> {
  const response = await fetch(
    `${API_BASE_URL}/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Unable to execute code.",
    );
  }

  return data;
}

export async function submitCode(
  code: string,
  questionId: string,
): Promise<SubmissionResult> {
  const response = await fetch(
    `${API_BASE_URL}/execute/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code,
        questionId,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Unable to submit solution.",
    );
  }

  return data;
}