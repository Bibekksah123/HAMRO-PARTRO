import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, desc, eq, gte, isNull, lt, or } from "drizzle-orm";
import { expenseCategories, expenses } from "@merodin/db";
import { ExpenseManager } from "@/components/expense-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createDatabase } from "@/lib/db";
import { summarizeExpenses } from "@/lib/expenses";
import { createPageMetadata } from "@/lib/page-metadata";
import { requireCurrentUser } from "@/lib/supabase/current-user";
import { todayInNepal } from "@merodin/date";

export const metadata: Metadata = createPageMetadata({
  title: "My Expenses",
  description: "Track your private income and expenses in MeroDin.",
  noIndex: true,
});
export const dynamic = "force-dynamic";

function toIsoDate(date: { year: number; month: number; day: number }) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export default async function ExpensesPage() {
  const user = await requireCurrentUser();
  const db = createDatabase();
  const today = todayInNepal();
  const monthStart = `${today.year}-${String(today.month).padStart(2, "0")}-01`;
  const nextMonth = new Date(Date.UTC(today.year, today.month, 1));
  const monthEnd = `${nextMonth.getUTCFullYear()}-${String(nextMonth.getUTCMonth() + 1).padStart(2, "0")}-01`;

  const [transactions, categories, currentMonthRows] = await Promise.all([
    db
      .select({
        id: expenses.id,
        type: expenses.type,
        amount: expenses.amount,
        categoryId: expenses.categoryId,
        categoryName: expenseCategories.name,
        description: expenses.description,
        occurredOn: expenses.occurredOn,
      })
      .from(expenses)
      .leftJoin(
        expenseCategories,
        eq(expenses.categoryId, expenseCategories.id),
      )
      .where(eq(expenses.userId, user.id))
      .orderBy(desc(expenses.occurredOn), desc(expenses.createdAt))
      .limit(50),
    db
      .select({
        id: expenseCategories.id,
        name: expenseCategories.name,
        type: expenseCategories.type,
      })
      .from(expenseCategories)
      .where(
        or(
          isNull(expenseCategories.userId),
          eq(expenseCategories.userId, user.id),
        ),
      )
      .orderBy(asc(expenseCategories.name)),
    db
      .select({ type: expenses.type, amount: expenses.amount })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.occurredOn, monthStart),
          lt(expenses.occurredOn, monthEnd),
        ),
      ),
  ]);

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">
            <Link href="/my">My Space</Link> / Money
          </p>
          <h1 className="page-title">Expenses</h1>
          <p className="page-description">
            A private view of income and spending for{" "}
            {user.email ?? "your account"}.
          </p>
          <ExpenseManager
            categories={categories}
            expenses={transactions}
            summary={summarizeExpenses(currentMonthRows)}
            today={toIsoDate(today)}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
