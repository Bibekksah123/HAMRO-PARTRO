import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  bsToAd,
  formatAdDate,
  formatBsDate,
  weekdayIndex,
} from "@merodin/date";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  datedHolidays2083,
  holidays2083,
  holidayNoticeSource,
} from "@/data/holidays/2083";

type HolidayPageProps = { params: Promise<{ year: string }> };
const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function generateStaticParams() {
  return [{ year: "2083" }];
}

export async function generateMetadata({
  params,
}: HolidayPageProps): Promise<Metadata> {
  const { year } = await params;
  if (year !== "2083") return { title: "Holiday year not available" };
  return createPageMetadata({
    title: "Nepal Public Holidays 2083 — Dates & Weekdays",
    description:
      "Government of Nepal public holidays for 2083 BS (2026/27), including Gregorian dates, weekdays, and regional eligibility notes.",
    path: "/holidays/2083",
  });
}

export default async function HolidayYearPage({ params }: HolidayPageProps) {
  const { year } = await params;
  if (year !== "2083") notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">Government and public holiday notice</p>
          <h1 className="page-title">Nepal public holidays 2083</h1>
          <p className="page-description">
            The notice covers 2083/01/01 through 2083/12/31. Saturday weekly
            holidays are not included in this list.
          </p>
          <div className="holiday-table-wrap">
            <table className="holiday-table">
              <caption>Published public holidays for 2083 BS</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Weekday</th>
                  <th scope="col">Holiday</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {datedHolidays2083.map((holiday) => {
                  const adDate = bsToAd(holiday.date);
                  const endDate = holiday.endDate
                    ? bsToAd(holiday.endDate)
                    : undefined;
                  const startDay = weekdayNames[weekdayIndex(holiday.date)];
                  const endDay = holiday.endDate
                    ? weekdayNames[weekdayIndex(holiday.endDate)]
                    : undefined;
                  const dateText = holiday.endDate
                    ? `${formatBsDate(holiday.date)} – ${formatBsDate(holiday.endDate)}`
                    : formatBsDate(holiday.date);
                  const adText = holiday.endDate
                    ? `${formatAdDate(adDate)} – ${formatAdDate(endDate!)}`
                    : formatAdDate(adDate);
                  const dayText = holiday.endDate
                    ? `${startDay} – ${endDay}`
                    : startDay;
                  return (
                    <tr key={holiday.id}>
                      <td>
                        <span>{dateText}</span>
                        <small>{adText}</small>
                      </td>
                      <td>{dayText}</td>
                      <th scope="row">{holiday.name}</th>
                      <td>{holiday.scope}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <section className="tba-section">
            <h2>Dates to be announced</h2>
            <p>
              The Ministry notice includes these holidays but does not set a
              fixed date in the annual list.
            </p>
            <ul>
              {holidays2083
                .filter((holiday) => holiday.date === null)
                .map((holiday) => (
                  <li key={holiday.id}>
                    <strong>{holiday.name}</strong>
                    <span>{holiday.scope}</span>
                  </li>
                ))}
            </ul>
          </section>
          <p className="data-source-note">
            Source:{" "}
            <a href={holidayNoticeSource.url}>{holidayNoticeSource.label}</a>.
            Dates shown here follow the published notice; some holidays apply
            only to a region or group listed in the notes.
          </p>
          <p>
            <Link href="/calendar">
              Open the Nepali calendar <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
