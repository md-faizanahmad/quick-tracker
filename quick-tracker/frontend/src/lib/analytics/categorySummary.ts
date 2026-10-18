import type { Expense } from "../../types/expenses";

export function groupByCategory(expenses: Expense[]) {
  const map: Record<string, number> = {};

  for (const e of expenses) {
    map[e.category] = (map[e.category] || 0) + e.amount;
  }

  return Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
