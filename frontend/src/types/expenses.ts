export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  synced: boolean;
}
