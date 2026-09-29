import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorTool } from "@/components/calculator-tool";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { calculatorBySlug, calculators } from "@/data/calculators";
import { createPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return calculators.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calculator = calculatorBySlug[slug];
  if (!calculator) return { title: "Calculator not found" };
  return createPageMetadata({
    title: calculator.name,
    description: calculator.description,
    path: `/calculators/${slug}`,
  });
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calculator = calculatorBySlug[slug];
  if (!calculator) notFound();
  const related = calculator.related
    .map((relatedSlug) => calculatorBySlug[relatedSlug])
    .filter((item) => item !== undefined);
  const siteUrl = getSiteUrl();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calculator.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        ...(siteUrl ? { item: siteUrl.toString() } : {}),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        ...(siteUrl
          ? { item: new URL("/calculators", siteUrl).toString() }
          : {}),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculator.name,
        ...(siteUrl
          ? { item: new URL(`/calculators/${slug}`, siteUrl).toString() }
          : {}),
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">
            <Link href="/calculators">Calculators</Link> / MeroDin
          </p>
          <h1 className="page-title">{calculator.name}</h1>
          <p className="page-description">{calculator.description}</p>
          <CalculatorTool calculator={calculator} />

          <article className="text-content calculator-guide">
            <h2>How this calculator works</h2>
            <p>{calculator.explanation}</p>
            <h2>Formula</h2>
            <p className="formula-callout">{calculator.formula}</p>
            <h2>Example</h2>
            <p>{calculator.example}</p>
            <h2>Frequently asked questions</h2>
            {calculator.faqs.map((faq) => (
              <section className="calculator-faq" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </section>
            ))}
            <h2>Related calculators</h2>
            <ul className="related-calculators">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/calculators/${item.slug}`}>{item.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/date-converter">Nepali date converter</Link>
              </li>
            </ul>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
