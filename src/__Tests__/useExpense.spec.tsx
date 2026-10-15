import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useExpenses } from "../hooks/useExpense";
import * as expenseService from "../services/expenseService";
import * as budgetRolloverService from "../services/budgetRolloverService";
import type { Expense } from "../types";

vi.mock("../services/expenseService", () => ({
  subscribeToExpenses: vi.fn(),
}));

vi.mock("../services/budgetRolloverService", () => ({
  checkAndPerformRollover: vi.fn(),
}));

describe("useExpenses hook - rollover timing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("FIX: should NOT call rollover check before subscriber emits (loading=true)", () => {
    // Mockeamos el subscriber para que NUNCA emita (simula snapshot aún cargando).
    // Con el bug, el useEffect de la línea 44-55 dispara checkAndPerformRollover
    // apenas se monta el hook, con expenses=[]. Eso corrompe el currentBudget.
    // Con el fix, el useEffect debe esperar a que loading sea false.
    vi.mocked(expenseService.subscribeToExpenses).mockImplementation(
      () => vi.fn(), // unsubscribe, pero el callback interno nunca se invoca
    );
    vi.mocked(budgetRolloverService.checkAndPerformRollover).mockResolvedValue({
      baseBudget: 50000,
      currentBudget: 50000,
      currentMonth: "2026-02",
    });

    // Render del hook. En el render inicial loading=true y expenses=[].
    renderHook(() => useExpenses("Febrero", "user-123"));

    // El rollover check NO debe haberse llamado todavía.
    expect(
      budgetRolloverService.checkAndPerformRollover,
    ).not.toHaveBeenCalled();
  });

  it("should call rollover check AFTER subscriber emits (loading=false)", async () => {
    // Capturamos el callback del subscriber para dispararlo manualmente
    // y simular que el snapshot de Firestore ya llegó.
    let capturedCallback: ((data: Expense[]) => void) | null = null;
    vi.mocked(expenseService.subscribeToExpenses).mockImplementation(
      (_userId, cb) => {
        capturedCallback = cb as (data: Expense[]) => void;
        return vi.fn();
      },
    );
    vi.mocked(budgetRolloverService.checkAndPerformRollover).mockResolvedValue({
      baseBudget: 50000,
      currentBudget: 50000,
      currentMonth: "2026-02",
    });

    renderHook(() => useExpenses("Febrero", "user-123"));

    // Antes de emitir: no se llamó
    expect(
      budgetRolloverService.checkAndPerformRollover,
    ).not.toHaveBeenCalled();

    // Emitimos el snapshot dentro de act() para que React flush los state
    // updates y el segundo useEffect re-corra con loading=false.
    expect(capturedCallback).not.toBeNull();
    act(() => {
      capturedCallback!([]);
    });

    // Después de emitir: loading=false, el rollover check debe dispararse
    await waitFor(() =>
      expect(
        budgetRolloverService.checkAndPerformRollover,
      ).toHaveBeenCalledTimes(1),
    );
    expect(
      budgetRolloverService.checkAndPerformRollover,
    ).toHaveBeenCalledWith("user-123", []);
  });
});