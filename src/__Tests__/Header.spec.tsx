import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../components/Header/Header";

// Mock Profile component
vi.mock("../components/profile/Profile", () => ({
  Profile: () => <div data-testid="mock-profile">Profile Component</div>,
}));

describe("Header", () => {
  it("should render with selected month", () => {
    // Act
    render(<Header selectedMonth="Febrero" />);

    // Assert
    const monthText = screen.getByText(/Febrero/);
    expect(monthText).toBeDefined();
  });

  it("should display year 2026", () => {
    // Act
    render(<Header selectedMonth="Enero" />);

    // Assert
    const yearText = screen.getByText(/2026/);
    expect(yearText).toBeDefined();
  });

  it("should render Profile component", () => {
    // Act
    render(<Header selectedMonth="Marzo" />);

    // Assert
    const profile = screen.getByTestId("mock-profile");
    expect(profile).toBeDefined();
  });

  it("should display subtitle", () => {
    // Act
    render(<Header selectedMonth="Abril" />);

    // Assert
    const subtitle = screen.getByText("Resumen de finanzas personales");
    expect(subtitle).toBeDefined();
  });

  it("should render different months correctly", () => {
    // Act
    const { rerender } = render(<Header selectedMonth="Enero" />);
    expect(screen.getByText(/Enero/)).toBeDefined();

    rerender(<Header selectedMonth="Diciembre" />);

    // Assert
    expect(screen.getByText(/Diciembre/)).toBeDefined();
  });
});
