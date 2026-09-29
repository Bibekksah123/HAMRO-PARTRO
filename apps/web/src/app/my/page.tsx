import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import {
  adToBs,
  bsToAd,
  differenceInDays,
  formatAdDate,
  formatBsDateNepali,
  todayInNepal,
} from "@merodin/date";
import { expenses, expenseCategories, notes, reminders } from "@merodin/db";
import { SignOutButton } from "@/components/sign-out-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { festivals2083 } from "@/data/festivals/2083";
import { createDatabase } from "@/lib/db";
import { summarizeExpenses } from "@/lib/expenses";
import { createPageMetadata } from "@/lib/page-metadata";
import { requireCurrentUser } from "@/lib/supabase/current-user";

export const metadata: Metadata = createPageMetadata({
  title: "My Space",
  description:
    "Your private MeroDin dashboard for expenses, reminders, and notes.",
  noIndex: true,
});
export const dynamic = "force-dynamic";

const money = (value: number | string) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(Number(value));

export default async function MySpacePage() {
  const user = await requireCurrentUser();
  const db = createDatabase();
  const today = todayInNepal();
  const startOfMonth = `${today.year}-${String(today.month).padStart(2, "0")}-01`;
  const nextMonth = new Date(Date.UTC(today.year, today.month, 1));
  const endOfMonth = `${nextMonth.getUTCFullYear()}-${String(nextMonth.getUTCMonth() + 1).padStart(2, "0")}-01`;
  const todayAd = today;
  const todayBs = adToBs(today);

  const [upcomingReminders, recentExpenses, monthExpenses, recentNotes] =
    await Promise.all([
      db
        .select({
          id: reminders.id,
          title: reminders.title,
          remindAt: reminders.remindAt,
        })
        .from(reminders)
        .where(
          and(
            eq(reminders.userId, user.id),
            eq(reminders.completed, false),
            gte(reminders.remindAt, new Date()),
          ),
        )
        .orderBy(asc(reminders.remindAt))
        .limit(5),
      db
        .select({
          id: expenses.id,
          type: expenses.type,
          amount: expenses.amount,
          description: expenses.description,
          occurredOn: expenses.occurredOn,
          categoryName: expenseCategories.name,
        })
        .from(expenses)
        .leftJoin(
          expenseCategories,
          eq(expenses.categoryId, expenseCategories.id),
        )
        .where(eq(expenses.userId, user.id))
        .orderBy(desc(expenses.occurredOn), desc(expenses.createdAt))
        .limit(5),
      db
        .select({ type: expenses.type, amount: expenses.amount })
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, user.id),
            gte(expenses.occurredOn, startOfMonth),
            lt(expenses.occurredOn, endOfMonth),
          ),
        ),
      db
        .select({
          id: notes.id,
          title: notes.title,
          content: notes.content,
          pinned: notes.pinned,
          updatedAt: notes.updatedAt,
        })
        .from(notes)
        .where(eq(notes.userId, user.id))
        .orderBy(desc(notes.pinned), desc(notes.updatedAt))
        .limit(5),
    ]);

  const summary = summarizeExpenses(monthExpenses);
  const nextFestivals = festivals2083
    .map((festival) => ({ festival, adDate: bsToAd(festival.date) }))
    .filter(
      ({ festival, adDate }) =>
        festival.date.year === todayBs.year &&
        differenceInDays(todayAd, adDate) >= 0,
    )
    .sort(
      (left, right) =>
        differenceInDays(todayAd, left.adDate) -
        differenceInDays(todayAd, right.adDate),
    )
    .slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <div className="dashboard-welcome">
            <div>
              <p className="section-kicker">Your personal dashboard</p>
              <h1 className="page-title">My Space</h1>
              <p className="page-description">
                {formatBsDateNepali(todayBs)} <span aria-hidden="true">·</span>{" "}
                {formatAdDate(today)}
              </p>
            </div>
            <div className="dashboard-account">
              <span>{user.email ?? "Signed in"}</span>
              <SignOutButton />
            </div>
          </div>

          <section aria-label="Quick actions" className="quick-action-grid">
            <Link href="/my/expenses#new-transaction">
              <span aria-hidden="true">＋</span>
              <strong>Add expense</strong>
            </Link>
            <Link href="/my/reminders#new-reminder">
              <span aria-hidden="true">◷</span>
              <strong>Add reminder</strong>
            </Link>
            <Link href="/my/notes#new-note">
              <span aria-hidden="true">▤</span>
              <strong>New note</strong>
            </Link>
          </section>

          <div className="dashboard-grid">
            <section
              className="personal-panel dashboard-panel"
              aria-labelledby="dashboard-reminders-title"
            >
              <div className="personal-panel-heading">
                <div>
                  <p className="section-kicker">Coming up</p>
                  <h2 id="dashboard-reminders-title">Reminders</h2>
                </div>
                <Link className="section-link" href="/my/reminders">
                  All reminders →
                </Link>
              </div>
              {upcomingReminders.length === 0 ? (
                <div className="personal-empty">
                  <strong>No upcoming reminders.</strong>
                  <span>Add a reminder to plan the next thing.</span>
                </div>
              ) : (
                <ul className="dashboard-list">
                  {upcomingReminders.map((reminder) => (
                    <li key={reminder.id}>
                      <span className="dashboard-list-mark" aria-hidden="true">
                        ◷
                      </span>
                      <span>
                        <strong>{reminder.title}</strong>
                        <small>
                          {new Intl.DateTimeFormat("en-NP", {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "Asia/Kathmandu",
                          }).format(reminder.remindAt)}{" "}
                          · Nepal time
                        </small>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section
              className="personal-panel dashboard-panel"
              aria-labelledby="dashboard-expenses-title"
            >
              <div className="personal-panel-heading">
                <div>
                  <p className="section-kicker">This month</p>
                  <h2 id="dashboard-expenses-title">Expense summary</h2>
                </div>
                <Link className="section-link" href="/my/expenses">
                  Manage →
                </Link>
              </div>
              <div className="dashboard-money-summary">
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
              <ul className="dashboard-list dashboard-expense-list">
                {recentExpenses.map((expense) => (
                  <li key={expense.id}>
                    <span className="dashboard-list-mark" aria-hidden="true">
                      {expense.type === "income" ? "↙" : "↗"}
                    </span>
                    <span>
                      <strong>
                        {expense.description ||
                          expense.categoryName ||
                          (expense.type === "income" ? "Income" : "Expense")}
                      </strong>
                      <small>
                        {expense.categoryName ?? "Uncategorized"} ·{" "}
                        {expense.occurredOn}
                      </small>
                    </span>
                    <b
                      className={
                        expense.type === "income"
                          ? "expense-income"
                          : "expense-expense"
                      }
                    >
                      {money(expense.amount)}
                    </b>
                  </li>
                ))}
              </ul>
              {recentExpenses.length === 0 && (
                <p className="dashboard-inline-empty">
                  No expenses this month.
                </p>
              )}
            </section>

            <section
              className="personal-panel dashboard-panel"
              aria-labelledby="dashboard-notes-title"
            >
              <div className="personal-panel-heading">
                <div>
                  <p className="section-kicker">Keep close</p>
                  <h2 id="dashboard-notes-title">Recent notes</h2>
                </div>
                <Link className="section-link" href="/my/notes">
                  All notes →
                </Link>
              </div>
              {recentNotes.length === 0 ? (
                <div className="personal-empty">
                  <strong>No notes yet.</strong>
                  <span>
                    Write down an idea or something you want to remember.
                  </span>
                </div>
              ) : (
                <ul className="dashboard-list">
                  {recentNotes.map((note) => (
                    <li key={note.id}>
                      <span className="dashboard-list-mark" aria-hidden="true">
                        {note.pinned ? "◆" : "▤"}
                      </span>
                      <span>
                        <strong>{note.title || "Untitled note"}</strong>
                        <small>
                          {note.content.slice(0, 92) || "No note text yet."}
                        </small>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section
              className="personal-panel dashboard-panel"
              aria-labelledby="dashboard-festivals-title"
            >
              <div className="personal-panel-heading">
                <div>
                  <p className="section-kicker">Nepal calendar</p>
                  <h2 id="dashboard-festivals-title">Upcoming festivals</h2>
                </div>
                <Link className="section-link" href="/festivals">
                  Explore →
                </Link>
              </div>
              {nextFestivals.length === 0 ? (
                <div className="personal-empty">
                  <strong>Explore the festival calendar.</strong>
                  <span>See festival dates and public holidays by year.</span>
                </div>
              ) : (
                <ul className="dashboard-list">
                  {nextFestivals.map(({ festival, adDate }) => (
                    <li key={festival.id}>
                      <span className="dashboard-list-mark" aria-hidden="true">
                        ✳
                      </span>
                      <span>
                        <strong>{festival.name}</strong>
                        <small>
                          {formatBsDateNepali(festival.date)} ·{" "}
                          {formatAdDate(adDate)}
                        </small>
                      </span>
                      <b>
                        {differenceInDays(todayAd, adDate) === 0
                          ? "Today"
                          : `${differenceInDays(todayAd, adDate)}d`}
                      </b>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
