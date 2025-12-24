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

  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction("expenses", "readonly");
      const store = tx.objectStore("expenses");
      const index = store.index("synced");

      const range = IDBKeyRange.only(false);
      const req = index.getAll(range);

      req.onsuccess = () => {
        resolve(req.result);
      };

      req.onerror = () => {
        reject(req.error);
      };

      tx.onerror = () => {
        reject(tx.error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

export async function markAsSynced(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("expenses", "readwrite");
    const store = tx.objectStore("expenses");

    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const expense = getReq.result;
      if (!expense) {
        resolve();
        return;
      }

      expense.synced = true;
      store.put(expense);
    };

    tx.oncomplete = () => resolve(); // 🔴 THIS IS CRITICAL
    tx.onerror = () => reject(tx.error);
  });
}
