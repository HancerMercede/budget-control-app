import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkAndPerformRollover } from "../services/budgetRolloverService";
import type { Expense, UserBudgetData } from "../types";
import * as firebase from "../config/firebase";

vi.mock("../config/firebase", () => ({
  getRemoteBudget: vi.fn(),
  updateCurrentBudget: vi.fn(),
  getCurrentMonth: vi.fn(),
  getPreviousMonth: vi.fn(),
}));

describe("budgetRolloverService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkAndPerformRollover", () => {
    const mockUserId = "user-123";
    const mockExpenses: Expense[] = [
      {
        id: "1",
        description: "Groceries",
        amount: 150,
        category: "Food",
        date: "2026-01-15",
        userId: mockUserId,
        createdAt: 1706112000000,
      },
      {
        id: "2",
        description: "Gas",
        amount: 50,
        category: "Transportation",
        date: "2026-01-20",
        userId: mockUserId,
        createdAt: 1706544000000,
      },
      {
        id: "3",
        description: "Coffee",
        amount: 25,
        category: "Food",
        date: "2026-02-05",
        userId: mockUserId,
        createdAt: 1707177600000,
      },
    ];

    it("should return existing budget data when month hasn't changed", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 48000,
        currentMonth: "2026-02",
      };

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");

      const result = await checkAndPerformRollover(mockUserId, mockExpenses);

      expect(result).toEqual(mockBudgetData);
      expect(firebase.updateCurrentBudget).not.toHaveBeenCalled();
    });

    it("should perform rollover with positive remaining balance", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-01",
      };

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // January expenses = 150 + 50 = 200
      // Remaining = 50000 - 200 = 49800
      // New budget = 50000 + 49800 = 99800

      const result = await checkAndPerformRollover(mockUserId, mockExpenses);

      expect(firebase.updateCurrentBudget).toHaveBeenCalledWith(mockUserId, {
        baseBudget: 50000,
        currentBudget: 99800,
        currentMonth: "2026-02",
      });
      expect(result).toEqual({
        baseBudget: 50000,
        currentBudget: 99800,
        currentMonth: "2026-02",
      });
    });

    it("should not rollover negative balance", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 100,
        currentMonth: "2026-01",
      };

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // January expenses = 200
      // Remaining = 100 - 200 = -100 (negative)
      // New budget = 50000 (no rollover)

      const result = await checkAndPerformRollover(mockUserId, mockExpenses);

      expect(firebase.updateCurrentBudget).toHaveBeenCalledWith(mockUserId, {
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-02",
      });
      expect(result.currentBudget).toBe(50000);
    });

    it("should handle zero remaining balance correctly", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 200,
        currentMonth: "2026-01",
      };

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // January expenses = 200
      // Remaining = 200 - 200 = 0
      // New budget = 50000 (no rollover when 0)

      const result = await checkAndPerformRollover(mockUserId, mockExpenses);

      expect(result.currentBudget).toBe(50000);
    });

    it("should handle empty expenses array", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-01",
      };

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // No expenses = 0
      // Remaining = 50000 - 0 = 50000
      // New budget = 50000 + 50000 = 100000

      const result = await checkAndPerformRollover(mockUserId, []);

      expect(result.currentBudget).toBe(100000);
    });

    it("should handle month transition from December to January", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 45000,
        currentMonth: "2025-12",
      };

      const decemberExpenses: Expense[] = [
        {
          id: "1",
          description: "Holiday shopping",
          amount: 3000,
          category: "Shopping",
          date: "2025-12-20",
          userId: mockUserId,
          createdAt: 1703030400000,
        },
      ];

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-01");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2025-12");

      // December expenses = 3000
      // Remaining = 45000 - 3000 = 42000
      // New budget = 50000 + 42000 = 92000

      const result = await checkAndPerformRollover(mockUserId, decemberExpenses);

      expect(result).toEqual({
        baseBudget: 50000,
        currentBudget: 92000,
        currentMonth: "2026-01",
      });
    });

    it("should only calculate expenses from previous month", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-01",
      };

      const multiMonthExpenses: Expense[] = [
        {
          id: "1",
          description: "December expense",
          amount: 1000,
          category: "Other",
          date: "2025-12-25",
          userId: mockUserId,
          createdAt: 1703462400000,
        },
        {
          id: "2",
          description: "January expense",
          amount: 500,
          category: "Food",
          date: "2026-01-15",
          userId: mockUserId,
          createdAt: 1706112000000,
        },
        {
          id: "3",
          description: "February expense",
          amount: 300,
          category: "Food",
          date: "2026-02-05",
          userId: mockUserId,
          createdAt: 1707177600000,
        },
      ];

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // Only January expense should count = 500
      // Remaining = 50000 - 500 = 49500
      // New budget = 50000 + 49500 = 99500

      const result = await checkAndPerformRollover(
        mockUserId,
        multiMonthExpenses,
      );

      expect(result.currentBudget).toBe(99500);
    });
  });
});
