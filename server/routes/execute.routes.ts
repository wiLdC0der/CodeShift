import { Router } from "express";
import { spawn } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

const MAX_EXECUTION_TIME = 5000;
const MAX_OUTPUT_LENGTH = 10_000;
const MAX_CODE_LENGTH = 50_000;

type ExecutionStatus =
  | "success"
  | "compile_error"
  | "runtime_error"
  | "timeout";

type ExecutionResult = {
  status: ExecutionStatus;
  output: string;
};

const expectedOutputs: Record<string, string> = {
  "arraylist-easy-1": "[10, 20, 30]",

  "arraylist-easy-2":
    "[10, 20, 30, 40]",

  "arraylist-easy-3":
    "15",

  "arraylist-easy-4":
    "[10, 50, 30]",

  "arraylist-medium-1":
    "100",

  "arraylist-hard-1":
    "[25, 30, 40]",
};

router.post(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { code } = req.body;

    if (typeof code !== "string") {
      return res.status(400).json({
        message: "Java code is required.",
      });
    }

    if (!code.trim()) {
      return res.status(400).json({
        message: "Java code cannot be empty.",
      });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        message: "Code is too large.",
      });
    }

    const result = await executeJava(code);

    return res.json(result);
  },
);

router.post(
  "/submit",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const { code, questionId } = req.body;

    if (typeof code !== "string") {
      return res.status(400).json({
        message: "Java code is required.",
      });
    }

    if (typeof questionId !== "string") {
      return res.status(400).json({
        message: "Question ID is required.",
      });
    }

    if (!code.trim()) {
      return res.status(400).json({
        message: "Java code cannot be empty.",
      });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        message: "Code is too large.",
      });
    }

    const expectedOutput =
      expectedOutputs[questionId];

    if (expectedOutput === undefined) {
      return res.status(404).json({
        message: "Practice question not found.",
      });
    }

    const result = await executeJava(code);

    if (result.status !== "success") {
      return res.json({
        correct: false,
        status: result.status,
        output: result.output,
        message:
          "Your solution could not be accepted because the program did not execute successfully.",
      });
    }

    const actualOutput = normalizeOutput(
      result.output,
    );

    const expected = normalizeOutput(
      expectedOutput,
    );

    const correct = actualOutput === expected;

    return res.json({
      correct,
      status: result.status,
      output: result.output,
      expectedOutput,
      message: correct
        ? "Correct solution."
        : "The program ran, but the output does not match the expected result.",
    });
  },
);

async function executeJava(
  code: string,
): Promise<ExecutionResult> {
  const executionId = crypto.randomUUID();

  const tempDirectory = path.join(
    os.tmpdir(),
    "codeshift",
    executionId,
  );

  const sourceFile = path.join(
    tempDirectory,
    "Main.java",
  );

  try {
    await fs.mkdir(tempDirectory, {
      recursive: true,
    });

    await fs.writeFile(
      sourceFile,
      code,
      "utf8",
    );

    return await compileAndRun(
      tempDirectory,
    );
  } catch (error) {
    console.error(
      "Code execution failed:",
      error,
    );

    return {
      status: "runtime_error",
      output: "Unable to execute code.",
    };
  } finally {
    await fs.rm(tempDirectory, {
      recursive: true,
      force: true,
    });
  }
}

function compileAndRun(
  workingDirectory: string,
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const compile = spawn(
      "javac",
      ["Main.java"],
      {
        cwd: workingDirectory,
        shell: false,
      },
    );

    let compileOutput = "";

    compile.stdout.on("data", (data) => {
      compileOutput += data.toString();
    });

    compile.stderr.on("data", (data) => {
      compileOutput += data.toString();
    });

    const compileTimer = setTimeout(() => {
      compile.kill();

      resolve({
        status: "timeout",
        output: "Compilation timed out.",
      });
    }, MAX_EXECUTION_TIME);

    compile.on("error", (error) => {
      clearTimeout(compileTimer);

      resolve({
        status: "compile_error",
        output: error.message,
      });
    });

    compile.on("close", (exitCode) => {
      clearTimeout(compileTimer);

      if (exitCode !== 0) {
        resolve({
          status: "compile_error",
          output: truncateOutput(
            compileOutput,
          ),
        });

        return;
      }

      runJava(
        workingDirectory,
        resolve,
      );
    });
  });
}

function runJava(
  workingDirectory: string,
  resolve: (
    value: ExecutionResult,
  ) => void,
) {
  const run = spawn(
    "java",
    ["Main"],
    {
      cwd: workingDirectory,
      shell: false,
    },
  );

  let output = "";

  run.stdout.on("data", (data) => {
    output += data.toString();

    if (
      output.length >
      MAX_OUTPUT_LENGTH
    ) {
      run.kill();
    }
  });

  run.stderr.on("data", (data) => {
    output += data.toString();

    if (
      output.length >
      MAX_OUTPUT_LENGTH
    ) {
      run.kill();
    }
  });

  const timer = setTimeout(() => {
    run.kill();

    resolve({
      status: "timeout",
      output: "Execution timed out.",
    });
  }, MAX_EXECUTION_TIME);

  run.on("error", (error) => {
    clearTimeout(timer);

    resolve({
      status: "runtime_error",
      output: error.message,
    });
  });

  run.on("close", (exitCode) => {
    clearTimeout(timer);

    if (
      output.length >
      MAX_OUTPUT_LENGTH
    ) {
      resolve({
        status: "runtime_error",
        output:
          "Program output exceeded the 10,000 character limit.",
      });

      return;
    }

    resolve({
      status:
        exitCode === 0
          ? "success"
          : "runtime_error",
      output: truncateOutput(output),
    });
  });
}

function normalizeOutput(
  output: string,
) {
  return output
    .replace(/\r\n/g, "\n")
    .trim();
}

function truncateOutput(
  output: string,
) {
  if (
    output.length <=
    MAX_OUTPUT_LENGTH
  ) {
    return output;
  }

  return (
    output.slice(
      0,
      MAX_OUTPUT_LENGTH,
    ) +
    "\n\n[Output truncated]"
  );
}

export default router;