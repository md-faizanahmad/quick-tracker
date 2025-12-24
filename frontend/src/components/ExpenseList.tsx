// src/components/ExpenseList.tsx
import { useEffect, useState } from "react";
import {
  Trash2,
  Pencil,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getAllExpenses,
  deleteExpense,
  updateExpense,
} from "../lib/db/indexedDb";
import { syncToServer } from "../lib/api/sync";
import type { Expense } from "../types/expenses";
import CategoryChart from "./CategoryChart";

type Props = {
  onEdit: (expense: Expense) => void;
};

const CATEGORY_ICONS: Record<string, string> = {
  Bills: "📄",
  Groceries: "🛒",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Food: "🍽️",
  Study: "📚",
  Transport: "🚕",
  Rent: "🏠",
  Health: "🏥",
  Other: "❓",
};

export default function ExpenseList({ onEdit }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("expenses-updated", loadExpenses);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      deleteExpense(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  };

  const handleRetry = async (expense: Expense) => {
    try {
      // Mark as pending first (UI feedback)
      await updateExpense({ ...expense, synced: false });
      window.dispatchEvent(new Event("expenses-updated"));
      alert("Retry triggered");

      // Always attempt sync — mobile-safe
      await syncToServer([{ ...expense, synced: false }]);

      // Mark as synced if request succeeds
      await updateExpense({ ...expense, synced: true });
      window.dispatchEvent(new Event("expenses-updated"));
    } catch (err) {
      // If offline or network fails → stay pending
      console.error("Sync failed:", err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
        <p className="text-gray-500 text-lg font-medium">
          No expenses yet. Start tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <CategoryChart expenses={expenses} />

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
        <p className="text-sm text-gray-600">Total this month</p>
        <p className="text-2xl font-bold text-gray-900">
          ₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
        </p>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => {
          const isExpanded = expandedId === expense.id;
          const isConfirming = deleteConfirmId === expense.id;
          const date = new Date(expense.date);
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={expense.id}
              className="
                bg-white 
                rounded-2xl 
                border border-gray-200 
                shadow-sm 
                transition-all duration-300 
                overflow-hidden
                relative
              "
            >
              {/* Compact Header – shown on mobile */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(expense.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {CATEGORY_ICONS[expense.category] || "❓"}
                  </span>
                  <div>
                    <div className="text-base font-semibold text-gray-900">
                      {expense.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {expense.synced ? (
                      <span className="flex cursor-pointer items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        <CheckCircle size={12} />
                        Synced
                      </span>
                    ) : (
                      <span className="flex cursor-pointer items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                        <RotateCcw size={12} />
                        Pending
                      </span>
                    )}
                  </div>

                  <span className="text-gray-900 font-bold text-lg">
                    {expense.currency}
                    {expense.amount.toLocaleString("en-IN")}
                  </span>

                  <div className="text-gray-400 ">
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details – only shown when clicked on mobile */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">
                    {formattedDate}
                  </div>

                  {expense.note && (
                    <p className="text-sm text-gray-600 mb-4">{expense.note}</p>
                  )}

                  <div className="flex justify-end gap-2">
                    {!expense.synced && (
                      <button
                        onClick={() => handleRetry(expense)}
                        disabled={!isOnline}
                        title={
                          isOnline
                            ? "Retry sync"
                            : "Offline – will sync when online"
                        }
                        className={`
                          p-2 rounded-full 
                          ${
                            isOnline
                              ? "text-orange-600 hover:bg-orange-50 active:scale-95 active:rotate-180 transition-all duration-300"
                              : "text-gray-400 cursor-not-allowed"
                          }
                        `}
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(expense)}
                      title="Edit"
                      className="p-2 cursor-pointer rounded-full text-blue-600 hover:bg-blue-50 active:scale-95 transition-all duration-200"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(expense.id)}
                      title="Delete"
                      className="p-2 cursor-pointer rounded-full text-red-600 hover:bg-red-50 active:scale-95 transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {isConfirming && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <div className="bg-white rounded-2xl shadow-2xl  p-3 max-w-xs w-full mx-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle size={20} className="text-red-600" />
                      <h3 className="text-md font-semibold text-gray-900">
                        Delete Expense?
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                      This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
