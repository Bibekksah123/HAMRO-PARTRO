import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addDaysToBsDate,
  bsToAd,
  formatAdDate,
  formatBsDate,
  type BsDate,
} from "@merodin/date";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { festivals2083 } from "@/data/festivals/2083";
import { datedHolidays2083, holidayNoticeSource } from "@/data/holidays/2083";
import { createPageMetadata } from "@/lib/page-metadata";

type CalendarDatePageProps = { params: Promise<{ date: string }> };

function parseBsDate(value: string): BsDate | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  try {
    bsToAd(date);
    return date;
  } catch {
    return undefined;
  }
}

function eventForDate<T extends { date: BsDate; endDate?: BsDate }>(
  items: readonly T[],
  date: BsDate,
): T | undefined {
  const compare = (left: BsDate, right: BsDate) =>
    left.year - right.year || left.month - right.month || left.day - right.day;
  return items.find(
    (item) =>
      compare(date, item.date) >= 0 &&
      compare(date, item.endDate ?? item.date) <= 0,
  );
}

export async function generateMetadata({
  params,
}: CalendarDatePageProps): Promise<Metadata> {
  const { date: dateParam } = await params;
  const date = parseBsDate(dateParam);
  if (!date) return { title: "Date not found" };
  return createPageMetadata({
    title: `${formatBsDate(date)} — Nepali Calendar Date`,
    description: `${formatBsDate(date)} BS is ${formatAdDate(bsToAd(date))} AD. View the Nepali calendar date, weekday, and published events.`,
    path: `/calendar/${dateParam}`,
  });
}

export default async function CalendarDatePage({
  params,
}: CalendarDatePageProps) {
  const { date: dateParam } = await params;
  const date = parseBsDate(dateParam);
  if (!date) notFound();

  const adDate = bsToAd(date);
  const holiday =
    date.year === 2083 ? eventForDate(datedHolidays2083, date) : undefined;
  const festival =
    date.year === 2083 ? eventForDate(festivals2083, date) : undefined;
  let previous: BsDate | undefined;
  let next: BsDate | undefined;
  try {
    previous = addDaysToBsDate(date, -1);
  } catch {
    /* outside the date table */
  }
  try {
    next = addDaysToBsDate(date, 1);
  } catch {
    /* outside the date table */
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <article className="page-content detail-content">
          <p className="section-kicker">Date detail · {date.year} BS</p>
          <h1 className="page-title">{formatBsDate(date)}</h1>
          <p className="page-description">{formatAdDate(adDate)}</p>
          <section
            aria-label="Events on this date"
            className="calendar-detail-card"
          >
            {holiday ? (
              <>
                <p className="section-kicker">Published holiday / event</p>
                <h2>{holiday.name}</h2>
                <p>{holiday.description}</p>
                <p>
                  <strong>Scope:</strong> {holiday.scope}
                </p>
              </>
            ) : (
              <>
                <h2>No fixed-date holiday listed</h2>
                <p>
                  No fixed-date public holiday appears for this day in the
                  available 2083 notice.
                </p>
              </>
            )}
            {festival && (
              <p>
                <Link href={`/festivals/${festival.slug}`}>
                  Read about {festival.name} <span aria-hidden="true">→</span>
                </Link>
              </p>
            )}
            {date.year === 2083 && (
              <p className="data-source-note">
                Holiday details follow the{" "}
                <a href={holidayNoticeSource.url}>
                  Ministry of Home Affairs notice for 2083
                </a>
                .
              </p>
            )}
          </section>
          <div className="date-detail-actions">
            {previous ? (
              <Link
                href={`/calendar/${previous.year}-${String(previous.month).padStart(2, "0")}-${String(previous.day).padStart(2, "0")}`}
              >
                ← Previous day
              </Link>
            ) : (
              <span />
            )}
            <Link href="/calendar">Month view</Link>
            {next ? (
              <Link
                href={`/calendar/${next.year}-${String(next.month).padStart(2, "0")}-${String(next.day).padStart(2, "0")}`}
              >
                Next day →
              </Link>
            ) : (
              <span />
            )}
          </div>
          <section className="text-content">
            <h2>Convert this date</h2>
            <p>
              Use the{" "}
              <Link href="/date-converter">
                BS to AD and AD to BS converter
              </Link>{" "}
              to look up another date or count the days between dates.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
