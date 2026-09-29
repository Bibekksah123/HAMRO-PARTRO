import type { Metadata } from "next";
import Link from "next/link";
import { DateConverter } from "@/components/date-converter";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "BS to AD Converter — Convert Nepali Dates",
  description:
    "Convert a Bikram Sambat (BS) date to its Gregorian (AD) equivalent. Check the Nepali calendar, copy the result, or add and subtract days.",
  path: "/bs-to-ad",
});

export default function BsToAdPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">Bikram Sambat → Gregorian</p>
          <h1 className="page-title">BS to AD converter</h1>
          <p className="page-description">
            Enter a Nepali date to find its Gregorian equivalent. Conversion
            happens in your browser and does not need an account.
          </p>
          <DateConverter initialDirection="bs-to-ad" />
          <section className="text-content">
            <h2>How to convert BS to AD</h2>
            <p>
              Select the Bikram Sambat year, month, and day, then choose Convert
              date. The result includes the Gregorian date and weekday. Nepali
              month lengths vary, so the converter validates the selected day
              against the calendar data.
            </p>
            <h2>About Nepali dates</h2>
            <p>
              The BS calendar is used in Nepal for everyday dates and government
              notices. Use the <Link href="/calendar">Nepali calendar</Link> to
              browse a full month, or switch to the{" "}
              <Link href="/ad-to-bs">AD to BS converter</Link>.
            </p>
          </section>
          <FaqSection
            items={[
              {
                question: "What is Bikram Sambat (BS)?",
                answer:
                  "Bikram Sambat is the calendar commonly used in Nepal for everyday dates and official notices. Nepali month lengths vary by year.",
              },
              {
                question: "Which Nepali years can I convert?",
                answer:
                  "MeroDin's bundled calendar data supports dates from 1975 through 2099 BS. Invalid days are rejected instead of being carried into another month.",
              },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
