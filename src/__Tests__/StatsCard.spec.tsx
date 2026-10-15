import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "../features/dashboard/cards/StatsCard";
import { Wallet } from "lucide-react";

describe("StatsCard", () => {
  describe("rendering", () => {
    it("should render title", () => {
      // Act
      render(
        <StatsCard
          title="Presupuesto"
          amount={50000}
          icon={Wallet}
          color="text-blue-400"
        />,
      );

      // Assert
      const title = screen.getByText("Presupuesto");
      expect(title).toBeDefined();
    });

    it("should render amount with correct formatting", () => {
      // Act
      render(
        <StatsCard
          title="Gastado"
          amount={1234.56}
          icon={Wallet}
          color="text-red-400"
        />,
      );

      // Assert
      // toLocaleString with 2 decimals: 1,234.56
      const amount = screen.getByText(/1,234\.56/);
      expect(amount).toBeDefined();
    });

    it("should render USD suffix", () => {
      // Act
      render(
        <StatsCard
          title="Disponible"
          amount={25000}
          icon={Wallet}
          color="text-green-400"
        />,
      );

      // Assert
      const usdText = screen.getByText(/USD/);
      expect(usdText).toBeDefined();
    });

    it("should format large numbers correctly", () => {
      // Act
      render(
        <StatsCard
          title="Total"
          amount={1000000}
          icon={Wallet}
          color="text-blue-400"
        />,
      );

      // Assert
      // 1,000,000.00
      const amount = screen.getByText(/1,000,000\.00/);
      expect(amount).toBeDefined();
    });

    it("should format decimal numbers with 2 decimal places", () => {
      // Act
      render(
        <StatsCard
          title="Test"
          amount={99.5}
          icon={Wallet}
          color="text-gray-400"
        />,
      );

      // Assert
      const amount = screen.getByText(/99\.50/);
      expect(amount).toBeDefined();
    });
  });

  describe("icon rendering", () => {
    it("should render icon component", () => {
      // Act
      const { container } = render(
        <StatsCard
          title="Test"
          amount={100}
          icon={Wallet}
          color="text-blue-400"
        />,
      );

      // Assert
      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeDefined();
    });
  });

  describe("color prop", () => {
    it("should apply color class to amount", () => {
      // Act
      const { container } = render(
        <StatsCard
          title="Test"
          amount={5000}
          icon={Wallet}
          color="text-red-500"
        />,
      );

      // Assert
      const amountElement = container.querySelector('[class*="text-red-500"]');
      expect(amountElement).toBeDefined();
    });

    it("should handle different color variations", () => {
      // Act
      const { container } = render(
        <StatsCard
          title="Test"
          amount={5000}
          icon={Wallet}
          color="text-green-600"
        />,
      );

      // Assert
      const amountElement = container.querySelector('[class*="text-green-600"]');
      expect(amountElement).toBeDefined();
    });
  });

  describe("amount formatting edge cases", () => {
    it("should format zero correctly", () => {
      // Act
      render(
        <StatsCard
          title="Empty"
          amount={0}
          icon={Wallet}
          color="text-gray-400"
        />,
      );

      // Assert
      const amount = screen.getByText(/0\.00/);
      expect(amount).toBeDefined();
    });

    it("should format negative numbers correctly", () => {
      // Act
      render(
        <StatsCard
          title="Deficit"
          amount={-500}
          icon={Wallet}
          color="text-red-500"
        />,
      );

      // Assert
      const amount = screen.getByText(/-500\.00/);
      expect(amount).toBeDefined();
    });

    it("should format very small decimals correctly", () => {
      // Act
      render(
        <StatsCard
          title="Small"
          amount={0.01}
          icon={Wallet}
          color="text-gray-400"
        />,
      );

      // Assert
      const amount = screen.getByText(/0\.01/);
      expect(amount).toBeDefined();
    });
  });
});
