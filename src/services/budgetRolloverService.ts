import { type Expense, type UserBudgetData } from "../types";
import {
  getRemoteBudget,
  updateCurrentBudget,
  getCurrentMonth,
  getPreviousMonth,
} from "../config/firebase";

const calculateMonthlyExpenses = (
  expenses: Expense[],
  month: string,
): number => {
  return expenses
    .filter((expense) => {
      const expenseMonth = expense.date.substring(0, 7); // "YYYY-MM"
      return expenseMonth === month;
    })
    .reduce((total, expense) => total + expense.amount, 0);
};

export const checkAndPerformRollover = async (
  userId: string,
  allExpenses: Expense[],
): Promise<UserBudgetData> => {
  const budgetData = await getRemoteBudget(userId);
  const currentMonth = getCurrentMonth();

  // Si el mes guardado es diferente al mes actual, hacer rollover
  if (budgetData.currentMonth !== currentMonth) {
    const previousMonth = getPreviousMonth();
    const previousMonthExpenses = calculateMonthlyExpenses(
      allExpenses,
      previousMonth,
    );

    // Calcular sobrante del mes anterior
    const previousBudget = budgetData.currentBudget;
    const remaining = previousBudget - previousMonthExpenses;

    // Rollover solo si es positivo
    const newBudget =
      remaining > 0 ? budgetData.baseBudget + remaining : budgetData.baseBudget;

    const newBudgetData: UserBudgetData = {
      baseBudget: budgetData.baseBudget,
      currentBudget: newBudget,
      currentMonth: currentMonth,
    };

    await updateCurrentBudget(userId, newBudgetData);
    return newBudgetData;
  }

  return budgetData;
};
