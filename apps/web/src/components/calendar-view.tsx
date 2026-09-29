"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  adToBs,
  bsToAd,
  daysInBsMonth,
  formatBsDate,
  todayInNepal,
  weekdayIndex,
  type BsDate,
} from "@merodin/date";
import { holidays2083 } from "@/data/holidays/2083";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "Baisakh",
  "Jestha",
  "Ashar",
  "Shrawan",
  "Bhadra",
  "Ashoj",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

function compareDate(left: BsDate, right: BsDate): number {
  return (
    left.year - right.year || left.month - right.month || left.day - right.day
  );
}

function eventOnDate(date: BsDate) {
  return holidays2083.find((holiday) => {
    if (!holiday.date || holiday.date.year !== date.year) return false;
    const lastDay = holiday.endDate ?? holiday.date;
    return (
      compareDate(date, holiday.date) >= 0 && compareDate(date, lastDay) <= 0
    );
  });
}

function shortAdDate(date: {
  year: number;
  month: number;
  day: number;
}): string {
  return new Intl.DateTimeFormat("en-NP", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(date.year, date.month - 1, date.day)));
}

function dateHref(date: BsDate): string {
  return `/calendar/${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function CalendarView() {
  const [year, setYear] = useState(2083);
  const [month, setMonth] = useState(1);
  const [today, setToday] = useState<BsDate>();

  useEffect(() => {
    const current = adToBs(todayInNepal());
    setYear(current.year);
    setMonth(current.month);
    setToday(current);
  }, []);

  const monthLength = daysInBsMonth(year, month);
  const leadingBlanks = weekdayIndex({ year, month, day: 1 });
  const cells = useMemo(
    () => [
      ...Array.from({ length: leadingBlanks }, () => null),
      ...Array.from({ length: monthLength }, (_, index) => index + 1),
    ],
    [leadingBlanks, monthLength],
  );

  function moveMonth(delta: number) {
    const nextMonth = month + delta;
    if (nextMonth < 1) {
      if (year > 1975) {
        setYear(year - 1);
        setMonth(12);
      }
    } else if (nextMonth > 12) {
      if (year < 2099) {
        setYear(year + 1);
        setMonth(1);
      }
    } else {
      setMonth(nextMonth);
    }
  }

  function updateYear(value: string) {
    const nextYear = Number(value);
    if (Number.isInteger(nextYear) && nextYear >= 1975 && nextYear <= 2099)
      setYear(nextYear);
  }

  return (
    <section
      aria-label={`${monthNames[month - 1]} ${year} Nepali calendar`}
      className="calendar-panel"
    >
      <div className="calendar-toolbar">
        <div className="calendar-month-control">
          <button
            aria-label="Previous month"
            className="calendar-nav-button"
            onClick={() => moveMonth(-1)}
            type="button"
          >
            ‹
          </button>
          <h2>
            {monthNames[month - 1]} <span>{year}</span>
          </h2>
          <button
            aria-label="Next month"
            className="calendar-nav-button"
            onClick={() => moveMonth(1)}
            type="button"
          >
            ›
          </button>
        </div>
        <div className="calendar-selectors">
          <label htmlFor="calendar-month">Month</label>
          <select
            id="calendar-month"
            onChange={(event) => setMonth(Number(event.target.value))}
            value={month}
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
          <label htmlFor="calendar-year">Year</label>
          <input
            id="calendar-year"
            max={2099}
            min={1975}
            onChange={(event) => updateYear(event.target.value)}
            type="number"
            value={year}
          />
          <button
            className="calendar-today-button"
            onClick={() => {
              if (today) {
                setYear(today.year);
                setMonth(today.month);
              }
            }}
            type="button"
          >
            Today
          </button>
        </div>
      </div>

      <div aria-label="Weekday headings" className="calendar-weekdays">
        {weekdays.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>
      <div className="calendar-days">
        {cells.map((day, index) => {
          if (day === null)
            return (
              <div
                aria-hidden="true"
                className="calendar-empty-cell"
                key={`empty-${index}`}
              />
            );
          const date = { year, month, day };
          const adDate = bsToAd(date);
          const event = eventOnDate(date);
          const isToday =
            today?.year === year && today.month === month && today.day === day;
          const weekday = weekdays[weekdayIndex(date)];
          const description = [
            formatBsDate(date),
            shortAdDate(adDate),
            weekday,
            event?.name,
          ]
            .filter(Boolean)
            .join("; ");
          return (
            <Link
              aria-label={description}
              className={`calendar-day-link${isToday ? "is-today" : ""}${event ? "has-event" : ""}`}
              href={dateHref(date)}
              key={day}
            >
              <span className="calendar-bs-day">{day}</span>
              <span className="calendar-ad-day">{shortAdDate(adDate)}</span>
              {event && (
                <span className="calendar-event-name">{event.name}</span>
              )}
              {weekday === "Saturday" && (
                <span className="calendar-saturday-label">Saturday</span>
              )}
              {isToday && <span className="calendar-today-label">Today</span>}
            </Link>
          );
        })}
      </div>
      <div className="calendar-legend">
        <span>
          <i className="legend-holiday" /> Public holiday / event
        </span>
        <span>
          <i className="legend-today" /> Today
        </span>
      </div>
      <p className="calendar-note">
        Daily date conversion is available from 1975 to 2099 BS. Government
        holiday listings currently cover 2083 BS.
      </p>
    </section>
  );
}
