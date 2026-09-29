import type { Metadata } from "next";
import type { Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default: "MeroDin — Your everyday Nepal utility",
    template: "%s | MeroDin",
  },
  description:
    "Calendar, Nepali dates, festivals, calculators and personal tools — all in one simple place.",
  applicationName: "MeroDin",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    title: "MeroDin — Your everyday Nepal utility",
    description:
      "Calendar, Nepali dates, festivals, calculators and personal tools — all in one simple place.",
    siteName: "MeroDin",
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MeroDin — Your everyday Nepal utility",
    description:
      "Calendar, Nepali dates, festivals, calculators and personal tools — all in one simple place.",
  },
};

export const viewport: Viewport = {
  themeColor: "#167452",
  colorScheme: "light dark",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MeroDin",
  description:
    "Calendar, Nepali dates, festivals, calculators and personal tools — all in one simple place.",
  inLanguage: "en",
  ...(siteUrl
    ? {
        url: siteUrl.toString(),
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl.toString().replace(/\/$/, "")}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <JsonLd data={websiteSchema} />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
