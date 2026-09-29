import type { Metadata } from "next";
import Link from "next/link";
import { DateConverter } from "@/components/date-converter";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "BS to AD & AD to BS Date Converter",
  description:
    "Convert Bikram Sambat dates to Gregorian dates and back. Copy results, count date differences, and add or subtract days.",
  path: "/date-converter",
});

export default function DateConverterPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">
            Quick, private, works in your browser
          </p>
          <h1 className="page-title">Nepali date converter</h1>
          <p className="page-description">
            Convert between Bikram Sambat (BS) and Gregorian (AD). Your date
            stays on this device.
          </p>
          <DateConverter />
          <section className="text-content">
            <h2>What are BS and AD?</h2>
            <p>
              BS means Bikram Sambat, the calendar used for Nepali dates and
              public notices. AD means Anno Domini, the Gregorian calendar
              commonly used internationally.
            </p>
            <h2>How does conversion work?</h2>
            <p>
              Nepali months do not all have the same number of days. MeroDin
              uses a versioned date table and checks each date before converting
              it. Supported dates run from 1975 through 2099 BS.
            </p>
            <p>
              For a month-by-month view, open the{" "}
              <Link href="/calendar">Nepali calendar</Link>. You can also go
              directly to <Link href="/bs-to-ad">BS to AD</Link> or{" "}
              <Link href="/ad-to-bs">AD to BS</Link>.
            </p>
          </section>
          <FaqSection
            items={[
              {
                question: "Does the date converter need an account or API?",
                answer:
                  "No. The date conversion, day counting, and add or subtract day tools work in your browser without an account.",
              },
              {
                question: "Can I count days between dates?",
                answer:
                  "Yes. Use the date difference fields to count elapsed days between two Gregorian dates. The converter also adds or subtracts days from either calendar date.",
              },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
