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

    it("should handle negative balance correctly without accumulating", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 100,
        currentMonth: "2026-01",
      };

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // FIX: el rollover se calcula contra el BASE, no contra el current inflado.
      // Aunque currentBudget anterior sea 100 (caso patológico), el cálculo usa base=50000.
      // January expenses = 150 + 50 = 200
      // remainingOnBase = 50000 - 200 = 49800
      // New budget = 50000 + 49800 = 99800

      const result = await checkAndPerformRollover(mockUserId, mockExpenses);

      expect(firebase.updateCurrentBudget).toHaveBeenCalledWith(mockUserId, {
        baseBudget: 50000,
        currentBudget: 99800,
        currentMonth: "2026-02",
      });
      expect(result.currentBudget).toBe(99800);
    });

    it("should handle when expenses exceed baseBudget (no carry-over)", async () => {
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-01",
      };

      // Gastos que EXCEDEN el base (más de 50k en enero)
      const overBudgetExpenses: Expense[] = [
        {
          id: "1",
          description: "Big purchase",
          amount: 60000,
          category: "Other",
          date: "2026-01-10",
          userId: mockUserId,
          createdAt: 1704854400000,
        },
      ];

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // remainingOnBase = 50000 - 60000 = -10000 → carriedOver = 0
      // New budget = 50000 + 0 = 50000 (reset puro)

      const result = await checkAndPerformRollover(
        mockUserId,
        overBudgetExpenses,
      );

      expect(firebase.updateCurrentBudget).toHaveBeenCalledWith(mockUserId, {
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-02",
      });
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

      // FIX: el remaining se calcula contra el BASE (50000), NO contra el current (45000).
      // December expenses = 3000
      // remainingOnBase = 50000 - 3000 = 47000
      // New budget = 50000 + 47000 = 97000

      const result = await checkAndPerformRollover(mockUserId, decemberExpenses);

      expect(result).toEqual({
        baseBudget: 50000,
        currentBudget: 97000,
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

    // ===== Tests del FIX anti-acumulación =====
    // El bug original: newBudget = baseBudget + (currentBudget_anterior - gastos).
    // Si currentBudget_anterior ya estaba inflado por rollovers previos, el
    // cálculo sumaba el base entero una y otra vez → crecimiento exponencial.
    //
    // El fix: remaining se calcula contra BASE, no contra CURRENT.
    // Cada rollover parte del base real del usuario.

    it("FIX: should ignore inflated currentBudget from previous bug", async () => {
      // Simulamos que el currentBudget quedó inflado (bug pre-existente):
      // la BD tiene current=200000, base=50000.
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 200000,    // ← inflado por bug previo
        currentMonth: "2026-01",
      };

      const expenses: Expense[] = [
        {
          id: "1",
          description: "Normal expense",
          amount: 25000,
          category: "Food",
          date: "2026-01-15",
          userId: mockUserId,
          createdAt: 1706112000000,
        },
      ];

      vi.mocked(firebase.getRemoteBudget).mockResolvedValue(mockBudgetData);
      vi.mocked(firebase.getCurrentMonth).mockReturnValue("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValue("2026-01");

      // FIX: aunque el current es 200000, calculamos contra el base.
      // remainingOnBase = 50000 - 25000 = 25000
      // New budget = 50000 + 25000 = 75000 (NO 225000 como haría el bug)

      const result = await checkAndPerformRollover(mockUserId, expenses);

      expect(result.currentBudget).toBe(75000);
    });

    it("FIX: should not accumulate base across consecutive rollovers", async () => {
      // Simulamos 2 rollovers seguidos con gastos = 0 (no expense enregistrée).
      // Bug viejo: base 50 → mes2 current 100 → mes3 current 150 → ...
      // Fix: base 50 → mes2 current 100 → mes3 current 100 → mes4 current 100.
      //        (estable: solo suma el base + lo ahorrado del base del mes anterior)

      // PRIMER rollover: enero → febrero
      vi.mocked(firebase.getRemoteBudget).mockResolvedValueOnce({
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-01",
      });
      vi.mocked(firebase.getCurrentMonth).mockReturnValueOnce("2026-02");
      vi.mocked(firebase.getPreviousMonth).mockReturnValueOnce("2026-01");

      const firstRollover = await checkAndPerformRollover(mockUserId, []);
      // remainingOnBase = 50000 - 0 = 50000 → newBudget = 50000 + 50000 = 100000

      expect(firstRollover.currentBudget).toBe(100000);

      // SEGUNDO rollover: febrero → marzo (current ahora 100k)
      vi.mocked(firebase.getRemoteBudget).mockResolvedValueOnce({
        baseBudget: 50000,
        currentBudget: 100000,    // ← ya tiene rollover acumulado
        currentMonth: "2026-02",
      });
      vi.mocked(firebase.getCurrentMonth).mockReturnValueOnce("2026-03");
      vi.mocked(firebase.getPreviousMonth).mockReturnValueOnce("2026-02");

      const secondRollover = await checkAndPerformRollover(mockUserId, []);
      // FIX: remainingOnBase = 50000 - 0 = 50000 → newBudget = 50000 + 50000 = 100000
      // Bug viejo daría: 50000 + 100000 = 150000 (acumulación)

      expect(secondRollover.currentBudget).toBe(100000);
      expect(secondRollover.currentBudget).toBe(firstRollover.currentBudget);
    });

    it("FIX: should keep currentBudget stable across many rollovers with no expenses", async () => {
      // 4 rollovers consecutivos, sin gastos nunca.
      // Bug viejo: 50 → 100 → 150 → 200 → 250.
      // Fix: 50 → 100 → 100 → 100 → 100 (estable a partir del 2do rollover).

      const expectedStableCurrent = 100000;

      for (let i = 0; i < 4; i++) {
        const month = `2026-${String(i + 2).padStart(2, "0")}`;
        const prev = `2026-${String(i + 1).padStart(2, "0")}`;

        vi.mocked(firebase.getRemoteBudget).mockResolvedValueOnce({
          baseBudget: 50000,
          currentBudget: i === 0 ? 50000 : 100000,
          currentMonth: prev,
        });
        vi.mocked(firebase.getCurrentMonth).mockReturnValueOnce(month);
        vi.mocked(firebase.getPreviousMonth).mockReturnValueOnce(prev);

        const result = await checkAndPerformRollover(mockUserId, []);
        expect(result.currentBudget).toBe(expectedStableCurrent);
      }
    });
  });
});
