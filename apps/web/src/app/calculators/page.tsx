import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { calculators } from "@/data/calculators";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Free Calculators for Everyday Life",
  description:
    "Use free age, EMI, loan, interest, percentage, GPA, savings, salary, date, and unit calculators from MeroDin.",
  path: "/calculators",
});

export default function CalculatorsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">Useful, private, and free</p>
          <h1 className="page-title">Everyday calculators</h1>
          <p className="page-description">
            Get quick estimates for study, money, dates, and common unit
            conversions. Calculations run in your browser without an account.
          </p>
          <div className="calculator-directory">
            {calculators.map((calculator) => (
              <Link
                className="calculator-directory-card"
                href={`/calculators/${calculator.slug}`}
                key={calculator.slug}
              >
                <span className="calculator-directory-icon" aria-hidden="true">
                  {calculator.slug === "percentage"
                    ? "%"
                    : calculator.slug.includes("interest") ||
                        calculator.slug === "emi" ||
                        calculator.slug === "loan" ||
                        calculator.slug === "savings" ||
                        calculator.slug === "salary"
                      ? "रु"
                      : calculator.slug === "gpa" || calculator.slug === "cgpa"
                        ? "A+"
                        : calculator.slug === "unit-converter"
                          ? "↔"
                          : "◷"}
                </span>
                <strong>{calculator.name}</strong>
                <span>{calculator.description}</span>
                <span className="calculator-card-link">Open calculator →</span>
              </Link>
            ))}
          </div>
          <p className="data-source-note">
            Results are estimates for planning and learning. Check official
            documents, your institution’s grading rules, or a financial
            professional when exact figures matter.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
