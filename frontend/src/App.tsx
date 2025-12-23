import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { useSync } from "./hooks/useSync";
import { useState } from "react";
import type { Expense } from "./types/expenses";
import InstallPrompt from "./components/InstallPrompt";

export default function App() {
  useSync();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-6 lg:py-8">
        <InstallPrompt />

        {/* Responsive layout: stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* FORM SECTION - Takes full width on mobile, ~40% on desktop */}
          <div className="w-full lg:w-5/12 xl:w-4/12 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
            <ExpenseForm
              key={editingExpense?.id ?? "new"}
              initialExpense={editingExpense}
              onCloseEdit={() => setEditingExpense(null)}
            />
          </div>

          {/* LIST SECTION - Takes full width on mobile, ~60% on desktop */}
          <div className="w-full lg:w-7/12 xl:w-8/12">
            <ExpenseList onEdit={setEditingExpense} />
          </div>
        </div>
      </main>
    </div>
  );
}
