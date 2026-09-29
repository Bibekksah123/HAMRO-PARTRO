import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Calendar", href: "/calendar" },
  { label: "Date converter", href: "/date-converter" },
  { label: "Calculators", href: "/calculators" },
  { label: "Festivals", href: "/festivals" },
  { label: "My Space", href: "/my" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link aria-label="MeroDin home" className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>
            Mero<span className="brand-accent">Din</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link className="sign-in-link" href="/login">
            Sign in <span aria-hidden="true">↗</span>
          </Link>
          <details className="mobile-menu">
            <summary aria-label="Open navigation menu">
              <span className="menu-lines" aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile navigation" className="mobile-nav">
              {navigation.map((item) => (
                <Link href={item.href} key={item.label}>
                  {item.label}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
              <Link className="mobile-sign-in" href="/login">
                Sign in <span aria-hidden="true">↗</span>
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
