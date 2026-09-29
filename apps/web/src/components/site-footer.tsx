import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link aria-label="MeroDin home" className="footer-brand" href="/">
          Mero<span>Din</span>
        </Link>
        <p>Small tools for a well-planned day.</p>
        <div className="footer-links">
          <Link href="/calendar">Calendar</Link>
          <Link href="/date-converter">Date converter</Link>
          <Link href="/festivals">Festivals</Link>
          <Link href="/calculators">Calculators</Link>
        </div>
        <span className="footer-country">
          Made with care in Nepal <span aria-hidden="true">♥</span>
        </span>
      </div>
    </footer>
  );
}
