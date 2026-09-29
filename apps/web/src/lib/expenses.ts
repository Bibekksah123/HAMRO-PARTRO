export type ExpenseSummaryRow = {
  type: "income" | "expense";
  amount: string | number;
};

export type ExpenseCategoryRow = ExpenseSummaryRow & {
  categoryName: string;
};

export function summarizeExpenses(rows: ExpenseSummaryRow[]) {
  const totals = rows.reduce(
    (summary, row) => {
      const amount = Number(row.amount);
      if (!Number.isFinite(amount) || amount < 0) return summary;
      if (row.type === "income") summary.income += amount;
      else summary.expenses += amount;
      return summary;
    },
    { income: 0, expenses: 0 },
  );
  return {
    ...totals,
    balance: totals.income - totals.expenses,
  };
}

export function expenseCategoryBreakdown(rows: ExpenseCategoryRow[]) {
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.type !== "expense") continue;
    const amount = Number(row.amount);
    if (!Number.isFinite(amount) || amount < 0) continue;
    totals.set(row.categoryName, (totals.get(row.categoryName) ?? 0) + amount);
  }
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((left, right) => right.amount - left.amount);
}
