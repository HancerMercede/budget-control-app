import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConfirm } from "../hooks/useConfirm";

describe("useConfirm", () => {
  describe("initial state", () => {
    it("should start with isOpen false and selectedId null", () => {
      // Act
      const { result } = renderHook(() => useConfirm());

      // Assert
      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedId).toBeNull();
    });
  });

  describe("askConfirm", () => {
    it("should set selectedId and open modal", () => {
      // Arrange
      const { result } = renderHook(() => useConfirm());
      const testId = "expense-123";

      // Act
      act(() => {
        result.current.askConfirm(testId);
      });

      // Assert
      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedId).toBe(testId);
    });

    it("should update selectedId when called multiple times", () => {
      // Arrange
      const { result } = renderHook(() => useConfirm());

      // Act
      act(() => {
        result.current.askConfirm("id-1");
      });

      expect(result.current.selectedId).toBe("id-1");

      act(() => {
        result.current.askConfirm("id-2");
      });

      // Assert
      expect(result.current.selectedId).toBe("id-2");
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe("closeConfirm", () => {
    it("should close modal and clear selectedId", () => {
      // Arrange
      const { result } = renderHook(() => useConfirm());

      // Open modal first
      act(() => {
        result.current.askConfirm("expense-123");
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedId).toBe("expense-123");

      // Act
      act(() => {
        result.current.closeConfirm();
      });

      // Assert
      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedId).toBeNull();
    });

    it("should work when called without opening first", () => {
      // Arrange
      const { result } = renderHook(() => useConfirm());

      // Act
      act(() => {
        result.current.closeConfirm();
      });

      // Assert
      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedId).toBeNull();
    });
  });

  describe("workflow", () => {
    it("should handle complete confirm workflow", () => {
      // Arrange
      const { result } = renderHook(() => useConfirm());

      // 1. Initial state
      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedId).toBeNull();

      // 2. Ask for confirmation
      act(() => {
        result.current.askConfirm("item-1");
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedId).toBe("item-1");

      // 3. Close confirmation
      act(() => {
        result.current.closeConfirm();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedId).toBeNull();

      // 4. Ask again with different ID
      act(() => {
        result.current.askConfirm("item-2");
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedId).toBe("item-2");
    });
  });

  describe("callback stability", () => {
    it("should have stable callback references", () => {
      // Arrange
      const { result, rerender } = renderHook(() => useConfirm());

      const askConfirmRef1 = result.current.askConfirm;
      const closeConfirmRef1 = result.current.closeConfirm;

      // Act
      rerender();

      // Assert
      expect(result.current.askConfirm).toBe(askConfirmRef1);
      expect(result.current.closeConfirm).toBe(closeConfirmRef1);
    });
  });
});
