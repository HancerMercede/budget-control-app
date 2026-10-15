import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../context/AuthContext";
import type { ReactNode } from "react";

describe("useAuth", () => {
  it("should return auth context value", () => {
    // Arrange
    const mockUser = {
      uid: "user-123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: "https://example.com/photo.jpg",
    };

    const mockContextValue = {
      user: mockUser as any,
      loading: false,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Assert
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it("should return null user when not authenticated", () => {
    // Arrange
    const mockContextValue = {
      user: null,
      loading: false,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Assert
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should return loading state", () => {
    // Arrange
    const mockContextValue = {
      user: null,
      loading: true,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Assert
    expect(result.current.loading).toBe(true);
  });
});
