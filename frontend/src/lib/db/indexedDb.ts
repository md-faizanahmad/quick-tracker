import type { Expense } from "../../types/expenses";

const DB_NAME = "expense-db";
const STORE = "expenses";
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("synced", "synced");
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function updateExpense(expense: Expense) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(expense);

  tx.oncomplete = () => {
    window.dispatchEvent(new Event("expenses-updated"));
  };
}
export async function saveExpense(expense: Expense) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(expense);

  tx.oncomplete = () => {
    window.dispatchEvent(new Event("expenses-updated"));
  };
}
export async function deleteExpense(id: string) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);

  tx.oncomplete = () => {
    window.dispatchEvent(new Event("expenses-updated"));
  };
}
export async function getAllExpenses(): Promise<Expense[]> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

export async function getUnsyncedExpenses(): Promise<Expense[]> {
  const db = await openDB();

  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const index = store.index("synced");

    const req = index.getAll(IDBKeyRange.only(false));

    req.onsuccess = () => resolve(req.result);
  });
}

export async function markAsSynced(id: string) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);

  const req = store.get(id);
  req.onsuccess = () => {
    const item = req.result;
    if (item) {
      item.synced = true;
      store.put(item);
    }
  };
}
