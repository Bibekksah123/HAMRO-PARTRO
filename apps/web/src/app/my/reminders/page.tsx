import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { reminders } from "@merodin/db";
import { ReminderManager } from "@/components/reminder-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createDatabase } from "@/lib/db";
import { createPageMetadata } from "@/lib/page-metadata";
import { requireCurrentUser } from "@/lib/supabase/current-user";

export const metadata: Metadata = createPageMetadata({
  title: "My Reminders",
  description: "Keep personal reminders and repeat preferences in MeroDin.",
  noIndex: true,
});
export const dynamic = "force-dynamic";

function localDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (name: string) =>
    parts.find((part) => part.type === name)?.value ?? "00";
  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${value("minute")}`;
}

export default async function RemindersPage() {
  const user = await requireCurrentUser();
  const rows = await createDatabase()
    .select()
    .from(reminders)
    .where(eq(reminders.userId, user.id))
    .orderBy(asc(reminders.completed), asc(reminders.remindAt));

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">
            <Link href="/my">My Space</Link> / Plans
          </p>
          <h1 className="page-title">Reminders</h1>
          <p className="page-description">
            Keep a private list of the things you want to remember next.
          </p>
          <ReminderManager
            reminders={rows.map((reminder) => ({
              id: reminder.id,
              title: reminder.title,
              details: reminder.details,
              remindAt: reminder.remindAt.toISOString(),
              repeat: reminder.repeat,
              completed: reminder.completed,
            }))}
            newReminderAt={localDateTime(new Date(Date.now() + 60 * 60 * 1000))}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
