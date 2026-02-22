import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MonthFilter } from "../features/filters/MonthFilter";

describe("MonthFilter", () => {
  const mockOnMonthChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const spanishMonths = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  describe("rendering", () => {
    it("should render month selector label", () => {
      // Act
      render(
        <MonthFilter currentMonth="Enero" onMonthChange={mockOnMonthChange} />,
      );

      // Assert
      const label = screen.getByText("Filtrar por Mes:");
      expect(label).toBeDefined();
    });

    it("should render select element", () => {
      // Act
      render(
        <MonthFilter currentMonth="Febrero" onMonthChange={mockOnMonthChange} />,
      );

      // Assert
      const select = screen.getByRole("combobox");
      expect(select).toBeDefined();
    });

    it("should render all 12 months", () => {
      // Act
      const { container } = render(
        <MonthFilter currentMonth="Marzo" onMonthChange={mockOnMonthChange} />,
      );

      // Assert
      const options = container.querySelectorAll("option");
      expect(options.length).toBe(12);
    });

    it("should have months in correct order", () => {
      // Act
      const { container } = render(
        <MonthFilter currentMonth="Abril" onMonthChange={mockOnMonthChange} />,
      );

      // Assert
      const options = container.querySelectorAll("option");
      options.forEach((option, index) => {
        expect(option.textContent).toBe(spanishMonths[index]);
      });
    });

    it("should have current month selected", () => {
      // Act
      render(
        <MonthFilter currentMonth="Junio" onMonthChange={mockOnMonthChange} />,
      );

      // Assert
      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("Junio");
    });
  });

  describe("interactions", () => {
    it("should call onMonthChange when month is selected", () => {
      // Arrange
      render(
        <MonthFilter currentMonth="Enero" onMonthChange={mockOnMonthChange} />,
      );

      const select = screen.getByRole("combobox");

      // Act
      fireEvent.change(select, { target: { value: "Julio" } });

      // Assert
      expect(mockOnMonthChange).toHaveBeenCalledWith("Julio");
    });

    it("should call onMonthChange with correct month", () => {
      // Arrange
      render(
        <MonthFilter currentMonth="Febrero" onMonthChange={mockOnMonthChange} />,
      );

      const select = screen.getByRole("combobox");

      // Act
      fireEvent.change(select, { target: { value: "Diciembre" } });

      // Assert
      expect(mockOnMonthChange).toHaveBeenCalledTimes(1);
      expect(mockOnMonthChange).toHaveBeenCalledWith("Diciembre");
    });

    it("should handle multiple month changes", () => {
      // Arrange
      const { rerender } = render(
        <MonthFilter currentMonth="Enero" onMonthChange={mockOnMonthChange} />,
      );

      const select = screen.getByRole("combobox");

      // Act - First change
      fireEvent.change(select, { target: { value: "Marzo" } });
      rerender(
        <MonthFilter currentMonth="Marzo" onMonthChange={mockOnMonthChange} />,
      );

      // Act - Second change
      fireEvent.change(select, { target: { value: "Agosto" } });

      // Assert
      expect(mockOnMonthChange).toHaveBeenCalledTimes(2);
      expect(mockOnMonthChange).toHaveBeenNthCalledWith(1, "Marzo");
      expect(mockOnMonthChange).toHaveBeenNthCalledWith(2, "Agosto");
    });
  });

  describe("all months", () => {
    spanishMonths.forEach((month) => {
      it(`should be able to select ${month}`, () => {
        // Arrange
        render(
          <MonthFilter currentMonth="Enero" onMonthChange={mockOnMonthChange} />,
        );

        const select = screen.getByRole("combobox");

        // Act
        fireEvent.change(select, { target: { value: month } });

        // Assert
        expect(mockOnMonthChange).toHaveBeenCalledWith(month);
      });
    });
  });
});
