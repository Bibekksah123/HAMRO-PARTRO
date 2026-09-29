import { describe, expect, test } from "bun:test";
import { bsToAd, differenceInDays } from "@merodin/date";
import { datedHolidays2083, holidays2083 } from "./2083";

describe("2083 government holiday seed data", () => {
  test("every fixed-date item is a valid Nepali date", () => {
    expect(datedHolidays2083.length).toBeGreaterThan(25);
    for (const holiday of datedHolidays2083) {
      expect(() => bsToAd(holiday.date)).not.toThrow();
    }
  });

  test("matches published Gregorian dates for the New Year, Dashain, and Holi", () => {
    expect(bsToAd({ year: 2083, month: 1, day: 1 })).toEqual({
      year: 2026,
      month: 4,
      day: 14,
    });
    expect(bsToAd({ year: 2083, month: 6, day: 31 })).toEqual({
      year: 2026,
      month: 10,
      day: 17,
    });
    expect(bsToAd({ year: 2083, month: 12, day: 7 })).toEqual({
      year: 2027,
      month: 3,
      day: 21,
    });
  });

  test("preserves the published Dashain and Tihar holiday spans", () => {
    const dashain = holidays2083.find((holiday) => holiday.id === "dashain");
    const tihar = holidays2083.find((holiday) => holiday.id === "tihar");
    expect(
      dashain?.date && dashain.endDate
        ? differenceInDays(bsToAd(dashain.date), bsToAd(dashain.endDate)) + 1
        : 0,
    ).toBe(7);
    expect(
      tihar?.date && tihar.endDate
        ? differenceInDays(bsToAd(tihar.date), bsToAd(tihar.endDate)) + 1
        : 0,
    ).toBe(5);
  });

  test("keeps unannounced holiday dates empty", () => {
    expect(
      holidays2083
        .filter((holiday) => holiday.date === null)
        .map((holiday) => holiday.id),
    ).toEqual([
      "eid-al-fitr",
      "eid-al-adha",
      "saruwa-pawani",
      "bhoto-jatra",
      "muhammad-jayanti",
      "guru-nanak-jayanti",
    ]);
  });
});
