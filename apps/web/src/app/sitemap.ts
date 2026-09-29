import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { festivals2083 } from "@/data/festivals/2083";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];
  const corePages: MetadataRoute.Sitemap = [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/calendar", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: new URL("/nepali-calendar", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: new URL("/date-converter", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: new URL("/bs-to-ad", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/ad-to-bs", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/festivals", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/holidays", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/holidays/2083", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/calculators", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
  const calculatorPages: MetadataRoute.Sitemap = calculators.map(
    ({ slug }) => ({
      url: new URL(`/calculators/${slug}`, siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );
  const festivalPages: MetadataRoute.Sitemap = festivals2083.map(
    ({ slug }) => ({
      url: new URL(`/festivals/${slug}`, siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );
  return [...corePages, ...calculatorPages, ...festivalPages];
}
