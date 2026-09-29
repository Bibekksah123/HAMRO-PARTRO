import { describe, expect, test } from "bun:test";
import {
  adToBs,
  addDaysToAdDate,
  bsToAd,
  daysInBsMonth,
  differenceInDays,
  todayInNepal,
} from "./index";

describe("Nepali date conversion", () => {
  test("matches the official MoHA date for September 27, 2026", () => {
    expect(adToBs({ year: 2026, month: 9, day: 27 })).toEqual({
      year: 2083,
      month: 6,
      day: 11,
    });
    expect(bsToAd({ year: 2083, month: 6, day: 11 })).toEqual({
      year: 2026,
      month: 9,
      day: 27,
    });
  });

  test("rejects an overflow day instead of silently moving it into the next month", () => {
    expect(() => bsToAd({ year: 2083, month: 1, day: 32 })).toThrow(
      "That day does not exist",
    );
  });

  test("reports the month length from the same calendar mapping", () => {
    expect(daysInBsMonth(2083, 1)).toBe(31);
  });

  test("adds Gregorian days without using the computer's local timezone", () => {
    expect(addDaysToAdDate({ year: 2026, month: 9, day: 27 }, 7)).toEqual({
      year: 2026,
      month: 10,
      day: 4,
    });
    expect(
      differenceInDays(
        { year: 2026, month: 9, day: 27 },
        { year: 2026, month: 10, day: 4 },
      ),
    ).toBe(7);
  });

  test("uses Nepal's calendar date for the requested instant", () => {
    expect(todayInNepal(new Date("2026-09-26T19:00:00.000Z"))).toEqual({
      year: 2026,
      month: 9,
      day: 27,
    });
  });
});
