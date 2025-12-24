import type { Expense } from "../../types/expenses";

export async function syncToServer(expenses: Expense[]) {
  const res = await fetch(
    "https://offline-expense-tracker-backend.vercel.app/sync",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenses),
      cache: "no-store",
      keepalive: true,
    }
  );
  console.log("CALLING /sync", expenses);
  alert("Sync request sent");

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Sync failed");
  }

  return res.json();
}
