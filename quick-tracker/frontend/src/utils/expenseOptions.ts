export const CATEGORIES = [
  { value: "Bills", icon: "📄" },
  { value: "Groceries", icon: "🛒" },
  { value: "Entertainment", icon: "🎬" },
  { value: "Shopping", icon: "🛍️" },
  { value: "Food", icon: "🍽️" },
  { value: "Study", icon: "📚" },
  { value: "Transport", icon: "🚕" },
  { value: "Rent", icon: "🏠" },
  { value: "Health", icon: "🏥" },
  { value: "Other", icon: "❓" },
] as const;

export type ExpenseCategory = (typeof CATEGORIES)[number]["value"];

export const CATEGORY_ICONS: Record<ExpenseCategory, string> =
  Object.fromEntries(
    CATEGORIES.map(({ value, icon }) => [value, icon]),
  ) as Record<ExpenseCategory, string>;

export const CURRENCIES = [
  { code: "₹", label: "INR", flag: "🇮🇳" },
  { code: "$", label: "USD", flag: "🇺🇸" },
  { code: "£", label: "GBP", flag: "🇬🇧" },
  { code: "€", label: "EUR", flag: "🇪🇺" },
  { code: "¥", label: "JPY", flag: "🇯🇵" },
] as const;

export type ExpenseCurrency = (typeof CURRENCIES)[number]["code"];
