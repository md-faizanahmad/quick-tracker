import { Wifi, WifiOff, RefreshCw, RefreshCwOff } from "lucide-react";
import { useEffect, useState } from "react";

import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSyncStatus } from "../hooks/useSyncStatus";

export default function Header() {
  // 🔑 SEPARATE CONCERNS (IMPORTANT)
  const online = useOnlineStatus(); // boolean
  const { status: syncStatus } = useSyncStatus(); // "idle" | "syncing" | "error"

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 -900/80 backdrop-blur-md   shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand + Time */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-poppins font-bold bg-linear-to-r  to-indigo-600 from-blue-400  bg-clip-text text-transparent">
                Expense Tracker
              </h1>
              <span className="text-xs text-gray-500 ">
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
                <div className="flex items-center gap-1.5  text-green-400 text-sm">
                  <Wifi size={16} className="text-3xl" />
                  <span className="hidden md:inline font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5  text-red-400 text-sm">
                  <WifiOff size={16} />
                  <span className="hidden md:inline font-medium">Offline</span>
                </div>
              )}

              {/* SYNC STATUS (SECONDARY TO OFFLINE) */}
              <div className=" md:flex items-center gap-1.5 text-sm text-gray-500 ">
                {online ? (
                  <div className="flex items-center gap-1.5  text-gray-500 text-sm">
                    <RefreshCw
                      size={16}
                      className={syncStatus === "syncing" ? "animate-spin" : ""}
                    />
                    <span className="hidden md:inline font-medium">Synced</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5  text-red-900 text-sm">
                    <RefreshCwOff
                      size={16}
                      className={syncStatus === "syncing" ? "animate-spin" : ""}
                    />
                    <span className="hidden md:inline font-medium">
                      Pending
                    </span>
                  </div>
                )}

                {/* <span className="hidden md:inline font-medium">
                  {!online
                    ? "Pending"
                    : syncStatus === "syncing"
                    ? "Syncing…"
                    : syncStatus === "error"
                    ? "Sync error"
                    : "Synced"}
                </span> */}
              </div>

              {/* THEME TOGGLE */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
