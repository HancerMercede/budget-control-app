// src/hooks/useExpenses.ts
import { useEffect, useState, useMemo } from "react";
import { subscribeToExpenses } from "../services/expenseService";
import { type Expense } from "../types";
import { getRemoteBudget } from "../config/firebase";

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
  const [userBudget, setUserBudget] = useState(0);

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
    const loadBudget = async () => {
      if (!userId) return;
      const amount = await getRemoteBudget(userId);
      setUserBudget(amount);
    };

    loadBudget();
  }, [userId]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const monthIndex = parseInt(expense.date.split("-")[1]) - 1;
      const monthName = months[monthIndex];

      return monthName === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  const totals = useMemo(() => {
    const consumed = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const budget = userBudget;
    return {
      consumed,
      budget,
      remaining: budget - consumed,
    };
  }, [expenses, userBudget]);

  return { expenses, filteredExpenses, loading, ...totals };
};
