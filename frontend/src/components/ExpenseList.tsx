// src/components/ExpenseList.tsx
import { useEffect, useState } from "react";
import { Trash2, Pencil, RotateCcw, AlertTriangle } from "lucide-react";
import {
  getAllExpenses,
  deleteExpense,
  updateExpense,
} from "../lib/db/indexedDb";
import type { Expense } from "../types/expenses";

type Props = {
  onEdit: (expense: Expense) => void;
};

export default function ExpenseList({ onEdit }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      try {
        const data = await getAllExpenses();
        setExpenses(data.sort((a, b) => b.date.localeCompare(a.date)));
      } catch (err) {
        console.error("Failed to load expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
    window.addEventListener("expenses-updated", loadExpenses);
    return () => window.removeEventListener("expenses-updated", loadExpenses);
  }, []);

  const handleDelete = (id: string) => {
    if (confirmId === id) {
      deleteExpense(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  };

  const handleRetry = async (expense: Expense) => {
    await updateExpense({ ...expense, synced: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-gray-500 dark:text-gray-400 text-base">
          No expenses yet. Add your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          2xl:grid-cols-5 
          gap-4 md:gap-6
        "
      >
        {expenses.map((expense) => {
          const isConfirming = confirmId === expense.id;
          const date = new Date(expense.date);
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={expense.id}
              className={`
                bg-white dark:bg-gray-800 
                rounded-2xl 
                border border-gray-200 dark:border-gray-700 
                shadow-sm hover:shadow-lg 
                transition-all duration-300 
                overflow-hidden
                flex flex-col
                h-full
              `}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50 dark:bg-gray-900/40">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formattedDate}
                  </div>
                  <div className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                    {expense.category}
                  </div>
                </div>

                {!expense.synced && (
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
                    Pending
                  </span>
                )}
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col justify-between p-5">
                {expense.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {expense.note}
                  </p>
                )}

                <div className="flex items-end justify-between mt-auto">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{expense.amount.toLocaleString("en-IN")}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!expense.synced && (
                      <button
                        onClick={() => handleRetry(expense)}
                        title="Retry sync"
                        className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => onEdit(expense)}
                      title="Edit expense"
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(expense.id)}
                      title={isConfirming ? "Confirm delete" : "Delete"}
                      className={`
                        p-2 rounded-lg transition-colors
                        ${
                          isConfirming
                            ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                            : "text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                        }
                      `}
                    >
                      {isConfirming ? (
                        <AlertTriangle size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirmation bar */}
              {isConfirming && (
                <div className="px-5 py-2.5 bg-red-50 dark:bg-red-900/30 border-t border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                  Confirm delete? Tap again.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
