import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Login from "../../pages/Auth/Login";
import Signup from "../../pages/Auth/Signup";
import Assessment from "../../pages/Assessment/Assessment";
import Lesson from "../../pages/Lesson/Lesson";
import Roadmap from "../../pages/Roadmap/Roadmap";

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          CodeShift
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
          Learn a new language
          <br />
          from the one you know.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400">
          Move from Python to Java without starting from zero.
        </p>

        <a
          href="/dashboard"
          className="mt-8 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
        >
          Open Dashboard
        </a>
      </div>
    </main>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/learn/:lessonId" element={<Lesson />} />
        <Route path="/roadmap" element={<Roadmap />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}