export interface Expense {
  id: string;
  amounr: number;
  category: string;
  date: string;
  node?: string;
  synced: boolean;
}
