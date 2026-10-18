import { Wifi, WifiOff, RefreshCw, RefreshCwOff } from "lucide-react";
import { useEffect, useState } from "react";

import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSyncStatus } from "../hooks/useSyncStatus";

export default function Header() {
  const online = useOnlineStatus();
  const { status: syncStatus } = useSyncStatus();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dateLabel = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const timeLabel = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isSyncing = syncStatus === "syncing";
  const hasSyncError = syncStatus === "error";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand and Date */}
          <div className="flex min-w-0 flex-col">
            <h1 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
              Offline-Track
            </h1>

            <span className="text-xs text-muted">
              {dateLabel} <span className="mx-1">·</span> {timeLabel}
            </span>
          </div>

          {/* Connection and Sync Status */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            {/* Network Status */}
            <div
              className={`flex items-center gap-1.5 text-sm ${
                online ? "text-primary" : "text-danger"
              }`}
              role="status"
              aria-label={online ? "Online" : "Offline"}
            >
              {online ? <Wifi size={16} /> : <WifiOff size={16} />}

              <span className="hidden font-medium sm:inline">
                {online ? "Online" : "Offline"}
              </span>
            </div>

            {/* Sync Status */}
            <div
              className={`flex items-center gap-1.5 text-sm ${
                hasSyncError
                  ? "text-danger"
                  : !online
                    ? "text-muted"
                    : "text-primary"
              }`}
              role="status"
              aria-label={
                !online
                  ? "Offline"
                  : isSyncing
                    ? "Syncing"
                    : hasSyncError
                      ? "Sync failed"
                      : "Sync idle"
              }
            >
              {!online ? (
                <RefreshCwOff size={16} />
              ) : (
                <RefreshCw
                  size={16}
                  className={isSyncing ? "animate-spin" : ""}
                />
              )}

              <span className="hidden font-medium sm:inline">
                {!online
                  ? "Pending"
                  : isSyncing
                    ? "Syncing"
                    : hasSyncError
                      ? "Sync failed"
                      : "Sync idle"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
