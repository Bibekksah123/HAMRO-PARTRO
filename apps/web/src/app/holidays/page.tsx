import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { holidayNoticeSource, holidayYears } from "@/data/holidays/2083";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Nepal Public Holidays — 2083 BS",
  description:
    "Browse the Government of Nepal's published 2083 public holidays, with Gregorian dates, weekdays, and regional notes.",
  path: "/holidays",
});

export default function HolidaysPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">Plan ahead</p>
          <h1 className="page-title">Public holidays in Nepal</h1>
          <p className="page-description">
            Browse published national and regional holiday notices by Nepali
            year.
          </p>
          <nav aria-label="Available holiday years" className="year-links">
            {holidayYears.map((year) => (
              <Link href={`/holidays/${year}`} key={year}>
                {year} BS <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
          <p className="data-source-note">
            The available year is 2083 BS. Dates marked “to be announced” are
            left undated until the relevant authority publishes them.
          </p>
          <p>
            Source:{" "}
            <a href={holidayNoticeSource.url}>{holidayNoticeSource.label}</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
