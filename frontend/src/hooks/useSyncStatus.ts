import { useContext } from "react";
import { SyncContext } from "../context/SyncContext";

export function useSyncStatus() {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error("useSyncStatus must be used within SyncProvider");
  }
  return ctx;
}
