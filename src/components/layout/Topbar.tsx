import { Bell, ChevronDown } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950 px-6">
      <div>
        <p className="text-xs text-zinc-500">Learning path</p>

        <button
          type="button"
          className="mt-0.5 flex items-center gap-1 text-sm font-medium text-zinc-200"
        >
          Python → Java
          <ChevronDown size={14} className="text-zinc-500" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-zinc-500 transition hover:text-zinc-300"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-200">
          A
        </div>
      </div>
    </header>
  );
}