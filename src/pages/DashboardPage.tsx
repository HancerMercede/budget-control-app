// src/pages/DashboardPage.tsx
import { useExpenses } from "../hooks/useExpense";
import { StatsCard } from "../features/dashboard/cards/StatsCard";
import { ExpenseForm } from "../features/expenses/ExpenseForm";
import { ExpenseTable } from "../features/expenses/ExpenseTable";
import { TrendingDown, Receipt } from "lucide-react";
import { MonthFilter } from "../features/filters/MonthFilter";
import { ExpenseChart } from "../features/expenses/ExpenseChart";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { BudgetCard } from "../components/Budget/BugedCard";
import { LoadComponent } from "../components/Load/LoadComponent";
import { Header } from "../components/Header/Header";
import { getCurrentMonthName } from "../components/utils/GetCurrentMonth";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName());

  const { expenses, consumed, remaining, loading, filteredExpenses } =
    useExpenses(selectedMonth, user?.uid ?? "");

  if (loading) {
    return <LoadComponent />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
      <Header selectedMonth={selectedMonth} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BudgetCard />
        <StatsCard
          title="Consumo"
          amount={consumed}
          icon={TrendingDown}
          color="text-red-500"
        />
        <StatsCard
          title="Restante"
          amount={remaining}
          icon={Receipt}
          color="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MonthFilter
            currentMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <ExpenseTable expenses={filteredExpenses} />
        </div>

        <div className="space-y-6">
          <ExpenseForm />
          <ExpenseChart selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
};
