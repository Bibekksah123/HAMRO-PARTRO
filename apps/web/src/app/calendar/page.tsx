import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CalendarView } from "@/components/calendar-view";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Nepali Calendar 2083 — BS Calendar & Holidays",
  description:
    "Browse the Nepali Bikram Sambat calendar, compare AD dates, and find published 2083 festivals and public holidays.",
  path: "/calendar",
});

export default function CalendarPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">Your year, at a glance</p>
          <h1 className="page-title">Nepali calendar</h1>
          <p className="page-description">
            Browse Bikram Sambat dates, see their Gregorian equivalents, and
            spot published holidays and important days.
          </p>
          <CalendarView />
          <section className="text-content">
            <h2>About the Nepali calendar</h2>
            <p>
              The Nepali calendar is the Bikram Sambat calendar used for
              everyday dates and official notices in Nepal. Months have
              different lengths, so this calendar uses a date table rather than
              assuming a fixed month pattern.
            </p>
            <p>
              Holiday labels shown here follow the Ministry of Home Affairs
              notice for 2083. Some holidays have regional or eligibility
              limits; those notes appear with the event.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
