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
    // FIX: NO disparar el rollover hasta que el subscriber haya emitido al
    // menos una vez (loading=false). Antes, la condición
    // `if (expenses.length >= 0)` era siempre true incluso con expenses=[],
    // entonces el rollover se ejecutaba con el snapshot vacío ANTES de que
    // llegaran los gastos reales del mes anterior. Eso causaba
    // `remaining = baseBudget - 0 = baseBudget` → `newBudget = 2 * base`,
    // corrompiendo el currentBudget en cada cambio de mes.
    if (!userId || loading) return;

    const loadAndCheckRollover = async () => {
      // Verificar y realizar rollover si es necesario
      const budgetData = await checkAndPerformRollover(userId, expenses);
      setUserBudgetData(budgetData);
    };

    loadAndCheckRollover();
  }, [userId, expenses, loading]);

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
