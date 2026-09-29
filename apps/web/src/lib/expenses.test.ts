import { describe, expect, it } from "bun:test";
import { expenseCategoryBreakdown, summarizeExpenses } from "./expenses";

describe("expense summaries", () => {
  it("calculates income, spending, and balance", () => {
    expect(
      summarizeExpenses([
        { type: "income", amount: "80000.00" },
        { type: "expense", amount: "1200.50" },
        { type: "expense", amount: 799.5 },
      ]),
    ).toEqual({ income: 80000, expenses: 2000, balance: 78000 });
  });

  it("orders expense categories by total and ignores income", () => {
    expect(
      expenseCategoryBreakdown([
        { type: "expense", amount: "1250", categoryName: "Food" },
        { type: "expense", amount: "500", categoryName: "Food" },
        { type: "expense", amount: 800, categoryName: "Transport" },
        { type: "income", amount: 5000, categoryName: "Salary" },
      ]),
    ).toEqual([
      { category: "Food", amount: 1750 },
      { category: "Transport", amount: 800 },
    ]);
  });
});
