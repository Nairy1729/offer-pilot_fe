import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { APP_NAME, APP_ROUTES } from "../../../lib/constants";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/80 bg-surface-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={APP_ROUTES.HOME} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 shadow-glow">
            <Sparkles size={20} className="text-white" />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
              {APP_NAME}
            </p>
            <p className="text-xs text-slate-500">Career trajectory engine</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#trajectory" className="transition hover:text-white">
            Trajectory
          </a>
          <a href="#intelligence" className="transition hover:text-white">
            Intelligence
          </a>
          <a href="#mission" className="transition hover:text-white">
            Today’s Mission
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link to={APP_ROUTES.LOGIN} className="hidden sm:inline-flex">
            <Button variant="ghost">Sign in</Button>
          </Link>

          <Link to={APP_ROUTES.SIGNUP}>
            <Button>Start your journey</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}