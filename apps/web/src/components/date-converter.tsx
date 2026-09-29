"use client";

import { useEffect, useState } from "react";
import {
  adToBs,
  addDaysToAdDate,
  addDaysToBsDate,
  bsToAd,
  differenceInDays,
  formatAdDate,
  formatBsDate,
  todayInNepal,
  type AdDate,
  type BsDate,
} from "@merodin/date";

export type ConversionDirection = "bs-to-ad" | "ad-to-bs";

interface ConversionResult {
  main: string;
  detail: string;
  fields: BsDate | AdDate;
}

function dateInputValue(date: AdDate): string {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function parseDateInput(value: string): AdDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError("Enter a valid Gregorian date.");
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function DateConverter({
  initialDirection = "bs-to-ad",
}: {
  initialDirection?: ConversionDirection;
}) {
  const [direction, setDirection] =
    useState<ConversionDirection>(initialDirection);
  const [date, setDate] = useState<BsDate | AdDate>({
    year: 2083,
    month: 1,
    day: 1,
  });
  const [result, setResult] = useState<ConversionResult>();
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [offset, setOffset] = useState("30");
  const [adjusted, setAdjusted] = useState("");
  const [differenceStart, setDifferenceStart] = useState("2026-09-27");
  const [differenceEnd, setDifferenceEnd] = useState("2026-10-04");
  const [difference, setDifference] = useState<string>();

  useEffect(() => {
    const today = todayInNepal();
    setDate(initialDirection === "bs-to-ad" ? adToBs(today) : today);
    setDifferenceStart(dateInputValue(today));
    setDifferenceEnd(dateInputValue(addDaysToAdDate(today, 7)));
  }, [initialDirection]);

  function runConversion() {
    setError("");
    setCopied(false);
    setAdjusted("");
    try {
      if (direction === "bs-to-ad") {
        const input = date as BsDate;
        const converted = bsToAd(input);
        setResult({
          main: formatAdDate(converted),
          detail: formatBsDate(input),
          fields: converted,
        });
      } else {
        const input = date as AdDate;
        const converted = adToBs(input);
        setResult({
          main: formatBsDate(converted),
          detail: formatAdDate(input),
          fields: converted,
        });
      }
    } catch (cause) {
      setResult(undefined);
      setError(
        cause instanceof Error
          ? cause.message
          : "That date could not be converted.",
      );
    }
  }

  function swapDirection() {
    try {
      const converted =
        direction === "bs-to-ad"
          ? bsToAd(date as BsDate)
          : adToBs(date as AdDate);
      setDate(converted);
      setDirection(direction === "bs-to-ad" ? "ad-to-bs" : "bs-to-ad");
      setResult(undefined);
      setError("");
      setAdjusted("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Convert the date before swapping.",
      );
    }
  }

  function calculateOffset(sign: 1 | -1) {
    setError("");
    setAdjusted("");
    const days = Number(offset);
    if (!Number.isInteger(days) || days < 0) {
      setError("Enter a whole number of days, zero or more.");
      return;
    }
    try {
      if (direction === "bs-to-ad") {
        const moved = addDaysToBsDate(date as BsDate, days * sign);
        setAdjusted(`${formatBsDate(moved)} (${formatAdDate(bsToAd(moved))})`);
      } else {
        const moved = addDaysToAdDate(date as AdDate, days * sign);
        setAdjusted(`${formatAdDate(moved)} (${formatBsDate(adToBs(moved))})`);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "That date is outside the supported range.",
      );
    }
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.main} (${result.detail})`);
      setCopied(true);
    } catch {
      setError(
        "Copy is unavailable in this browser. Select the result text to copy it.",
      );
    }
  }

  function calculateDifference() {
    setError("");
    setDifference(undefined);
    try {
      const days = differenceInDays(
        parseDateInput(differenceStart),
        parseDateInput(differenceEnd),
      );
      setDifference(
        `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}${days < 0 ? " earlier" : ""}`,
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Enter two valid Gregorian dates.",
      );
    }
  }

  const isBs = direction === "bs-to-ad";
  const bsDate = date as BsDate;
  const adDate = date as AdDate;

  return (
    <div className="converter-stack">
      <section aria-labelledby="converter-title" className="converter-card">
        <div className="converter-card-heading">
          <div>
            <p className="section-kicker">Instant date conversion</p>
            <h2 id="converter-title">
              {isBs
                ? "Bikram Sambat to Gregorian"
                : "Gregorian to Bikram Sambat"}
            </h2>
          </div>
          <button className="swap-button" onClick={swapDirection} type="button">
            <span aria-hidden="true">⇄</span> Swap
          </button>
        </div>
        <div
          className="direction-tabs"
          role="group"
          aria-label="Conversion direction"
        >
          <button
            aria-pressed={isBs}
            className={isBs ? "active" : ""}
            onClick={() => {
              setDirection("bs-to-ad");
              setResult(undefined);
            }}
            type="button"
          >
            BS to AD
          </button>
          <button
            aria-pressed={!isBs}
            className={!isBs ? "active" : ""}
            onClick={() => {
              setDirection("ad-to-bs");
              setResult(undefined);
            }}
            type="button"
          >
            AD to BS
          </button>
        </div>
        <div className="date-input-grid">
          {isBs ? (
            <>
              <label>
                Nepali year
                <input
                  max={2099}
                  min={1975}
                  onChange={(event) =>
                    setDate({ ...bsDate, year: Number(event.target.value) })
                  }
                  type="number"
                  value={bsDate.year}
                />
              </label>
              <label>
                Nepali month
                <select
                  onChange={(event) =>
                    setDate({ ...bsDate, month: Number(event.target.value) })
                  }
                  value={bsDate.month}
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1} —{" "}
                      {
                        "Baisakh Jestha Ashar Shrawan Bhadra Ashoj Kartik Mangsir Poush Magh Falgun Chaitra".split(
                          " ",
                        )[index]
                      }
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Day
                <input
                  max={32}
                  min={1}
                  onChange={(event) =>
                    setDate({ ...bsDate, day: Number(event.target.value) })
                  }
                  type="number"
                  value={bsDate.day}
                />
              </label>
            </>
          ) : (
            <label className="ad-date-label">
              Gregorian date
              <input
                max="2043-04-13"
                min="1918-04-13"
                onChange={(event) =>
                  setDate(parseDateInput(event.target.value))
                }
                type="date"
                value={dateInputValue(adDate)}
              />
            </label>
          )}
        </div>
        <button
          className="convert-button"
          onClick={runConversion}
          type="button"
        >
          Convert date <span aria-hidden="true">→</span>
        </button>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {result && (
          <div aria-live="polite" className="conversion-result">
            <div>
              <span className="result-label">Converted date</span>
              <p className="result-main">{result.main}</p>
              <p className="result-detail">{result.detail}</p>
            </div>
            <button className="copy-button" onClick={copyResult} type="button">
              {copied ? "Copied" : "Copy result"}
            </button>
          </div>
        )}

        <div className="add-days-row">
          <label htmlFor="offset-days">Add or subtract days</label>
          <input
            id="offset-days"
            min={0}
            onChange={(event) => setOffset(event.target.value)}
            type="number"
            value={offset}
          />
          <button onClick={() => calculateOffset(1)} type="button">
            Add
          </button>
          <button onClick={() => calculateOffset(-1)} type="button">
            Subtract
          </button>
        </div>
        {adjusted && (
          <p aria-live="polite" className="adjusted-result">
            Result: <strong>{adjusted}</strong>
          </p>
        )}
      </section>

      <section
        aria-labelledby="date-difference-title"
        className="difference-card"
      >
        <div>
          <p className="section-kicker">Plan ahead</p>
          <h2 id="date-difference-title">Date difference</h2>
          <p>Count the days between two dates.</p>
        </div>
        <label>
          Start date
          <input
            onChange={(event) => setDifferenceStart(event.target.value)}
            type="date"
            value={differenceStart}
          />
        </label>
        <label>
          End date
          <input
            onChange={(event) => setDifferenceEnd(event.target.value)}
            type="date"
            value={differenceEnd}
          />
        </label>
        <button
          className="difference-button"
          onClick={calculateDifference}
          type="button"
        >
          Count days
        </button>
        {difference && (
          <p aria-live="polite" className="difference-result">
            {difference}
          </p>
        )}
      </section>
    </div>
  );
}
