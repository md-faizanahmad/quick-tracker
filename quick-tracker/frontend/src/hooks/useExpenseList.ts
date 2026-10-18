import { useCallback, useEffect, useState } from "react";
import {
  getAllExpenses,
  deleteExpense,
  updateExpense,
  markAsSynced,
} from "../lib/db/indexedDb";
import { syncToServer } from "../lib/api/sync";
import { useOnlineStatus } from "./useOnlineStatus";
import type { Expense } from "../types/expenses";

export function useExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isOnline = useOnlineStatus();

  const loadExpenses = useCallback(async () => {
    try {
      const data = await getAllExpenses();

      setExpenses(data.sort((a, b) => b.date.localeCompare(a.date)));
      setError(null);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExpenses();

    window.addEventListener("expenses-updated", loadExpenses);

    return () => {
      window.removeEventListener("expenses-updated", loadExpenses);
    };
  }, [loadExpenses]);

  const handleDelete = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }

    try {
      await deleteExpense(id);

      setDeleteConfirmId(null);
      setExpandedId((current) => (current === id ? null : current));

      window.dispatchEvent(new Event("expenses-updated"));
      await loadExpenses();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setError("Unable to delete expense. Please try again.");
      setDeleteConfirmId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleRetry = async (expense: Expense) => {
    if (!isOnline || retryingId) return;

    setRetryingId(expense.id);
    setError(null);

    try {
      const pendingExpense = {
        ...expense,
        synced: false,
      };

      await updateExpense(pendingExpense);
      window.dispatchEvent(new Event("expenses-updated"));

      await syncToServer([pendingExpense]);
      await markAsSynced(expense.id);

      window.dispatchEvent(new Event("expenses-updated"));
      await loadExpenses();
    } catch (err) {
      console.error("Expense sync failed:", err);
      setError("Sync failed. You can retry when you're online.");
    } finally {
      setRetryingId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return {
    expenses,
    loading,
    isOnline,
    deleteConfirmId,
    expandedId,
    retryingId,
    error,
    handleDelete,
    handleRetry,
    toggleExpand,
    cancelDelete,
    loadExpenses,
  };
}
