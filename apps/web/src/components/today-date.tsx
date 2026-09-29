"use client";

import { useEffect, useState } from "react";
import {
  adToBs,
  bsToAd,
  differenceInDays,
  formatAdDate,
  formatBsDateNepali,
  todayInNepal,
} from "@merodin/date";
import { datedHolidays2083 } from "@/data/holidays/2083";
import { festivals2083 } from "@/data/festivals/2083";

interface TodaySummary {
  englishDate: string;
  nepaliDate: string;
  holiday: string;
  festival: string;
  festivalDate: string;
  countdown: string;
}

export function TodayDate() {
  const [summary, setSummary] = useState<TodaySummary>();

  useEffect(() => {
    const todayAd = todayInNepal();
    const todayBs = adToBs(todayAd);
    const inThisYear = (date: { year: number; month: number; day: number }) =>
      date.year === todayBs.year;
    const todayHoliday = datedHolidays2083.find((holiday) => {
      if (!inThisYear(holiday.date)) return false;
      const start = differenceInDays(bsToAd(holiday.date), todayAd);
      const end = differenceInDays(
        todayAd,
        bsToAd(holiday.endDate ?? holiday.date),
      );
      return start >= 0 && end >= 0;
    });
    const nextFestival = festivals2083
      .map((festival) => ({ festival, start: bsToAd(festival.date) }))
      .filter(
        ({ festival, start }) =>
          inThisYear(festival.date) && differenceInDays(todayAd, start) >= 0,
      )
      .sort(
        (a, b) =>
          differenceInDays(todayAd, a.start) -
          differenceInDays(todayAd, b.start),
      )[0];
    const countdownDays = nextFestival
      ? differenceInDays(todayAd, nextFestival.start)
      : null;

    setSummary({
      englishDate: formatAdDate(todayAd),
      nepaliDate: formatBsDateNepali(todayBs),
      holiday: todayHoliday?.name ?? "No fixed-date holiday today",
      festival: nextFestival?.festival.name ?? "See the festival calendar",
      festivalDate: nextFestival
        ? formatBsDateNepali(nextFestival.festival.date)
        : "",
      countdown:
        countdownDays === null
          ? ""
          : countdownDays === 0
            ? "Today"
            : countdownDays === 1
              ? "Tomorrow"
              : `In ${countdownDays} days`,
    });
  }, []);

  return (
    <>
      <p className="today-date">{summary?.englishDate ?? "Today’s date"}</p>
      <div className="today-divider" />
      <div className="today-date-row">
        <span className="today-date-label">Nepali date</span>
        <span className="today-date-value">
          {summary?.nepaliDate ?? "Loading date"}
        </span>
      </div>
      <div className="today-date-row">
        <span className="today-date-label">Today’s festival</span>
        <span className="today-date-value">
          {summary?.holiday ?? "Checking holidays"}
        </span>
      </div>
      <div className="today-date-row">
        <span className="today-date-label">Up next</span>
        <span className="today-date-value">
          {summary?.festival ?? "Finding festivals"}
          {summary?.countdown ? ` · ${summary.countdown}` : ""}
        </span>
      </div>
    </>
  );
}
