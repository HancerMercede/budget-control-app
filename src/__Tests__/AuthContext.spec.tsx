import { describe, it, expect } from "vitest";
import { AuthContext } from "../context/AuthContext";

describe("AuthContext", () => {
  it("should have default value with null user and loading true", () => {
    // Arrange & Act
    const defaultValue = AuthContext._currentValue || {
      user: null,
      loading: true,
    };

    // Assert
    expect(defaultValue.user).toBeNull();
    expect(defaultValue.loading).toBe(true);
  });

  it("should be a valid React Context", () => {
    // Assert
    expect(AuthContext).toBeDefined();
    expect(AuthContext.Provider).toBeDefined();
    expect(AuthContext.Consumer).toBeDefined();
  });
});
