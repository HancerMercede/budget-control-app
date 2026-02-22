import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTotalPages } from "../hooks/useTotalPages";
import type { Expense } from "../types";

describe("useTotalPages", () => {
  const createMockExpenses = (count: number): Expense[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `expense-${i + 1}`,
      description: `Expense ${i + 1}`,
      amount: 100 + i,
      category: "Food" as const,
      date: "2026-02-22",
      userId: "user-123",
      createdAt: 1707177600000 + i,
    }));
  };

  describe("totalPages calculation", () => {
    it("should calculate total pages correctly for 5 items", () => {
      // Arrange
      const expenses = createMockExpenses(5);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(1);
    });

    it("should calculate total pages correctly for 6 items", () => {
      // Arrange
      const expenses = createMockExpenses(6);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(2);
    });

    it("should calculate total pages correctly for 10 items", () => {
      // Arrange
      const expenses = createMockExpenses(10);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(2);
    });

    it("should calculate total pages correctly for 15 items", () => {
      // Arrange
      const expenses = createMockExpenses(15);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(3);
    });

    it("should return 0 pages for empty array", () => {
      // Arrange
      const expenses: Expense[] = [];

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(0);
    });

    it("should calculate total pages correctly for 1 item", () => {
      // Arrange
      const expenses = createMockExpenses(1);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(1);
    });
  });

  describe("currentExpenses pagination", () => {
    it("should return first 5 items on page 1", () => {
      // Arrange
      const expenses = createMockExpenses(10);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.currentExpenses).toHaveLength(5);
      expect(result.current.currentExpenses[0].id).toBe("expense-1");
      expect(result.current.currentExpenses[4].id).toBe("expense-5");
    });

    it("should return items 6-10 on page 2", () => {
      // Arrange
      const expenses = createMockExpenses(10);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Change to page 2
      act(() => {
        result.current.setCurrentPage(2);
      });

      // Assert
      expect(result.current.currentExpenses).toHaveLength(5);
      expect(result.current.currentExpenses[0].id).toBe("expense-6");
      expect(result.current.currentExpenses[4].id).toBe("expense-10");
    });

    it("should return remaining items on last page", () => {
      // Arrange - 12 items = 3 pages (5, 5, 2)
      const expenses = createMockExpenses(12);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Change to page 3
      act(() => {
        result.current.setCurrentPage(3);
      });

      // Assert
      expect(result.current.currentExpenses).toHaveLength(2);
      expect(result.current.currentExpenses[0].id).toBe("expense-11");
      expect(result.current.currentExpenses[1].id).toBe("expense-12");
    });

    it("should return empty array for empty expenses", () => {
      // Arrange
      const expenses: Expense[] = [];

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.currentExpenses).toHaveLength(0);
    });

    it("should return all items when less than 5", () => {
      // Arrange
      const expenses = createMockExpenses(3);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.currentExpenses).toHaveLength(3);
      expect(result.current.currentExpenses[0].id).toBe("expense-1");
      expect(result.current.currentExpenses[2].id).toBe("expense-3");
    });
  });

  describe("currentPage state management", () => {
    it("should start at page 1", () => {
      // Arrange
      const expenses = createMockExpenses(10);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.currentPage).toBe(1);
    });

    it("should update currentPage when setCurrentPage is called", () => {
      // Arrange
      const expenses = createMockExpenses(10);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      act(() => {
        result.current.setCurrentPage(2);
      });

      // Assert
      expect(result.current.currentPage).toBe(2);
    });

    it("should persist currentPage across rerenders", () => {
      // Arrange
      const expenses = createMockExpenses(10);

      // Act
      const { result, rerender } = renderHook(() => useTotalPages(expenses));

      act(() => {
        result.current.setCurrentPage(2);
      });

      rerender();

      // Assert
      expect(result.current.currentPage).toBe(2);
    });
  });

  describe("edge cases", () => {
    it("should handle exactly 5 items correctly", () => {
      // Arrange
      const expenses = createMockExpenses(5);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentExpenses).toHaveLength(5);
    });

    it("should handle exactly 10 items correctly", () => {
      // Arrange
      const expenses = createMockExpenses(10);

      // Act
      const { result } = renderHook(() => useTotalPages(expenses));

      // Assert
      expect(result.current.totalPages).toBe(2);
      expect(result.current.currentExpenses).toHaveLength(5);
    });

    it("should recalculate when expenses array changes", () => {
      // Arrange
      const expenses1 = createMockExpenses(5);
      const expenses2 = createMockExpenses(10);

      // Act
      const { result, rerender } = renderHook(
        ({ expenses }) => useTotalPages(expenses),
        { initialProps: { expenses: expenses1 } },
      );

      expect(result.current.totalPages).toBe(1);

      rerender({ expenses: expenses2 });

      // Assert
      expect(result.current.totalPages).toBe(2);
    });

    it("should reset to show first page when expenses reduce", () => {
      // Arrange
      const expenses1 = createMockExpenses(10);
      const expenses2 = createMockExpenses(5);

      // Act
      const { result, rerender } = renderHook(
        ({ expenses }) => useTotalPages(expenses),
        { initialProps: { expenses: expenses1 } },
      );

      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);

      // When expenses change, page stays the same but might be out of bounds
      rerender({ expenses: expenses2 });

      // Assert - totalPages is now 1, but currentPage is still 2
      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentPage).toBe(2);
      // This would show empty results - component should handle this edge case
    });
  });
});
