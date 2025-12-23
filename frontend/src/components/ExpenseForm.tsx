import { useState, type FormEvent } from "react";
import { Plus, Save, X } from "lucide-react";
import { saveExpense, updateExpense } from "../lib/db/indexedDb";
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

type Category = (typeof CATEGORIES)[number];

type Props = {
  initialExpense?: Expense | null;
  onCloseEdit?: () => void;
};

export default function ExpenseForm({ initialExpense, onCloseEdit }: Props) {
  const isEdit = Boolean(initialExpense);

  const [amount, setAmount] = useState(
    initialExpense ? String(initialExpense.amount) : ""
  );
  const [category, setCategory] = useState<Category>(
    (initialExpense?.category as Category) ?? "Food"
  );
  const [note, setNote] = useState(initialExpense?.note ?? "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const expenseData = {
      amount: Number(amount),
      category,
      note: note.trim() || undefined,
      synced: false,
    };

    if (isEdit && initialExpense) {
      await updateExpense({
        ...initialExpense,
        ...expenseData,
      });
      onCloseEdit?.();
    } else {
      await saveExpense({
        id: crypto.randomUUID(),
        ...expenseData,
        date: new Date().toISOString(),
      });

      // Reset form
      setAmount("");
      setCategory("Food");
      setNote("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`
          bg-white dark:bg-gray-800 
          rounded-2xl 
          shadow-lg 
          border border-gray-200 dark:border-gray-700 
          overflow-hidden
          backdrop-blur-sm
        `}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? "Edit Expense" : "New Expense"}
          </h2>

          {isEdit && onCloseEdit && (
            <button
              type="button"
              onClick={onCloseEdit}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Amount */}
          <div className="space-y-1">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="0.00"
                className={`
                  w-full pl-8 pr-4 py-3 
                  bg-gray-50 dark:bg-gray-900 
                  border border-gray-300 dark:border-gray-600 
                  rounded-lg 
                  text-gray-900 dark:text-white 
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  outline-none transition-all
                `}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={`
                w-full px-4 py-3 
                bg-gray-50 dark:bg-gray-900 
                border border-gray-300 dark:border-gray-600 
                rounded-lg 
                text-gray-900 dark:text-white 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                outline-none transition-all appearance-none
              `}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Note (optional)
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Coffee with team"
              className={`
                w-full px-4 py-3 
                bg-gray-50 dark:bg-gray-900 
                border border-gray-300 dark:border-gray-600 
                rounded-lg 
                text-gray-900 dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-500
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                outline-none transition-all
              `}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`
              w-full flex items-center justify-center gap-2
              py-3 px-4
              bg-blue-600 hover:bg-blue-700 
              active:bg-blue-800
              text-white font-medium
              rounded-lg
              transition-colors duration-200
              shadow-md hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              dark:focus:ring-offset-gray-900
            `}
          >
            {isEdit ? <Save size={18} /> : <Plus size={18} />}
            {isEdit ? "Save Changes" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
