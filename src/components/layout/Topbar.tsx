import { useState } from "react";
import { Bell, CalendarDays, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../lib/constants";
import { getApiErrorMessage } from "../../services/apiError";
import { useAuthStore } from "../../features/auth/store/authStore";
import { logoutUser } from "../../features/auth/services/authService";
import { Button } from "../ui/button";
import { MobileSidebar } from "./MobileSidebar";

export function Topbar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "OP";

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error(getApiErrorMessage(error, "Logout API failed."));
    } finally {
      clearSession();

      navigate(APP_ROUTES.LOGIN, {
        replace: true,
      });

      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-surface-950/80 px-4 py-4 backdrop-blur-xl sm:px-5 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MobileSidebar />

          <div className="hidden min-w-0 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-500 md:flex md:w-80">
            <Search size={17} className="shrink-0" />
            <span className="truncate text-sm">
              Search goals, tasks, applications...
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden md:inline-flex">
            <CalendarDays size={16} />
            Today
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell size={18} />
          </Button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-semibold">
            {initials}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}