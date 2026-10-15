import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveExpense, subscribeToExpenses, deleteExpense } from "../services/expenseService";
import type { Expense } from "../types";
import * as firestore from "firebase/firestore";

// Mock Firebase Firestore
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "mock-collection-ref"),
  addDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  where: vi.fn(),
}));

vi.mock("../config/firebase", () => ({
  db: {},
}));

describe("expenseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.Date.now = vi.fn(() => 1707177600000); // Mock Date.now
  });

  describe("saveExpense", () => {
    it("should save expense with createdAt timestamp", async () => {
      // Arrange
      const mockExpense = {
        description: "Groceries",
        amount: 150,
        category: "Food" as const,
        date: "2026-02-22",
        userId: "user-123",
      };

      vi.mocked(firestore.addDoc).mockResolvedValue({
        id: "new-expense-id",
      } as any);

      // Act
      await saveExpense(mockExpense);

      // Assert
      expect(firestore.collection).toHaveBeenCalledWith({}, "expenses");
      expect(firestore.addDoc).toHaveBeenCalledWith(
        expect.anything(),
        {
          ...mockExpense,
          createdAt: 1707177600000,
        },
      );
    });

    it("should throw error when save fails", async () => {
      // Arrange
      const mockExpense = {
        description: "Groceries",
        amount: 150,
        category: "Food" as const,
        date: "2026-02-22",
        userId: "user-123",
      };

      const mockError = new Error("Firebase error");
      vi.mocked(firestore.addDoc).mockRejectedValue(mockError);

      // Act & Assert
      await expect(saveExpense(mockExpense)).rejects.toThrow("Firebase error");
    });
  });

  describe("subscribeToExpenses", () => {
    it("should subscribe to expenses with correct query", () => {
      // Arrange
      const mockUserId = "user-123";
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockQuery = {};
      vi.mocked(firestore.query).mockReturnValue(mockQuery as any);
      vi.mocked(firestore.where).mockReturnValue({} as any);
      vi.mocked(firestore.orderBy).mockReturnValue({} as any);
      vi.mocked(firestore.onSnapshot).mockReturnValue(mockUnsubscribe);

      // Act
      const unsubscribe = subscribeToExpenses(mockUserId, mockCallback);

      // Assert
      expect(firestore.collection).toHaveBeenCalledWith({}, "expenses");
      expect(firestore.where).toHaveBeenCalledWith("userId", "==", mockUserId);
      expect(firestore.orderBy).toHaveBeenCalledWith("createdAt", "desc");
      expect(firestore.query).toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("should call callback with mapped expenses", () => {
      // Arrange
      const mockUserId = "user-123";
      const mockCallback = vi.fn();

      const mockDocs = [
        {
          id: "1",
          data: () => ({
            description: "Groceries",
            amount: 150,
            category: "Food",
            date: "2026-02-22",
            userId: mockUserId,
            createdAt: 1707177600000,
          }),
        },
        {
          id: "2",
          data: () => ({
            description: "Gas",
            amount: 50,
            category: "Transportation",
            date: "2026-02-21",
            userId: mockUserId,
            createdAt: 1707091200000,
          }),
        },
      ];

      vi.mocked(firestore.query).mockReturnValue({} as any);
      vi.mocked(firestore.where).mockReturnValue({} as any);
      vi.mocked(firestore.orderBy).mockReturnValue({} as any);
      vi.mocked(firestore.onSnapshot).mockImplementation((q, callback: any) => {
        const snapshot = {
          docs: mockDocs,
        };
        callback(snapshot);
        return vi.fn();
      });

      // Act
      subscribeToExpenses(mockUserId, mockCallback);

      // Assert
      expect(mockCallback).toHaveBeenCalledWith([
        {
          id: "1",
          description: "Groceries",
          amount: 150,
          category: "Food",
          date: "2026-02-22",
          userId: mockUserId,
          createdAt: 1707177600000,
        },
        {
          id: "2",
          description: "Gas",
          amount: 50,
          category: "Transportation",
          date: "2026-02-21",
          userId: mockUserId,
          createdAt: 1707091200000,
        },
      ]);
    });

    it("should handle empty snapshot", () => {
      // Arrange
      const mockUserId = "user-123";
      const mockCallback = vi.fn();

      vi.mocked(firestore.query).mockReturnValue({} as any);
      vi.mocked(firestore.where).mockReturnValue({} as any);
      vi.mocked(firestore.orderBy).mockReturnValue({} as any);
      vi.mocked(firestore.onSnapshot).mockImplementation((q, callback: any) => {
        const snapshot = { docs: [] };
        callback(snapshot);
        return vi.fn();
      });

      // Act
      subscribeToExpenses(mockUserId, mockCallback);

      // Assert
      expect(mockCallback).toHaveBeenCalledWith([]);
    });
  });

  describe("deleteExpense", () => {
    it("should delete expense by id", async () => {
      // Arrange
      const mockId = "expense-123";
      const mockDocRef = { id: mockId };

      vi.mocked(firestore.doc).mockReturnValue(mockDocRef as any);
      vi.mocked(firestore.deleteDoc).mockResolvedValue(undefined);

      // Act
      await deleteExpense(mockId);

      // Assert
      expect(firestore.doc).toHaveBeenCalledWith({}, "expenses", mockId);
      expect(firestore.deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it("should throw error when delete fails", async () => {
      // Arrange
      const mockId = "expense-123";
      const mockError = new Error("Delete failed");

      vi.mocked(firestore.doc).mockReturnValue({} as any);
      vi.mocked(firestore.deleteDoc).mockRejectedValue(mockError);

      // Act & Assert
      await expect(deleteExpense(mockId)).rejects.toThrow("Delete failed");
    });
  });
});
