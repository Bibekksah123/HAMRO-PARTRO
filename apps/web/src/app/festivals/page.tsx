import type { Metadata } from "next";
import Link from "next/link";
import { formatAdDate, formatBsDate, bsToAd } from "@merodin/date";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { festivals2083 } from "@/data/festivals/2083";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Nepal Festivals 2083 — Dates & Public Holidays",
  description:
    "Browse Nepal's 2083 festival dates, including Dashain, Tihar, Holi, Teej, and regional public holidays.",
  path: "/festivals",
});

export default function FestivalsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">A year of celebrations</p>
          <h1 className="page-title">Festivals in Nepal, 2083</h1>
          <p className="page-description">
            Find dates and notes for festivals listed in the 2083 Government of
            Nepal holiday notice. Some observances are limited to a region or
            community.
          </p>
          <div className="festival-grid">
            {festivals2083.map((festival) => {
              const adDate = bsToAd(festival.date);
              return (
                <Link
                  className="festival-card"
                  href={`/festivals/${festival.slug}`}
                  key={festival.id}
                >
                  <span className="festival-category">{festival.category}</span>
                  <h2>{festival.name}</h2>
                  <p className="festival-name-nepali">{festival.nameNepali}</p>
                  <p className="festival-date">{formatBsDate(festival.date)}</p>
                  <p className="festival-ad-date">{formatAdDate(adDate)}</p>
                  {festival.duration && (
                    <span className="festival-duration">
                      {festival.duration} day public holiday
                    </span>
                  )}
                  <span className="festival-card-link">
                    Details <span aria-hidden="true">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="data-source-note">
            Dates are based on the{" "}
            <a href="https://moha.gov.np/en/post/government-and-public-holidays-in-2083">
              Ministry of Home Affairs' 2083 holiday notice
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
