import { adToBs, bsToAd, formatAdDate, formatBsDate } from "@merodin/date";
import { calculators } from "../data/calculators";
import { festivals2083 } from "../data/festivals/2083";
import { datedHolidays2083 } from "../data/holidays/2083";

export type SearchResult = {
  title: string;
  description: string;
  href: string;
  kind: string;
  searchText: string;
};

const staticResults: SearchResult[] = [
  {
    title: "Nepali calendar",
    description: "Browse BS dates and see their Gregorian equivalents.",
    href: "/calendar",
    kind: "Calendar",
    searchText: "calendar date month year nepali bikram sambat bs ad 2083",
  },
  {
    title: "BS to AD date converter",
    description: "Convert a Bikram Sambat date to the Gregorian calendar.",
    href: "/bs-to-ad",
    kind: "Date tool",
    searchText: "bs to ad bikram sambat gregorian nepali date convert",
  },
  {
    title: "AD to BS date converter",
    description: "Convert a Gregorian date to Bikram Sambat.",
    href: "/ad-to-bs",
    kind: "Date tool",
    searchText: "ad to bs gregorian bikram sambat nepali date convert",
  },
  {
    title: "Nepal public holidays 2083",
    description: "See published dates, weekdays, and regional holiday notes.",
    href: "/holidays/2083",
    kind: "Public holidays",
    searchText: "holidays public government 2083 leave day off",
  },
  {
    title: "Festivals in Nepal 2083",
    description: "Browse festivals, dates, and holiday scope for the year.",
    href: "/festivals",
    kind: "Festival calendar",
    searchText: "festival festivals celebrations events 2083",
  },
];

function searchableContent(): SearchResult[] {
  const calculatorResults = calculators.map((calculator) => ({
    title: calculator.name,
    description: calculator.description,
    href: `/calculators/${calculator.slug}`,
    kind: "Calculator",
    searchText: `${calculator.name} ${calculator.description} ${calculator.slug.replaceAll("-", " ")}`,
  }));
  const festivalResults = festivals2083.map((festival) => ({
    title: `${festival.name} 2083`,
    description: `${festival.nameNepali} · ${formatBsDate(festival.date)} BS (${formatAdDate(bsToAd(festival.date))} AD). ${festival.description}`,
    href: `/festivals/${festival.slug}`,
    kind: "Festival",
    searchText: `${festival.name} ${festival.nameNepali} ${festival.slug.replaceAll("-", " ")} ${festival.category} 2083 ${formatBsDate(festival.date)} ${formatAdDate(bsToAd(festival.date))} ${festival.description}`,
  }));
  const holidayResults = datedHolidays2083.map((holiday) => ({
    title: `${holiday.name} — ${formatBsDate(holiday.date)} BS`,
    description: `${formatAdDate(bsToAd(holiday.date))} AD · ${holiday.scope}`,
    href: `/calendar/${holiday.date.year}-${String(holiday.date.month).padStart(2, "0")}-${String(holiday.date.day).padStart(2, "0")}`,
    kind: "Holiday",
    searchText: `${holiday.name} ${holiday.description} ${holiday.scope} 2083 ${formatBsDate(holiday.date)} ${formatAdDate(bsToAd(holiday.date))}`,
  }));
  return [
    ...staticResults,
    ...calculatorResults,
    ...festivalResults,
    ...holidayResults,
  ];
}

function dateSearchResult(query: string): SearchResult | undefined {
  const match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(query.trim());
  if (!match) return undefined;
  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  try {
    const adDate = bsToAd(date);
    const normalized = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    return {
      title: `${formatBsDate(date)} BS — Nepali calendar date`,
      description: `${formatAdDate(adDate)} AD. Open date details and nearby calendar days.`,
      href: `/calendar/${normalized}`,
      kind: "Calendar date",
      searchText: `${normalized} ${formatBsDate(date)} ${formatAdDate(adDate)} ${formatBsDate(adToBs(adDate))}`,
    };
  } catch {
    return undefined;
  }
}

export function searchSite(query: string): SearchResult[] {
  const normalized = query.trim().toLocaleLowerCase("en");
  if (!normalized) return [];
  const tokens = normalized.split(/\s+/);
  const results = searchableContent()
    .filter((item) => {
      const content =
        `${item.title} ${item.description} ${item.searchText}`.toLocaleLowerCase(
          "en",
        );
      return tokens.every((token) => content.includes(token));
    })
    .sort((left, right) => {
      const score = (item: SearchResult) => {
        const title = item.title.toLocaleLowerCase("en");
        return title === normalized
          ? 3
          : title.startsWith(normalized)
            ? 2
            : title.includes(normalized)
              ? 1
              : 0;
      };
      return score(right) - score(left);
    });
  const exactDate = dateSearchResult(query);
  if (exactDate && !results.some((result) => result.href === exactDate.href)) {
    results.unshift(exactDate);
  }
  return results.slice(0, 30);
}
