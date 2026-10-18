import {
  Trash2,
  Pencil,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ReceiptText,
} from "lucide-react";

import type { Expense } from "../../types/expenses";
import { useExpenseList } from "../../hooks/useExpenseList";
import CategoryChart from "./CategoryChart";
import { CATEGORY_ICONS } from "../../utils/expenseOptions";

type Props = {
  onEdit: (expense: Expense) => void;
};

export default function ExpenseList({ onEdit }: Props) {
  const {
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
  } = useExpenseList();

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  if (loading) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("expenses-updated"))}
            className="shrink-0 font-medium underline underline-offset-2"
          >
            Refresh
          </button>
        </div>
      )}

      {expenses.length > 0 && <CategoryChart expenses={expenses} />}

      {/* Total Expenses */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">
              Total recorded expenses
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {expenses[0]?.currency ?? "₹"}
              {totalExpenses.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mt-1 text-xs text-muted">
              {expenses.length}{" "}
              {expenses.length === 1 ? "transaction" : "transactions"} recorded
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
            <ReceiptText size={21} />
          </div>
        </div>
      </section>

      {/* Expense List Heading */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Recent expenses
          </h2>
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
            {expenses.length} records
          </span>
        </div>

        {expenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-primary">
              <ReceiptText size={23} />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">
              No expenses yet
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
              Your recorded expenses will appear here when you add your first
              transaction.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const isExpanded = expandedId === expense.id;
              const isConfirming = deleteConfirmId === expense.id;
              const isRetrying = retryingId === expense.id;

              const formattedDate = new Date(expense.date).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              );

              return (
                <article
                  key={expense.id}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/30"
                >
                  {/* Expense Summary */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(expense.id)}
                    aria-expanded={isExpanded}
                    className="flex w-full min-w-0 items-center gap-3 p-3.5 text-left transition-colors hover:bg-surface/60 sm:gap-4 sm:p-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-xl">
                      {CATEGORY_ICONS[
                        expense.category as keyof typeof CATEGORY_ICONS
                      ] ?? "❓"}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground sm:text-base">
                        {expense.category}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {formattedDate}
                      </span>
                    </span>

                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="whitespace-nowrap text-sm font-bold tabular-nums text-foreground sm:text-base">
                        {expense.currency}
                        {expense.amount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                          expense.synced
                            ? "bg-[#EDF4ED] text-[#356859]"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {expense.synced ? (
                          <CheckCircle size={11} />
                        ) : (
                          <RotateCcw size={11} />
                        )}
                        {expense.synced ? "Synced" : "Pending"}
                      </span>
                    </span>

                    <span className="shrink-0 text-muted">
                      {isExpanded ? (
                        <ChevronUp size={17} />
                      ) : (
                        <ChevronDown size={17} />
                      )}
                    </span>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border px-4 pb-4 pt-3">
                      {expense.note && (
                        <p className="mb-4 break-words text-sm leading-6 text-muted">
                          {expense.note}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-muted">
                          {expense.synced
                            ? "Saved and synchronized"
                            : isOnline
                              ? "Waiting to synchronize"
                              : "Saved locally · Offline"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {!expense.synced && (
                            <button
                              type="button"
                              onClick={() => void handleRetry(expense)}
                              disabled={!isOnline || retryingId !== null}
                              aria-label="Retry expense sync"
                              title={
                                !isOnline
                                  ? "Unavailable while offline"
                                  : "Retry synchronization"
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl text-primary transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <RotateCcw
                                size={17}
                                className={isRetrying ? "animate-spin" : ""}
                              />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onEdit(expense)}
                            aria-label="Edit expense"
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-primary transition-colors hover:bg-surface"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(expense.id)}
                            aria-label="Delete expense"
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-danger transition-colors hover:bg-danger/5"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {isConfirming && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-[2px]">
                      <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={`delete-title-${expense.id}`}
                        className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 shadow-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                            <AlertTriangle size={20} />
                          </span>

                          <h3
                            id={`delete-title-${expense.id}`}
                            className="font-semibold text-foreground"
                          >
                            Delete expense?
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-5 text-muted">
                          This transaction will be permanently removed from your
                          local records.
                        </p>

                        <div className="mt-5 flex gap-2">
                          <button
                            type="button"
                            onClick={cancelDelete}
                            className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(expense.id)}
                            className="flex-1 rounded-xl bg-danger px-3 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
