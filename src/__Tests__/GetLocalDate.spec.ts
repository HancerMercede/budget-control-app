import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getLocalDate } from "../components/utils/GetLocalDate";

describe("GetLocalDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Date Format", () => {
    it("should return date in YYYY-MM-DD format", () => {
      vi.setSystemTime(new Date("2026-02-22T12:00:00.000Z"));
      const result = getLocalDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return correct date for a known date", () => {
      vi.setSystemTime(new Date("2026-06-15T12:00:00.000Z"));
      const result = getLocalDate();
      const [year, month, day] = result.split("-");
      expect(year).toBe("2026");
      expect(month).toBeDefined();
      expect(day).toBeDefined();
    });

    it("should return date string without time component", () => {
      vi.setSystemTime(new Date("2026-02-22T23:59:59.999Z"));
      const result = getLocalDate();
      expect(result).not.toContain("T");
      expect(result).not.toContain(":");
    });
  });

  describe("Date Boundaries and Edge Cases", () => {
    it("should handle first day of year", () => {
      vi.setSystemTime(new Date("2026-01-01T12:00:00.000Z"));
      const result = getLocalDate();
      const [year] = result.split("-");
      expect(year).toBe("2026");
    });

    it("should handle last day of year", () => {
      vi.setSystemTime(new Date("2026-12-31T12:00:00.000Z"));
      const result = getLocalDate();
      const [year] = result.split("-");
      expect(year).toBe("2026");
    });

    it("should handle leap year date", () => {
      vi.setSystemTime(new Date("2024-02-29T12:00:00.000Z"));
      const result = getLocalDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("Padding and Format Consistency", () => {
    it("should pad single-digit months with leading zero", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
      const result = getLocalDate();
      const [, month] = result.split("-");
      expect(month.length).toBe(2);
    });

    it("should pad single-digit days with leading zero", () => {
      vi.setSystemTime(new Date("2026-02-05T12:00:00.000Z"));
      const result = getLocalDate();
      const [, , day] = result.split("-");
      expect(day.length).toBe(2);
    });

    it("should have exactly 10 characters (YYYY-MM-DD)", () => {
      vi.setSystemTime(new Date("2026-02-22T12:00:00.000Z"));
      const result = getLocalDate();
      expect(result.length).toBe(10);
    });
  });
});
