import type { Expense } from "../types/expenses";
import { groupByCategory } from "../lib/analytics/categorySummary";

type Props = {
  expenses: Expense[];
};

export default function CategoryChart({ expenses }: Props) {
  const data = groupByCategory(expenses).slice(0, 5);
  const max = data[0]?.total ?? 1;

  return (
    <div className="bg-white rounded-xl  p-4 ">
      <h3 className="text-sm font-semibold mb-3">Where your money goes</h3>

      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between text-xs mb-1">
              <span>{item.category}</span>
              <span>{item.total.toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{
                  width: `${(item.total / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
