import type { Expense } from "../../types/expenses";

const LIMITS = {
  AMOUNT_MAX: 1_000_000,
  NOTE_MAX: 60,
};

export type ExpenseInput = Pick<
  Expense,
  "amount" | "note" | "category" | "currency"
>;

export function validateExpense(input: ExpenseInput) {
  const errors: Partial<Record<keyof ExpenseInput, string>> = {};

  if (!input.amount || input.amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  } else if (input.amount > LIMITS.AMOUNT_MAX) {
    errors.amount = "Amount too large";
  }

  if (input.note && input.note.length > LIMITS.NOTE_MAX) {
    errors.note = `Note must be under ${LIMITS.NOTE_MAX} characters`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
