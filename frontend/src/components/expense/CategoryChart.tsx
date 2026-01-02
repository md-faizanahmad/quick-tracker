// src/components/CategoryChart.tsx
import type { Expense } from "../../types/expenses";
import { groupByCategory } from "../../lib/analytics/categorySummary";

type Props = {
  expenses: Expense[];
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function CategoryChart({ expenses }: Props) {
  const data = groupByCategory(expenses).slice(0, 5);
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
        Where Your Money Goes
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
        {data.map((item, index) => {
          const percentage = (item.total / max) * 100;
          const color = COLORS[index % COLORS.length];

          return (
            <div key={item.category} className="flex flex-col items-center">
              {/* Radial Progress */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={`${percentage * 2.64} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>

                {/* Center value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs sm:text-sm font-bold text-gray-800">
                  <span>₹{item.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Category name */}
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-700 text-center">
                {item.category}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
