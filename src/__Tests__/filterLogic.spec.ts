import { describe, it, expect } from "vitest";
import type { Expense } from "../types";

const filterExpenses = (
  expenses: Expense[],
  selectedMonth: string,
  months: string[],
) => {
  return expenses.filter((expense: Expense) => {
    const monthIndex = parseInt(expense.date.split("-")[1]) - 1;
    const monthName = months[monthIndex];
    return monthName?.toLowerCase() === selectedMonth?.toLowerCase();
  });
};

describe("budget-control-app Filtering Logic", () => {
  const mockMonths = ["January", "February", "March"];

  const mockExpenses: Expense[] = [
    {
      id: "1",
      description: "Internet",
      amount: 100,
      category: "Services",
      date: "2026-01-15",
      userId: "user-1",
      createdAt: parseInt(new Date().toISOString()),
    },
    {
      id: "2",
      description: "Groceries",
      amount: 200,
      category: "Food",
      date: "2026-02-01",
      userId: "user-1",
      createdAt: parseInt(new Date().toISOString()),
    },
    {
      id: "3",
      description: "Gym",
      amount: 50,
      category: "Health",
      date: "2026-02-20",
      userId: "user-1",
      createdAt: parseInt(new Date().toISOString()),
    },
  ];

  it("should return only expenses from February", () => {
    const result = filterExpenses(mockExpenses, "February", mockMonths);
    expect(result).toHaveLength(2);
    expect(result[0].date).toContain("-02-");
  });

  it("should be case-insensitive for month matching", () => {
    const result = filterExpenses(mockExpenses, "february", mockMonths);
    expect(result).toHaveLength(2);
  });

  it("should return an empty array if the month has no records", () => {
    const result = filterExpenses(mockExpenses, "March", mockMonths);
    expect(result).toHaveLength(0);
  });
});
