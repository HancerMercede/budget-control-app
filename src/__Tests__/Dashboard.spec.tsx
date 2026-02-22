import { describe, expect, test } from "vitest";
import { DashboardPage } from "../pages/DashboardPage";
import { render } from "@testing-library/react";
import { getRemoteBudget } from "../config/firebase";

describe("Dashboard", () => {
  test("Render the dashboard page", () => {
    render(<DashboardPage />);
  });
});

describe("Get Budget", () => {
  test("Budget must be 50,000", async () => {
    const userId = "jDADi4kIuYe3rwxJrkamgmHVSk23";
    const budgetData = await getRemoteBudget(userId);
    console.log(budgetData);

    expect(budgetData.baseBudget).toBe(50000);
  });
});
