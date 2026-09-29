import type { Metadata } from "next";
import Link from "next/link";
import { DateConverter } from "@/components/date-converter";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "AD to BS Converter — Convert Gregorian Dates to Nepali",
  description:
    "Convert a Gregorian (AD) date to its Bikram Sambat (BS) equivalent. Copy results and count or add days with this free Nepali date tool.",
  path: "/ad-to-bs",
});

export default function AdToBsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">Gregorian → Bikram Sambat</p>
          <h1 className="page-title">AD to BS converter</h1>
          <p className="page-description">
            Choose a Gregorian date to find the Nepali date. The conversion runs
            locally in your browser.
          </p>
          <DateConverter initialDirection="ad-to-bs" />
          <section className="text-content">
            <h2>How to convert AD to BS</h2>
            <p>
              Choose a Gregorian date and select Convert date. The result shows
              the corresponding Bikram Sambat date and its weekday. The
              supported date table covers 1975 to 2099 BS.
            </p>
            <h2>When to use the BS date</h2>
            <p>
              Nepali dates appear on government notices, festival calendars,
              school schedules, and family records. Browse the{" "}
              <Link href="/calendar">Nepali calendar</Link> or use the{" "}
              <Link href="/bs-to-ad">BS to AD converter</Link> to go the other
              way.
            </p>
          </section>
          <FaqSection
            items={[
              {
                question: "Which Gregorian dates can I convert?",
                answer:
                  "The supported Bikram Sambat table covers 1975 to 2099 BS and their Gregorian equivalents. Dates outside that range are not converted.",
              },
              {
                question: "Why can a Nepali month have a different length?",
                answer:
                  "Bikram Sambat month lengths vary by year, so the converter checks the selected date against its versioned calendar table.",
              },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
