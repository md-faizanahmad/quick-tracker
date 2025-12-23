import type { Expense } from "../../types/expenses";

export async function syncToServer(expenses: Expense[]) {
  const baseURL = "https://offline-expense-tracker-backend.vercel.app/sync";

  const res = await fetch(`${baseURL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenses),
  });

  if (!res.ok) {
    throw new Error("Sync failed");
  }

  return res.json();
}
