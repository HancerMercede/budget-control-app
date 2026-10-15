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

    // FIX: el remaining se calcula contra el baseBudget, NO contra el
    // currentBudget. Antes se usaba el currentBudget (línea anterior al fix),
    // que podía estar inflado por rollovers previos y generaba acumulación
    // exponencial mes a mes. Ahora cada rollover parte del base real del
    // usuario y solo transfiere lo que SOBRÓ del presupuesto base del mes
    // anterior — nunca del current inflado.
    const remainingOnBase = budgetData.baseBudget - previousMonthExpenses;
    const carriedOver = remainingOnBase > 0 ? remainingOnBase : 0;

    // Reset al base + lo que ahorraste del presupuesto base del mes anterior
    const newBudget = budgetData.baseBudget + carriedOver;

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
