import { describe, it, expect } from "vitest";
import { formatFix } from "../components/utils/FormatFix";

describe("FormatFix", () => {
  describe("String Date Format (YYYY-MM-DD)", () => {
    it("should format valid YYYY-MM-DD string to MM/DD/YY", () => {
      // Arrange
      const input = "2026-02-22";

      // Act
      const result = formatFix(input);

      // Assert
      expect(result).toBe("02/22/26");
    });

    it("should format date with single-digit month and day", () => {
      const input = "2026-03-05";
      expect(formatFix(input)).toBe("03/05/26");
    });

    it("should handle date string with time component", () => {
      const input = "2026-12-31T23:59:59.000Z";
      expect(formatFix(input)).toBe("12/31/26");
    });

    it("should format year 2000 correctly", () => {
      const input = "2000-01-01";
      expect(formatFix(input)).toBe("01/01/00");
    });

    it("should format year 1999 correctly", () => {
      const input = "1999-12-31";
      expect(formatFix(input)).toBe("12/31/99");
    });
  });

  describe("Firebase Timestamp Format", () => {
    it("should format Firebase timestamp object with toDate method", () => {
      // Arrange - Mock Firebase Timestamp
      const mockTimestamp = {
        toDate: () => new Date("2026-02-22T12:00:00.000Z"),
      };

      // Act
      const result = formatFix(mockTimestamp);

      // Assert
      expect(result).toBe("02/22/26");
    });

    it("should handle timestamp with different date", () => {
      const mockTimestamp = {
        toDate: () => new Date("2025-11-15T08:30:00.000Z"),
      };
      expect(formatFix(mockTimestamp)).toBe("11/15/25");
    });

    it("should pad single-digit months and days from timestamp", () => {
      const mockTimestamp = {
        toDate: () => new Date("2026-03-05T12:00:00.000Z"),
      };
      expect(formatFix(mockTimestamp)).toBe("03/05/26");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should return '---' for null input", () => {
      expect(formatFix(null)).toBe("---");
    });

    it("should return '---' for undefined input", () => {
      expect(formatFix(undefined)).toBe("---");
    });

    it("should return '---' for empty string", () => {
      expect(formatFix("")).toBe("---");
    });

    it("should return input for invalid string format", () => {
      expect(formatFix("invalid-date")).toBe("invalid-date");
    });

    it("should return 'Fecha inv.' for object without toDate method", () => {
      const invalidObject = { someKey: "someValue" };
      expect(formatFix(invalidObject)).toBe("Fecha inv.");
    });

    it("should return 'Fecha inv.' for number input", () => {
      expect(formatFix(12345)).toBe("Fecha inv.");
    });

    it("should return 'Fecha inv.' for boolean input", () => {
      expect(formatFix(true)).toBe("Fecha inv.");
    });

    it("should return 'Fecha inv.' for array input", () => {
      expect(formatFix([])).toBe("Fecha inv.");
    });
  });

  describe("Partial Date Strings", () => {
    it("should handle date string with only year", () => {
      expect(formatFix("2026")).toBe("2026");
    });

    it("should handle date string with year and month only", () => {
      expect(formatFix("2026-02")).toBe("2026-02");
    });
  });

  describe("Date Boundaries", () => {
    it("should format first day of month correctly", () => {
      expect(formatFix("2026-01-01")).toBe("01/01/26");
    });

    it("should format last day of month correctly", () => {
      expect(formatFix("2026-12-31")).toBe("12/31/26");
    });

    it("should format leap year date correctly", () => {
      expect(formatFix("2024-02-29")).toBe("02/29/24");
    });
  });
});
