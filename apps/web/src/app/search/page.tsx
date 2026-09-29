import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/page-metadata";
import { searchSite } from "@/lib/search";

export const metadata: Metadata = createPageMetadata({
  title: "Search MeroDin",
  description:
    "Search MeroDin for Nepali dates, public holidays, festivals, calendars, and everyday calculators.",
  noIndex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().slice(0, 100);
  const results = searchSite(query);

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content search-page">
          <p className="section-kicker">Find a useful answer</p>
          <h1 className="page-title">Search MeroDin</h1>
          <form action="/search" className="search-page-form" role="search">
            <label className="sr-only" htmlFor="search-query">
              Search dates, festivals, and calculators
            </label>
            <span aria-hidden="true">⌕</span>
            <input
              id="search-query"
              name="q"
              placeholder="Search dates, festivals, calculators..."
              type="search"
              defaultValue={query}
            />
            <button type="submit">Search</button>
          </form>
          {query ? (
            <section
              aria-live="polite"
              aria-labelledby="search-results-title"
              className="search-results-section"
            >
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Results for “{query}”</p>
                  <h2 id="search-results-title">
                    {results.length
                      ? `${results.length} useful match${results.length === 1 ? "" : "es"}`
                      : "No matches yet"}
                  </h2>
                </div>
              </div>
              {results.length ? (
                <ul className="search-results-list">
                  {results.map((result) => (
                    <li key={`${result.kind}-${result.href}`}>
                      <Link href={result.href}>
                        <span>{result.kind}</span>
                        <strong>{result.title}</strong>
                        <small>{result.description}</small>
                        <b aria-hidden="true">→</b>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="personal-empty">
                  <strong>Try a festival name, date, or calculator.</strong>
                  <span>
                    Searches include the 2083 calendar and published holiday
                    data.
                  </span>
                </div>
              )}
            </section>
          ) : (
            <p className="page-description search-prompt">
              Search Dashain, EMI, a BS date, or a public holiday.
            </p>
          )}
          <p className="data-source-note">
            <Link href="/calendar">Calendar</Link> ·{" "}
            <Link href="/festivals">Festivals</Link> ·{" "}
            <Link href="/calculators">Calculators</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
