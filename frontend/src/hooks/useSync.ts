import { useEffect } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSyncStatus } from "../hooks/useSyncStatus";
import { getUnsyncedExpenses, markAsSynced } from "../lib/db/indexedDb";
import { syncToServer } from "../lib/api/sync";

export function useSync() {
  const online = useOnlineStatus();
  const { setStatus } = useSyncStatus();

  useEffect(() => {
    if (!online) {
      setStatus("idle");
      return;
    }
    let retryId: number | null = null;
    const runSync = async () => {
      try {
        setStatus("syncing");

        const pending = await getUnsyncedExpenses();

        if (pending.length === 0) {
          setStatus("idle");
          return;
        }

        await syncToServer(pending);

        for (const item of pending) {
          await markAsSynced(item.id);
        }

        setStatus("idle");
      } catch {
        setStatus("waiting");
        retryId = window.setTimeout(runSync, 5000);
      }
    };

    runSync();

    return () => {
      if (retryId !== null) {
        clearTimeout(retryId);
      }
    };
  }, [online, setStatus]);
}
