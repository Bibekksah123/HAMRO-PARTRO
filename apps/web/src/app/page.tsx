import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TodayDate } from "@/components/today-date";

const tools = [
  {
    title: "BS to AD",
    detail: "Find the Gregorian date",
    href: "/bs-to-ad",
    mark: "बि → AD",
    tint: "green",
  },
  {
    title: "AD to BS",
    detail: "Find the Nepali date",
    href: "/ad-to-bs",
    mark: "AD → बि",
    tint: "orange",
  },
  {
    title: "Age calculator",
    detail: "Your age, down to the day",
    href: "/calculators/age",
    mark: "Aa",
    tint: "blue",
  },
  {
    title: "EMI calculator",
    detail: "Plan a monthly payment",
    href: "/calculators/emi",
    mark: "रु",
    tint: "purple",
  },
  {
    title: "GPA calculator",
    detail: "Work out your grade point",
    href: "/calculators/gpa",
    mark: "A+",
    tint: "orange",
  },
  {
    title: "Percentage",
    detail: "Get a quick percentage",
    href: "/calculators/percentage",
    mark: "%",
    tint: "green",
  },
];

const festivalLinks = [
  {
    title: "Browse festivals",
    detail: "See Nepal’s celebrations through the year.",
    href: "/festivals",
    mark: "✳",
  },
  {
    title: "Public holidays",
    detail: "Plan ahead for days off.",
    href: "/holidays",
    mark: "□",
  },
  {
    title: "Nepali calendar",
    detail: "Explore dates and important days.",
    href: "/calendar",
    mark: "◫",
  },
];

const personalTools = [
  {
    title: "Expenses",
    detail: "Keep an eye on money in and out.",
    href: "/my/expenses",
    mark: "↗",
  },
  {
    title: "Reminders",
    detail: "Make room for what matters next.",
    href: "/my/reminders",
    mark: "◷",
  },
  {
    title: "Notes",
    detail: "Keep little thoughts close at hand.",
    href: "/my/notes",
    mark: "▤",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero-wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" /> Made for everyday life in Nepal
            </p>
            <h1>
              Your everyday
              <br />
              <span>Nepal utility.</span>
            </h1>
            <p className="hero-description">
              Calendar, Nepali dates, festivals, calculators and personal tools
              — all in one simple place.
            </p>
            <form className="search-box" action="/search" role="search">
              <label className="sr-only" htmlFor="site-search">
                Search dates, festivals and calculators
              </label>
              <span aria-hidden="true" className="search-icon">
                ⌕
              </span>
              <input
                id="site-search"
                name="q"
                placeholder="Search dates, festivals, calculators..."
              />
              <button type="submit">Search</button>
            </form>
            <div className="quick-links">
              <span>Try:</span>
              <Link href="/festivals/dashain">Dashain</Link>
              <Link href="/calculators/emi">EMI</Link>
              <Link href="/date-converter">Date converter</Link>
            </div>
          </div>
          <div className="today-card">
            <div className="today-card-top">
              <div>
                <p className="card-kicker">TODAY IN NEPAL</p>
                <TodayDate />
              </div>
              <span className="today-sun" aria-hidden="true">
                ☼
              </span>
            </div>
            <Link href="/calendar" className="today-card-link">
              Explore the Nepali calendar <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        </section>

        <section
          className="content-section tools-section"
          aria-labelledby="tools-heading"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">A good place to start</p>
              <h2 id="tools-heading">Popular tools</h2>
            </div>
            <Link className="section-link" href="/calculators">
              All calculators <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="tool-grid">
            {tools.map((tool) => (
              <Link className="tool-card" href={tool.href} key={tool.title}>
                <span
                  className={`tool-mark mark-${tool.tint}`}
                  aria-hidden="true"
                >
                  {tool.mark}
                </span>
                <span className="tool-card-copy">
                  <span className="tool-title">{tool.title}</span>
                  <span className="tool-detail">{tool.detail}</span>
                </span>
                <span className="tool-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="feature-band" aria-labelledby="festival-heading">
          <div className="feature-intro">
            <p className="section-kicker">The year, in good company</p>
            <h2 id="festival-heading">Days that bring us together.</h2>
            <p>
              Find festival dates, public holidays, and the stories behind the
              days we celebrate.
            </p>
            <Link className="text-link" href="/festivals">
              Explore festivals <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="feature-list">
            {festivalLinks.map((item) => (
              <Link className="feature-row" href={item.href} key={item.title}>
                <span className="feature-mark" aria-hidden="true">
                  {item.mark}
                </span>
                <span>
                  <span className="feature-title">{item.title}</span>
                  <span className="feature-detail">{item.detail}</span>
                </span>
                <span className="feature-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="content-section personal-section"
          aria-labelledby="personal-heading"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">A little space for you</p>
              <h2 id="personal-heading">Make the day your own.</h2>
            </div>
            <Link className="section-link" href="/my">
              Go to My Space <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="personal-grid">
            {personalTools.map((tool) => (
              <Link className="personal-card" href={tool.href} key={tool.title}>
                <span className="personal-mark" aria-hidden="true">
                  {tool.mark}
                </span>
                <span className="personal-card-title">{tool.title}</span>
                <span className="personal-card-detail">{tool.detail}</span>
                <span className="personal-card-action">
                  Take a look <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
