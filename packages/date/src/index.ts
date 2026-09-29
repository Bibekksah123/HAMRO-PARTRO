import DateConverter from "@remotemerge/nepali-date-converter";

export interface BsDate {
  year: number;
  month: number;
  day: number;
}

export interface AdDate {
  year: number;
  month: number;
  day: number;
}

export const bsMonthNames = [
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
] as const;

export const nepaliMonths = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फागुन",
  "चैत",
] as const;

const MIN_BS_YEAR = 1975;
const MAX_BS_YEAR = 2099;
const MS_PER_DAY = 86_400_000;
const weekdayIndexes = new Map([
  ["Sunday", 0],
  ["Monday", 1],
  ["Tuesday", 2],
  ["Wednesday", 3],
  ["Thursday", 4],
  ["Friday", 5],
  ["Saturday", 6],
]);

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function bsIso(date: BsDate): string {
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

function adIso(date: AdDate): string {
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

function assertWholeDate(date: AdDate | BsDate): void {
  if (![date.year, date.month, date.day].every(Number.isInteger)) {
    throw new RangeError("Enter a complete date using whole numbers.");
  }
  if (date.month < 1 || date.month > 12 || date.day < 1 || date.day > 32) {
    throw new RangeError("The selected date is not valid.");
  }
}

function assertGregorianDate(date: AdDate): void {
  assertWholeDate(date);
  const utcDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
  if (
    utcDate.getUTCFullYear() !== date.year ||
    utcDate.getUTCMonth() !== date.month - 1 ||
    utcDate.getUTCDate() !== date.day
  ) {
    throw new RangeError("The selected Gregorian date does not exist.");
  }
}

function assertBsYear(year: number): void {
  if (!Number.isInteger(year) || year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    throw new RangeError(
      `The supported Nepali date range is ${MIN_BS_YEAR} to ${MAX_BS_YEAR} BS.`,
    );
  }
}

export function bsToAd(date: BsDate): AdDate {
  assertBsYear(date.year);
  assertWholeDate(date);

  let converted: ReturnType<DateConverter["toAd"]>;
  try {
    converted = new DateConverter(bsIso(date)).toAd();
  } catch {
    throw new RangeError(
      "This Nepali date is outside the supported calendar range.",
    );
  }

  const result = {
    year: converted.year,
    month: converted.month,
    day: converted.date,
  };
  let roundTrip: ReturnType<DateConverter["toBs"]>;
  try {
    roundTrip = new DateConverter(adIso(result)).toBs();
  } catch {
    throw new RangeError(
      "This Nepali date is outside the supported calendar range.",
    );
  }
  if (
    roundTrip.year !== date.year ||
    roundTrip.month !== date.month ||
    roundTrip.date !== date.day
  ) {
    throw new RangeError(
      "That day does not exist in the selected Nepali month.",
    );
  }
  return result;
}

export function adToBs(date: AdDate): BsDate {
  assertGregorianDate(date);

  let converted: ReturnType<DateConverter["toBs"]>;
  try {
    converted = new DateConverter(adIso(date)).toBs();
  } catch {
    throw new RangeError(
      "This Gregorian date is outside the supported calendar range.",
    );
  }
  assertBsYear(converted.year);

  const result = {
    year: converted.year,
    month: converted.month,
    day: converted.date,
  };
  const roundTrip = bsToAd(result);
  if (
    roundTrip.year !== date.year ||
    roundTrip.month !== date.month ||
    roundTrip.day !== date.day
  ) {
    throw new RangeError(
      "This Gregorian date is outside the supported calendar range.",
    );
  }
  return result;
}

export function daysInBsMonth(year: number, month: number): number {
  assertBsYear(year);
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("Choose a Nepali month from 1 to 12.");
  }

  let count = 0;
  for (let day = 1; day <= 32; day += 1) {
    try {
      bsToAd({ year, month, day });
      count += 1;
    } catch {
      break;
    }
  }
  return count;
}

export function weekdayIndex(date: BsDate): number {
  const converted = new DateConverter(bsIso(date)).toAd();
  const weekday = weekdayIndexes.get(converted.day);
  if (weekday === undefined)
    throw new RangeError("Could not determine the weekday for this date.");
  return weekday;
}

export function addDaysToAdDate(date: AdDate, days: number): AdDate {
  assertGregorianDate(date);
  if (!Number.isInteger(days))
    throw new RangeError("The number of days must be a whole number.");
  const moved = new Date(
    Date.UTC(date.year, date.month - 1, date.day) + days * MS_PER_DAY,
  );
  const result = {
    year: moved.getUTCFullYear(),
    month: moved.getUTCMonth() + 1,
    day: moved.getUTCDate(),
  };
  adToBs(result);
  return result;
}

export function addDaysToBsDate(date: BsDate, days: number): BsDate {
  return adToBs(addDaysToAdDate(bsToAd(date), days));
}

export function differenceInDays(start: AdDate, end: AdDate): number {
  assertGregorianDate(start);
  assertGregorianDate(end);
  adToBs(start);
  adToBs(end);
  return Math.round(
    (Date.UTC(end.year, end.month - 1, end.day) -
      Date.UTC(start.year, start.month - 1, start.day)) /
      MS_PER_DAY,
  );
}

export function todayInNepal(now = new Date()): AdDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: "year" | "month" | "day") =>
    Number(parts.find((entry) => entry.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}

export function formatBsDate(date: BsDate): string {
  bsToAd(date);
  return `${date.day} ${bsMonthNames[date.month - 1]} ${date.year}`;
}

export function formatBsDateNepali(date: BsDate): string {
  bsToAd(date);
  const digits = String(date.day).replace(
    /\d/g,
    (digit) => "०१२३४५६७८९"[Number(digit)] ?? digit,
  );
  const year = String(date.year).replace(
    /\d/g,
    (digit) => "०१२३४५६७८९"[Number(digit)] ?? digit,
  );
  return `${digits} ${nepaliMonths[date.month - 1]} ${year}`;
}

export function formatAdDate(date: AdDate): string {
  assertGregorianDate(date);
  return new Intl.DateTimeFormat("en-NP", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(date.year, date.month - 1, date.day)));
}
