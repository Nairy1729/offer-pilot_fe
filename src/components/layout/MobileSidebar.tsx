import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";
import { APP_NAME, APP_ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

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

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <aside className="relative z-10 flex h-dvh w-80 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-950 p-5 shadow-premium">
            <div className="flex items-center justify-between gap-4">
              <Link
                to={APP_ROUTES.DASHBOARD}
                className="flex min-w-0 items-center gap-3"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 shadow-glow">
                  <Sparkles size={20} />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold">{APP_NAME}</p>
                  <p className="truncate text-xs text-slate-500">Career OS</p>
                </div>
              </Link>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </Button>
            </div>

            <nav className="mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                        isActive
                          ? "bg-slate-800 text-white"
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
          </aside>
        </div>
      ) : null}
    </>
  );
}