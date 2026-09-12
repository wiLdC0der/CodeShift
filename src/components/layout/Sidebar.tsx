import {
  BookOpen,
  Code2,
  LayoutDashboard,
  Map,
  Settings,
  Terminal,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Learn",
    icon: BookOpen,
    path: "/learn",
  },
  {
    label: "Roadmap",
    icon: Map,
    path: "/roadmap",
  },
  {
    label: "Practice",
    icon: Trophy,
    path: "/practice",
  },
  {
    label: "Playground",
    icon: Terminal,
    path: "/playground",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-zinc-800/80 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950">
            <Code2 size={16} strokeWidth={2.5} />
          </div>

          <span className="text-sm font-semibold tracking-tight text-white">
            CodeShift
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800/80 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}