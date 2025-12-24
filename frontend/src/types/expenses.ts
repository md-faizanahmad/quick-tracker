export type Currency = "₹" | "$" | "£" | "€" | "¥";
export interface Expense {
  id: string;
  currency: Currency;
  amount: number;
  category: string;
  date: string;
  note?: string;
  synced: boolean;
}
