import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "../components/Modal/ConfirmModal";

describe("ConfirmModal", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should not render when isOpen is false", () => {
      // Act
      const { container } = render(
        <ConfirmModal
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it("should render when isOpen is true", () => {
      // Act
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      // Assert
      const confirmText = screen.getByText("Confirmar Acción");
      expect(confirmText).toBeDefined();
    });

    it("should display confirm button", () => {
      // Act
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      // Assert
      const confirmButton = screen.getByRole("button", { name: /Eliminar Registro/i });
      expect(confirmButton).toBeDefined();
    });

    it("should display cancel button", () => {
      // Act
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      // Assert
      const cancelButton = screen.getByRole("button", { name: /Volver atrás/i });
      expect(cancelButton).toBeDefined();
    });
  });

  describe("interactions", () => {
    it("should call onClose when overlay is clicked", () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      const overlay = document.querySelector('[class*="absolute inset-0"]');

      if (overlay) {
        fireEvent.click(overlay);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should call onClose when cancel button is clicked", () => {
      // Arrange
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      const cancelButton = screen.getByRole("button", { name: /Volver atrás/i });

      // Act
      fireEvent.click(cancelButton);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onConfirm and then onClose when confirm button is clicked", () => {
      // Arrange
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      const confirmButton = screen.getByRole("button", { name: /Eliminar Registro/i });

      // Act
      fireEvent.click(confirmButton);

      // Assert
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onConfirm before onClose", () => {
      // Arrange
      const callOrder: string[] = [];
      const onConfirm = vi.fn(() => callOrder.push("confirm"));
      const onClose = vi.fn(() => callOrder.push("close"));

      render(
        <ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />,
      );

      const confirmButton = screen.getByRole("button", { name: /Eliminar Registro/i });

      // Act
      fireEvent.click(confirmButton);

      // Assert
      expect(callOrder).toEqual(["confirm", "close"]);
    });
  });

  describe("accessibility", () => {
    it("should have modal structure", () => {
      // Act
      const { container } = render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      // Assert
      expect(container.querySelector('[class*="fixed"]')).toBeDefined();
    });

    it("should have visible text content", () => {
      // Act
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      // Assert
      expect(screen.getByText("Confirmar Acción")).toBeDefined();
      expect(screen.getByText(/¿Deseas eliminar este registro permanentemente?/)).toBeDefined();
    });
  });
});
