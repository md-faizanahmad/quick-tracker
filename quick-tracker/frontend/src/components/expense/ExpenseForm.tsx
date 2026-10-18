// src/components/ExpenseForm.tsx
import { useEffect, useState, type FormEvent } from "react";
import { saveExpense, updateExpense } from "../../lib/db/indexedDb";
import { validateExpense } from "../../lib/validation/expenseValidation";
import type { Expense } from "../../types/expenses";

const CATEGORIES = [
  { value: "Bills", icon: "📄" },
  { value: "Groceries", icon: "🛒" },
  { value: "Entertainment", icon: "🎬" },
  { value: "Shopping", icon: "🛍️" },
  { value: "Food", icon: "🍽️" },
  { value: "Study", icon: "📚" },
  { value: "Transport", icon: "🚕" },
  { value: "Rent", icon: "🏠" },
  { value: "Health", icon: "🏥" },
  { value: "Other", icon: "❓" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

const CURRENCIES = [
  { code: "₹", label: "INR", flag: "🇮🇳" },
  { code: "$", label: "USD", flag: "🇺🇸" },
  { code: "£", label: "GBP", flag: "🇬🇧" },
  { code: "€", label: "EUR", flag: "🇪🇺" },
  { code: "¥", label: "JPY", flag: "🇯🇵" },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

type Props = {
  initialExpense?: Expense | null;
  onCloseEdit?: () => void;
};

export default function ExpenseForm({ initialExpense, onCloseEdit }: Props) {
  const isEdit = Boolean(initialExpense);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState(
    initialExpense ? String(initialExpense.amount) : ""
  );
  const [category, setCategory] = useState<Category>(
    (initialExpense?.category as Category) ?? "Food"
  );
  const [currency, setCurrency] = useState<CurrencyCode>(
    initialExpense?.currency ?? "₹"
  );
  const [note, setNote] = useState(initialExpense?.note ?? "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

    const expenseData = {
      amount: Number(amount),
      currency,
      category,
      note: note.trim() || undefined,
      synced: false,
    };

    if (isEdit && initialExpense) {
      await updateExpense({ ...initialExpense, ...expenseData });
      onCloseEdit?.();
    } else {
      await saveExpense({
        id: crypto.randomUUID(),
        ...expenseData,
        date: new Date().toISOString(),
      });
      setAmount("");
      setCategory("Food");
      setCurrency("₹");
      setNote("");
      onCloseEdit?.(); // Close modal after adding new
    }
  };

  // Auto-scroll to focused input with keyboard handling
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT") {
        // Delay to allow keyboard animation
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6 ">
        {/* Amount + Currency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="flex items-stretch rounded-xl overflow-hidden border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-20 px-3 py-3 bg-gray-50 text-gray-900 font-medium cursor-pointer focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00"
              className="flex-1 px-4 py-3 bg-white text-gray-900 text-lg font-medium outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.value}
              </option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Monthly groceries"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md"
        >
          {isEdit ? "Save Changes" : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
