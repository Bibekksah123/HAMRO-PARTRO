import type { Metadata } from "next";
import { getSiteUrl } from "./site-url";

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl =
    path && siteUrl ? new URL(path, siteUrl).toString() : undefined;
  const socialTitle = `${title} | MeroDin`;
  return {
    title,
    description,
    ...(path && siteUrl ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title: socialTitle,
      description,
      siteName: "MeroDin",
      locale: "en_NP",
      type: "website",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
