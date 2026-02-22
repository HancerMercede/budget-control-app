import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadComponent } from "../components/Load/LoadComponent";

describe("LoadComponent", () => {
  it("should render loading spinner", () => {
    // Act
    render(<LoadComponent />);

    // Assert
    const loadingText = screen.getByText("Cargando tus finanzas...");
    expect(loadingText).toBeDefined();
  });

  it("should have full screen height", () => {
    // Act
    const { container } = render(<LoadComponent />);
    const mainDiv = container.firstChild as HTMLElement;

    // Assert
    expect(mainDiv.className).toContain("min-h-screen");
  });

  it("should have centered content", () => {
    // Act
    const { container } = render(<LoadComponent />);
    const mainDiv = container.firstChild as HTMLElement;

    // Assert
    expect(mainDiv.className).toContain("flex");
    expect(mainDiv.className).toContain("justify-center");
    expect(mainDiv.className).toContain("items-center");
  });

  it("should have spinner animation", () => {
    // Act
    const { container } = render(<LoadComponent />);
    const spinner = container.querySelector('[class*="animate-spin"]');

    // Assert
    expect(spinner).toBeDefined();
  });
});
