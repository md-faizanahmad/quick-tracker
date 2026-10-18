import type { Expense } from "../../types/expenses";

export async function syncToServer(expenses: Expense[]) {
  const payload = expenses.map((e) => ({
    id: e.id,
    amount: e.amount,
    category: e.category,
    note: e.note,
    currency: e.currency,
    date: e.date,
  }));

  const res = await fetch(
    "https://offline-expense-tracker-backend.vercel.app/sync",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Sync failed");
  return res.json();
}
