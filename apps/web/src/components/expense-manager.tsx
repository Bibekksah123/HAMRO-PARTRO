"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ExpenseCategory } from "@merodin/db";
import {
  addExpenseCategory,
  deleteExpense,
  saveExpense,
} from "@/app/my/expenses/actions";
import type { summarizeExpenses } from "@/lib/expenses";

export type ExpenseItem = {
  id: string;
  type: "income" | "expense";
  amount: string;
  categoryId: string | null;
  categoryName: string | null;
  description: string;
  occurredOn: string;
};

type Summary = ReturnType<typeof summarizeExpenses>;

const money = (value: number | string) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(Number(value));

export function ExpenseManager({
  categories,
  expenses,
  summary,
  today,
}: {
  categories: Pick<ExpenseCategory, "id" | "name" | "type">[];
  expenses: ExpenseItem[];
  summary: Summary;
  today: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ExpenseItem | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense",
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const visibleCategories = categories.filter(
    (category) => category.type === transactionType,
  );

  async function submitExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const result = await saveExpense(new FormData(event.currentTarget));
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "We could not save this transaction.");
      return;
    }
    setEditing(null);
    setTransactionType("expense");
    setFormKey((key) => key + 1);
    setMessage("Transaction saved.");
    router.refresh();
  }

  async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const result = await addExpenseCategory(new FormData(event.currentTarget));
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "We could not add that category.");
      return;
    }
    event.currentTarget.reset();
    setMessage("Category added.");
    router.refresh();
  }

  async function removeExpense(id: string) {
    setBusy(true);
    setError("");
    const result = await deleteExpense(id);
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "We could not delete this transaction.");
      return;
    }
    setMessage("Transaction deleted.");
    router.refresh();
  }

  function startEditing(expense: ExpenseItem) {
    setEditing(expense);
    setTransactionType(expense.type);
    setFormKey((key) => key + 1);
    setError("");
    setMessage("");
  }

  function cancelEditing() {
    setEditing(null);
    setTransactionType("expense");
    setFormKey((key) => key + 1);
  }

  return (
    <div className="personal-tools-layout">
      <section
        className="personal-panel"
        aria-labelledby="expense-summary-title"
      >
        <div className="personal-panel-heading">
          <div>
            <p className="section-kicker">This month</p>
            <h2 id="expense-summary-title">Money overview</h2>
          </div>
          <span className="personal-panel-note">
            All amounts in Nepalese rupees
          </span>
        </div>
        <div className="expense-summary-grid">
          <div>
            <span>Income</span>
            <strong>{money(summary.income)}</strong>
          </div>
          <div>
            <span>Expenses</span>
            <strong>{money(summary.expenses)}</strong>
          </div>
          <div>
            <span>Balance</span>
            <strong>{money(summary.balance)}</strong>
          </div>
        </div>
      </section>

      <section className="personal-panel" aria-labelledby="expense-form-title">
        <div className="personal-panel-heading">
          <div>
            <p className="section-kicker">
              {editing ? "Update entry" : "Add to your records"}
            </p>
            <h2 id="expense-form-title">
              {editing ? "Edit transaction" : "New transaction"}
            </h2>
          </div>
        </div>
        <form
          className="personal-form"
          id="new-transaction"
          key={formKey}
          onSubmit={submitExpense}
        >
          <input name="id" type="hidden" value={editing?.id ?? ""} />
          <label>
            Type
            <select
              name="type"
              onChange={(event) =>
                setTransactionType(event.target.value as "income" | "expense")
              }
              value={transactionType}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label>
            Amount (रु)
            <input
              autoComplete="off"
              min="0.01"
              name="amount"
              required
              step="0.01"
              type="number"
              defaultValue={editing?.amount ?? ""}
            />
          </label>
          <label>
            Category
            <select
              defaultValue={
                editing?.type === transactionType
                  ? (editing.categoryId ?? "")
                  : ""
              }
              key={`${formKey}-${transactionType}`}
              name="categoryId"
            >
              <option value="">Uncategorized</option>
              {visibleCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              defaultValue={editing?.occurredOn ?? today}
              name="occurredOn"
              required
              type="date"
            />
          </label>
          <label className="personal-form-wide">
            Description <span>(optional)</span>
            <input
              defaultValue={editing?.description ?? ""}
              maxLength={240}
              name="description"
              placeholder="What was this for?"
            />
          </label>
          <div className="personal-form-actions personal-form-wide">
            <button className="convert-button" disabled={busy} type="submit">
              {busy ? "Saving…" : editing ? "Save changes" : "Add transaction"}
              <span aria-hidden="true">→</span>
            </button>
            {editing && (
              <button
                className="plain-action"
                onClick={cancelEditing}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="personal-status" role="status">
            {message}
          </p>
        )}

        <details className="category-add">
          <summary>Add a category</summary>
          <form className="category-add-form" onSubmit={submitCategory}>
            <label>
              Category name
              <input maxLength={48} name="name" required />
            </label>
            <label>
              Applies to
              <select defaultValue="expense" name="type">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <button className="plain-action" disabled={busy} type="submit">
              Add category
            </button>
          </form>
        </details>
      </section>

      <section
        className="personal-panel"
        aria-labelledby="expense-history-title"
      >
        <div className="personal-panel-heading">
          <div>
            <p className="section-kicker">Your entries</p>
            <h2 id="expense-history-title">Recent transactions</h2>
          </div>
        </div>
        {expenses.length === 0 ? (
          <div className="personal-empty">
            <strong>No expenses this month.</strong>
            <span>
              Add income or spending above to start your private ledger.
            </span>
          </div>
        ) : (
          <div className="expense-list">
            {expenses.map((expense) => (
              <article className="expense-row" key={expense.id}>
                <div className="expense-row-copy">
                  <strong>
                    {expense.description ||
                      expense.categoryName ||
                      (expense.type === "income" ? "Income" : "Expense")}
                  </strong>
                  <span>
                    {expense.categoryName ?? "Uncategorized"} ·{" "}
                    {expense.occurredOn}
                  </span>
                </div>
                <strong className={`expense-amount expense-${expense.type}`}>
                  {expense.type === "income" ? "+" : "−"}
                  {money(expense.amount)}
                </strong>
                <div className="expense-row-actions">
                  <button
                    className="plain-action"
                    onClick={() => startEditing(expense)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="plain-action danger-action"
                    disabled={busy}
                    onClick={() => removeExpense(expense.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
