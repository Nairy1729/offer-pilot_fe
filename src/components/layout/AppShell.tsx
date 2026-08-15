import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-950 text-white">
      <Sidebar />

      <div className="min-h-screen w-full min-w-0 lg:pl-72">
        <Topbar />

        <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-5 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}