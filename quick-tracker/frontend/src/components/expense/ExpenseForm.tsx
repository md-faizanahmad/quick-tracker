import { useEffect } from "react";
import { Check, LoaderCircle } from "lucide-react";
import {
  useExpenseForm,
  type ExpenseCategory,
  type ExpenseCurrency,
} from "../../hooks/useExpenseForm";
import type { Expense } from "../../types/expenses";
import { CATEGORIES, CURRENCIES } from "../../utils/expenseOptions";

type Props = {
  initialExpense?: Expense | null;
  onCloseEdit?: () => void;
};

export default function ExpenseForm({ initialExpense, onCloseEdit }: Props) {
  const {
    amount,
    setAmount,
    category,
    setCategory,
    currency,
    setCurrency,
    note,
    setNote,
    error,
    isEdit,
    isSubmitting,
    handleSubmit,
  } = useExpenseForm({ initialExpense, onCloseEdit });

  // Keep focused fields visible when the mobile keyboard opens.
  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "SELECT")
      ) {
        window.setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 300);
      }
    };

    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Form Heading */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Expense details
        </p>

        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
          {isEdit ? "Edit expense" : "Add an expense"}
        </h2>

        <p className="mt-1 text-sm text-muted">
          Record your spending for easy tracking.
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label
          htmlFor="expense-amount"
          className="block text-sm font-medium text-foreground"
        >
          Amount
        </label>

        <div className="flex overflow-hidden rounded-xl border border-border bg-card transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
          <select
            aria-label="Currency"
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value as ExpenseCurrency)
            }
            className="w-[70px] shrink-0 cursor-pointer border-0 border-r border-border bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none focus:ring-0"
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.code}
              </option>
            ))}
          </select>

          <input
            id="expense-amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            className="min-w-0 flex-1 border-0 bg-transparent px-4 py-2 text-lg font-semibold tabular-nums text-foreground outline-none placeholder:text-muted/60 focus:ring-0"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label
          htmlFor="expense-category"
          className="block text-sm font-medium text-foreground"
        >
          Category
        </label>

        <div className="relative">
          <select
            id="expense-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as ExpenseCategory)
            }
            className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-card px-4 py-3.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.icon} {item.value}
              </option>
            ))}
          </select>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted"
          >
            ▼
          </span>
        </div>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <label
          htmlFor="expense-note"
          className="block text-sm font-medium text-foreground"
        >
          Note <span className="font-normal text-muted">(optional)</span>
        </label>

        <input
          id="expense-note"
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="e.g. Monthly groceries"
          maxLength={200}
          className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Validation / Save Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Saving expense...
          </>
        ) : (
          <>
            <Check size={18} />
            {isEdit ? "Save changes" : "Add expense"}
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted">
        Your expense is saved to local storage.
      </p>
    </form>
  );
}
