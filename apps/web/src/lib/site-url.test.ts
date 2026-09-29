import { afterEach, describe, expect, it } from "bun:test";
import { createPageMetadata } from "./page-metadata";
import { getSiteUrl } from "./site-url";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }
});

describe("site URL metadata", () => {
  it("omits canonical host data until a real site URL is configured", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const metadata = createPageMetadata({
      title: "Nepali calendar",
      description: "Browse Nepali dates.",
      path: "/calendar",
    });

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).not.toHaveProperty("url");
    expect(getSiteUrl()).toBeUndefined();
  });

  it("normalizes the configured origin for canonicals", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://merodin.example/deploy/path";
    const metadata = createPageMetadata({
      title: "Nepali calendar",
      description: "Browse Nepali dates.",
      path: "/calendar",
    });

    expect(metadata.alternates?.canonical).toBe("/calendar");
    expect(metadata.openGraph).toHaveProperty(
      "url",
      "https://merodin.example/calendar",
    );
    expect(getSiteUrl()?.toString()).toBe("https://merodin.example/");
  });

  it("rejects insecure public production origins", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://merodin.example";
    expect(getSiteUrl()).toBeUndefined();
  });
});
