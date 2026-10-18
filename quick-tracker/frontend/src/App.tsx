import { useState } from "react";
import Header from "./components/Header";
import ExpenseForm from "./components/expense/ExpenseForm";
import ExpenseList from "./components/expense/ExpenseList";
import { useSync } from "./hooks/useSync";
import { Plus, X } from "lucide-react";
import type { Expense } from "./types/expenses";
import InstallPrompt from "./components/InstallPrompt";
import Footer from "./components/Footer";

export default function App() {
  useSync();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = (expense?: Expense) => {
    setEditingExpense(expense ?? null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="container mx-auto grow px-4 py-6 sm:px-6 lg:py-8">
        <InstallPrompt />

        {/* Floating Add Button — Mobile */}
        <button
          type="button"
          onClick={() => handleOpenForm()}
          className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-accent active:scale-95 md:hidden"
          aria-label="Add new expense"
        >
          <Plus size={25} strokeWidth={2.2} />
        </button>

        {/* Main Layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Desktop Expense Form */}
          <aside className="hidden w-full md:block lg:sticky lg:top-6 lg:mb-0 lg:w-5/12 xl:w-4/12">
            <ExpenseForm
              key={editingExpense?.id ?? "new"}
              initialExpense={editingExpense}
              onCloseEdit={() => setEditingExpense(null)}
            />
          </aside>

          {/* Expense List */}
          <section className="w-full min-w-0 lg:w-7/12 xl:w-8/12">
            <ExpenseList onEdit={handleOpenForm} />
          </section>
        </div>

        {/* Mobile Expense Form Modal */}
        {isFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/35 backdrop-blur-[2px] md:hidden"
            onClick={handleCloseForm}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="expense-form-title"
              className="mb-2 max-h-[90dvh] w-full overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4">
                <div>
                  <h2
                    id="expense-form-title"
                    className="text-lg font-semibold tracking-tight text-foreground"
                  >
                    {editingExpense ? "Edit Expense" : "New Expense"}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Keep your spending up to date.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-xl p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                  aria-label="Close expense form"
                >
                  <X size={21} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5">
                <ExpenseForm
                  key={editingExpense?.id ?? "new"}
                  initialExpense={editingExpense}
                  onCloseEdit={handleCloseForm}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
