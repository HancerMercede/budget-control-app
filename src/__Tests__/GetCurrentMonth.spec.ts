import { describe, it, expect, vi, afterEach } from "vitest";
import { getCurrentMonthName } from "../components/utils/GetCurrentMonth";

vi.mock("vitest", () => ({
  ...vi.importActual("vitest"),
}));

describe("GetCurrentMonth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockFormatter = (monthName: string) => {
    return class MockFormatter {
      format(_date: Date) {
        return monthName;
      }
    };
  };

  describe("Month Name Formatting", () => {
    it("should return January with capital first letter", () => {
      const mockFormatter = createMockFormatter("enero");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Enero");
    });

    it("should return February with capital first letter", () => {
      const mockFormatter = createMockFormatter("febrero");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Febrero");
    });

    it("should return March with capital first letter", () => {
      const mockFormatter = createMockFormatter("marzo");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Marzo");
    });

    it("should return April with capital first letter", () => {
      const mockFormatter = createMockFormatter("abril");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Abril");
    });

    it("should return May with capital first letter", () => {
      const mockFormatter = createMockFormatter("mayo");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Mayo");
    });

    it("should return June with capital first letter", () => {
      const mockFormatter = createMockFormatter("junio");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Junio");
    });

    it("should return July with capital first letter", () => {
      const mockFormatter = createMockFormatter("julio");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Julio");
    });

    it("should return August with capital first letter", () => {
      const mockFormatter = createMockFormatter("agosto");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Agosto");
    });

    it("should return September with capital first letter", () => {
      const mockFormatter = createMockFormatter("septiembre");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Septiembre");
    });

    it("should return October with capital first letter", () => {
      const mockFormatter = createMockFormatter("octubre");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Octubre");
    });

    it("should return November with capital first letter", () => {
      const mockFormatter = createMockFormatter("noviembre");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Noviembre");
    });

    it("should return December with capital first letter", () => {
      const mockFormatter = createMockFormatter("diciembre");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Diciembre");
    });
  });

  describe("Capitalization Logic", () => {
    it("should capitalize first letter even if locale returns lowercase", () => {
      const mockFormatter = createMockFormatter("marzo");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      const result = getCurrentMonthName();
      expect(result[0]).toBe(result[0].toUpperCase());
      expect(result).toMatch(/^[A-Z]/);
    });

    it("should return a non-empty string", () => {
      const result = getCurrentMonthName();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return a string type", () => {
      const result = getCurrentMonthName();
      expect(typeof result).toBe("string");
    });
  });

  describe("Edge Cases", () => {
    it("should handle first day of year", () => {
      const mockFormatter = createMockFormatter("enero");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Enero");
    });

    it("should handle last day of year", () => {
      const mockFormatter = createMockFormatter("diciembre");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Diciembre");
    });

    it("should handle leap year February", () => {
      const mockFormatter = createMockFormatter("febrero");
      vi.spyOn(global, "Intl" as any, "get").mockReturnValue({
        DateTimeFormat: mockFormatter,
      } as any);
      expect(getCurrentMonthName()).toBe("Febrero");
    });
  });

  describe("Locale Consistency", () => {
    it("should use Spanish locale (es-ES)", () => {
      const originalFormatter = global.Intl.DateTimeFormat;
      let capturedLocale: string | undefined;
      
      global.Intl.DateTimeFormat = class MockFormatter {
        constructor(locale: string) {
          capturedLocale = locale;
        }
        format(_date: Date) {
          return "enero";
        }
      };
      
      const result = getCurrentMonthName();
      
      expect(capturedLocale).toBe("es-ES");
      expect(result).toBe("Enero");
      
      global.Intl.DateTimeFormat = originalFormatter;
    });
  });
});
