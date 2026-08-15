import { Link, NavLink } from "react-router-dom";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { APP_NAME, APP_ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

const navigationItems = [
  {
    label: "Dashboard",
    href: APP_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Goals",
    href: APP_ROUTES.GOALS,
    icon: Target,
  },
  {
    label: "Learning",
    href: APP_ROUTES.LEARNING,
    icon: BookOpenCheck,
  },
  {
    label: "Applications",
    href: APP_ROUTES.APPLICATIONS,
    icon: BriefcaseBusiness,
  },
  {
    label: "Resume",
    href: APP_ROUTES.RESUME,
    icon: FileText,
  },
  {
    label: "Profile",
    href: APP_ROUTES.PROFILE,
    icon: UserRound,
  },
  {
    label: "Settings",
    href: APP_ROUTES.SETTINGS,
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-800 bg-slate-950/90 px-4 py-5 backdrop-blur-xl lg:block">
      <div className="flex h-full min-h-0 flex-col">
        <Link to={APP_ROUTES.DASHBOARD} className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 shadow-glow">
            <Sparkles size={21} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight">
              {APP_NAME}
            </p>
            <p className="truncate text-xs text-slate-500">
              Career execution OS
            </p>
          </div>
        </Link>

        <div className="mt-7 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-brand-300">Current Goal</p>
            <Badge variant="blue">v1</Badge>
          </div>

          <h2 className="mt-3 text-sm font-semibold text-white">
            Backend Engineer
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Targeting 12-15 LPA switch with Spring Boot, DSA and system design.
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            42% preparation progress
          </p>
        </div>

        <nav className="mt-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )
                }
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-semibold">
              OP
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                OfferPilot User
              </p>
              <p className="truncate text-xs text-slate-500">
                Preparing seriously
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}