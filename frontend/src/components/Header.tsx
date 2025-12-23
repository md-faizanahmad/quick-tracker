import {
  Wifi,
  WifiOff,
  Sun,
  Moon,
  RefreshCw,
  List,
  PlusCircle,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useTheme } from "../hooks/useTheme";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSyncStatus } from "../hooks/useSyncStatus";

export default function Header() {
  // 🔑 SEPARATE CONCERNS (IMPORTANT)
  const online = useOnlineStatus(); // boolean
  const { status: syncStatus } = useSyncStatus(); // "idle" | "syncing" | "error"
  const { theme, toggleTheme } = useTheme();

  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand + Time */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {time.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                ·{" "}
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* STATUS + THEME */}
            <div className="flex items-center gap-4">
              {/* ONLINE / OFFLINE (TRUTHFUL) */}
              {online ? (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm">
                  <Wifi size={16} />
                  <span className="hidden md:inline font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm">
                  <WifiOff size={16} />
                  <span className="hidden md:inline font-medium">Offline</span>
                </div>
              )}

              {/* SYNC STATUS (SECONDARY TO OFFLINE) */}
              <div className=" md:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <RefreshCw
                  size={16}
                  className={syncStatus === "syncing" ? "animate-spin" : ""}
                />
                <span className="hidden md:inline font-medium">
                  {!online
                    ? "Pending"
                    : syncStatus === "syncing"
                    ? "Syncing…"
                    : syncStatus === "error"
                    ? "Sync error"
                    : "Synced"}
                </span>
              </div>

              {/* THEME TOGGLE */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP NAV */}
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 sm:hidden">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <MobileNav to="/expenses" active={isActive("/expenses")}>
            <List size={22} />
          </MobileNav>
          <MobileNav to="/add" active={isActive("/add")}>
            <PlusCircle size={22} />
          </MobileNav>
          <MobileNav to="/settings" active={isActive("/settings")}>
            <Settings size={22} />
          </MobileNav>
        </div>
      </nav>
    </>
  );
}

/* ---------- helpers ---------- */

function MobileNav({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 ${
        active ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
      }`}
    >
      {children}
    </Link>
  );
}
