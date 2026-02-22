import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getCurrentMonth,
  getPreviousMonth,
  getRemoteBudget,
  updateBaseBudget,
  updateCurrentBudget,
} from "../config/firebase";
import type { UserBudgetData } from "../types";
import * as firestore from "firebase/firestore";

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe("firebase config", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-22T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getCurrentMonth", () => {
    it("should return current month in YYYY-MM format", () => {
      const result = getCurrentMonth();
      expect(result).toBe("2026-02");
    });

    it("should pad single-digit months with zero", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
      const result = getCurrentMonth();
      expect(result).toBe("2026-03");
    });

    it("should handle December correctly", () => {
      vi.setSystemTime(new Date("2025-12-31T23:59:59.000Z"));
      const result = getCurrentMonth();
      expect(result).toBe("2025-12");
    });

    it("should handle January correctly", () => {
      vi.setSystemTime(new Date("2026-01-15T12:00:00.000Z"));
      const result = getCurrentMonth();
      expect(result).toBe("2026-01");
    });
  });

  describe("getPreviousMonth", () => {
    it("should return previous month in YYYY-MM format", () => {
      const result = getPreviousMonth();
      expect(result).toBe("2026-01");
    });

    it("should handle year transition from January to December", () => {
      vi.setSystemTime(new Date("2026-01-15T12:00:00.000Z"));
      const result = getPreviousMonth();
      expect(result).toBe("2025-12");
    });

    it("should pad single-digit months with zero", () => {
      vi.setSystemTime(new Date("2026-10-15T12:00:00.000Z"));
      const result = getPreviousMonth();
      expect(result).toBe("2026-09");
    });

    it("should handle February correctly", () => {
      vi.setSystemTime(new Date("2026-03-01T12:00:00.000Z"));
      const result = getPreviousMonth();
      expect(result).toBe("2026-02");
    });
  });

  describe("getRemoteBudget", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-02-22T12:00:00.000Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return budget data when document exists", async () => {
      const mockUserId = "user-123";
      const mockDocRef = {};
      const mockData = {
        baseBudget: 50000,
        currentBudget: 48000,
        currentMonth: "2026-02",
      };

      vi.mocked(firestore.doc).mockReturnValue(mockDocRef as any);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => mockData,
      } as any);

      const result = await getRemoteBudget(mockUserId);

      expect(result).toEqual(mockData);
      expect(firestore.doc).toHaveBeenCalledWith({}, "users", mockUserId);
    });

    it("should migrate legacy monthlyBudget to new format", async () => {
      const mockUserId = "user-123";
      const mockDocRef = {};
      const mockLegacyData = {
        monthlyBudget: 50000,
      };

      vi.mocked(firestore.doc).mockReturnValue(mockDocRef as any);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => mockLegacyData,
      } as any);
      vi.mocked(firestore.setDoc).mockResolvedValue(undefined);

      const result = await getRemoteBudget(mockUserId);

      expect(result).toEqual({
        baseBudget: 50000,
        currentBudget: 50000,
        currentMonth: "2026-02",
      });
      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          baseBudget: 50000,
          currentBudget: 50000,
          currentMonth: "2026-02",
        },
        { merge: true },
      );
    });

    it("should return default budget when document does not exist", async () => {
      const mockUserId = "user-123";

      vi.mocked(firestore.doc).mockReturnValue({} as any);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => false,
      } as any);

      const result = await getRemoteBudget(mockUserId);

      expect(result).toEqual({
        baseBudget: 0,
        currentBudget: 0,
        currentMonth: "2026-02",
      });
    });

    it("should handle missing fields with defaults", async () => {
      const mockUserId = "user-123";

      vi.mocked(firestore.doc).mockReturnValue({} as any);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({}),
      } as any);

      const result = await getRemoteBudget(mockUserId);

      expect(result).toEqual({
        baseBudget: 0,
        currentBudget: 0,
        currentMonth: "2026-02",
      });
    });
  });

  describe("updateBaseBudget", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-02-22T12:00:00.000Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should update both base and current budget", async () => {
      const mockUserId = "user-123";
      const mockAmount = 60000;
      const mockDocRef = {};
      const existingData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 48000,
        currentMonth: "2026-02",
      };

      vi.mocked(firestore.doc).mockReturnValue(mockDocRef as any);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => existingData,
      } as any);
      vi.mocked(firestore.setDoc).mockResolvedValue(undefined);

      await updateBaseBudget(mockUserId, mockAmount);

      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          baseBudget: mockAmount,
          currentBudget: mockAmount,
          currentMonth: "2026-02",
        },
        { merge: true },
      );
    });

    it("should preserve current month when updating", async () => {
      const mockUserId = "user-123";
      const mockAmount = 75000;
      const mockDocRef = {};
      const existingData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 48000,
        currentMonth: "2026-01",
      };

      vi.mocked(firestore.doc).mockReturnValue(mockDocRef as any);
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => existingData,
      } as any);
      vi.mocked(firestore.setDoc).mockResolvedValue(undefined);

      await updateBaseBudget(mockUserId, mockAmount);

      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          baseBudget: mockAmount,
          currentBudget: mockAmount,
          currentMonth: "2026-01",
        },
        { merge: true },
      );
    });
  });

  describe("updateCurrentBudget", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should update budget data", async () => {
      const mockUserId = "user-123";
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 55000,
        currentMonth: "2026-02",
      };
      const mockDocRef = {};

      vi.mocked(firestore.doc).mockReturnValue(mockDocRef as any);
      vi.mocked(firestore.setDoc).mockResolvedValue(undefined);

      await updateCurrentBudget(mockUserId, mockBudgetData);

      expect(firestore.doc).toHaveBeenCalledWith({}, "users", mockUserId);
      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        mockBudgetData,
        { merge: true },
      );
    });

    it("should handle budget with rollover", async () => {
      const mockUserId = "user-123";
      const mockBudgetData: UserBudgetData = {
        baseBudget: 50000,
        currentBudget: 95000,
        currentMonth: "2026-03",
      };
      const mockDocRef = {};

      vi.mocked(firestore.doc).mockReturnValue(mockDocRef as any);
      vi.mocked(firestore.setDoc).mockResolvedValue(undefined);

      await updateCurrentBudget(mockUserId, mockBudgetData);

      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        mockBudgetData,
        { merge: true },
      );
    });
  });
});
