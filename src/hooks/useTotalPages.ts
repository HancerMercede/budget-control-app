import { useState } from "react";
import type { Expense } from "../types";

export const useTotalPages = (expenses: Expense[]) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentExpenses = expenses.slice(start, start + itemsPerPage);

  return { totalPages, currentExpenses, setCurrentPage, currentPage };
};
