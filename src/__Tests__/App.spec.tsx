import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock LayoutPage with default export
vi.mock("../pages/LayoutPage", () => ({
  default: () => <div data-testid="mock-layout-page">Layout Page</div>,
}));

describe("App", () => {
  it("should render without crashing", () => {
    // Act
    render(<App />);

    // Assert - component renders
    const layoutPage = screen.getByTestId("mock-layout-page");
    expect(layoutPage).toBeDefined();
  });

  it("should render LayoutPage component", () => {
    // Act
    render(<App />);

    // Assert
    const layoutPage = screen.getByTestId("mock-layout-page");
    expect(layoutPage.textContent).toBe("Layout Page");
  });

  it("should have dark background container", () => {
    // Act
    const { container } = render(<App />);
    const mainDiv = container.firstChild as HTMLElement;

    // Assert
    expect(mainDiv.className).toContain("bg-[#0a0a0a]");
  });

  it("should have proper layout classes", () => {
    // Act
    const { container } = render(<App />);
    const mainDiv = container.firstChild as HTMLElement;

    // Assert
    expect(mainDiv.className).toContain("min-h-screen");
  });
});
