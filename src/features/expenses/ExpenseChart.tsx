// src/features/dashboard/components/ExpenseChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useExpenses } from "../../hooks/useExpense";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  selectedMonth: string;
}

export const ExpenseChart = ({ selectedMonth }: Props) => {
  const { user } = useAuth();
  const userId = user?.uid ?? "";
  const { expenses } = useExpenses(selectedMonth, userId);

  const data = expenses.reduce((acc: any[], curr) => {
    const found = acc.find((item) => item.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const COLORS = ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"];

  return (
    <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 h-[300px]">
      <h3 className="text-white text-sm font-bold uppercase mb-4">
        Gastos por Categoría
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "none",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
