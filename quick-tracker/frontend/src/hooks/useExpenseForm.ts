import { useEffect, useState, type FormEvent } from "react";
import { saveExpense, updateExpense } from "../lib/db/indexedDb";
import { validateExpense } from "../lib/validation/expenseValidation";
import type { Expense } from "../types/expenses";

const CATEGORIES = [
  "Bills",
  "Groceries",
  "Entertainment",
  "Shopping",
  "Food",
  "Study",
  "Transport",
  "Rent",
  "Health",
  "Other",
] as const;

const CURRENCIES = ["₹", "$", "£", "€", "¥"] as const;

export type ExpenseCategory = (typeof CATEGORIES)[number];
export type ExpenseCurrency = (typeof CURRENCIES)[number];

type UseExpenseFormProps = {
  initialExpense?: Expense | null;
  onCloseEdit?: () => void;
};

export function useExpenseForm({
  initialExpense,
  onCloseEdit,
}: UseExpenseFormProps) {
  const [amount, setAmount] = useState(
    initialExpense ? String(initialExpense.amount) : "",
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    (initialExpense?.category as ExpenseCategory) ?? "Food",
  );
  const [currency, setCurrency] = useState<ExpenseCurrency>(
    (initialExpense?.currency as ExpenseCurrency) ?? "₹",
  );
  const [note, setNote] = useState(initialExpense?.note ?? "");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(initialExpense);

  useEffect(() => {
    setAmount(initialExpense ? String(initialExpense.amount) : "");
    setCategory((initialExpense?.category as ExpenseCategory) ?? "Food");
    setCurrency((initialExpense?.currency as ExpenseCurrency) ?? "₹");
    setNote(initialExpense?.note ?? "");
    setError(null);
  }, [initialExpense]);

  const resetForm = () => {
    setAmount("");
    setCategory("Food");
    setCurrency("₹");
    setNote("");
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validation = validateExpense({
      amount: Number(amount),
      currency,
      category,
      note,
    });

    if (!validation.valid) {
      setError(Object.values(validation.errors)[0] ?? "Invalid input");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const expenseData = {
        amount: Number(amount),
        currency,
        category,
        note: note.trim() || undefined,
        synced: false,
      };

      if (isEdit && initialExpense) {
        await updateExpense({
          ...initialExpense,
          ...expenseData,
        });
      } else {
        await saveExpense({
          id: crypto.randomUUID(),
          ...expenseData,
          date: new Date().toISOString(),
        });

        resetForm();
      }

      onCloseEdit?.();
    } catch {
      setError("Unable to save expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    resetForm,
    categories: CATEGORIES,
    currencies: CURRENCIES,
  };
}
