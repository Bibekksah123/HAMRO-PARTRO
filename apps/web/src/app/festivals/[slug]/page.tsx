import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bsToAd, formatAdDate, formatBsDate } from "@merodin/date";
import { FestivalCountdown } from "@/components/festival-countdown";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { festivals2083 } from "@/data/festivals/2083";
import { holidayNoticeSource } from "@/data/holidays/2083";
import { createPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site-url";

type FestivalPageProps = { params: Promise<{ slug: string }> };

function festivalForSlug(slug: string) {
  return festivals2083.find((festival) => festival.slug === slug);
}

export function generateStaticParams() {
  return festivals2083.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FestivalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const festival = festivalForSlug(slug);
  if (!festival) return { title: "Festival not found" };
  return createPageMetadata({
    title: `${festival.name} 2083 — Date, Countdown & Details`,
    description: `${festival.name} falls on ${formatBsDate(festival.date)} BS (${formatAdDate(bsToAd(festival.date))} AD). Read the date and public holiday notes.`,
    path: `/festivals/${festival.slug}`,
  });
}

export default async function FestivalDetailPage({
  params,
}: FestivalPageProps) {
  const { slug } = await params;
  const festival = festivalForSlug(slug);
  if (!festival) notFound();

  const adStart = bsToAd(festival.date);
  const adEnd = festival.endDate ? bsToAd(festival.endDate) : undefined;
  const siteUrl = getSiteUrl();
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: festival.name,
    description: festival.description,
    startDate: `${adStart.year}-${String(adStart.month).padStart(2, "0")}-${String(adStart.day).padStart(2, "0")}`,
    ...(adEnd
      ? {
          endDate: `${adEnd.year}-${String(adEnd.month).padStart(2, "0")}-${String(adEnd.day).padStart(2, "0")}`,
        }
      : {}),
    ...(siteUrl
      ? { url: new URL(`/festivals/${festival.slug}`, siteUrl).toString() }
      : {}),
  };

  return (
    <>
      <JsonLd data={eventSchema} />
      <SiteHeader />
      <main id="main" className="page-shell">
        <article className="page-content detail-content">
          <p className="section-kicker">
            {festival.category} festival · 2083 BS
          </p>
          <h1 className="page-title">{festival.name}</h1>
          <p className="festival-name-nepali detail-nepali">
            {festival.nameNepali}
          </p>
          <div className="festival-detail-card">
            <div>
              <span>Starts</span>
              <strong>{formatBsDate(festival.date)}</strong>
              <small>{formatAdDate(adStart)}</small>
            </div>
            {festival.endDate && (
              <div>
                <span>Ends</span>
                <strong>{formatBsDate(festival.endDate)}</strong>
                <small>{formatAdDate(adEnd!)}</small>
              </div>
            )}
            <FestivalCountdown date={festival.date} />
          </div>
          <p className="detail-description">{festival.description}</p>
          {festival.scope && (
            <p className="holiday-scope">
              <strong>Holiday scope:</strong> {festival.scope}
            </p>
          )}
          {festival.duration && (
            <p className="holiday-scope">
              <strong>Duration:</strong> {festival.duration} days
            </p>
          )}
          <div className="detail-actions">
            <Link
              href={`/calendar/${festival.date.year}-${String(festival.date.month).padStart(2, "0")}-${String(festival.date.day).padStart(2, "0")}`}
            >
              Open this date in the calendar <span aria-hidden="true">→</span>
            </Link>
            <Link href="/holidays/2083">
              View 2083 holidays <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="data-source-note">
            The date and holiday scope follow the{" "}
            <a href={holidayNoticeSource.url}>
              Ministry of Home Affairs notice for 2083
            </a>
            .
          </p>
          <section className="text-content">
            <h2>Related tools</h2>
            <p>
              Browse the <Link href="/calendar">Nepali calendar</Link> or
              convert another date with the{" "}
              <Link href="/date-converter">BS and AD date converter</Link>.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
