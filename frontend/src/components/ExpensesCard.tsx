import { Trash2, Pencil } from "lucide-react";
import type { Expense } from "../types/expenses";
import { deleteExpense } from "../lib/db/indexedDb";

type Props = {
  expense: Expense;
  onEdit: (expense: Expense) => void;
};

export default function ExpenseCard({ expense, onEdit }: Props) {
  return (
    <div className="bg-white -900 rounded-xl border  border-gray-800 p-3 space-y-2">
      {/* DATE */}
      <div className="text-xs text-gray-500">
        {new Date(expense.date).toDateString()}
      </div>

      {/* CONTENT */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">{expense.category}</p>
          {expense.note && (
            <p className="text-xs text-gray-500 mt-0.5">{expense.note}</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold">₹{expense.amount}</p>
          {!expense.synced && (
            <p className="text-xs text-orange-500">Pending sync</p>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          onClick={() => onEdit(expense)}
          className="text-xs text-blue-600 cursor-pointer"
        >
          <Pencil size={14} />
        </button>

        <button
          onClick={() => deleteExpense(expense.id)}
          className="text-xs text-red-600 cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
