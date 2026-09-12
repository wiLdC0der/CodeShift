import { useState } from "react";
import { ArrowRight, Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to log in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <div className="hidden flex-1 flex-col justify-between p-10 lg:flex">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Code2 size={17} strokeWidth={2.5} />
            </div>

            <span className="text-sm font-semibold">CodeShift</span>
          </Link>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
              Python → Java
            </p>

            <h1 className="mt-4 max-w-lg text-5xl font-semibold tracking-tight">
              Continue learning from where you stopped.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-500">
              Your roadmap, mastery, exercises, and learning history stay
              connected to your account.
            </p>
          </div>

          <p className="text-xs text-zinc-700">
            Learn from what you already know.
          </p>
        </div>

        <div className="flex w-full items-center justify-center border-l border-zinc-900 px-6 lg:max-w-xl">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950">
                  <Code2 size={17} />
                </div>

                <span className="text-sm font-semibold">
                  CodeShift
                </span>
              </Link>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Welcome back</p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Sign in to CodeShift
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Continue your personalized language transition.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-3.5 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Signing in..." : "Sign in"}
                {!submitting && <ArrowRight size={15} />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-zinc-200 hover:text-white"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}