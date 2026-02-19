// src/hooks/useExpenses.ts
import { useEffect, useState, useMemo } from "react";
import { subscribeToExpenses } from "../services/expenseService";
import { type Expense, type UserBudgetData } from "../types";
import { checkAndPerformRollover } from "../services/budgetRolloverService";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const useExpenses = (selectedMonth: string, userId: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBudgetData, setUserBudgetData] = useState<UserBudgetData>({
    baseBudget: 0,
    currentBudget: 0,
    currentMonth: "",
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = subscribeToExpenses(userId, (data) => {
      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const loadAndCheckRollover = async () => {
      if (!userId) return;
      // Verificar y realizar rollover si es necesario
      const budgetData = await checkAndPerformRollover(userId, expenses);
      setUserBudgetData(budgetData);
    };

    if (expenses.length >= 0) {
      loadAndCheckRollover();
    }
  }, [userId, expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const monthIndex = parseInt(expense.date.split("-")[1]) - 1;
      const monthName = months[monthIndex];

      return monthName === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  const totals = useMemo(() => {
    // Calcular consumo solo del mes seleccionado
    const consumed = filteredExpenses.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );
    const budget = userBudgetData.currentBudget;
    return {
      consumed,
      budget,
      remaining: budget - consumed,
    };
  }, [filteredExpenses, userBudgetData]);

  return { expenses, filteredExpenses, loading, ...totals };
};
