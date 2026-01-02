// src/App.tsx
import { useState } from "react";
import Header from "./components/Header";
import ExpenseForm from "./components/expense/ExpenseForm";
import ExpenseList from "./components/expense/ExpenseList";
import { useSync } from "./hooks/useSync";
import { Plus, X } from "lucide-react"; // Added Mail icon
import type { Expense } from "./types/expenses";
import InstallPrompt from "./components/InstallPrompt";
import Footer from "./components/Footer";

export default function App() {
  useSync();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
    } else {
      setEditingExpense(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Header />

        <main className="grow container mx-auto px-4 py-6 lg:py-8">
          <InstallPrompt />

          {/* HERO SECTION */}

          {/* Floating Add button – mobile */}
          <button
            onClick={() => handleOpenForm()}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all md:hidden"
            aria-label="Add new expense"
          >
            <Plus size={28} />
          </button>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Desktop Form (Sidebar style) */}
            <div className="hidden md:block w-full lg:w-5/12 xl:w-4/12 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
              <ExpenseForm
                key={editingExpense?.id ?? "new"}
                initialExpense={editingExpense}
                onCloseEdit={() => setEditingExpense(null)}
              />
            </div>

            {/* Expense List (Full width on mobile, 7/12 on desktop) */}
            <div className="w-full md:w-full lg:w-7/12 xl:w-8/12">
              <ExpenseList onEdit={handleOpenForm} />
            </div>
          </div>

          {/* Mobile Modal for Form */}
          {isFormOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:hidden">
              <div className="bg-white w-full rounded-t-3xl max-h-[90vh] mb-2 ms-2 me-2 overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex justify-between items-center z-10">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingExpense ? "Edit Expense" : "New Expense"}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X size={25} className="text-red-500" />
                  </button>
                </div>
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

        {/* FOOTER SECTION */}
        <Footer />
      </div>
    </>
  );
}
