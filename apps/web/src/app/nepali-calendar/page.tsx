import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CalendarView } from "@/components/calendar-view";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Nepali Calendar — Bikram Sambat Dates & Holidays",
  description:
    "Check today's Nepali date, browse the Bikram Sambat calendar, and open 2083 public holidays and festival dates.",
  path: "/nepali-calendar",
});

export default function NepaliCalendarPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">Bikram Sambat</p>
          <h1 className="page-title">Nepali calendar</h1>
          <p className="page-description">
            Check dates in the Nepali calendar and their Gregorian equivalents.
            Select a date to see its details.
          </p>
          <CalendarView />
          <section className="text-content">
            <h2>Need to convert a date?</h2>
            <p>
              Use the{" "}
              <Link href="/date-converter">
                BS to AD and AD to BS converter
              </Link>{" "}
              to look up a date, count the days between two dates, or add or
              subtract days.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
