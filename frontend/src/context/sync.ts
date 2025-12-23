export async function syncToServer(payload: unknown[]) {
  const res = await fetch(
    "https://offline-expense-tracker-backend.vercel.app/sync",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Sync failed");
  }

  return res.json();
}
