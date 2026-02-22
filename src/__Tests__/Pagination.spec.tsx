import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../components/utils/Pagination";

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should not render when totalPages is 1", () => {
      // Act
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it("should not render when totalPages is 0", () => {
      // Act
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it("should render when totalPages is greater than 1", () => {
      // Act
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      const pageLabel = screen.getByText("Página");
      const pageNumbers = screen.getByText("1 de 3");
      expect(pageLabel).toBeDefined();
      expect(pageNumbers).toBeDefined();
    });

    it("should display correct page numbers", () => {
      // Act
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      const pageLabel = screen.getByText("Página");
      const pageNumbers = screen.getByText("2 de 5");
      expect(pageLabel).toBeDefined();
      expect(pageNumbers).toBeDefined();
    });
  });

  describe("previous button", () => {
    it("should be disabled on first page", () => {
      // Act
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      const buttons = screen.getAllByRole("button");
      const prevButton = buttons[0];
      expect(prevButton.disabled).toBe(true);
    });

    it("should be enabled when not on first page", () => {
      // Act
      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      const buttons = screen.getAllByRole("button");
      const prevButton = buttons[0];
      expect(prevButton.disabled).toBe(false);
    });

    it("should call onPageChange with previous page number", () => {
      // Arrange
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const buttons = screen.getAllByRole("button");
      const prevButton = buttons[0];

      // Act
      fireEvent.click(prevButton);

      // Assert
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe("next button", () => {
    it("should be disabled on last page", () => {
      // Act
      render(
        <Pagination
          currentPage={3}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[1];
      expect(nextButton.disabled).toBe(true);
    });

    it("should be enabled when not on last page", () => {
      // Act
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />,
      );

      // Assert
      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[1];
      expect(nextButton.disabled).toBe(false);
    });

    it("should call onPageChange with next page number", () => {
      // Arrange
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[1];

      // Act
      fireEvent.click(nextButton);

      // Assert
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe("boundary conditions", () => {
    it("should handle page 1 of 2 correctly", () => {
      // Act
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />,
      );

      const buttons = screen.getAllByRole("button");

      // Assert
      expect(buttons[0].disabled).toBe(true); // prev disabled
      expect(buttons[1].disabled).toBe(false); // next enabled
    });

    it("should handle last page correctly", () => {
      // Act
      render(
        <Pagination
          currentPage={10}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />,
      );

      const buttons = screen.getAllByRole("button");

      // Assert
      expect(buttons[0].disabled).toBe(false); // prev enabled
      expect(buttons[1].disabled).toBe(true); // next disabled
    });
  });
});
